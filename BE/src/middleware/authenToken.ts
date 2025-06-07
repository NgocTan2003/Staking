import { NextFunction, Request, Response } from "express";
import { UNAUTHORIZED, FORBIDDEN } from "../constants/http"
import { RefreshToken } from "../services/auth.service";
import { TokenExpiredError } from "jsonwebtoken";
const jwt = require('jsonwebtoken');
import { setAuthCookies } from "../utils/cookies";

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = req.cookies?.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET
    if (!accessToken) {
        res.sendStatus(UNAUTHORIZED);
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
        (req as any).address = decoded.address;

        next();
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            const result = await RefreshToken(req);
            if (result.accessToken && result.refreshToken) {
                setAuthCookies({
                    res,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                });
                const newDecoded: any = jwt.decode(result.accessToken);
                (req as any).address = newDecoded?.address;
                return next();
            }

            return res.status(result.errorCode || UNAUTHORIZED).json({ message: result.message, errorCode: result.errorCode });
        }

        return res.status(FORBIDDEN).json({ message: "Invalid access token" });
    }
};

export { authenticateToken };