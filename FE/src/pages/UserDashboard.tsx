import Header from "../components/Header";
import { Box, CircularProgress } from '@mui/material';
import { Button, Typography, TextField, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { useReadStakingGetStakeDetail, useWriteTokenAFaucet, useWriteStakingDeposit, useWriteTokenAApprove } from "../abi/abi";
import { parseUnits } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';
import { useStakingContext } from "../contexts/StakingContext";
import { toast } from 'react-toastify';
import { convertToNumber } from "../utils/convertUtils";

const stakingContractAddress = import.meta.env.VITE_ADDRESS_STAKING as `0x${string}`;

interface StakeInfo {
    stakedAmount: number;
    stakedNFTs: number;
    userAPR: number;
    totalReward: number;
    lockTime: number;
}

const UserDashboard = () => {
    const amountFaucet = 100000;
    const { address, isConnected } = useAccount()
    // const [amountDeposit, setAmountDeposit] = useState(0);

    const [amountDeposit, setAmountDeposit] = useState<string>(''); // Change to string instead of number

    const [stakeInfor, setStakeInfor] = useState<StakeInfo>({
        stakedAmount: 0,
        stakedNFTs: 0,
        userAPR: 0,
        totalReward: 0,
        lockTime: 0
    });
    const { data: rawStakeInfor } = useReadStakingGetStakeDetail(
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
    const { tokenAContract, userBalance, updateBaseInfoUser, updateBalancesTokenA } = useStakingContext();


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
                                                <div className="">Staked Amount: {stakeInfor.stakedAmount} ETH</div>
                                                <div className="">Staked NFTs: {stakeInfor.stakedNFTs}</div>
                                                <div className="">User APR: {stakeInfor.userAPR} %</div>
                                                <div className="">Total Reward: {stakeInfor.totalReward} ETH</div>
                                                <div className="">LockTime: {stakeInfor.lockTime}</div>
                                            </>
                                        ) : (
                                            <>
                                                Please connect your Wallet to view staking information
                                            </>
                                        )}
                                    </Typography>

                                    <Button variant="contained"
                                        disabled={!isConnected}
                                        color="primary">
                                        WITHDRAW TOKENS
                                    </Button>

                                    <Button variant="contained"
                                        disabled={!isConnected}
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
        </div>
    );
}


export default UserDashboard;