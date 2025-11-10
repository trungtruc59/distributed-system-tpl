import { CommonAPIResponse } from '@/types/CommonTypes';
import http from './http';

export const getBooking = (params: any) => {
    return http.get<CommonAPIResponse<any>>('api/bookings', params);
};

export const getBookingDetail = (bookingId: string) => {
    return http.get<CommonAPIResponse<any>>(`api/bookings/${bookingId}`);
};

export const getBookingHistory = (phone: string) => {
    return http.get<CommonAPIResponse<any>>('api/bookings/history', { phone });
};

export const postBooking = (payload: any) => {
    return http.post<CommonAPIResponse<any>>('api/bookings', payload);
};

export const updateBooking = (bookingId: string, payload: any) => {
    return http.put<CommonAPIResponse<any>>(`api/bookings/${bookingId}`, payload);
};

export const deleteBooking = (bookingId: string) => {
    return http.delete<CommonAPIResponse<boolean>>(`api/bookings/${bookingId}`);
};

export const cancelBooking = (bookingId: string) => {
    return http.post<CommonAPIResponse<any>>(`api/bookings/${bookingId}/cancel`);
};
