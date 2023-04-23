import { db } from '@/utils/database';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { JWTPayload } from '@/modules/auth/auth.service';
import { AttendanceStatus } from '@prisma/client';
import { ApiError } from '@/utils/ApiError';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';

export async function startAttendance(lectureId: string, courseId: string) {
	const token = await jwt.sign(
		{ lectureId, courseId },
		config.attendance.tokenSecret,
		{
			expiresIn: config.attendance.tokenExpiry,
		},
	);
	await db.course.update({
		where: {
			courseId: courseId,
		},
		data: {
			totalLectures: { increment: 1 },
		},
	});
	return {
		token,
	};
}

export async function markAttendance(payload: JWTPayload, token: string) {
	const userId = payload.User.id;
	let isValid: { lectureId: string; courseId: string };
	try {
		const valid = jwt.verify(token, config.attendance.tokenSecret);
		isValid = valid as { lectureId: string; courseId: string };
	} catch (e) {
		return {
			courseId: '',
			lectureId: '',
			userId: userId,
			result: AttendanceStatus.ABSENT,
		};
	}

	const { courseId, lectureId } = isValid;
	const myCourses = await db.academicDetails.findUnique({
		where: {
			userId: userId,
		},
		select: {
			batch: {
				select: {
					courses: true,
				},
			},
		},
	});
	const isEnrolled = myCourses?.batch?.courses.find(
		(c) => c.courseId === courseId,
	);
	if (!isEnrolled) {
		throw new ApiError(
			'Unauthorized',
			HttpStatusCode.UNAUTHORIZED,
			'You arent enrolled in this course',
		);
	}
	const attendance = await db.attendance.upsert({
		where: {
			attendanceId: {
				courseId,
				lectureId,
				userId,
			},
		},
		create: {
			courseId,
			lectureId,
			userId,
			attended: AttendanceStatus.PRESENT,
		},
		update: {
			attended: AttendanceStatus.PRESENT,
		},
	});
	return attendance;
}

export async function getFacultyAttendanceReport(
	professorId: string,
	batchId: string,
	courseId: string,
) {
	const course = await db.course.findUnique({
		where: {
			courseId,
		},
	});
	const professor = await db.user.findUnique({
		where: {
			id: professorId,
		},
		select: {
			profile: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
	});
	const students = await db.academicDetails.findMany({
		where: {
			batchId,
		},
		select: {
			userId: true,
			User: {
				select: {
					profile: { select: { firstName: true, lastName: true } },
				},
			},
		},
	});
	const attendance = await db.attendance.groupBy({
		by: ['userId'],
		where: {
			courseId,
			userId: {
				in: students.map((s) => s.userId),
			},
			attended: AttendanceStatus.PRESENT,
		},
		_count: {
			attended: true,
		},
	});
	return {
		courseId,
		courseName: course?.courseName,
		professorId,
		professorName: `${professor?.profile?.firstName} ${professor?.profile?.lastName}`,
		totalLectures: course?.totalLectures,
		attendance: students.map((s) => {
			const a = attendance.find((a) => s.userId === a.userId);
			return {
				userId: s.userId,
				firstName: s?.User.profile?.firstName || 'Unknown',
				lastName: s?.User.profile?.lastName || '',
				attended: a?._count.attended || 0,
			};
		}),
	};
}

export async function getStudentAttendanceReport(userId: string) {
	const student = await db.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			academicDetails: {
				select: {
					program: {
						select: { semesters: true, currentSemester: true },
					},
				},
			},
		},
	});
	const currentSem =
		student?.academicDetails?.program.semesters[
			student.academicDetails.program.currentSemester
		];
	const courses = await db.course.findMany({
		where: {
			semesterId: currentSem?.semesterId,
		},
	});
	const attendance = await db.attendance.groupBy({
		by: ['courseId'],
		where: {
			courseId: {
				in: courses.map((c) => c.courseId),
			},
			userId,
			attended: AttendanceStatus.PRESENT,
		},
		_count: {
			attended: true,
		},
	});
	return {
		courses: courses.map((c) => ({
			...c,
			attended:
				attendance.find((a) => a.courseId === c.courseId)?._count
					.attended || 0,
		})),
	};
}
