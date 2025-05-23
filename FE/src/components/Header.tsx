import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from 'react-toastify';
import { useStakingContext } from "../contexts/StakingContext";

const Header = () => {
    const { isConnected } = useAccount();
    const [prevConnected, setPrevConnected] = useState(false);
    const { baseAPR, userBalance, userNFTCount, updateBalancesTokenA } = useStakingContext();

    useEffect(() => {
        if (isConnected && !prevConnected) {
            updateBalancesTokenA();
            toast.success('Connect Wallet Success');
        }
        setPrevConnected(isConnected);
    }, [isConnected, prevConnected]);

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