import http from './http';

export type UploadFileRes = {
  access_mode: string;
  api_key: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: any;
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

export default function uploadFile(formData: FormData) {
  return http.post<UploadFileRes>(
    'api/files/upload',
    formData
  ) as Promise<UploadFileRes>;
}
