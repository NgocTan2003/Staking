import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { createPublicClient, http, decodeEventLog, parseAbi } from 'viem';
import { bscTestnet } from 'viem/chains';
import { TransactionType } from "../types/TransactionType";
import { crawlDataToDB } from "../services/transaction.service";
import TransactionModel from "../models/transactions.model"; // Import your Transaction model here


const BSC_API_KEY = process.env.BSCSCAN_API_KEY!;
const ADDRESS_CONTRACT_STAKING = process.env.ADDRESS_CONTRACT_STAKING!;

const client = createPublicClient({
    chain: bscTestnet,
    transport: http(),
});

const abi = parseAbi([
    "event Deposited(address indexed user, uint256 amount)",
    "event NFTMinted(address indexed user, uint256 tokenId)",
    "event RewardClaimed(address indexed user, uint256 reward)",
    "event WithDrawn(address indexed user, uint256 amount, uint256 reward)",
    "event NFTsWithDrawn(address indexed user, uint256 tokenId)",
    "event NFTDeposited(address indexed user, uint256 Id)",
    "event APRUpdated(address indexed user, uint256 newBaseAPR)"
]);

const getTransactions = async (): Promise<TransactionType[]> => {
    const result: TransactionType[] = [];

    try {
        const response = await axios.get("https://api-testnet.bscscan.com/api", {
            params: {
                module: "account",
                action: "txlist",
                address: ADDRESS_CONTRACT_STAKING,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 10000,
                sort: "asc",
                apikey: BSC_API_KEY,
            },
        });

        if (response.data.status !== "1") {
            console.error("No transactions found or error:", response.data.message);
        }

        const transactions = response.data.result;

        for (const tx of transactions) {
            const receipt = await client.getTransactionReceipt({ hash: tx.hash as `0x${string}` });

            if (!receipt.logs.length) continue;

            const timestampInMillis = parseInt(tx.timeStamp) * 1000;
            const formattedDate = new Date(timestampInMillis).toISOString().replace("T", " ").substring(0, 19);

            for (const log of receipt.logs) {
                try {
                    const decoded = decodeEventLog({ abi, data: log.data, topics: log.topics });
                    let amount = "";
                    let tokenId = "";
                    let apr = "";

                    switch (decoded.eventName) {
                        case "Deposited":
                            amount = decoded.args.amount.toString();
                            break;
                        case "NFTMinted":
                            tokenId = decoded.args.tokenId.toString();
                            break;
                        case "RewardClaimed":
                            amount = decoded.args.reward.toString();
                            break;
                        case "WithDrawn":
                            amount = decoded.args.amount.toString();
                            break;
                        case "NFTsWithDrawn":
                            tokenId = decoded.args.tokenId.toString();
                            break;
                        case "NFTDeposited":
                            tokenId = decoded.args.Id.toString();
                            break;
                        case "APRUpdated":
                            apr = decoded.args.newBaseAPR.toString();
                            break;
                    }

                    const transaction = {
                        TransactionHash: tx.hash,
                        EventType: decoded.eventName,
                        BlockNumber: tx.blockNumber,
                        From: tx.from,
                        To: tx.to,
                        Amount: amount,
                        TokenID: tokenId,
                        APR: apr,
                        GasUsed: tx.gasUsed,
                        Timestamp: formattedDate,
                    };

                    const exists = await TransactionModel.findOne({ TransactionHash: tx.hash });
                    if (!exists) {
                        result.push(transaction);
                    }

                } catch {
                    console.error("Error decoding log:", log);
                }
            }
        }

        if (result.length > 0) {
            var responseCrawl = await crawlDataToDB(result);
            console.log("response ===================================================", responseCrawl);
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }

    return result;
};

export { getTransactions };
