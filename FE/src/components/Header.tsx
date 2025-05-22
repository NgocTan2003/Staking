import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from 'react-toastify';
import { convertToString } from "../utils/convertUtils";
import { useReadStakingApr, useReadTokenABalanceOf, useReadStakingMintedNfTs } from "../abi/abi";

const Header = () => {
    const { address, isConnected } = useAccount();
    const [APR, setAPR] = useState<number>(0);
    const [prevConnected, setPrevConnected] = useState(false);
    const [userBalance, setUserBalance] = useState<string>('0');
    const [userNFTCount, setUserNFTCount] = useState<number>(0);
    const { data: rawAPR } = useReadStakingApr();
    const { data: rawBalanceOfUser } = useReadTokenABalanceOf({
        args: [address as `0x${string}`],
    });
    const { data: rawNFTOfUser } = useReadStakingMintedNfTs({
        args: [address as `0x${string}`],
    });

    useEffect(() => {
        if (isConnected && !prevConnected) {
            toast.success('Connect Wallet Success');
        }
        setPrevConnected(isConnected);
    }, [isConnected, prevConnected]);

    useEffect(() => {
        if (rawAPR) {
            const aprConvert = Number(rawAPR) / 100;
            setAPR(aprConvert);
        }
        if (isConnected && rawNFTOfUser && rawBalanceOfUser) {
            const userBalanceConvert = convertToString(rawBalanceOfUser as bigint);
            const userNFTCountConvert = Number(rawNFTOfUser);
            setUserBalance(userBalanceConvert);
            setUserNFTCount(userNFTCountConvert);
        }
    }, [rawAPR]);



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
                            <div className="text-amber-100">Base APR: {APR}%</div>
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