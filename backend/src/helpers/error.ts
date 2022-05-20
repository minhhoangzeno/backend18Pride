export class HttpExceptError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.statusCode = status;
    this.code = code;
  }
}