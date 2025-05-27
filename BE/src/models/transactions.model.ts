import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { PaginateModel } from '../types/mongoose-paginate';

export interface TransactionDocument extends mongoose.Document {
    TransactionHash: string;
    EventType: string;
    BlockNumber: string;
    From: string;
    To: string;
    Amount: string;
    TokenID: string;
    APR: string;
    GasUsed: string;
    Timestamp: string;
}

const transactionSchema = new mongoose.Schema<TransactionDocument>({
    TransactionHash: {
        type: String,
        required: true,
    },
    EventType: {
        type: String,
        required: true,
    },
    BlockNumber: {
        type: String,
        required: true,
    },
    From: {
        type: String,
        required: true,
    },
    To: {
        type: String,
        required: true,
    },
    Amount: {
        type: String,
    },
    TokenID: {
        type: String,
    },
    APR: {
        type: String,
    },
    GasUsed: {
        type: String,
        required: true,
    },
    Timestamp: {
        type: String,
        required: true,
    }
}, { timestamps: true });

transactionSchema.plugin(mongoosePaginate);
const TransactionModel = mongoose.model<TransactionDocument, PaginateModel<TransactionDocument>>(
    'Transaction',
    transactionSchema
);

export default TransactionModel;