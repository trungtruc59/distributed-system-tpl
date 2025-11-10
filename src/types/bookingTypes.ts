import { ItemPayload } from './courtType';
import { Branch } from './branchTypes';

export type BookingDetailRequest = {
    itemId: string;
    quantity: number;
    startTime?: string;
    endTime?: string;
};

export type BookingRequest = {
    customerName: string;
    phone: string;
    branchId: string;
    note?: string;
    bookingDate: string;
    paid: boolean;
    details: BookingDetailRequest[];
};

export type BookingDetail = {
    id?: string;
    item?: ItemPayload | null;
    quantity: number;
    startTime?: string;
    endTime?: string;
    price?: number;
};

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

export type BookingResponse = {
    id: string;
    customerName: string;
    phone: string;
    bookingDate: string;
    note?: string;
    paid: boolean;
    totalPrice?: number;
    status: BookingStatus;
    branch?: Pick<Branch, 'id' | 'name' | 'address'> | null;
    details: BookingDetail[];
};

export type BookingListParams = {
    page?: number;
    pageSize?: number;
    searchKey?: string;
    from?: string;
    to?: string;
    branch?: string;
    sortProperty?: string;
    sortOrder?: 'asc' | 'desc';
};
