import {ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiTags} from "@nestjs/swagger";
import {Controller, UseInterceptors} from "@nestjs/common";
import {UndefinedToNullInterceptor} from "../../shared/common/interceptors/undefinedToNull.interceptor";
import {UsersService} from "../../service/users.service";
import {ConfigService} from "@nestjs/config";

@ApiInternalServerErrorResponse({
  description: 'server error',
})
@UseInterceptors(UndefinedToNullInterceptor)
@ApiBadRequestResponse({ description: 'bad request' })
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
}
