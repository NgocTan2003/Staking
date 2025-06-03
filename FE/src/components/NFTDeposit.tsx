import { Button, FormControl, InputLabel, Select, MenuItem, Checkbox, Typography, CircularProgress } from '@mui/material';
import { useReadStakingGetListStakedNft, useWriteStakingWithDrawnNft } from '../abi/abi';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'react-toastify';
import config from '../config';


interface NFTDepositProps {
    reloadWithDrawNFT: boolean;
    setReloadWithDrawNFT: (value: boolean) => void;
}

export const NFTDeposit = ({ reloadWithDrawNFT, setReloadWithDrawNFT }: NFTDepositProps) => {
    const { address } = useAccount();
    const [selectedNFT, setSelectedNFT] = useState<string[]>([]);
    const [stakedNFTs, setStakedNFTs] = useState<any[]>([]);
    const { data: rawStakedNFTs, refetch: refetchStakedNFTOfUser } = useReadStakingGetListStakedNft({
        args: [address as `0x${string}`],
    });
    const { writeContractAsync: withDrawNFT, isPending: pendingWithDrawNFT } = useWriteStakingWithDrawnNft();
    useEffect(() => {
        refetchStakedNFTOfUser();
        if (rawStakedNFTs) {
            const nftIds = rawStakedNFTs.map(nft => Number(nft));
            setStakedNFTs(nftIds);
        }
    }, [rawStakedNFTs, reloadWithDrawNFT])

    const handleWithDrawNFT = async () => {
        try {
            for (const nftId of selectedNFT) {
                const tx = await withDrawNFT({
                    args: [[BigInt(nftId)]],
                });

                await waitForTransactionReceipt(config, {
                    hash: tx,
                    timeout: 10_000,
                });

                toast.success(`NFT #${nftId} WithDraw successfully`);
            }
            await refetchStakedNFTOfUser();
            setSelectedNFT([]);
            setReloadWithDrawNFT(!reloadWithDrawNFT)
        } catch (error) {
            toast.error('Failed to withdraw NFTs. Please try again.');
        }
    }

    return (
        <>
            {stakedNFTs.length !== 0 ? (<>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select NFTs to WithDraw</InputLabel>
                    <Select
                        multiple
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select NFTs to WithDraw"
                        value={selectedNFT}
                        onChange={(event) => {
                            const value = event.target.value;
                            setSelectedNFT(typeof value === 'string' ? value.split(',') : value);
                        }}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {stakedNFTs
                            .filter((nftId) => !selectedNFT.includes(nftId))
                            .map((nftId) => (
                                <MenuItem key={nftId} value={nftId.toString()}>
                                    <Checkbox
                                        checked={selectedNFT.includes(nftId.toString())}
                                    />
                                    <Typography>NFT #{nftId}</Typography>
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={selectedNFT.length === 0}
                        fullWidth
                        onClick={handleWithDrawNFT}
                    >
                        {pendingWithDrawNFT ? (
                            <>
                                <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                            </>
                        ) : (
                            'WithDraw Selected NFTs'
                        )}
                    </Button>
                </div>
            </>) : (<></>)}
        </>
    );
}