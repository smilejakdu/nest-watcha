import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
	imports: [TypeOrmModule.forFeature([Boards])],
	controllers: [ImageController],
	providers: [ImageService],
})
export class ImageModule {}
