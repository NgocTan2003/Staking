import { formatEther } from 'viem';


export const convertToString = (value: bigint): string => {
    if (value === undefined || value === null) {
        throw new Error("Invalid value: value is undefined or null");
    }

    const valueETH = formatEther(value as bigint)
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(Number(valueETH));

    return String(formattedValue);
}

export const convertToNumber = (formatted: string): number => {
    const normalized = formatted.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
};

export function truncateMiddle(str: string, startLength: number = 5, endLength: number = 4): string {
    if (str.length <= startLength + endLength) {
        return str;
    }
    return str.slice(0, startLength) + '...' + str.slice(-endLength);
}

