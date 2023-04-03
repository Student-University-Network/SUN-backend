import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	getUsersList,
	getUserDetails,
	assignProfessor,
	getBatchDetails,
	saveBatchDetails,
} from '@/modules/admin/admin.service';
import {
	AssignProfessorInput,
	AssignProfessorSchema,
	GetUserDetailsInput,
	getBatchInput,
	saveBatchDetailsInput,
} from '@/modules/admin/admin.schema';

export async function getUsersListHandler(req: Request, res: Response) {
	const usersList = await getUsersList();

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: usersList,
	});
}

export async function getUserDetailsHandler(
	req: Request<GetUserDetailsInput>,
	res: Response,
) {
	const { userId } = req.params;
	const userDetails = await getUserDetails(userId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: userDetails,
	});
}

export async function assignProfessorHandler(
	req: Request<{}, {}, AssignProfessorInput>,
	res: Response,
) {
	const teacherOnCourse = await assignProfessor(req.body);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: teacherOnCourse,
	});
}

export async function getBatchDetailsHandler(
	req: Request<getBatchInput>,
	res: Response,
) {
	const { batchId } = req.params;

	const batchDetails = await getBatchDetails(batchId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: batchDetails,
	});
}

export async function saveBatchDetailsHandler(
	req: Request<{}, {}, saveBatchDetailsInput>,
	res: Response,
) {
	const batchDetails = await saveBatchDetails(req.body);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: batchDetails,
	});
}
