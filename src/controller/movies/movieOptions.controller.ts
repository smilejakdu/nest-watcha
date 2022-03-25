import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MovieOptionsService } from '../../service/movieOptions.service';
import { CreateMovieOptionDto } from './movieOption.controller.dto/createMovieOption.dto';
import { checkAdminPermission, PermissionsGuard } from '../../shared/common/permissions/permissionCheck';
import { UserAuthGuard } from '../../shared/auth/guard/user-auth.guard';
import { PermissionType } from '../../database/entities/permission.entity';

@ApiInternalServerErrorResponse({ description: '서버 에러' })
@ApiTags('MOVIES_OPTIONS')
@Controller('movies_options')
export class MovieOptionsController {
  constructor(
    private readonly movieOptionService:MovieOptionsService,
  ) {}

  @ApiOperation({ summary: '뮤비 옵션 만들기' })
  @ApiCreatedResponse({ description: '성공' })
  @UseGuards(UserAuthGuard,PermissionsGuard)
  @Post()
  async createMovieOption(@Req() req,@Body() createMovieOptionDto:CreateMovieOptionDto) {
    checkAdminPermission(req, PermissionType.ADMIN);
    console.log(createMovieOptionDto);
    return await this.movieOptionService.createMovieOption(createMovieOptionDto);
  }
}