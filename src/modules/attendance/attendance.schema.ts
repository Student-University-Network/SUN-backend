import { z } from 'zod';

export const startAttendanceSchema = z.object({
	body: z.object({
		lectureId: z.string(),
		courseId: z.string(),
	}),
});

export type startAttendanceInput = z.TypeOf<
	typeof startAttendanceSchema
>['body'];

export const markAttendanceSchema = z.object({
	body: z.object({
		token: z.string(),
	}),
});

export type markAttendanceInput = z.TypeOf<typeof markAttendanceSchema>['body'];

export const getAttendanceReportSchema = z.object({
	query: z.object({
		courseId: z.string(),
		batchId: z.string(),
	}),
});

export type getAttendanceReportInput = z.TypeOf<
	typeof getAttendanceReportSchema
>['query'];
