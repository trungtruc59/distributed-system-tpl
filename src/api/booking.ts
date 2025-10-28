import { CommonAPIResponse } from '@/types/CommonTypes';
import http from './http';

export const postBooking = (payload: any) => {
    return http.post<CommonAPIResponse<any>>('api/bookings', payload);
};

export const tmp = () => {};
