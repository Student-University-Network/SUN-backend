import {
	createProgramInput,
	getProgramInput,
	updateProgramInput,
} from '@/modules/program/program.schema';
import { Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/HttpStatusCodes';
import { Status } from '@/constants/Status';
import {
	createNewProgram,
	getProgramDetails,
	getProgramList,
	updateProgram,
} from '@/modules/program/program.service';

export async function getProgramHandler(
	req: Request<getProgramInput>,
	res: Response,
) {
	const { programId } = req.params;

	const program = await getProgramDetails(req.user!, programId);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: program,
	});
}

export async function getProgramListHandler(req: Request, res: Response) {
	const list = await getProgramList();

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: list,
	});
}

export async function createProgramHandler(
	req: Request<{}, {}, createProgramInput>,
	res: Response,
) {
	const body = req.body;

	const newProgram = await createNewProgram(body);

	res.status(HttpStatusCode.CREATED).json({
		status: Status.SUCCESS,
		data: newProgram,
	});
}

export async function updateProgramHandler(
	req: Request<{}, {}, updateProgramInput>,
	res: Response,
) {
	const body = req.body;

	const updatedProgram = await updateProgram(req.user!, body);

	res.status(HttpStatusCode.OK).json({
		status: Status.SUCCESS,
		data: updatedProgram,
	});
}
