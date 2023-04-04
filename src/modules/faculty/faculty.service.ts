import { db } from '@/utils/database';

export async function getCoursesList(userId: string) {
	const coursesList = await db.teachersOnCourse.findMany({
		where: {
			professorId: userId,
		},
		include: {
			course: {
				include: {
					semester: {
						include: {
							program: true,
						},
					},
				},
			},
		},
	});

	return {
		courses: coursesList.map((crs) => {
			return {
				...crs.course,
				semesterName: crs.course.semester.semesterName,
				programName: crs.course.semester.program.programName,
			};
		}),
	};
}

export async function getCourseDetails(courseId: string) {
	// TODO : add Faculty and students role handling
	const user = await db.user.findUnique({
		where: {
			id: courseId,
		},
		include: {
			profile: true,
			academicDetails: true,
		},
	});

	return user;
}
