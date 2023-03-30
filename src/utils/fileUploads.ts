import config from '@/config';
import multer from 'multer';
import fs from 'fs';

if (!fs.existsSync(config.fileStoreLocation)) {
	fs.mkdirSync(config.fileStoreLocation);
	fs.mkdirSync(config.fileStoreLocation + '/batch-register');
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, config.fileStoreLocation + '/batch-register');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
	},
});

const upload = multer({ storage: storage });
export default upload;

export function parseCSV(file: Express.Multer.File, delimeter: string) {
	const content = fs.readFileSync(file.path, { encoding: 'utf-8' });
	content.replaceAll('\r\n', '\n');
	const allDataArray = content
		.split('\n')
		.map((line) => line.split(delimeter));
	const metaDataArray = allDataArray.slice(0, 2);
	const contentArray = allDataArray.slice(2);

	let dataObject: Array<{ [k: string]: any }> = [];
	for (const row of contentArray) {
		let newRow: { [k: string]: any } = {};
		for (const i in row) {
			const value = row[i];
			switch (metaDataArray[1][i]) {
				case 'int':
					newRow[metaDataArray[0][i]] = parseInt(value);
					break;
				case 'float':
					newRow[metaDataArray[0][i]] = parseFloat(value);
					break;
				case 'date':
					newRow[metaDataArray[0][i]] = new Date(value);
					break;
				default:
					newRow[metaDataArray[0][i]] = value;
					break;
			}
		}
		dataObject.push(newRow);
	}

	return dataObject;
}

export function toCSV(
	metaData: Array<Array<string>>,
	data: Array<{ [k: string]: any }>,
	delimeter: string,
) {
	data = data.map((row) => Object.values(row));
	data.splice(0, 0, metaData[1]);
	data.splice(0, 0, metaData[0]);
	const contentString = data.map((row) => row.join(delimeter)).join('\n');
	return contentString;
}
