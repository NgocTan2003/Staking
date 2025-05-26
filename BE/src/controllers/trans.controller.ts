import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/http';


const getAllHandler = async (req: Request, res: Response): Promise<any> => {
    try {


        return res.status(200).json({
            message: "All transactions fetched successfully",
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