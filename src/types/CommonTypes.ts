export type CommonSearchParams = {
  searchKey?: string;
  sortProperty?: string;
  sortOrder?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export type CommonAPIResponse<T = any> = {
  data: T;
  totalPages: number;
  totalElements: number;
};

export type CommonAPIErrorResponse = {
  message: string;
  status: string;
  timestamp: number;
};
