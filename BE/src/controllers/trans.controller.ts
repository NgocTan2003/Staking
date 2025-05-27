import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/http';
import { getAllTransactions } from '../services/transaction.service';
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

const getUserTransactions = async (req: Request, res: Response): Promise<any> => {

}



export { getAllHandler, getUserTransactions };