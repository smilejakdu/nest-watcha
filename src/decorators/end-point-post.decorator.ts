import {applyDecorators, Post} from "@nestjs/common";
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {Type} from "class-transformer";

export function endPointPostDecorator<T>(summary: string,
                                        description:string,
                                        responseDtoClass: new () => T,
                                        endPoint: string,
) {

  return applyDecorators(
    ApiOperation({
      summary: summary,
    }),
    ApiOkResponse({
      description: description,
      type: Type(() => responseDtoClass),
    }),
    Post(endPoint),
  );
}
