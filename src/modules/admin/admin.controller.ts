import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { getUsersList, getUserDetails } from '@/modules/admin/admin.service';
import { GetUserDetailsInput } from '@/modules/admin/admin.schema';

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
