import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardImageEntity } from 'src/database/entities/BoardImage.entity';
import { ImageController } from '../controller/image/boardImage.controller';
import { BoardImageService } from '../service/boardImage.service';

@Module({
	imports: [TypeOrmModule.forFeature([BoardImageEntity])],
	controllers: [ImageController],
	providers: [BoardImageService],
	exports: [BoardImageService],
})
export class ImageModule {}
