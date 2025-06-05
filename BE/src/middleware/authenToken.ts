import { NextFunction, Request, Response } from "express";
import { KEY_SIGNATURE } from "../constants/env";
import { UNAUTHORIZED, FORBIDDEN } from "../constants/http"
import { RefreshToken } from "../services/auth.service";
import { TokenExpiredError } from "jsonwebtoken";
const jwt = require('jsonwebtoken');

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        res.sendStatus(UNAUTHORIZED);
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, KEY_SIGNATURE) as any;
        console.log("Decoded token 1:", decoded);
        (req as any).account = decoded.account;
        if (decoded.account.Signature !== KEY_SIGNATURE) {
            return res.status(UNAUTHORIZED).json({ message: "Incorrect Signature" });
        }
        next();
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            const result = await RefreshToken(req);

            if (result.accessToken && result.refreshToken) {
                const newDecoded: any = jwt.decode(result.accessToken);
                (req as any).user = newDecoded?.user;

                return next();
            }

            return res.status(result.errorCode || UNAUTHORIZED).json({ message: result.message });
        }

        return res.status(FORBIDDEN).json({ message: "Invalid access token" });
    }
};

export { authenticateToken };