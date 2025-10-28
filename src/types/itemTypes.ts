import { DayOfWeek } from '@/store/modules/booking/dayMapping.constant';

export type Price = {
    dayOfWeek: keyof typeof DayOfWeek;
    startTime: string;
    endTime: string;
};

export type Item = {
    id: string;
    name: string;
    type: 'COURT' | 'ITEM';
    status: string;
    capacity: number;
    unit: string;
    description: string;
    prices: Price[];
};
