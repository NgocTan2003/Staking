import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify';
import { useStakingContext } from "../contexts/StakingContext";
import { useSignMessage } from 'wagmi';
import { useGetSignature, useLogin } from "../utils/hook/useAuth";
import { useDisconnect } from 'wagmi';
import type { LoginType } from "../types/login.type";

const Header = () => {
    const { isConnected, address } = useAccount();
    const { baseAPR, userBalance, userNFTCount, updateBalancesTokenA } = useStakingContext();
    const { signMessageAsync } = useSignMessage();
    const [hasSigned, setHasSigned] = useState(false);
    const { data, refetch: refetchSignature } = useGetSignature(address as `0x${string}`);
    const { mutateAsync: login, isPending, error } = useLogin();
    const { disconnect } = useDisconnect();


    useEffect(() => {
        const wasConnected = localStorage.getItem('wasConnected') === 'true';

        if (isConnected && !wasConnected) {
            updateBalancesTokenA();
            toast.success('Connect Wallet Success');
        }

        localStorage.setItem('wasConnected', isConnected.toString());
    }, [isConnected]);

    useEffect(() => {
        const shouldDisconnect = localStorage.getItem("requireWalletReconnect") === "true";

        if (shouldDisconnect) {
            setTimeout(() => {
                disconnect();
                localStorage.removeItem("requireWalletReconnect");
            }, 500);
        }
    }, []);

    useEffect(() => {
        const sign = async () => {
            try {
                if (!address || hasSigned) return;

                const response = await refetchSignature();
                const messageToSign = response.data?.message_signature;

                if (!messageToSign) {
                    toast.error("Get message signature failed");
                    return;
                }

                const signature = await signMessageAsync({ account: address, message: messageToSign });
                if (!signature) {
                    toast.error("Signature failed");
                    return;
                }

                const loginType: LoginType = {
                    address: address as `0x${string}`,
                    signature,
                    message: messageToSign,
                };

                const result = await login({ loginType });
                if (result.statusCode !== 200) {
                    toast.error("Login failed: " + result.message);
                    return;
                }

                setHasSigned(true);
            } catch (error) {
                console.error("Error Signature", error);
            }
        };

        if (isConnected && address) {
            sign();
        }
    }, [isConnected, address, signMessageAsync, hasSigned]);

    return (
        <div className="flex justify-between items-center p-8 bg-gray-400 text-lg">
            <div className="flex gap-6 ml-6">
                <Link to="/" className="cursor-pointer hover:text-blue-200">Home</Link>
                <Link to="/history" className="cursor-pointer hover:text-blue-200">History</Link>
            </div>
            <div className="flex">
                {isConnected ? (
                    <>
                        <div className="flex items-center gap-4 mr-4 text-sm">
                            <div className="text-amber-100">Base APR: {baseAPR}%</div>
                            <div>Token A: {userBalance} ETH</div>
                            <div>NFTB: {userNFTCount}</div>
                        </div></>
                ) : (<></>)}

                <ConnectButton />
            </div>
        </div >
    );
}

export default Header;