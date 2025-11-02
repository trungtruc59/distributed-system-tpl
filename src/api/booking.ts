import { CommonAPIResponse } from '@/types/CommonTypes';
import http from './http';

export const getBooking = (params: any) => {
    return http.get<CommonAPIResponse<any>>('api/bookings', params);
};

export const getBookingHistory = (phone: string) => {
    return http.get<CommonAPIResponse<any>>('api/bookings/history', { phone });
};

export const postBooking = (payload: any) => {
    return http.post<CommonAPIResponse<any>>('api/bookings', payload);
};
