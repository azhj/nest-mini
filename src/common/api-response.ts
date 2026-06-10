/**
 * ============================================================
 * 统一 API 响应封装（ApiResponse）
 * ============================================================
 *
 * 职责：统一所有 API 响应格式，便于前端统一处理
 *
 * 响应格式：
 * {
 *   code: number;    // 状态码（200=成功，其他=错误码）
 *   message: string; // 提示信息
 *   data: T;         // 响应数据
 * }
 */

export class ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(message: string, code = 500): ApiResponse<null> {
    return new ApiResponse(code, message, null);
  }
}
