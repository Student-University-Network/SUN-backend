import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	getTimetableInput,
	setLectureStatusInput,
	setTimetableInput,
	setFirebaseTokenInput,
} from '@/modules/timetable/timetable.schema';
import {
	getFacultyTimetable,
	getTimetable,
	setLectureStatus,
	setTimetable,
	setFireBaseToken,
} from '@/modules/timetable/timetable.service';
import { Request, Response } from 'express';

export async function getTimetableHandler(
	req: Request<getTimetableInput>,
	res: Response,
) {
	const { batchId } = req.params;

	const timetable = await getTimetable(batchId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: timetable,
	});
}

export async function setTimetableHandler(
	req: Request<{}, {}, setTimetableInput>,
	res: Response,
) {
	const timetable = await setTimetable(req.body);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: timetable,
	});
}

export async function getFacultyTimetableHandler(req: Request, res: Response) {
	const facultyTimetable = await getFacultyTimetable(req.user?.User.id || '');

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: facultyTimetable,
	});
}

export async function setLectureStatusHandler(
	req: Request<{}, {}, setLectureStatusInput>,
	res: Response,
) {
	const { batchId, status: newStatus, lectureId } = req.body;

	const timetable = await setLectureStatus(newStatus, lectureId, batchId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: timetable,
	});
}

export async function setFirebaseTokenHandler(
	req: Request<{}, {}, setFirebaseTokenInput>,
	res: Response,
) {
	const { token } = req.body;

	await setFireBaseToken(token);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
	});
}
