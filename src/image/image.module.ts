import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImageEntity } from 'src/entities/BoardImageEntity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
	imports: [TypeOrmModule.forFeature([BoardImageEntity])],
	controllers: [ImageController],
	providers: [ImageService],
	exports: [ImageService],
})
export class ImageModule {}
