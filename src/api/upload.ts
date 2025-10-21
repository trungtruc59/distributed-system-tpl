import http from './http';

export default function uploadFile(formData: FormData) {
  return http.post('api/files/upload', formData);
}
