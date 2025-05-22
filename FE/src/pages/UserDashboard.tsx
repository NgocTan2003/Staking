import Header from "../components/Header";
import Box from '@mui/material/Box';
import { Button, Typography, TextField, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { convertToString } from "../utils/convertUtils";
import { useReadTokenAGetContractBalance, useReadStakingGetStakeDetail, useWriteTokenAFaucet, useWriteTokenASetStakingContract } from "../abi/abi";
import { parseUnits } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';

interface StakeInfo {
    stakedAmount: number;
    stakedNFTs: number;
    userAPR: number;
    totalReward: number;
    lockTime: number;
}

const UserDashboard = () => {
    const amountFaucet = 3000000;
    const { address, isConnected } = useAccount()
    const [contractBalance, setContractBalance] = useState<string>('0')
    const [stakeInfor, setStakeInfor] = useState<StakeInfo>({
        stakedAmount: 0,
        stakedNFTs: 0,
        userAPR: 0,
        totalReward: 0,
        lockTime: 0
    });
    const { data: rawContractBalance, refetch: refetchContractBalance } = useReadTokenAGetContractBalance();
    const { data: rawStakeInfor } = address ? useReadStakingGetStakeDetail({
        args: [address],
    }) : { data: undefined };
    const { writeContractAsync: faucet, isSuccess, isPending } = useWriteTokenAFaucet();


    useEffect(() => {
        if (rawContractBalance) {
            const value = convertToString(rawContractBalance as bigint);
            setContractBalance(value);
        }

        if (rawStakeInfor) {
            // const parsedStakeInfo: StakeInfo = {
            //     stakedAmount: Number(rawStakeInfor[0]),
            //     stakedNFTs: Number(rawStakeInfor[1]),
            //     userAPR: Number(rawStakeInfor[2]),
            //     totalReward: Number(rawStakeInfor[3]),
            //     lockTime: Number(rawStakeInfor[4]),
            // };
            // console.log('parsedStakeInfo ', parsedStakeInfo);
            // setStakeInfor(parsedStakeInfo);
        }
    }, [isConnected, rawContractBalance]);


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

            await refetchContractBalance();
        } catch (error) {
            console.error('Faucet error:', error);
        }
    };


    return (
        <div>
            <Header />

            <div className="bg-blue-100 h-screen w-full p-6">
                <div className="text-3xl">User Dashboard</div>
                <div className="text-sm mt-5">
                    Token A Remaining in Contract: {contractBalance} ETH
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

                                    <Button variant="contained" color="primary">
                                        WITHDRAW TOKENS
                                    </Button>

                                    <Button variant="contained" color="primary">
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

                                    <TextField label="Amount Deposit" variant="outlined" fullWidth />

                                    <Button variant="contained" color="primary">
                                        Deposit
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
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
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
                                            {isPending ? 'Processing...' : 'Faucet 3M Token A'}
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