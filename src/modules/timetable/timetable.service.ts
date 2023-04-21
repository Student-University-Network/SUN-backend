import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { getCoursesList } from '@/modules/faculty/faculty.service';
import {
	LectureStatus,
	setTimetableInput,
} from '@/modules/timetable/timetable.schema';
import { ApiError } from '@/utils/ApiError';
import { db } from '@/utils/database';
import log from '@/utils/logger';

export async function getTimetable(batchId: string) {
	const timetable = await db.timetable.findUnique({
		where: {
			batchId: batchId,
		},
	});
	return timetable?.timetableData;
}

export async function getFacultyTimetable(userId: string) {
	let coursesList = await db.teachersOnCourse.findMany({
		where: {
			professorId: userId,
		},
	});
	coursesList = coursesList.filter(
		(v, i, a) => a.findIndex((v2) => v2.batchId === v.batchId) === i,
	);
	const timetables: Array<setTimetableInput> = [];
	for (let c of coursesList) {
		const timetable = await db.timetable.findUnique({
			where: {
				batchId: c.batchId,
			},
		});
		if (timetable) {
			timetables.push(timetable.timetableData as setTimetableInput);
		}
	}
	const facultyTimetable: { [k: string]: any } = {
		userId,
		days: [...Array(7)].map((_, i) => ({ weekDay: i, lectures: [] })),
	};
	timetables.forEach((tt, ttIndex) =>
		tt.days.forEach((d, dIndex) =>
			d.lectures.forEach((l, lIndex) => {
				if (l.professorId === userId) {
					facultyTimetable.days[d.weekDay].lectures.push({
						...l,
						batchId: tt.batchId,
						batchName: tt.batchName,
					});
				}
			}),
		),
	);
	return facultyTimetable;
}

export async function setTimetable(newTimetable: setTimetableInput) {
	const batch = await db.batch.findUnique({
		where: {
			id: newTimetable.batchId,
		},
	});
	if (batch === null) {
		throw new ApiError(
			'Bad request',
			HttpStatusCode.BAD_REQUEST,
			'No such batch exists',
		);
	}

	const timetable = await db.timetable.upsert({
		where: {
			batchId: newTimetable.batchId,
		},
		create: {
			batchId: newTimetable.batchId,
			timetableData: newTimetable,
		},
		update: {
			batchId: newTimetable.batchId,
			timetableData: newTimetable,
		},
	});
	return timetable;
}

export async function setLectureStatus(
	status: LectureStatus,
	lectureId: string,
	batchId: string,
) {
	const timetable = await db.timetable.findUnique({
		where: {
			batchId: batchId,
		},
	});
	let timetableData = timetable?.timetableData as setTimetableInput;
	timetableData = {
		...timetableData,
		days: timetableData.days.map((d) => ({
			...d,
			lectures: d.lectures.map((l) => {
				if (l.id === lectureId) {
					return { ...l, status: status };
				} else {
					return l;
				}
			}),
		})),
	};
	const newTimetable = await db.timetable.update({
		where: {
			batchId: batchId,
		},
		data: {
			batchId: batchId,
			timetableData: timetableData,
		},
	});
	return newTimetable.timetableData;
}
