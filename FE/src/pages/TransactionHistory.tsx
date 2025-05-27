import { useState, useEffect } from "react";
import { Button, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { toast } from 'react-toastify';
import { useGetPaginatedTransaction } from "../utils/hook/useTransaction";
import { useStakingContext } from "../contexts/StakingContext";
import type { TransactionType } from "../types/transactions.type";
import { convertToString, truncateMiddle } from '../utils/convertUtils';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAccount } from "wagmi";
import { useWriteStakingUpdateApr } from "../abi/abi"
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';


const TransactionHistory = () => {
    const [totalTransaction, setTotalTransaction] = useState<number>(0);
    const [arrTransaction, setArrTransaction] = useState<TransactionType[]>([]); 4
    const { isConnected } = useAccount();
    const [newAPR, setNewAPR] = useState<number>();
    const [keySearch, setKeySearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('Timestamp');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const { allTransactions, totalDocs, totalPages, currentPage, isLoading, refetch } = useGetPaginatedTransaction(page, limit, sortBy, sortOrder);
    const { isAdmin, updateBaseInfoUser } = useStakingContext();
    const { writeContractAsync: updateAPR } = useWriteStakingUpdateApr();

    const handleChangeAPR = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value) || value === '0') {
            const valueNumber = value === '' ? 0 : parseFloat(value);
            setNewAPR(valueNumber);
        } else {
            toast.error('Invalid number format');
        }
    }

    const handleUpdateAPR = async () => {
        if (newAPR !== undefined) {
            const tx = await updateAPR({ args: [BigInt(newAPR * 100)] });
            await waitForTransactionReceipt(config, {
                hash: tx,
                timeout: 30_000,
            });
            setNewAPR(0);
            await updateBaseInfoUser();
            toast.success(`APR updated to ${newAPR}% successfully!`);
        }
    }

    const handleSortChange = (e: SelectChangeEvent) => {
        setSortBy(e.target.value)
    };


    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }

    if (!isConnected) {
        return <div className="text-red-500 text-center text-xl mt-4">Please connect your wallet to view transaction history.</div>
    }

    return (
        <div className="bg-blue-100 h-screen w-full p-6">
            <div className="text-xl">
                All Transactions
            </div>
            <div className="text-sm mt-4">
                Total Transactions: {totalDocs}
            </div>
            {isAdmin ? <>
                <div className="mt-2 flex gap-2">
                    <input className="p-2 border-1 rounded" value={newAPR} placeholder="New APR (%)" onChange={handleChangeAPR} />
                    <Button variant="contained" disabled={newAPR == undefined} onClick={handleUpdateAPR}>Update APR</Button>
                </div>
            </> : <></>}
            <div className="flex gap-3 mt-3 flex items-center">
                <div>
                    <input className="p-2 border-1 rounded mr-2" placeholder="Search (Address/Block)" onChange={(e) => setKeySearch(e.target.value)} />
                    <Button variant="contained" disabled={keySearch == ''}>Search</Button>
                </div>
                <div >
                    <Select className="w-[auto] mr-2" value={sortBy} onChange={(e) => handleSortChange(e)}>
                        <MenuItem value="Timestamp">Timestamp</MenuItem>
                        <MenuItem value="EventType">Event Type</MenuItem>
                        <MenuItem value="Amount">Amount</MenuItem>
                    </Select>
                    <Button variant="outlined" onClick={handleSortOrderChange}>
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </Button>
                </div>
            </div>
            <div className="mt-3">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction Hash</TableCell>
                                <TableCell>Event Type</TableCell>
                                <TableCell>Block</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Amount (ETH)</TableCell>
                                <TableCell>Token ID</TableCell>
                                <TableCell>APR (%)</TableCell>
                                <TableCell>Gas Used (Wei)</TableCell>
                                <TableCell>Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allTransactions.map((item: TransactionType) => (
                                <TableRow

                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {truncateMiddle(item.TransactionHash)}
                                    </TableCell>
                                    <TableCell>{item.EventType}</TableCell>
                                    <TableCell>{item.BlockNumber}</TableCell>
                                    <TableCell>{truncateMiddle(item.From)}</TableCell>
                                    <TableCell>{truncateMiddle(item.To)}</TableCell>
                                    <TableCell>{convertToString(BigInt(item.Amount))}</TableCell>
                                    <TableCell>{item.TokenID}</TableCell>
                                    <TableCell>{Number(item.APR) / 100}</TableCell>
                                    <TableCell>{item.GasUsed}</TableCell>
                                    <TableCell>{item.Timestamp}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="w-full flex justify-center py-6">
                        <div className="inline-flex items-center space-x-2 rounded-xl shadow-md bg-white px-4 py-2">
                            <button
                                className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </button>

                            <button
                                className="px-3 py-1.5 rounded-lg text-sm font-medium transition bg-blue-600 text-white shadow"
                            >
                                {page}
                            </button>

                            <button
                                className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </TableContainer>
            </div>
        </div>
    )
}

export default TransactionHistory;