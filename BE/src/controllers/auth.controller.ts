import { INTERNAL_SERVER_ERROR, OK } from "../constants/http";
import { Request, Response } from "express";
import { getSignature, Login, RefreshToken } from "../services/auth.service";
import { loginSchema } from "./auth.schemas";
import { z } from "zod";
import { setAuthCookies } from "../utils/cookies";


const getSignatureHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const address = req.query.address as string;
        const message_Signature = await getSignature(address);
        return res.status(200).json({
            statusCode: OK,
            message_signature: message_Signature
        });
    } catch (error) {
        console.error("Error getting signature:", error);
        return res.status(INTERNAL_SERVER_ERROR).json({
            statusCode: INTERNAL_SERVER_ERROR,
            message: error
        });
    }
}

const loginHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const request = loginSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"],
        })

        const response = await Login(request);
        const { accessToken, refreshToken, message, errorCode } = response;

        if (accessToken && refreshToken) {
            return setAuthCookies({ res, accessToken, refreshToken })
                .status(OK)
                .json({ "accessToken": accessToken, "refreshToken": refreshToken, "message": message, "statusCode": OK });

        } else if (errorCode) {
            return res.status(OK).json({
                statusCode: errorCode,
                message: message,
            });
        } else {
            return res.status(500).json({ message: "Missing tokens" });
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ messages });
        }
        throw error;
    }
}

const refreshTokenHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await RefreshToken(req);
        const { accessToken, refreshToken, message, errorCode } = response;

        if (accessToken && refreshToken) {
            return res.status(OK)
                .json({ "accessToken": accessToken, "refreshToken": refreshToken, "message": message, "statusCode": OK });
        } else if (errorCode) {
            return res.status(OK).json({
                statusCode: errorCode,
                message: message,
            });
        } else {
            return res.status(500).json({ message: "Missing tokens" });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ messages });
        }
        throw error;
    }
}

export { getSignatureHandler, loginHandler, refreshTokenHandler };