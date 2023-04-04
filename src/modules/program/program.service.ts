import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { JWTPayload } from '@/modules/auth/auth.service';
import {
	createProgramInput,
	updateProgramInput,
} from '@/modules/program/program.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import { Role } from '@prisma/client';

export async function getProgramList() {
	const programsList = await db.program.findMany();
	return programsList;
}

export async function getProgramDetails(
	userPayload: JWTPayload,
	programId: string,
) {
	const academicDetails = await isStudentEnrolledIn(userPayload, programId);

	// TODO : Add check for FACULTY if they are assigned to it

	const progamDetails = await db.program.findUnique({
		where: {
			programId: programId,
		},
		include: {
			semesters: {
				include: {
					courses: true,
				},
			},
			batches: {
				include: {
					students: true,
				},
			},
		},
	});

	return {
		...progamDetails,
		batches: progamDetails?.batches.map((b) => ({
			...b,
			students: b.students.length,
		})),
		batchId: academicDetails?.batchId,
	};
}

export async function createNewProgram(prg: createProgramInput) {
	const newProgram = await db.$transaction(async (tx) => {
		const program = await tx.program.create({
			data: {
				programName: prg.programName,
				duration: prg.duration,
				tag: prg.tag,
				startYear: prg.startYear,
				endYear: prg.endYear,
				semesters: {
					create: prg.semesters.map((sem) => {
						return {
							semesterName: sem.semesterName,
							order: sem.order,
							courses: {
								create: sem.courses.map((crs) => crs),
							},
						};
					}),
				},
				batches: {
					createMany: {
						data: prg.batches,
					},
				},
			},
			include: {
				semesters: {
					select: {
						courses: true,
					},
				},
				batches: true,
			},
		});

		for (let crs of program.semesters[prg.currentSemester].courses) {
			await tx.teachersOnCourse.createMany({
				data: program.batches.map((btch) => ({
					batchId: btch.id,
					courseId: crs.courseId,
				})),
			});
		}

		return program;
	});

	return newProgram;
}

export async function updateProgram(
	userPayload: JWTPayload,
	prg: updateProgramInput,
) {
	await isStudentEnrolledIn(userPayload, prg.programId);

	// As multiple records need to be updated with different data we need to use transaction
	// for atomicity
	const updatedProgram = await db.$transaction(async (tx) => {
		if (prg.semesters) {
			for (const sem of prg.semesters) {
				await tx.semester.update({
					where: {
						semesterId: sem.semesterId,
					},
					data: {
						semesterName: sem.semesterName,
						order: sem.order,
					},
				});
				if (sem.courses) {
					for (const crs of sem.courses) {
						await tx.course.update({
							where: {
								courseId: crs.courseId,
							},
							data: {
								...crs,
							},
						});
					}
				}
			}
		}
		if (prg.batches) {
			for (const batch of prg.batches) {
				await tx.batch.update({
					where: {
						id: batch.id,
					},
					data: {
						...batch,
					},
				});
			}
		}
		const program = await tx.program.update({
			where: {
				programId: prg.programId,
			},
			data: {
				programName: prg.programName,
				duration: prg.duration,
				tag: prg.tag,
				startYear: prg.startYear,
				endYear: prg.endYear,
				currentSemester: prg.currentSemester,
			},
			include: {
				semesters: {
					include: {
						courses: true,
					},
				},
				batches: true,
			},
		});

		return program;
	});

	return updatedProgram;
}

async function isStudentEnrolledIn({ User }: JWTPayload, programId: String) {
	// if role is STUDENT then allow only if user is enrolled in
	if (User.role === Role.STUDENT) {
		const academicDetails = await db.academicDetails.findUnique({
			where: {
				userId: User.id,
			},
		});
		if (academicDetails?.programId !== programId) {
			throw new ApiError(
				'Forbidden',
				HttpStatusCode.FORBIDDEN,
				'You don not have perimssion to view requested program details',
			);
		}
		return academicDetails;
	}
}
