import { Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from 'src/shared/common/interceptors/undefinedToNull.interceptor';
import { multerOptions } from 'src/shared/lib/multerOptions';
import { imageUploadRequest } from './image.controller.dto/image.upload.dto';
import { BoardImageService } from '../../service/boardImage.service';

@ApiInternalServerErrorResponse({
	description: '서버 에러',
})
@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('IMAGE')
@Controller('image')
export class ImageController {
	constructor(private imageService: BoardImageService) {}

	@UseInterceptors(FilesInterceptor('images', null, multerOptions))
	// FilesInterceptor 첫번째 매개변수: formData의 key값,
	// 두번째 매개변수: 파일 최대 갯수
	// 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)
	@ApiOkResponse({
		description: '성공',
		type: imageUploadRequest,
	})
	// @ApiCookieAuth('connect.sid')
	// @UseGuards(new LoggedInGuard())
	@ApiOperation({ summary: '이미지 업로드' })
	@Post('/')
	async uploadImages(@UploadedFiles() files: File[]) {
		const uploadedFiles = await this.imageService.uploadFiles(files);

		return {
			message: 'image upload success',
			data: uploadedFiles,
		};
	}

	@Get('/')
	async findImages() {
		const findImagesResult = await this.imageService.findAllImages();
		return {
			message: 'image get success',
			data: findImagesResult,
		};
	}
}
