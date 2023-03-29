import { Body, CacheTTL, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenreService } from '../../service/genre.service';
import { GetGenreDto } from './genre.controller.dto/getGenre.dto';
import { UpdateGenreRequestDto } from './genre.controller.dto/updateGenre.dto';
import { DeleteGenreRequestDto } from './genre.controller.dto/deleteGenre.dto';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { PermissionsGuard } from '../../shared/common/permissions/permissionCheck';
import { CreateGenreRequestDto } from "./genre.controller.dto/createGenre.dto";
import { Pagination } from 'src/shared/pagination';
import {CoreResponseDto} from "../../shared/CoreResponse";

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('GENRE')
@Controller('genre')
export class GenreController {
	constructor(
		private readonly genreService: GenreService,
	) {}

	@ApiOperation({ summary: '장르 만들기' })
	@ApiCreatedResponse({
		description: '성공',
		type: GetGenreDto,
	})
	@UseGuards(UserAuthGuard, PermissionsGuard)
	@Post()
	async createGenre(@Req() req, @Body() body: CreateGenreRequestDto) {
		return this.genreService.createGenre(body.genreName);
	}

	@ApiOperation({ summary: '모든 장르 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: GetGenreDto,
	})
	@Get()
	async findAllGenre(@Query() page: Pagination) {
		const {pageNumber, size} = page;
		const parsingPageNumber = (Number(pageNumber) !== 0 && pageNumber) ? pageNumber : 1;
		const parsingSizeNumber = (Number(size) !== 0 && size) ? size : 5;

		return this.genreService.findAllGenre(parsingPageNumber, parsingSizeNumber);
	}

	@ApiOperation({ summary: '하나의 장르 와 뮤비 가져오기' })
	@ApiOkResponse({
		description: '성공',
		type: GetGenreDto,
	})
	@CacheTTL(5)
	@Get(':genreName')
	async findOneGenre(
		@Query() page: Pagination,
		@Query('genreName') genreName: string,
	):Promise<CoreResponseDto> {
		const { pageNumber, size } = page;
		const parsingPageNumber = (Number(pageNumber) !== 0 && pageNumber) ? pageNumber : 1;
		const parsingSizeNumber = (Number(size) !== 0 && size) ? size : 5;

		return this.genreService.findGenreWithMovieByName(genreName, parsingPageNumber, parsingSizeNumber);
	}

	@ApiOperation({ summary: '장르 업데이트' })
	@ApiOkResponse({
		description: '업데이트 성공',
		type: UpdateGenreRequestDto,
	})
	@UseGuards(UserAuthGuard, PermissionsGuard)
	@Patch(':id')
	async updateOneGenre(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateGenreRequestDto,
	) {
		return this.genreService.updateGenre(id, body.genreName);
	}

	@ApiOperation({ summary: '장르 삭제하기' })
	@ApiOkResponse({
		description: '삭제하기 성공',
		type: DeleteGenreRequestDto,
	})
	@UseGuards(UserAuthGuard, PermissionsGuard)
	@Delete(':id')
	async deleteOneGenre(@Param('id', ParseIntPipe) id: number) {
		return this.genreService.deletedGenre(id);
	}
}
