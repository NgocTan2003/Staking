import Header from "../components/Header";
import { Box, CircularProgress, Checkbox } from '@mui/material';
import { Button, Typography, TextField, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useCallback, } from "react";
import { useAccount } from 'wagmi'
import {
    useReadStakingGetStakeDetail, useWriteTokenAFaucet, useWriteStakingDeposit, useWriteTokenAApprove,
    useReadStakingGetCurrentApr, useReadStakingGetNftListByOwner, useWriteStakingClaimReward, useWriteTokenASetStakingContract
} from "../abi/abi";
import { parseUnits } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';
import { useStakingContext } from "../contexts/StakingContext";
import { toast } from 'react-toastify';
import { convertToString, convertToNumber } from "../utils/convertUtils";

const stakingContractAddress = import.meta.env.VITE_ADDRESS_STAKING as `0x${string}`;

const UserDashboard = () => {
    const amountFaucet = 100000;
    const { address, isConnected } = useAccount()
    const [amountDeposit, setAmountDeposit] = useState<string>('');
    const [stakedAmount, setStakedAmonut] = useState<string>('0');
    const [stakedNFTsCount, setstakedNFTsCount] = useState<number>(0);
    const [NFTsOwned, setNFTsOwned] = useState<any[]>([]);
    const [stakedNFTs, setStakedNFTs] = useState<any[]>([]);
    const [userAPR, setUserAPR] = useState<number>(0);
    const [totalReward, setTotalReward] = useState<string>('0');
    const [lockTime, setLockTime] = useState<number>(0);
    const [selectedNFTsForDeposit, setSelectedNFTsForDeposit] = useState<string[]>([]);
    const { data: rawStakeInfo, refetch: refetchStakeInfo } = useReadStakingGetStakeDetail(
        address ? {
            args: [address],
        } : {
            args: ['0x0000000000000000000000000000000000000000'],
        }
    );
    const [disabledDeposit, setDisabledDeposit] = useState(true);
    const { writeContractAsync: deposit, isSuccess: successDeposit, isPending: pendingDeposit } = useWriteStakingDeposit();
    const { writeContractAsync: approve, isPending: pendingApprove } = useWriteTokenAApprove();
    const { writeContractAsync: faucet, isPending: pendingFaucet } = useWriteTokenAFaucet();
    const { data: rawNFTs, refetch: refetchRawNFTs } = useReadStakingGetNftListByOwner({
        args: [address as `0x${string}`],
    });
    const { data: rawCurrentApr } = useReadStakingGetCurrentApr({
        args: [address as `0x${string}`],
    });
    const { writeContractAsync: claimReward, isSuccess: successClaimReward, isPending: pendingClaimReward } = useWriteStakingClaimReward();
    const { tokenAContract, userBalance, updateBaseInfoUser, updateBalancesTokenA } = useStakingContext();

    useEffect(() => {
        if (rawStakeInfo && isConnected) {
            const stakedAmount = convertToString(rawStakeInfo[0] as bigint);
            setStakedAmonut(stakedAmount);
            const stakedNFTs = Number(rawStakeInfo[4]);
            setstakedNFTsCount(stakedNFTs);
            const userAPR = Number(rawCurrentApr) / 100;
            setUserAPR(userAPR);
        }
    }, [rawStakeInfo, rawNFTs]);

    useEffect(() => {
        if (successDeposit) {
            toast.success('Deposit Success');
            setLockTime(30);
        }
    }, [successDeposit]);

    useEffect(() => {
        if (rawNFTs && isConnected) {
            const ownedNFTs = rawNFTs.map(nft => Number(nft));
            setNFTsOwned(ownedNFTs);
        }
    }, [rawNFTs, isConnected]);

    const fetchTotalReward = useCallback(async () => {
        await refetchStakeInfo();
        if (address && rawStakeInfo) {
            try {
                const totalReward = rawStakeInfo[1] + rawStakeInfo[2];
                const totalRewardConvert = convertToString(totalReward as bigint);
                setTotalReward(totalRewardConvert);
            } catch (error) {
                console.error("Error fetching total reward:", error);
            }
        }
    }, [address, rawStakeInfo]);

    useEffect(() => {
        if (address) {
            fetchTotalReward();
            const interval = setInterval(() => {
                fetchTotalReward();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [address, fetchTotalReward]);

    useEffect(() => {
        if (lockTime <= 0) return;

        const interval = setInterval(() => {
            setLockTime(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [lockTime]);

    const handleFaucet = async () => {
        try {
            const amountBigInt = parseUnits(amountFaucet.toString(), 18);
            const tx = await faucet({
                args: [amountBigInt],
            });

            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 10_000,
            });

            await updateBaseInfoUser();
            await updateBalancesTokenA();
        } catch (error) {
            console.error('Faucet error:', error);
        }
    };

    const handleChangeDeposit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setDisabledDeposit(false);
            const valueNumber = value === '' ? 0 : parseFloat(value);
            const balance = convertToNumber(userBalance);
            if (valueNumber > balance) {
                setDisabledDeposit(true);
                toast.error('Deposit amount exceeds your balance');
            } else {
                setAmountDeposit(value);
                setDisabledDeposit(valueNumber <= 0);
            }
        } else {
            setDisabledDeposit(true);
            toast.error('Invalid number format');
        }
    };

    const handleDeposit = async () => {
        try {
            const amountBigInt = parseUnits(amountDeposit.toString(), 18);
            await approve({
                args: [stakingContractAddress, amountBigInt],
            });

            const tx = await deposit({
                args: [amountBigInt],
            });

            setAmountDeposit('');

            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 10_000,
            });

            await refetchStakeInfo();
            await updateBaseInfoUser();
        } catch (error) {
            console.error('Deposit error:', error);
            toast.error('Transaction failed');
        }
    }

    const handleClaimReward = async () => {
        try {
            if (isConnected && address) {
                const tx = await claimReward({});

                await waitForTransactionReceipt(config, {
                    hash: tx,
                    timeout: 10_000,
                });

                await refetchStakeInfo();
                await updateBaseInfoUser();
                toast.success('Claim reward success');
            }
        } catch (error) {
            console.error('Claim reward error:', error);
            toast.error('Transaction failed');
        }
    }


    return (
        <div>
            <Header />

            <div className="bg-blue-100 h-screen w-full p-6">
                <div className="text-3xl">User Dashboard</div>
                <div className="text-sm mt-5">
                    Token A Remaining in Contract: {tokenAContract} ETH
                </div>
                <Grid container spacing={2} className="mt-2">
                    <Grid size={5}>
                        <div className="mt-2 bg-white p-6 rounded-lg shadow-md">
                            <Box
                                sx={{
                                    flexGrow: 1, p: 1
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="h5" color="black" sx={{ fontSize: '20px' }}>
                                        Staking information
                                    </Typography>

                                    <Typography variant="h5" color="black" sx={{ fontSize: '15px' }}>
                                        {isConnected ? (
                                            <>
                                                <div className="">Staked Amount: {stakedAmount} ETH</div>
                                                <div className="">Staked NFTs: {stakedNFTsCount}</div>
                                                <div className="">User APR: {userAPR} %</div>
                                                <div className="">Total Reward: {totalReward} ETH</div>
                                                <div className="">LockTime: {lockTime}s</div>
                                            </>
                                        ) : (
                                            <>
                                                Please connect your Wallet to view staking information
                                            </>
                                        )}
                                    </Typography>

                                    <Button variant="contained"
                                        disabled={!isConnected || lockTime > 0}
                                        color="primary">
                                        WITHDRAW TOKENS
                                    </Button>

                                    <Button variant="contained"
                                        onClick={handleClaimReward}
                                        disabled={!isConnected || lockTime > 0}
                                        color="primary">
                                        CLAIM REWARDS
                                    </Button>
                                </Stack>
                            </Box>
                        </div>
                    </Grid>

                    <Grid size={7}>
                        <div className="mt-2 bg-white p-6 rounded-lg shadow-md">
                            <Box
                                sx={{
                                    flexGrow: 1, p: 1
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="h5" color="black" sx={{ fontSize: '20px' }}>
                                        Staking Actions
                                    </Typography>

                                    <TextField label="Amount Deposit" variant="outlined" value={amountDeposit} type="text" onChange={handleChangeDeposit} fullWidth />

                                    <Button variant="contained" disabled={disabledDeposit} onClick={handleDeposit} color="primary">
                                        {pendingDeposit ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                            </>
                                        ) : (
                                            'Deposit'
                                        )}
                                    </Button>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select NFTs to Deposit</InputLabel>
                                        <Select
                                            multiple
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Select NFTs to Deposit"
                                            value={selectedNFTsForDeposit}
                                            renderValue={(selected: string[]) =>
                                                selected.join(", ")
                                            }
                                        // onChange={}
                                        >
                                            {NFTsOwned
                                                .filter(
                                                    (nftId) =>
                                                        !stakedNFTs.includes(nftId)
                                                )
                                                .map((nftId) => (
                                                    <MenuItem
                                                        key={nftId}
                                                        value={nftId}
                                                    >
                                                        <Checkbox
                                                            checked={
                                                                selectedNFTsForDeposit.indexOf(
                                                                    nftId
                                                                ) > -1
                                                            }
                                                            value={nftId}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                setSelectedNFTsForDeposit((prev) =>
                                                                    prev.includes(value)
                                                                        ? prev.filter((id) => id !== value)
                                                                        : [...prev, value]
                                                                );
                                                            }}
                                                        />
                                                        <Typography>
                                                            NFT #{nftId}
                                                        </Typography>
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>

                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isConnected}
                                            fullWidth
                                        >
                                            Deposit Selected NFTs
                                        </Button>
                                    </div>

                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isConnected}
                                            fullWidth
                                            onClick={handleFaucet}
                                        >
                                            {pendingFaucet ? (
                                                <>
                                                    <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                                </>
                                            ) : (
                                                'Faucet 3M Token A'
                                            )}
                                        </Button>
                                    </div>
                                </Stack>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div >
    );
}


export default UserDashboard;