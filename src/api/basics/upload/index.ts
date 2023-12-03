import { UploadFileParams } from '#/axios';
import { basicHttp } from '@/utils/http/axios';
import { UploadApiResult } from './UploadModel';

enum Api {
  UploadToOSS = '/utils/uploadImage',
}

/**
 * @description: 上传图片到 OSS
 */
export const uploadToOSS = (params: UploadFileParams) =>
  basicHttp.uploadFile<UploadApiResult<{ name: string; url: string }>>(
    {
      baseURL: 'http://127.0.0.1:7001/vben/api',
      url: Api.UploadToOSS,
    },
    params,
  );
