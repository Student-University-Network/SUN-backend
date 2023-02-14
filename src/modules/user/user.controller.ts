import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { updateProfileInput } from '@/modules/user/user.schema';
import { getUserProfile, updateUserProfile } from '@/modules/user/user.service';
import { Request, Response } from 'express';

export async function getProfileHandler(req: Request, res: Response) {
	const userProfile = await getUserProfile(req.user?.User.id!);

	res.status(HttpStatusCode.OK).json({
		message: Status.SUCCESS,
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
		message: Status.SUCCESS,
		data: updatedProfile,
	});
}
