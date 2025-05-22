import { formatEther } from 'viem';


export const convertToString = (value: bigint): string => {
    const valueETH = formatEther(value as bigint)
    const formattedValue = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(Number(valueETH));

    return String(formattedValue);
}