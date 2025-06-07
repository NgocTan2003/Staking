import { UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR } from "../constants/http";
import { AccountDocument } from "../models/account.model";
import AccountModel from "../models/account.model";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { verifyMessage } from "ethers";

type LoginRequest = {
    address: string,
    signature: string,
    message: string
    userAgent?: string,
}

type AuthResponse = {
    user?: AccountDocument,
    accessToken?: string,
    refreshToken?: string,
    message: string,
    errorCode?: number
}


const getSignature = async (address: string): Promise<string> => {
    if (!address) {
        throw new Error("Address is required to get signature");
    }
    if (address === process.env.ADDRESS_WALLET_ADMIN) {
        if (!process.env.MESSAGE_ADMIN_SIGNATURE) {
            throw new Error("MESSAGE_ADMIN_SIGNATURE is not defined in environment variables");
        }
        return process.env.MESSAGE_ADMIN_SIGNATURE;
    } else {
        if (!process.env.MESSAGE_USER_SIGNATURE) {
            throw new Error("MESSAGE_USER_SIGNATURE is not defined in environment variables");
        }
        return process.env.MESSAGE_USER_SIGNATURE;
    }
}

function verifySignature(address: string, message: string, signature: string) {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
}

const Login = async (req: LoginRequest): Promise<AuthResponse> => {
    try {
        if (req.message != process.env.MESSAGE_USER_SIGNATURE && req.message != process.env.MESSAGE_ADMIN_SIGNATURE) {
            return {
                message: "Invalid message",
                errorCode: UNAUTHORIZED
            };
        }
        const isValid = verifySignature(req.address, req.message, req.signature);

        if (!isValid) {
            return {
                message: "Invalid signature",
                errorCode: UNAUTHORIZED
            };
        }

        let existingUser = await AccountModel.findOne({ Address: req.address });
        if (!existingUser) {
            let isAdmin = false;
            if (req.address === process.env.ADDRESS_WALLET_ADMIN) {
                isAdmin = true;
            }
            const account = await AccountModel.create({
                Address: req.address,
                Signature: req.signature,
                isAdmin: isAdmin,
                refreshToken: "",
            });
            existingUser = account;
        } else {
            existingUser.Signature = req.signature;
            existingUser.refreshToken = "";
            await existingUser.save();
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const accessToken = jwt.sign({ address: existingUser.Address, isAdmin: existingUser.isAdmin }, process.env.JWT_SECRET, {
            audience: ["account"],
            expiresIn: "30s",
        });

        const refreshToken = jwt.sign({ address: existingUser.Address, isAdmin: existingUser.isAdmin }, process.env.JWT_SECRET, {
            audience: ["account"],
            expiresIn: "1m",
        });

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

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

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const verified = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;

        if (!verified?.address) {
            return {
                message: "Invalid token payload",
                errorCode: UNAUTHORIZED
            }
        }

        const account = await AccountModel.findOne({ Address: verified.address, refreshToken: refreshToken });
        if (!account) {
            return {
                message: "Account not found",
                errorCode: UNAUTHORIZED
            }
        }

        const newAccessToken = jwt.sign({ address: account.Address, isAdmin: account.isAdmin }, JWT_SECRET, {
            audience: ["account"],
            expiresIn: "30s",
        });

        const newRefreshToken = jwt.sign({ address: account.Address, isAdmin: account.isAdmin }, JWT_SECRET, {
            audience: ["account"],
            expiresIn: "1m",
        });

        account.refreshToken = newRefreshToken;
        await account.save();

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