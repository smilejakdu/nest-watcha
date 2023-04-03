import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CoreResponseDto {
  @ApiProperty({
    example: true,
    description: '성공 여부',
  })
  ok: boolean;

  @ApiProperty({
    example: 200,
    description: '상태 코드',
  })
  statusCode: number;

  @ApiProperty({
    example: 'SUCCESS',
    description: '메세지',
  })
  message: string;
}

export class CoreResponseListDto implements CoreResponseDto {
  ok: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export function SuccessFulResponse(data?, status = HttpStatus.OK) {
  if(status == HttpStatus.CREATED) {
    return {
      ok: true,
      statusCode: HttpStatus.CREATED,
      message: 'SUCCESS',
      data: data
    };
  }
  return {
    ok: true,
    statusCode: HttpStatus.OK,
    message: 'SUCCESS',
    data: data
  };
}

export function BadRequest(message = 'BAD REQUEST', status = HttpStatus.BAD_REQUEST){
  return {
    ok: false,
    statusCode: status,
    message: message,
  };
}

export function HttpRequestResponse(message: string, status = HttpStatus.BAD_REQUEST) {
  return {
    ok: false,
    statusCode: status,
    message,
  };
}

export function NotFoundResponse(data) {
  return {
    ok: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `does not found ${data}`,
  };
}