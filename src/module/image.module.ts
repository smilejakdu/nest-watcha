import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImageEntity } from 'src/database/entities/BoardImageEntity';
import { ImageController } from '../controller/image/image.controller';
import { ImageService } from '../database/service/image.service';

@Module({
	imports: [TypeOrmModule.forFeature([BoardImageEntity])],
	controllers: [ImageController],
	providers: [ImageService],
	exports: [ImageService],
})
export class ImageModule {}
