import {
	AssignProfessorInput,
	saveBatchDetailsInput,
} from '@/modules/admin/admin.schema';
import { db } from '@/utils/database';

export async function getUsersList() {
	const usersList = await db.user.findMany({
		select: {
			id: true,
			role: true,
			userLoginData: {
				select: {
					username: true,
				},
			},
			profile: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
	});
	return {
		users: usersList.map((user) => {
			return {
				id: user.id,
				role: user.role,
				username: user.userLoginData.username,
				firstName: user.profile?.firstName || '',
				lastName: user.profile?.lastName || '',
			};
		}),
	};
}

export async function getUserDetails(userId: string) {
	// TODO : add Faculty and students role handling
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			profile: true,
			academicDetails: {
				include: {
					program: true,
					batch: true,
				},
			},
		},
	});

	return {
		...user,
		academicDetails: {
			rollNo: user?.academicDetails?.rollNo,
			batchId: user?.academicDetails?.batchId,
			programId: user?.academicDetails?.programId,
			programName: user?.academicDetails?.program.programName,
			batchName: user?.academicDetails?.batch?.batchName,
		},
	};
}

export async function assignProfessor(payload: AssignProfessorInput) {
	const { courseId, teacherId, batchId } = payload;

	const teacherOnCourse = await db.teachersOnCourse.upsert({
		where: {
			courseId_batchId: { courseId: courseId, batchId: batchId },
		},
		update: {
			professorId: teacherId,
		},
		create: {
			batchId: batchId,
			courseId: courseId,
			professorId: teacherId,
		},
	});

	return teacherOnCourse;
}

export async function getBatchDetails(batchId: string) {
	const batch = await db.batch.findUnique({
		where: {
			id: batchId,
		},
	});
	const teacherOnCourses = await db.teachersOnCourse.findMany({
		where: {
			batchId: batchId,
		},
		include: {
			course: true,
			professor: {
				include: {
					profile: true,
				},
			},
		},
	});
	const students = await db.academicDetails.findMany({
		where: {
			batchId: batchId,
		},
		include: {
			User: {
				include: {
					profile: true,
				},
			},
		},
	});

	const unassigned = await db.academicDetails.findMany({
		where: {
			programId: batch?.programId || '',
			batchId: null,
		},
		include: {
			User: {
				include: {
					profile: true,
				},
			},
		},
	});

	return {
		...batch,
		unassignedStudents: unassigned.map((u) => ({
			id: u.userId,
			firstName: u.User.profile?.firstName,
			lastName: u.User.profile?.lastName,
		})),
		students: students.map((stu) => ({
			id: stu.userId,
			firstName: stu.User.profile?.firstName,
			lastName: stu.User.profile?.lastName,
		})),
		courses: teacherOnCourses.map((toc) => ({
			courseId: toc.courseId,
			courseName: toc.course.courseName,
			professor: {
				id: toc.professorId,
				firstName: toc.professor?.profile?.firstName,
				lastName: toc.professor?.profile?.lastName,
			},
		})),
	};
}

export async function saveBatchDetails(payload: saveBatchDetailsInput) {
	await db.$transaction(async (tx) => {
		await tx.batch.update({
			where: {
				id: payload.id,
			},
			data: {
				batchName: payload.batchName,
			},
		});
		for (let student of payload.students) {
			await tx.academicDetails.update({
				where: {
					userId: student.id,
				},
				data: {
					batchId: payload.id,
				},
			});
		}
		for (let student of payload.unassignedStudents) {
			await tx.academicDetails.update({
				where: {
					userId: student.id,
				},
				data: {
					batchId: null,
				},
			});
		}
		for (let crs of payload.courses) {
			await tx.teachersOnCourse.update({
				where: {
					courseId_batchId: {
						courseId: crs.courseId,
						batchId: payload.id,
					},
				},
				data: {
					professorId: crs.professor.id,
				},
			});
		}
	});
}
