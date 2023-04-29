import { z } from 'zod';

export enum LectureStatus {
	SCHEDULED = 'SCHEDULED',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export const getTimetableSchema = z.object({
	params: z.object({
		batchId: z.string({
			required_error: 'Please provide batch ID to get its timetable',
		}),
	}),
});

export type getTimetableInput = z.TypeOf<typeof getTimetableSchema>['params'];

export const setLectureStatusSchema = z.object({
	body: z.object({
		batchId: z.string(),
		lectureId: z.string(),
		status: z.nativeEnum(LectureStatus),
	}),
});

export type setLectureStatusInput = z.TypeOf<
	typeof setLectureStatusSchema
>['body'];

export const setTimetableSchema = z.object({
	body: z.object({
		batchId: z.string(),
		batchName: z.string(),
		days: z.array(
			z.object({
				weekDay: z.number(),
				lectures: z.array(
					z.object({
						id: z.string().optional(),
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
						status: z
							.nativeEnum(LectureStatus)
							.default(LectureStatus.SCHEDULED),
					}),
				),
			}),
		),
	}),
});

export type setTimetableInput = z.TypeOf<typeof setTimetableSchema>['body'];

export const setFirebaseTokenSchema = z.object({
	body: z.object({
		token: z.string(),
	}),
});

export type setFirebaseTokenInput = z.TypeOf<
	typeof setFirebaseTokenSchema
>['body'];
