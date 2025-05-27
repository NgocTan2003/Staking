import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/http';
import { getAllTransactions, getUserTransactions } from '../services/transaction.service';
import { OK } from '../constants/http';



const getAllHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await getAllTransactions(req);

        if (response.errorCode) {
            return res.status(response.errorCode || 500).json({
                statusCode: response.errorCode,
                message: response.message
            });
        }

        return res.status(200).json({
            statusCode: OK,
            message: response.message,
            transactions: response.transactions
        });
    } catch (error) {
        return {
            errorCode: INTERNAL_SERVER_ERROR,
            message: error
        };
    }
}

const getUserTransactionsHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await getUserTransactions(req);

        if (response.errorCode) {
            return res.status(response.errorCode || 500).json({
                statusCode: response.errorCode,
                message: response.message
            });
        }

        return res.status(200).json({
            statusCode: OK,
            message: response.message,
            transactions: response.transactions
        });
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            statusCode: INTERNAL_SERVER_ERROR,
            message: error
        });
    }

}



export { getAllHandler, getUserTransactions, getUserTransactionsHandler };