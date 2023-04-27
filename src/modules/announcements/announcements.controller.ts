import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import { setAnnouncementInput } from '@/modules/announcements/announcements.schema';
import {
	getAnnouncements,
	setAnnouncement,
	getProgramList,
} from '@/modules/announcements/announcements.service';
import { Request, Response } from 'express';

export async function getAnnouncementsHandler(req: Request, res: Response) {
	const userId = req.user?.User.id;
	const list = await getAnnouncements(userId || '');

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: list,
	});
}

export async function setAnnouncementHandler(
	req: Request<{}, {}, setAnnouncementInput>,
	res: Response,
) {
	const userId = req.user?.User.id;
	const response = await setAnnouncement(userId || '', req.body);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: response,
	});
}

export async function getProgramListHandler(req: Request, res: Response) {
	const userId = req.user?.User.id;
	const list = await getProgramList(userId || '');

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: list,
	});
}
