import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	getCoursesList,
	getCourseDetails,
} from '@/modules/faculty/faculty.service';
import { GetUserDetailsInput } from '@/modules/faculty/faculty.schema';

export async function getCoursesListHandler(req: Request, res: Response) {
	const coursesList = await getCoursesList(req.user?.User.id!);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: coursesList,
	});
}

export async function getCourseDetailsHandler(
	req: Request<GetUserDetailsInput>,
	res: Response,
) {
	const { userId } = req.params;
	const courseDetails = await getCourseDetails(userId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: courseDetails,
	});
}
