import { UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR } from "../constants/http";
import { AccountDocument } from "../models/account.model";
import AccountModel from "../models/account.model";
import jwt from "jsonwebtoken";
import { Request } from "express";

type LoginRequest = {
    address: string,
    signature: string,
    userAgent?: string
}

type AuthResponse = {
    user?: AccountDocument,
    accessToken?: string,
    refreshToken?: string,
    message: string,
    errorCode?: number
}

const KEY_SIGNATURE = process.env.KEY_SIGNATURE;

const getSignature = async (): Promise<string> => {
    const Signature = process.env.Signature;
    if (!Signature) {
        throw new Error("Signature not found in environment variables");
    }

    return Signature;
}

const Login = async (req: LoginRequest): Promise<AuthResponse> => {
    try {
        if (req.signature != KEY_SIGNATURE) {
            return {
                message: "Invalid signature",
                errorCode: UNAUTHORIZED
            };
        }
        let existingUser = await AccountModel.findOne({ Address: req.address });
        if (!existingUser) {
            const account = await AccountModel.create({
                Address: req.address,
                Signature: req.signature,
            });
            existingUser = account;
        }

        if (!KEY_SIGNATURE) {
            throw new Error("KEY_SIGNATURE is not defined in environment variables");
        }

        const accessToken = jwt.sign({ account: existingUser }, KEY_SIGNATURE, {
            audience: ["account"],
            expiresIn: "30s",
        });

        const refreshToken = jwt.sign({ account: existingUser }, KEY_SIGNATURE, {
            audience: ["account"],
            expiresIn: "1m",
        });

        return {
            accessToken,
            refreshToken,
            message: "User logged in successfully",
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : String(error),
            errorCode: INTERNAL_SERVER_ERROR
        }
    }
}

const RefreshToken = async (request: Request): Promise<AuthResponse> => {
    const refreshToken = request.cookies.refreshToken;
    const accessToken = request.cookies.accessToken;

    if (!accessToken || !refreshToken) {
        return {
            message: "Unauthorized",
            errorCode: UNAUTHORIZED
        }
    }

    const now = Math.floor(Date.now() / 1000);
    try {
        const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;
        console.log("Decoded AccessToken refresh:", decodedAccessToken);

        if (decodedAccessToken?.exp && decodedAccessToken.exp > now) {
            return {
                message: "AccessToken not expired",
                errorCode: FORBIDDEN
            }
        }

        const decodedRefresh = jwt.decode(refreshToken) as jwt.JwtPayload;
        if (!decodedRefresh?.exp || decodedRefresh.exp < now) {
            return {
                message: "RefreshToken expired",
                errorCode: UNAUTHORIZED
            }
        }

        if (!KEY_SIGNATURE) {
            throw new Error("KEY_SIGNATURE is not defined in environment variables");
        }

        const verified = jwt.verify(refreshToken, KEY_SIGNATURE) as jwt.JwtPayload;
        const accountData = verified.account;

        if (!accountData?.Address) {
            return {
                message: "Invalid token payload",
                errorCode: UNAUTHORIZED
            }
        }

        const account = await AccountModel.findOne({ Address: accountData.Address });
        if (!account) {
            return {
                message: "Account not found",
                errorCode: UNAUTHORIZED
            }
        }
        
        const newAccessToken = jwt.sign({ account: account }, KEY_SIGNATURE, {
            audience: ["account"],
            expiresIn: "30s",
        });

        const newRefreshToken = jwt.sign({ account: accessToken }, KEY_SIGNATURE, {
            audience: ["account"],
            expiresIn: "1m",
        });
        console.log("New AccessToken:", newAccessToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            message: "Refresh successfully",
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : String(error),
            errorCode: INTERNAL_SERVER_ERROR
        }
    }
}

export { getSignature, Login, RefreshToken };