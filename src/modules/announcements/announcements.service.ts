import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { setAnnouncementInput } from '@/modules/announcements/announcements.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import { Role } from '@prisma/client';

export async function getAnnouncements(userId: string) {
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			academicDetails: true,
		},
	});
	if (user == null) {
		throw new ApiError(
			'BAD Request',
			HttpStatusCode.BAD_REQUEST,
			'Invalid user',
		);
	}
	let list: Array<{ [k: string]: any }> = [];
	if (user.role == Role.STUDENT) {
		list = await db.announcement.findMany({
			where: {
				programId: user.academicDetails?.programId,
				AND: {
					programId: undefined,
				},
			},
			include: {
				program: true,
				announcer: {
					include: {
						profile: true,
					},
				},
			},
		});
	} else {
		list = await db.announcement.findMany({
			where: {
				userId: userId,
			},
			include: {
				program: true,
				announcer: {
					include: {
						profile: true,
					},
				},
			},
		});
	}
	return {
		announcements: [
			...list.map((l) => ({
				title: l.title,
				content: l.content,
				announcementId: l.announcementId,
				userId: l.userId,
				programId: l.programId,
				programName: l.program?.programName,
				announcer: `${l.announcer?.profile?.firstName} ${l.announcer?.profile?.lastName}`,
			})),
		],
	};
}

export async function setAnnouncement(
	userId: string,
	announcement: setAnnouncementInput,
) {
	const newAnnouncement = await db.announcement.create({
		data: {
			...announcement,
			userId: userId,
		},
	});
	return newAnnouncement;
}

export async function getProgramList(userId: string) {
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			academicDetails: true,
		},
	});
	if (user == null) {
		throw new ApiError(
			'BAD Request',
			HttpStatusCode.BAD_REQUEST,
			'Invalid user',
		);
	}
	let list: Array<{ [k: string]: any }> = [];
	if (user.role === Role.FACULTY) {
		const programList = await db.teachersOnCourse.findMany({
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
		list = programList.map((p) => ({
			programId: p.course.semester.programId,
			programName: p.course.semester.program.programName,
			tag: p.course.semester.program.tag,
		}));
		list = list.filter(
			(l, i, self) =>
				self.findIndex((s) => s.programId === l.programId) === i,
		);
		console.log(list);
	} else {
		const programList = await db.program.findMany();
		list = programList.map((p) => ({
			programId: p.programId,
			programName: p.programName,
			tag: p.tag,
		}));
	}
	return { programs: [...list] };
}
