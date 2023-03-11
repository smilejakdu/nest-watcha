import { HttpStatus } from '@nestjs/common';

export interface CoreResponse {
  ok: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export class CoreResponseDto implements CoreResponse {
  ok: boolean;
  statusCode: number;
  message: string;
  data?: any;
}

export function SuccessFulResponse(data,status = HttpStatus.OK){
  if(status == HttpStatus.CREATED){
    return {
      ok: true,
      statusCode: HttpStatus.CREATED,
      message: 'SUCCESS',
      data:data
    };
  }
  return {
    ok: true,
    statusCode: HttpStatus.OK,
    message: 'SUCCESS',
    data:data
  };
}

export function BadRequest(){
  return {
    ok:false,
    statusCode:HttpStatus.BAD_REQUEST,
    message:'BAD REQUEST'
  };
}

export function NotFoundResponse(data) {
  return {
    ok: false,
    statusCode: HttpStatus.NOT_FOUND,
    message: `does not found ${data}`,
  };
}