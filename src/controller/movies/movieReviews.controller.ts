import {ApiInternalServerErrorResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Param, ParseIntPipe, Req, UseGuards} from "@nestjs/common";
import {UserAuthGuard} from "../../shared/auth/guard/user-auth.guard";
import {endPointPostDecorator} from "../../decorators/controllerDecorators/end-point-post.decorator";
import {CoreResponseDto} from "../../shared/CoreResponse";
import {Request} from "express";
import {UsersEntity} from "../../database/entities/User/Users.entity";
import {MovieReviewService} from "../../service/movieReview.service";

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIE_REVIEWS')
@Controller('movie_reviews')
export class MovieReviewsController {
  constructor(
    private readonly movieReviewService: MovieReviewService,
  ) {}

  @UseGuards(UserAuthGuard)
  @endPointPostDecorator('댓글 쓰기', '성공', CoreResponseDto, '')
  async postComments(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
    @Req() request: Request,
  ) {
    const foundUser = request.user as UsersEntity;
    await this.movieReviewService.createMovieReview(foundUser.id);
  }
}