import dayjs from 'dayjs';

// eslint-disable-next-line import/prefer-default-export
export const formatOpenAndCloseTimeOfBranch = (openTime: string, closeTime: string) => {
    const openHour = dayjs(openTime).format('HH:mm');
    const closeHour = dayjs(closeTime).format('HH:mm');
    return `${openHour} - ${closeHour}`;
};
