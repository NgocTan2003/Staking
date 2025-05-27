import { useState, useEffect } from "react";
import { Button, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useGetPaginatedTransaction } from "../utils/hook/useTransaction";
import { useStakingContext } from "../contexts/StakingContext";
import type { TransactionType } from "../types/transactions.type";
import { convertToString } from '../utils/convertUtils';

const TransactionHistory = () => {
    const [totalTransaction, setTotalTransaction] = useState<number>(0);
    const [arrTransaction, setArrTransaction] = useState<TransactionType[]>([]);
    const [newAPR, setNewAPR] = useState<number>(0);
    const [keySearch, setKeySearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('Timestamp');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const { allTransactions, totalDocs, totalPages, currentPage, isLoading, refetch } = useGetPaginatedTransaction(page, limit, sortBy, sortOrder);

    const { isAdmin } = useStakingContext();

    const handleChangeAPR = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log("value ", value, typeof value)
        if (value === '' || /^\d*\.?\d*$/.test(value) || value === '0') {
            const valueNumber = value === '' ? 0 : parseFloat(value);
            setNewAPR(valueNumber);
        } else {
            toast.error('Invalid number format');
        }
    }

    const handleSortChange = (e: SelectChangeEvent) => {
        setSortBy(e.target.value)
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
                    <input className="p-2 border-1 rounded" placeholder="New APR (%)" onChange={handleChangeAPR} />
                    <Button variant="contained" disabled={newAPR < 1}>Update APR</Button>
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
                                        {item.TransactionHash}
                                    </TableCell>
                                    <TableCell align="right">{item.EventType}</TableCell>
                                    <TableCell align="right">{item.BlockNumber}</TableCell>
                                    <TableCell align="right">{item.From}</TableCell>
                                    <TableCell align="right">{item.To}</TableCell>
                                    <TableCell align="right">{convertToString(BigInt(item.Amount))}</TableCell>
                                    <TableCell align="right">{item.TokenID}</TableCell>
                                    <TableCell align="right">{item.APR}</TableCell>
                                    <TableCell align="right">{item.GasUsed}</TableCell>
                                    <TableCell align="right">{item.Timestamp}</TableCell>
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