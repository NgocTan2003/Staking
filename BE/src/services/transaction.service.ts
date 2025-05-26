import { TransactionType } from '../types/TransactionType';
import TransactionModel from '../models/transactions.model';


const crawlDataToDB = async (arrTransaction: TransactionType[]) => {
    console.log("crawlDataToDB...", arrTransaction.length);

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

        console.log("New transactions to save:", newTransactions.length);

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


export { crawlDataToDB };