import { useState, useEffect } from "react";
import { Button, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { toast } from 'react-toastify';
import { useGetPaginatedAllTransaction, useGetPaginatedUserTransaction, useSearchTransaction } from "../utils/hook/useTransaction";
import { useStakingContext } from "../contexts/StakingContext";
import type { TransactionType } from "../types/transactions.type";
import { convertToString, truncateMiddle } from '../utils/convertUtils';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAccount } from "wagmi";
import { useWriteStakingUpdateApr } from "../abi/abi"
import { waitForTransactionReceipt } from '@wagmi/core';
import config from '../config';
import ClearIcon from '@mui/icons-material/Clear';


const TransactionHistory = () => {
    const [arrTransaction, setArrTransaction] = useState<TransactionType[]>([]);
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const { isConnected, address } = useAccount();
    const [newAPR, setNewAPR] = useState<number>(0);
    const [keySearch, setKeySearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('Timestamp');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(5);
    const [flagSearch, setFlagSearch] = useState<boolean>(false);
    const { allTransactions, totalDocs: totalAllTrans, totalAllPages, refetch: refetchAllTrans } = useGetPaginatedAllTransaction(page, limit, sortBy, sortOrder);
    const { allUserTransactions, totalDocs: totalUserTrans, totalUserPages, refetch: refetchUserTrans } = useGetPaginatedUserTransaction(address as `0x${string}`, page, limit, sortBy, sortOrder);
    const { dataSearchTransactions, totalDocs: totalSearchTrans, totalSearchPages } = useSearchTransaction(flagSearch, keySearch, page, limit, sortBy, sortOrder);
    const { isAdmin, updateBaseInfoUser } = useStakingContext();
    const { writeContractAsync: updateAPR } = useWriteStakingUpdateApr();

    useEffect(() => {
        if (isAdmin && !flagSearch) {
            refetchAllTrans();
            if (arrTransaction !== allTransactions || totalRecord !== totalAllTrans) {
                setArrTransaction(allTransactions);
                setTotalRecord(totalAllTrans);
            }
        } else {
            if (arrTransaction !== allUserTransactions || totalRecord !== totalUserTrans) {
                setArrTransaction(allUserTransactions);
                setTotalRecord(totalUserTrans);
            }
        }
    }, [isAdmin, allTransactions, allUserTransactions])

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

    const handleSearch = () => {
        setFlagSearch(true);
        setArrTransaction(dataSearchTransactions);
        setTotalRecord(totalSearchTrans);
        setPage(1);
    }

    const handleClearSearch = () => {
        setFlagSearch(false);
        setKeySearch('');
        refetchAllTrans();
        setPage(1);
        setArrTransaction(allTransactions);
        setTotalRecord(totalAllTrans);
    }

    useEffect(() => {
        setFlagSearch(false);
        setKeySearch('')
        setPage(1)
    }, [address])

    useEffect(() => {
        if (flagSearch && dataSearchTransactions && totalSearchTrans) {
            setArrTransaction(dataSearchTransactions);
            setTotalRecord(totalSearchTrans);
        }
    }, [flagSearch, dataSearchTransactions, totalSearchTrans]);

    if (!isConnected) {
        return <div className="text-red-500 text-center text-xl mt-4">Please connect your wallet to view transaction history.</div>
    }

    return (
        <div className="bg-blue-100 h-screen w-full p-6">
            <div className="text-xl">
                All Transactions
            </div>
            <div className="text-sm mt-4">
                Total Transactions: {totalRecord}
            </div>
            {isAdmin ? <>
                <div className="mt-2 flex gap-2">
                    <input className="p-2 border-1 rounded" value={newAPR} placeholder="New APR (%)" onChange={handleChangeAPR} />
                    <Button variant="contained" disabled={newAPR == undefined} onClick={handleUpdateAPR}>Update APR</Button>
                </div>
            </> : <></>}
            <div className="flex gap-3 mt-3 flex items-center">
                {
                    isAdmin ? <>
                        <div className="relative inline-block mr-2">
                            <input
                                className="p-2 pr-8 border border-1 rounded"
                                placeholder="Search (Address)"
                                value={keySearch}
                                onChange={(e) => {
                                    setFlagSearch(false);
                                    setKeySearch(e.target.value)
                                }}
                            />
                            {keySearch && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    <ClearIcon fontSize="small" className="cursor-pointer" />
                                </button>
                            )}
                        </div>

                        <Button variant="contained" disabled={keySearch === ''} onClick={handleSearch}>
                            Search
                        </Button>

                    </> : <></>
                }
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
                    {arrTransaction.length > 0 ? <>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Transaction Hash</TableCell>
                                    <TableCell>Event Type</TableCell>
                                    <TableCell>Block</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Amount (ETH)</TableCell>
                                    <TableCell>NFT ID</TableCell>
                                    <TableCell>APR (%)</TableCell>
                                    <TableCell>Gas Used (Wei)</TableCell>
                                    <TableCell>Timestamp</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {arrTransaction.map((item: TransactionType, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <a
                                                href={`https://testnet.bscscan.com/tx/${item.TransactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="no-underline hover:underline hover:text-blue-800"
                                            >
                                                {truncateMiddle(item.TransactionHash)}
                                            </a>
                                        </TableCell>
                                        <TableCell>{item.EventType}</TableCell>
                                        <TableCell>{item.BlockNumber}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://testnet.bscscan.com/address/${item.From}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="no-underline hover:underline hover:text-blue-800"
                                            >
                                                {truncateMiddle(item.From)}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://testnet.bscscan.com/address/${item.To}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="no-underline hover:underline hover:text-blue-800"
                                            >
                                                {truncateMiddle(item.To)}
                                            </a>
                                        </TableCell>
                                        <TableCell>{item.Amount === "" ? "" : convertToString(BigInt(item.Amount))}</TableCell>
                                        <TableCell>{item.TokenID}</TableCell>
                                        <TableCell>{Number(item.APR) / 100}</TableCell>
                                        <TableCell>{item.GasUsed}</TableCell>
                                        <TableCell>{item.Timestamp}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="w-full flex justify-between items-center py-6">
                            <div className="flex-1 flex justify-center">
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
                                        disabled={
                                            flagSearch ? page === totalSearchPages : (isAdmin ? page === totalAllPages : page === totalUserPages)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mr-3">
                                <div className="mr-3">Total Pages: {flagSearch ? totalSearchPages : (isAdmin ? totalAllPages : totalUserPages)}</div>
                                <div>Rows per page:</div>
                                <Select className="w-auto mr-2" value={limit} onChange={(e) => {
                                    setLimit(Number(e.target.value))
                                    setPage(1);
                                }}>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="15">15</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </> : <>
                        <div className="h-[50px] flex justify-center items-center">No data</div>
                    </>}
                </TableContainer>
            </div >
        </div >
    )
}

export default TransactionHistory;