export class ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data ?? (null as any);
  }

  static success<T>(data: T, message = 'success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(message: string, code = 500): ApiResponse {
    return new ApiResponse(code, message);
  }
}
