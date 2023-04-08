import { z } from 'zod';

export const getTimetableSchema = z.object({
	params: z.object({
		batchId: z.string({
			required_error: 'Please provide batch ID to get its timetable',
		}),
	}),
});

export type getTimetableInput = z.TypeOf<typeof getTimetableSchema>['params'];

export const setTimetableSchema = z.object({
	body: z.object({
		batchId: z.string(),
		batchName: z.string(),
		days: z.array(
			z.object({
				weekDay: z.number(),
				lectures: z.array(
					z.object({
						courseId: z.string(),
						professorId: z.string(),
						professorName: z.string(),
						room: z.string(),
						startTime: z.object({
							hour: z.number(),
							minute: z.number(),
						}),
						endTime: z.object({
							hour: z.number(),
							minute: z.number(),
						}),
					}),
				),
			}),
		),
	}),
});

export type setTimetableInput = z.TypeOf<typeof setTimetableSchema>['body'];
