import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	changePasswordInput,
	updateProfileInput,
} from '@/modules/user/user.schema';
import {
	getAcademicDetails,
	getUserProfile,
	updatePassword,
	updateUserProfile,
} from '@/modules/user/user.service';
import { Request, Response } from 'express';
import log from '@/utils/logger';

export async function getProfileHandler(req: Request, res: Response) {
	const userProfile = await getUserProfile(req.user?.User.id!);

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

export async function getAcademicDetailsHandler(req: Request, res: Response) {
	const academicDetails = await getAcademicDetails(req.user?.User.id!);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: academicDetails,
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
