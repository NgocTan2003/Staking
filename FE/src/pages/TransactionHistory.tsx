import { useState } from "react";
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

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const TransactionHistory = () => {
    const [totalTransaction, setTotalTransaction] = useState<number>(0);
    const [newAPR, setNewAPR] = useState<number>(0);
    const [keySearch, setKeySearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    // const { allNotes, totalPages, currentPage, isLoading, refetch } = useGetPaginatedTransaction(page, limit);


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
                Total Transactions: {totalTransaction}
            </div>
            {isAdmin ? <>
                <div className="mt-2 flex gap-2">
                    <input className="p-2 border-1 rounded" placeholder="New APR (%)" onChange={handleChangeAPR} />
                    <Button variant="contained" disabled={newAPR < 1}>Update APR</Button>
                </div>
            </> : <></>}
            <div className="flex gap-3 mt-3 h">
                <div>
                    <input className="p-2 border-1 rounded mr-2" placeholder="Search (Address/Block)" onChange={(e) => setKeySearch(e.target.value)} />
                    <Button variant="contained" disabled={keySearch == ''}>Search</Button>
                </div>
                <div >
                    <Select className="w-[auto] mr-2" value={sortBy} onChange={(e) => handleSortChange(e)}>
                        <MenuItem value="timestamp">Timestamp</MenuItem>
                        <MenuItem value="eventType">Event Type</MenuItem>
                        <MenuItem value="amount">Amount</MenuItem>
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
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="w-full flex justify-end p-4 pr-10">
                        <span>
                            111111
                        </span>
                        {/* <button className="join-item btn" onClick={() => setPage(page - 1)} disabled={page === 1}>«</button>
                                {[...Array()].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="join-item btn" onClick={() => setPage(page + 1)} disabled={page === 1}>»</button> */}
                    </div>
                </TableContainer>
            </div>
        </div>
    )
}

export default TransactionHistory;