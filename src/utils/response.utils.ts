import { ResponsePagination, ResponseSuccess } from "src/interface/response.interface";

export class BaseResponse {
  _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data ? data  : {},
    };
  }

  _pagination(
    massage: string,
    data: any,
    total: number,
    page: number,
    pageSize: number,
  ): ResponsePagination {
    return {
      status: 'Success',
      message: massage,
      data: data,
      pagination: {
        total_page: total == 0 ? total + 1 : total,
        page: page,
        pageSize: pageSize,
        total: Math.ceil(total / pageSize),
        nextPage: page + 1,
        previosPage: page - 1 === 0 ? 1 : page - 1,
      },
    };
  }
  _error(status:number,message:string) {
    return {
      status: status,
      message: message,
      error: 'Internal Server Error',
    };
  }
}
