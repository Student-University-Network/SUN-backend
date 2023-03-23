import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	changePasswordInput,
	updateProfileInput,
} from '@/modules/user/user.schema';
import {
	getUserProfile,
	updatePassword,
	updateUserProfile,
} from '@/modules/user/user.service';
import { Request, Response } from 'express';
import log from '@/utils/logger';

export async function getProfileHandler(req: Request, res: Response) {
	const userProfile = await getUserProfile(req.user?.User.id!);
	log.debug(userProfile);
	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: userProfile,
	});
}

export async function updateProfileHandler(
	req: Request<{}, {}, updateProfileInput>,
	res: Response,
) {
	const body = req.body;

	const updatedProfile = await updateUserProfile(req.user?.User.id!, body);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: updatedProfile,
	});
}

export async function changePasswordHandler(
	req: Request<{}, {}, changePasswordInput>,
	res: Response,
) {
	const changePass = await updatePassword(req.user?.User.id!, req.body);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		message: 'Password updated successfully',
	});
}
