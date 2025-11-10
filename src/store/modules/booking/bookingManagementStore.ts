import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { cancelBooking, deleteBooking, getBooking, getBookingDetail, postBooking, updateBooking } from '@/api/booking';
import { BookingListParams, BookingResponse } from '@/types/bookingTypes';

type BookingManagementState = {
    bookings: BookingResponse[];
    totalElements: number;
    totalPages: number;
    loading: boolean;
    filters: Required<Pick<BookingListParams, 'page' | 'pageSize'>> & Omit<BookingListParams, 'page' | 'pageSize'>;
    selectedBooking: BookingResponse | null;
};

const todayStart = dayjs().startOf('day').toISOString();
const todayEnd = dayjs().endOf('day').toISOString();

const defaultFilters = {
    page: 0,
    pageSize: 10,
    searchKey: '',
    branch: '',
    from: todayStart,
    to: todayEnd,
    sortProperty: 'bookingDate',
    sortOrder: 'desc' as const,
};

const useBookingManagementStore = defineStore('booking-management', {
    state: (): BookingManagementState => ({
        bookings: [],
        totalElements: 0,
        totalPages: 1,
        loading: false,
        filters: { ...defaultFilters },
        selectedBooking: null,
    }),

    actions: {
        async fetchBookings(params?: BookingListParams) {
            this.loading = true;
            try {
                const requestParams = {
                    ...this.filters,
                    ...params,
                };

                const response = await getBooking(requestParams);
                if (response && 'data' in response) {
                    this.bookings = Array.isArray(response.data) ? response.data : [];
                    this.totalPages = response.totalPages ?? 1;
                    this.totalElements = response.totalElements ?? this.bookings.length;
                    this.filters = requestParams;
                }
            } finally {
                this.loading = false;
            }
        },

        async fetchBookingDetail(bookingId: string) {
            const response = await getBookingDetail(bookingId);
            if (response && 'data' in response) {
                this.selectedBooking = response.data as BookingResponse;
                return this.selectedBooking;
            }
            return null;
        },

        setSelectedBooking(booking: BookingResponse | null) {
            this.selectedBooking = booking;
        },

        resetFilters() {
            this.filters = { ...defaultFilters };
        },

        async cancelBooking(bookingId: string) {
            const response = await cancelBooking(bookingId);
            if (response && 'data' in response) {
                await this.fetchBookings();
                return response.data;
            }
            return null;
        },

        async deleteBooking(bookingId: string) {
            const response = await deleteBooking(bookingId);
            if (response && 'data' in response) {
                await this.fetchBookings();
                return response.data;
            }
            return null;
        },

        async markBookingAsPaid(booking: BookingResponse) {
            if (!booking.branch?.id) {
                throw new Error('Không xác định được chi nhánh của đơn đặt sân.');
            }

            const payload = {
                customerName: booking.customerName,
                phone: booking.phone,
                branchId: booking.branch?.id ?? '',
                note: booking.note || '',
                bookingDate: booking.bookingDate,
                paid: true,
                details: booking.details.map((detail) => ({
                    itemId: (() => {
                        if (!detail.item?.id) {
                            throw new Error('Đơn đặt sân thiếu thông tin sân.');
                        }
                        return detail.item.id;
                    })(),
                    quantity: detail.quantity,
                    startTime: detail.startTime,
                    endTime: detail.endTime,
                })),
            };

            const response = await updateBooking(booking.id, payload);
            if (response && 'data' in response) {
                const updatedBooking = response.data as BookingResponse;
                
                // Cập nhật trực tiếp trong danh sách
                const index = this.bookings.findIndex((b) => b.id === booking.id);
                if (index !== -1) {
                    this.bookings[index] = updatedBooking;
                }
                
                // Cập nhật selectedBooking nếu đang xem chi tiết
                if (this.selectedBooking?.id === booking.id) {
                    this.selectedBooking = updatedBooking;
                }
                
                // Gọi lại fetchBookings với filter hiện tại để đảm bảo đồng bộ
                await this.fetchBookings(this.filters);
                
                return updatedBooking;
            }
            return null;
        },

        async createBooking(payload: any) {
            const response = await postBooking(payload);
            if (response && 'data' in response) {
                // Không tự refresh ở đây, để component tự refresh với filter hiện tại
                return response.data;
            }
            throw new Error('Không thể tạo đơn đặt sân');
        },
    },
});

export default useBookingManagementStore;

