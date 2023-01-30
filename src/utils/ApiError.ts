import { HttpStatusCode } from '@/constants/HttpStatusCodes';

export class ApiError extends Error {
	public readonly statusCode: number;
	public readonly name: string;
	constructor(name: string, statusCode: HttpStatusCode, message: string) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.statusCode = statusCode;
		this.message = message;
		this.name = name;

		Error.captureStackTrace(this);
	}
}
