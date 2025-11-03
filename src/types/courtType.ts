import { DayOfWeek } from '@/store/modules/booking/dayMapping.constant';

export type Price = {
    id?: string;
    dayOfWeek: keyof typeof DayOfWeek;
    startTime: string;
    endTime: string;
    price: number;
    isDefault: boolean;
    createdAt?: string;
    updatedAt: string;
};
export type ItemPayload = {
    id: string;
    name: string;
    type: string;
    status: string;
    capacity: number;
    unit: string;
    description: string;
};
