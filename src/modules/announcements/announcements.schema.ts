import { z } from 'zod';

export const setAnnouncementSchema = z.object({
	body: z.object({
		title: z.string(),
		content: z.string(),
		programId: z.string().optional(),
	}),
});

export type setAnnouncementInput = z.TypeOf<
	typeof setAnnouncementSchema
>['body'];
