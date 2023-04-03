import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	getUsersList,
	getUserDetails,
	assignProfessor,
} from '@/modules/admin/admin.service';
import {
	AssignProfessorInput,
	AssignProfessorSchema,
	GetUserDetailsInput,
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
