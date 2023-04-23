import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	startAttendanceInput,
	markAttendanceInput,
	getAttendanceReportInput,
} from '@/modules/attendance/attendance.schema';
import {
	startAttendance,
	markAttendance,
	getFacultyAttendanceReport,
	getStudentAttendanceReport,
} from '@/modules/attendance/attendance.service';
import { ApiError } from '@/utils/ApiError';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

export async function startAttendanceHandler(
	req: Request<{}, {}, startAttendanceInput>,
	res: Response,
) {
	const { lectureId, courseId } = req.body;

	const token = await startAttendance(lectureId, courseId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: token,
	});
}

export async function markAttendanceHandler(
	req: Request<{}, {}, markAttendanceInput>,
	res: Response,
) {
	const response = await markAttendance(req.user!, req.body.token);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: response,
	});
}

export async function getAttendanceReportHandler(
	req: Request<{}, {}, {}, getAttendanceReportInput>,
	res: Response,
) {
	if (req.user?.User.role === Role.STUDENT) {
		const report = await getStudentAttendanceReport(req.user?.User.id!);
		res.status(HttpStatusCode.CREATED).json({
			status: Status.SUCCESS,
			data: report,
		});
	} else if (req.user?.User.role === Role.FACULTY) {
		const report = await getFacultyAttendanceReport(
			req.user?.User.id!,
			req.query.batchId,
			req.query.courseId,
		);
		res.status(HttpStatusCode.CREATED).json({
			status: Status.SUCCESS,
			data: report,
		});
	} else {
		throw new ApiError(
			'Bad Request',
			HttpStatusCode.BAD_REQUEST,
			'Bad request',
		);
	}
}
