import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImageService } from '../service/boardImage.service';
import { BoardImageController } from '../controller/image/boardImage.controller';
import { BoardImageRepository } from '../database/repository/boardImage.repository';

@Module({
	imports: [TypeOrmModule.forFeature([BoardImageRepository])],
	controllers: [BoardImageController],
	providers: [BoardImageService],
	exports: [BoardImageService],
})
export class ImageModule {}
