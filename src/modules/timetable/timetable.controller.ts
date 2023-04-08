import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	getTimetableInput,
	setTimetableInput,
} from '@/modules/timetable/timetable.schema';
import {
	getFacultyTimetable,
	getTimetable,
	setTimetable,
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
