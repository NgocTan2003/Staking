import { Box, CircularProgress, Checkbox, Button, Typography, TextField, Stack, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState, useCallback, use } from "react";
import { useAccount } from 'wagmi'
import {
    useReadStakingGetStakeDetail, useWriteTokenAFaucet, useWriteStakingDeposit, useWriteTokenAApprove, useWriteStakingNftDeposit,
    useReadStakingGetCurrentApr, useReadStakingGetNftListByOwner, useWriteStakingClaimReward, useWriteStakingWithDrawn,
    useReadNftbIsApprovedForAll, useWriteNftbSetApprovalForAll
} from "../abi/abi";
import { parseUnits } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';
import { useStakingContext } from "../contexts/StakingContext";
import { toast } from 'react-toastify';
import { convertToString, convertToNumber } from "../utils/convertUtils";
import { NFTDeposit } from '../components/NFTDeposit';

const stakingContractAddress = import.meta.env.VITE_ADDRESS_STAKING as `0x${string}`;

const UserDashboard = () => {
    const amountFaucet = 3000000;
    const { address, isConnected } = useAccount();
    const [amountDeposit, setAmountDeposit] = useState<string>('');
    const [stakedAmount, setStakedAmonut] = useState<string>('0');
    const [stakedNFTsCount, setstakedNFTsCount] = useState<number>(0);
    const [NFTsOwned, setNFTsOwned] = useState<number[]>([]);
    const [stakedNFTs, setStakedNFTs] = useState<any[]>([]);
    const [userAPR, setUserAPR] = useState<number>(0);
    const [totalReward, setTotalReward] = useState<string>('0');
    const [flagLock, setFlagLock] = useState<boolean>(false);
    const [selectedNFTsForDeposit, setSelectedNFTsForDeposit] = useState<string[]>([]);
    const [shouldCalculateReward, setShouldCalculateReward] = useState(true);
    const [timeLeft, setTimeLeft] = useState("");
    const [disabledDeposit, setDisabledDeposit] = useState(true);
    const [reloadWithDrawNFT, setReloadWithDrawNFT] = useState(false);
    const [effectDeposit, setEffectDeposit] = useState(false);
    const [effectDepositNFT, setEffectDepositNFT] = useState(false);
    const [effectFaucet, setEffectFaucet] = useState(false);
    const [effectClaimReward, setEffectClaimReward] = useState(false);
    const [effectWithDrawTK, setEffectWithDrawTK] = useState(false);
    const { data: rawStakeInfo, refetch: refetchStakeInfo } = useReadStakingGetStakeDetail(
        address ? {
            args: [address],
        } : {
            args: ['0x0000000000000000000000000000000000000000'],
        }
    );
    const { writeContractAsync: deposit, isSuccess: successDeposit, isPending: pendingDeposit } = useWriteStakingDeposit();
    const { writeContractAsync: approve, isPending: pendingApprove } = useWriteTokenAApprove();
    const { writeContractAsync: faucet, isPending: pendingFaucet } = useWriteTokenAFaucet();
    const { data: rawNFTs, refetch: refetchRawNFTs } = useReadStakingGetNftListByOwner({
        args: [address as `0x${string}`],
    });
    const { data: rawCurrentApr, refetch: refetchCurrentApr } = useReadStakingGetCurrentApr({
        args: [address as `0x${string}`],
    });
    const { writeContractAsync: claimReward, isSuccess: successClaimReward, isPending: pendingClaimReward } = useWriteStakingClaimReward();
    const { tokenAContract, userBalance, updateBaseInfoUser, updateBalancesTokenA } = useStakingContext();
    const { writeContractAsync: withdraw, isSuccess: successWithdraw, isPending: pendingWithdraw } = useWriteStakingWithDrawn();
    const { writeContractAsync: nftDeposit, isPending: pendingNFTDeposit } = useWriteStakingNftDeposit();
    const { writeContractAsync: setApprovalForAll } = useWriteNftbSetApprovalForAll();
    const { data: isApprovedForAll } = useReadNftbIsApprovedForAll({
        args: [address as `0x${string}`, stakingContractAddress],
    });

    useEffect(() => {
        let countdownInterval: NodeJS.Timeout | undefined;

        const startCountdown = (targetTime: bigint) => {
            countdownInterval = setInterval(() => {
                const now = Date.now();
                const target = Number(targetTime) * 1000;
                const diff = target - now;

                if (diff <= 0) {
                    clearInterval(countdownInterval);
                    setFlagLock(false)
                    return;
                }
                setFlagLock(true)
                const seconds = Math.floor(diff / 1000) % 60;
                const minutes = Math.floor(diff / 1000 / 60) % 60;
                const hours = Math.floor(diff / 1000 / 60 / 60) % 24;

                setTimeLeft(`${hours} hour ${minutes} minutes ${seconds} seconds`);
            }, 1000);
        };

        if (rawStakeInfo && isConnected && address) {
            const stakedAmount = convertToString(rawStakeInfo[0] as bigint);
            setStakedAmonut(stakedAmount);
            const stakedNFTs = Number(rawStakeInfo[4]);
            setstakedNFTsCount(stakedNFTs);
            const lockEndTime = rawStakeInfo[3];

            if (Number(lockEndTime) * 1000 > Date.now()) {
                setFlagLock(true)
                startCountdown(lockEndTime);
            } else {
                setFlagLock(false)
                setTimeLeft('0 hour 0 minutes 0 seconds');
            }

            const userAPR = Number(rawCurrentApr) / 100;
            setUserAPR(userAPR);
        } else {
            setStakedAmonut("0");
            setstakedNFTsCount(0);
            setUserAPR(0);
            setTotalReward("0");
            setTimeLeft("");
        }

        return () => {
            if (countdownInterval) clearInterval(countdownInterval);
        };
    }, [rawStakeInfo, rawCurrentApr, isConnected, address]);

    useEffect(() => {
        if (successDeposit) {
            setEffectDeposit(false);
            toast.success('Deposit Success');
        }
    }, [successDeposit]);

    useEffect(() => {
        if (rawNFTs && isConnected) {
            const ownedNFTs = rawNFTs.map(nft => Number(nft));
            setNFTsOwned(ownedNFTs);
        }
    }, [rawNFTs, isConnected]);

    useEffect(() => {
        const reload = async () => {
            await refetchStakeInfo();
            await refetchCurrentApr();
            await refetchRawNFTs();
        };
        reload();
    }, [reloadWithDrawNFT]);

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
        if (address && shouldCalculateReward) {
            fetchTotalReward();
            const interval = setInterval(() => {
                fetchTotalReward();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [address, fetchTotalReward, shouldCalculateReward]);

    const handleFaucet = async () => {
        try {
            setEffectFaucet(true);
            const amountBigInt = parseUnits(amountFaucet.toString(), 18);
            const tx = await faucet({
                args: [amountBigInt],
            });

            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 30_000,
            });
            setEffectFaucet(false);
            toast.success(`Faucet ${amountFaucet} tokenA success`)

            await updateBaseInfoUser();
            await updateBalancesTokenA();
        } catch (error) {
            console.error('Faucet error:', error);
        }
    };

    const handleChangeDeposit = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value) || value === '0') {
            const valueNumber = value === '' ? 0 : parseFloat(value);
            const balance = convertToNumber(userBalance);
            if (valueNumber > balance) {
                setDisabledDeposit(true);
                toast.error('Deposit amount exceeds your balance');
            } else {
                setAmountDeposit(value);
                setDisabledDeposit(valueNumber <= 0);
            }
            setDisabledDeposit(false)
        } else {
            setDisabledDeposit(true);
            toast.error('Invalid number format');
        }
    };

    const handleDeposit = async () => {
        try {
            setEffectDeposit(true);
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
                timeout: 30_000,
            });

            await refetchStakeInfo();
            await refetchRawNFTs();
            await updateBaseInfoUser();
            setShouldCalculateReward(true);
        } catch (error) {
            console.error('Deposit error:', error);
            toast.error('Transaction failed');
        }
    }

    const handleClaimReward = async () => {
        try {
            if (isConnected && address) {
                setEffectClaimReward(true);
                const tx = await claimReward({});

                await waitForTransactionReceipt(config, {
                    hash: tx,
                    timeout: 30_000,
                });

                await refetchStakeInfo();
                await updateBaseInfoUser();
                setEffectClaimReward(false);
                toast.success('Claim reward success');
            }
        } catch (error) {
            console.error('Claim reward error:', error);
            toast.error('Transaction failed');
        }
    }

    const handleDepositNFTs = async () => {
        try {
            if (!isApprovedForAll) {
                const approveTx = await setApprovalForAll({
                    args: [stakingContractAddress, true],
                });
                await waitForTransactionReceipt(config, {
                    hash: approveTx,
                    timeout: 10_000,
                });
            }

            setEffectDepositNFT(true);
            for (const nftId of selectedNFTsForDeposit) {
                const tx = await nftDeposit({
                    args: [BigInt(nftId)],
                });

                await waitForTransactionReceipt(config, {
                    hash: tx,
                    timeout: 10_000,
                });

                toast.success(`NFT #${nftId} deposited successfully`);
                await refetchStakeInfo();
                await refetchCurrentApr();
                await refetchRawNFTs();
            }
            setEffectDepositNFT(false);
            setReloadWithDrawNFT(!reloadWithDrawNFT)
            setSelectedNFTsForDeposit([]);
        } catch (error) {
            console.error("Error depositing NFTs:", error);
            toast.error("Failed to deposit NFTs");
        }
    }

    const handleWithdraw = async () => {
        try {
            setEffectWithDrawTK(true);
            setShouldCalculateReward(false);
            const tx = await withdraw({});
            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 30_000,
            });

            await refetchStakeInfo();
            await updateBaseInfoUser();
            await refetchRawNFTs();
            setAmountDeposit('0');
            setStakedAmonut('0');
            setstakedNFTsCount(0);
            setStakedNFTs([]);
            setTotalReward('0');
            setUserAPR(0);
            setSelectedNFTsForDeposit([]);
            setEffectWithDrawTK(false);
            toast.success('Withdraw success');
        } catch (error) {
            setShouldCalculateReward(true);
            console.error('Withdraw error:', error);
            toast.error('Transaction failed');
        }
    }

    return (
        <div>
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
                                                <div className="">LockTime: {timeLeft}</div>
                                            </>
                                        ) : (
                                            <>
                                                Please connect your Wallet to view staking information
                                            </>
                                        )}
                                    </Typography>

                                    <Button variant="contained"
                                        onClick={handleWithdraw}
                                        disabled={!isConnected || flagLock || stakedAmount == '0'}
                                        color="primary">
                                        {effectWithDrawTK ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                            </>
                                        ) : (
                                            'WITHDRAW TOKENS'
                                        )}
                                    </Button>

                                    <Button variant="contained"
                                        onClick={handleClaimReward}
                                        disabled={!isConnected || flagLock || stakedAmount == '0'}
                                        color="primary">
                                        {effectClaimReward ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                            </>
                                        ) : (
                                            'CLAIM REWARDS'
                                        )}
                                    </Button>

                                    <NFTDeposit reloadWithDrawNFT={reloadWithDrawNFT} setReloadWithDrawNFT={setReloadWithDrawNFT} />
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
                                        {effectDeposit ? (
                                            <>
                                                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                            </>
                                        ) : (
                                            'Deposit'
                                        )}
                                    </Button>

                                    {stakedAmount !== '0' && (
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select NFTs to Deposit</InputLabel>
                                            <Select
                                                multiple
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Select NFTs to Deposit"
                                                value={selectedNFTsForDeposit}
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    setSelectedNFTsForDeposit(typeof value === 'string' ? value.split(',') : value);
                                                }}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                {NFTsOwned
                                                    .filter((nftId) => !stakedNFTs.includes(nftId))
                                                    .map((nftId) => (
                                                        <MenuItem key={nftId} value={nftId.toString()}>
                                                            <Checkbox
                                                                checked={selectedNFTsForDeposit.includes(nftId.toString())}
                                                            />
                                                            <Typography>NFT #{nftId}</Typography>
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    )}

                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isConnected || selectedNFTsForDeposit.length === 0 || stakedAmount === '0'}
                                            fullWidth
                                            onClick={handleDepositNFTs}
                                        >
                                            {effectDepositNFT ? (
                                                <>
                                                    <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                                                </>
                                            ) : (
                                                'Deposit Selected NFTs'
                                            )}
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
                                            {effectFaucet ? (
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