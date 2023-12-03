export interface UploadApiResult<T = any> {
  data: T;
  errno: number;
  message: string;
}
