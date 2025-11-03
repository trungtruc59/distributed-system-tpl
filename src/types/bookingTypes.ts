import { ItemPayload } from './courtType';

export type BookingItemRequest = {
    itemId: string;
    quantity: number;
    startTime?: string;
    endTime?: string;
};
export type BookingRequest = {
    customerName: string;
    phone: string;
    bookingDate: string;
    paid: boolean;
    details: BookingItemRequest;
};

export type BookingItem = {
    id: string;
    item: ItemPayload;
    price: number;
} & Omit<BookingItemRequest, 'itemId'>;
