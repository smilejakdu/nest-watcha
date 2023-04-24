import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMovieReviewDto {
  @IsNotEmpty()
  @ApiProperty({
    description:'user_id',
    example:1,
  })
  user_id : number;

  @IsNotEmpty()
  @ApiProperty({
    description:'genre_id',
    example:1,
  })
  genre_id : number;
}
