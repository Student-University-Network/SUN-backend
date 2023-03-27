import { z } from 'zod';

export const getProgramSchema = z.object({
	params: z.object({ programId: z.string() }),
});

export type getProgramInput = z.TypeOf<typeof getProgramSchema>['params'];

export const createProgramSchema = z.object({
	body: z
		.object({
			programName: z
				.string()
				.min(8, '8 character program name is required'),
			duration: z.number().int().positive({
				message: 'Atleast 1 semester duration is required',
			}),
			startYear: z.coerce.date(),
			endYear: z.coerce.date(),
			tag: z.string().optional(),
			batches: z.array(z.object({ batchName: z.string().min(1) })),
			currentSemester: z.number().default(0),
			semesters: z.array(
				z.object({
					semesterName: z.string().min(1),
					order: z.number(),
					courses: z.array(
						z.object({
							courseName: z.string().min(1),
							totalLectures: z.number().min(1).optional(),
							compulsory: z.boolean().default(true).optional(),
						}),
					),
				}),
			),
		})
		.refine((data) => data.currentSemester < data.duration, {
			message: 'Invalid current semester',
		})
		.refine(
			(data) => data.semesters.length === data.duration,
			(data) => ({
				message: `Only ${data.semesters.length} semesters are provided for duration of ${data.duration} semesters.`,
			}),
		),
});

export type createProgramInput = z.TypeOf<typeof createProgramSchema>['body'];

export const updateProgramSchema = z.object({
	body: z.object({
		programId: z.string(),
		programName: z
			.string()
			.min(8, '8 character program name is required')
			.optional(),
		duration: z
			.number()
			.int()
			.positive({
				message: 'Atleast 1 semester duration is required',
			})
			.optional(),
		startYear: z.coerce.date().optional(),
		endYear: z.coerce.date().optional(),
		tag: z.string().optional(),
		currentSemester: z.number().optional(),
		batches: z
			.array(
				z.object({
					id: z.string(),
					batchName: z.string().min(1),
				}),
			)
			.optional(),
		semesters: z
			.array(
				z.object({
					semesterId: z.string(),
					semesterName: z.string().min(1).optional(),
					order: z.number().optional(),
					courses: z
						.array(
							z.object({
								courseId: z.string(),
								courseName: z.string().min(1).optional(),
								totalLectures: z.number().min(1).optional(),
								compulsory: z.boolean().optional(),
							}),
						)
						.optional(),
				}),
			)
			.optional(),
	}),
});

export type updateProgramInput = z.TypeOf<typeof updateProgramSchema>['body'];
