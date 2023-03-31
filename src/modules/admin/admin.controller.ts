import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { getUsersList } from '@/modules/admin/admin.service';

export async function getUsersListHandler(req: Request, res: Response) {
	const usersList = await getUsersList();

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: usersList,
	});
}
