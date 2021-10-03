import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImage } from 'src/entities/BoardImage';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
	imports: [TypeOrmModule.forFeature([BoardImage])],
	controllers: [ImageController],
	providers: [ImageService],
	exports: [ImageService],
})
export class ImageModule {}
