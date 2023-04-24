import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {MovieReviewRepository} from "../database/repository/movieReview.repository";

@Injectable()
export class MovieReviewService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly movieReviewRepository: MovieReviewRepository,
  ) {}

  async createMovieReview(user_id: number) {

  }
}