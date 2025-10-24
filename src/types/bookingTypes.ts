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
    item: any;
    price: number;
} & Omit<BookingItemRequest, 'itemId'>;
