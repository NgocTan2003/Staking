import Header from "../components/Header";
import { Box, CircularProgress } from '@mui/material';
import { Button, Typography, TextField, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useCallback, use } from "react";
import { useAccount } from 'wagmi'
import {
    useReadStakingGetStakeDetail, useWriteTokenAFaucet, useWriteStakingDeposit, useWriteTokenAApprove,
    useReadStakingGetCurrentApr, useReadStakingGetLockTimeRemaining
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
    const [stakedNFTs, setStakedNFTs] = useState<number>(0);
    const [userAPR, setUserAPR] = useState<number>(0);
    const [totalReward, setTotalReward] = useState<string>('0');
    const [lockTime, setLockTime] = useState<number>(0);
    const { data: rawStakeInfor, refetch: refetchStakeInfo } = useReadStakingGetStakeDetail(
        address ? {
            args: [address],
        } : {
            args: ['0x0000000000000000000000000000000000000000'],
        }
    );
    const [disabledDeposit, setDisabledDeposit] = useState(true);
    const { writeContractAsync: deposit, isPending: pendingDeposit } = useWriteStakingDeposit();
    const { writeContractAsync: approve, isPending: pendingApprove } = useWriteTokenAApprove();
    const { writeContractAsync: faucet, isPending: pendingFaucet } = useWriteTokenAFaucet();
    const { data: rawCurrentApr } = useReadStakingGetCurrentApr({
        args: [address as `0x${string}`],
    });
    const { data: rawStakingLockTimeRemaining } = useReadStakingGetLockTimeRemaining({
        args: [address as `0x${string}`],
    });
    const { tokenAContract, userBalance, updateBaseInfoUser, updateBalancesTokenA } = useStakingContext();

    useEffect(() => {
        if (rawStakeInfor && isConnected) {
            console.log('rawStakeInfor', rawStakeInfor);
            const stakedAmount = convertToString(rawStakeInfor[0] as bigint);
            setStakedAmonut(stakedAmount);
            const stakedNFTs = Number(rawStakeInfor[4]);
            setStakedNFTs(stakedNFTs);
            const userAPR = Number(rawCurrentApr) / 100;
            setUserAPR(userAPR);
        }
    }, [rawStakeInfor]);

    const fetchTotalReward = useCallback(async () => {
        await refetchStakeInfo();
        if (address && rawStakeInfor) {
            try {
                const totalReward = rawStakeInfor[1] + rawStakeInfor[2];
                const totalRewardConvert = convertToString(totalReward as bigint);
                setTotalReward(totalRewardConvert);
            } catch (error) {
                console.error("Error fetching total reward:", error);
            }
        }
    }, [address, rawStakeInfor]);

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
            toast.success('Deposit Success');
            setLockTime(30);

            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 10_000,
            });


            await updateBaseInfoUser();
        } catch (error) {
            console.error('Deposit error:', error);
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
                                                <div className="">Staked NFTs: {stakedNFTs}</div>
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
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Select NFTs to Deposit"
                                        // value={}
                                        // onChange={}
                                        >
                                            <MenuItem>Ten</MenuItem>
                                            <MenuItem>Twenty</MenuItem>
                                            <MenuItem>Thirty</MenuItem>
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