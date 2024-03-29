import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import HttpError from 'src/shared/exception/HttpError';
import uuidRandom from './uuidRandom';

export const multerOptions = {
	fileFilter: (request, file, callback) => {
		if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
			// image type jpg , jpeg , png
			callback(null, true);
		} else {
			callback(new HttpError(400, '지원하지 않는 이미지 형식입니다.'), false);
		}
	},

	storage: diskStorage({
		destination: (request, file, callback) => {
			const uploadPath = 'public';

			if (!existsSync(uploadPath)) {
				// public 폴더가 존재하지 않을시, 생성합니다.
				mkdirSync(uploadPath);
			}
			callback(null, uploadPath);
		},

		filename: (request, file, callback) => {
			callback(null, uuidRandom(file));
		},
	}),
};

export const createImageURL = (file): string => {
	const serverAddress: string = process.env.SERVER_ADDRESS;

	// 파일이 저장되는 경로: 서버주소/public 폴더
	// 위의 조건에 따라 파일의 경로를 생성해줍니다.
	return `${serverAddress}/public/${file.filename}`;
};
