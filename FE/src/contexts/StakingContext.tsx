import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
    use,
} from 'react';
import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import {
    useReadTokenAGetContractBalance,
    useReadTokenABalanceOf,
    useReadStakingMintedNfTs,
    useReadStakingApr
} from "../abi/abi";

import { convertToString } from "../utils/convertUtils";

interface StakingContextType {
    address?: `0x${string}`;
    isAdmin: boolean;
    userBalance: string;
    tokenAContract: string;
    userNFTCount: number;
    nftBBalance: string;
    baseAPR: number;
    initializeContracts: () => Promise<void>;
    updateBalancesTokenA: () => Promise<void>;
    updateBaseInfoUser: () => Promise<void>;
}

const StakingContext = createContext<StakingContextType | null>(null);

export const useStakingContext = () => {
    const context = useContext(StakingContext);
    if (!context) {
        throw new Error("useStakingContext must be used within a StakingProvider");
    }
    return context;
};

interface StakingProviderProps {
    children: ReactNode;
}

export const StakingProvider = ({ children }: StakingProviderProps) => {
    const { address, isConnected } = useAccount();
    const [isAdmin, setIsAdmin] = useState(false);
    const [tokenAContract, setTokenAContract] = useState<string>('0')
    const [userBalance, setUserBalance] = useState<string>('0');
    const [userNFTCount, setUserNFTCount] = useState<number>(0);
    const [nftBBalance, setNFTBBalance] = useState('0');
    const [baseAPR, setBaseAPR] = useState<number>(0);

    const { data: rawContractBalance, refetch: refetchContractBalance } = useReadTokenAGetContractBalance();
    const { data: rawBalanceOfUser, refetch: refetchBalanceOfUser } = useReadTokenABalanceOf({
        args: [address as `0x${string}`],
    });
    const { data: rawNFTOfUser, refetch: refetchRawNFTOfUser } = useReadStakingMintedNfTs({
        args: [address as `0x${string}`],
    });
    const { data: rawAPR, refetch: refetchRawAPR } = useReadStakingApr();

    useEffect(() => {
        if (address && isConnected) {
            const isAdminAddress = address.toLowerCase() === import.meta.env.VITE_ADMIN_ADDRESS.toLowerCase();
            setIsAdmin(isAdminAddress);
        } else {
            setIsAdmin(false);
        }
    }, [address, isConnected]);

    const updateBalancesTokenA = useCallback(async () => {
        if (rawContractBalance !== undefined && rawContractBalance !== null) {
            const value = convertToString(rawContractBalance as bigint);
            setTokenAContract(value);
            refetchContractBalance();
        }
    }, [rawContractBalance]);

    useEffect(() => {
        if (rawBalanceOfUser || rawContractBalance || rawNFTOfUser) {
            if (isConnected) {
                const userBalanceConvert = convertToString(rawBalanceOfUser as bigint);
                setUserBalance(userBalanceConvert);
                const userNFTCountConvert = Number(rawNFTOfUser);
                setUserNFTCount(userNFTCountConvert);
            }

            const value = convertToString(rawContractBalance as bigint);
            setTokenAContract(value);
        }
    }, [rawBalanceOfUser, rawContractBalance, rawNFTOfUser])

    const updateBaseInfoUser = useCallback(async () => {
        if (rawBalanceOfUser) {
            const userBalanceConvert = convertToString(rawBalanceOfUser as bigint);
            setUserBalance(userBalanceConvert);
            refetchBalanceOfUser();
        }
        const userNFTCountConvert = Number(rawNFTOfUser);
        const aprConvert = Number(rawAPR) / 100;
        setBaseAPR(aprConvert);
        setUserNFTCount(userNFTCountConvert);
        refetchRawNFTOfUser();
        refetchRawAPR();
    }, [isConnected, rawBalanceOfUser, rawNFTOfUser, rawAPR]);

    const initializeContracts = useCallback(async () => {
        console.log('Initializing contracts...');
        await updateBalancesTokenA();
        await updateBaseInfoUser();
    }, [isConnected, updateBalancesTokenA, updateBaseInfoUser]);

    useEffect(() => {
        initializeContracts();
    }, [initializeContracts]);

    const contextValue = useMemo(() => ({
        address,
        isAdmin,
        tokenAContract,
        userBalance,
        userNFTCount,
        nftBBalance,
        baseAPR,
        initializeContracts,
        updateBalancesTokenA,
        updateBaseInfoUser
    }), [
        address,
        isAdmin,
        tokenAContract,
        userBalance,
        userNFTCount,
        nftBBalance,
        baseAPR,
        initializeContracts,
        updateBalancesTokenA,
        updateBaseInfoUser
    ]);

    return (
        <StakingContext.Provider value={contextValue}>
            {children}
        </StakingContext.Provider>
    );
};
