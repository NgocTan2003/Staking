import { TransactionType } from '../types/transaction.type';
import TransactionModel, { TransactionDocument } from '../models/transactions.model';
import { PaginateResult } from 'mongoose';
import { INTERNAL_SERVER_ERROR } from '../constants/http';
import { Request } from 'express';

type TransactionPaginateResponse = {
    errorCode?: number;
    message: string;
    transactions?: PaginateResult<TransactionDocument>;
};


const crawlDataToDB = async (arrTransaction: TransactionType[]) => {
    try {
        if (arrTransaction.length === 0) {
            return {
                success: true,
                message: "No data to save.",
            };
        }

        const existingTransactions = await TransactionModel.find({
            transactionId: { $in: arrTransaction.map(tx => tx.TransactionHash) },
        });

        const existingTransactionIds = new Set(existingTransactions.map(tx => tx.TransactionHash));
        const newTransactions = arrTransaction.filter(tx => !existingTransactionIds.has(tx.TransactionHash));

        if (newTransactions.length === 0) {
            return {
                success: true,
                message: "No new data to save.",
            };
        }

        await TransactionModel.insertMany(newTransactions);

        return {
            success: true,
            message: "Save To Database Success.",
        };
    } catch (error) {
        console.error("Error in crawlDataToDB:", error);
        return {
            success: false,
            message: "Save To Database Failed.",
        };
    }
};

const getAllTransactions = async (req: Request): Promise<TransactionPaginateResponse> => {
    try {
        const {
            _page = 1,
            _limit = 10,
            _sort = "Timestamp",
            _order = "desc",
        } = req.query as any;

        const options = {
            page: _page,
            limit: _limit,
            sort: { [_sort]: _order === "desc" ? -1 : 1 },
        };

        const transactions = await TransactionModel.paginate({}, options);
        return {
            message: "Success",
            transactions: transactions as PaginateResult<TransactionDocument>
        };
    } catch (error: any) {
        return {
            errorCode: INTERNAL_SERVER_ERROR,
            message: error.message || "Unknown error",
        };
    }
};

const getUserTransactions = async (req: Request): Promise<TransactionPaginateResponse> => {
    try {
        const { address } = req.params;
        const {
            _page = 1,
            _limit = 10,
            _sort = "Timestamp",
            _order = "desc",
        } = req.query as any;

        const options = {
            page: _page,
            limit: _limit,
            sort: { [_sort]: _order === "desc" ? -1 : 1 },
        };

        const transactions = await TransactionModel.paginate({ From: address.toLowerCase() }, options);
        return {
            message: "Success",
            transactions: transactions as PaginateResult<TransactionDocument>
        };
    } catch (error: any) {
        return {
            errorCode: INTERNAL_SERVER_ERROR,
            message: error.message || "Unknown error",
        };
    }
}

const searchTransactions = async (req: Request): Promise<TransactionPaginateResponse> => {
    try {
        const { address } = req.params;
        const {
            _page = 1,
            _limit = 10,
            _sort = "Timestamp",
            _order = "desc",
        } = req.query as any;

        const options = {
            page: _page,
            limit: _limit,
            sort: { [_sort]: _order === "desc" ? -1 : 1 },
        };

        const transactions = await TransactionModel.paginate({
            $or: [
                { From: address.toLowerCase() },
            ]
        }, options);

        return {
            message: "Search successful",
            transactions: transactions as PaginateResult<TransactionDocument>
        };
    } catch (error: any) {
        return {
            errorCode: INTERNAL_SERVER_ERROR,
            message: error.message || "Unknown error",
        };
    }
}


export { crawlDataToDB, getAllTransactions, getUserTransactions, searchTransactions };