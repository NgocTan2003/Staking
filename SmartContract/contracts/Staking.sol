// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTB.sol";
import "./TokenA.sol";

contract Staking is Ownable, ReentrancyGuard {
    TokenA public _tokenA;
    NFTB public _nftB;

    struct Stake {
        uint256 timestamp;
        uint256 amount;
        uint256 nftCount;
        uint256 lockEndTime;
        uint256 pendingReward;
        uint256 totalStakedAmount;
        uint256 nftDepositTime;
        uint256 mintedNFTCount;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256[]) public stakedNFTs;
    mapping(address => uint256) public mintedNFTs;

    event Deposited(address indexed user, uint256 amount);
    event NFTMinted(address indexed user, uint256 tokenId);
    event RewardClaimed(address indexed user, uint256 reward);
    event WithDrawn(address indexed user, uint256 amount, uint256 reward);
    event NFTsWithDrawn(address indexed user, uint256 tokenId);
    event NFTDeposited(address indexed user, uint256 Id);
    event APRUpdated(address indexed user, uint256 newBaseAPR);

    uint256 public TIME_LOCK = 30 seconds;
    uint256 public APR = 800;
    uint256 public APR_Bonus = 200;
    uint256 public NFT_PREREQUISITE = 1000000 * 10 ** 18;

    constructor(address tokenA, address nftB) Ownable(msg.sender) {
        _tokenA = TokenA(tokenA);
        _nftB = NFTB(nftB);
    }

    function deposit(uint256 amount) public nonReentrant {
        require(amount > 0, "deposit: amount must be greater than 0");
        require(
            _tokenA.transferFrom(msg.sender, address(this), amount),
            "Transfer fail"
        );

        Stake storage stake = stakes[msg.sender];

        if (stake.amount > 0) {
            uint256 reward = _calculateReward(msg.sender);
            stake.pendingReward += reward;
        }

        stake.amount += amount;
        stake.timestamp = block.timestamp;
        stake.lockEndTime = block.timestamp + TIME_LOCK;
        stake.totalStakedAmount += amount;

        if (stake.nftDepositTime > 0) {
            stake.nftDepositTime = block.timestamp;
        }

        uint256 totalNFTsEarned = stake.totalStakedAmount / NFT_PREREQUISITE;
        uint256 nftsNew = totalNFTsEarned > mintedNFTs[msg.sender]
            ? totalNFTsEarned - mintedNFTs[msg.sender]
            : 0;

        for (uint256 i = 0; i < nftsNew; i++) {
            uint256 tokenId = _nftB.safeMint(msg.sender);
            emit NFTMinted(msg.sender, tokenId);
        }
        mintedNFTs[msg.sender] += nftsNew;
        emit Deposited(msg.sender, amount);
    }

    function nftDeposit(uint256 tokenId) public nonReentrant {
        require(_nftB.ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        _nftB.transferFrom(msg.sender, address(this), tokenId);

        Stake storage stake = stakes[msg.sender];
        if (stake.amount > 0) {
            stake.pendingReward += _calculateReward(msg.sender);
        }
        stakedNFTs[msg.sender].push(tokenId);
        stake.timestamp = block.timestamp;
        stake.nftDepositTime = block.timestamp;
        stake.nftCount++;

        emit NFTDeposited(msg.sender, tokenId);
    }

    function claimReward() external nonReentrant {
        Stake storage stake = stakes[msg.sender];
        require(stake.amount > 0, "Staked amount must be greater than 0");

        uint256 reward = _calculateReward(msg.sender) + stake.pendingReward;
        require(reward > 0, "No reward to claim");

        require(
            _tokenA.transferReward(msg.sender, reward),
            "Reward transfer failed"
        );

        stake.pendingReward = 0;
        stake.timestamp = block.timestamp;
        if (stake.nftDepositTime > 0) {
            stake.nftDepositTime = block.timestamp;
        }

        emit RewardClaimed(msg.sender, reward);
    }

    function withDrawn() external nonReentrant {
        Stake storage stake = stakes[msg.sender];
        require(stake.amount > 0, "No stake to withdraw");
        require(
            block.timestamp >= stake.lockEndTime,
            "Locked account cannot be withdrawn"
        );

        uint256 reward = _calculateReward(msg.sender) + stake.pendingReward;

        require(
            _tokenA.transfer(msg.sender, stake.amount),
            "Amount Transfer fail"
        );
        require(
            _tokenA.transferReward(msg.sender, reward),
            "Reward TransferReward fail"
        );

        for (uint256 i = 0; i < stakedNFTs[msg.sender].length; i++) {
            uint256 tokenId = stakedNFTs[msg.sender][i];
            _nftB.transferFrom(address(this), msg.sender, tokenId);
            emit NFTsWithDrawn(msg.sender, tokenId);
        }

        emit WithDrawn(msg.sender, stake.amount, reward);
        emit RewardClaimed(msg.sender, reward);

        delete stakedNFTs[msg.sender];
        delete stakes[msg.sender];
    }

    function withDrawnNFT(uint256[] calldata tokenIds) external nonReentrant {
        Stake storage stake = stakes[msg.sender];
        require(tokenIds.length > 0, "NFT must be greater than 0");
        require(stake.nftCount > 0, "No NFTS to withdraw");

        uint256 withDrawnCount = 0;
        bool flag = false;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 id = tokenIds[i];
            for (uint256 j = 0; j < stake.nftCount; j++) {
                if (stakedNFTs[msg.sender][j] == id) {
                    _nftB.transferFrom(address(this), msg.sender, id);
                    stakedNFTs[msg.sender][j] = stakedNFTs[msg.sender][
                        stakedNFTs[msg.sender].length - 1
                    ];
                    stakedNFTs[msg.sender].pop();
                    emit NFTsWithDrawn(msg.sender, id);

                    withDrawnCount++;
                    flag = true;
                    break;
                }
            }
            require(flag, "NFT not found");
        }
        stake.nftCount -= withDrawnCount;
        if (stake.nftDepositTime > 0) {
            stake.nftDepositTime = block.timestamp;
        }
    }

    function getStakeDetail(
        address user
    )
        public
        view
        returns (
            uint256 amount,
            uint256 pendingReward,
            uint256 calculatedReward,
            uint256 lockEndTime,
            uint256 nftCount
        )
    {
        Stake storage stake = stakes[user];
        amount = stake.amount;
        pendingReward = stake.pendingReward;
        calculatedReward = _calculateReward(user);
        lockEndTime = stake.lockEndTime;
        nftCount = stake.nftCount;
    }

    function _calculateReward(address user) public view returns (uint256) {
        Stake storage stake = stakes[user];
        require(
            stake.amount > 0,
            "calculateReward: amount must be greater than 0"
        );
        uint256 timeSent = block.timestamp - stake.timestamp;
        uint256 reward;

        if (stake.nftDepositTime > 0) {
            uint256 base = Math.mulDiv(
                stake.amount * APR * (stake.nftDepositTime - stake.timestamp),
                1,
                365 days * 1000
            );
            uint256 bonus = Math.mulDiv(
                stake.amount *
                    (APR + APR_Bonus * stake.nftCount) *
                    (block.timestamp - stake.nftDepositTime),
                1,
                365 days * 1000
            );
            reward = base + bonus;
        } else {
            reward = Math.mulDiv(
                stake.amount * APR * timeSent,
                1,
                365 days * 10000
            );
        }
        return reward;
    }

    function updateAPR(uint256 newAPR) external onlyOwner {
        APR = newAPR;
        emit APRUpdated(msg.sender, newAPR);
    }

    function getContractBalance() public view returns (uint256) {
        return _tokenA.balanceOf(address(this));
    }

    function getLockTimeRemaining(address user) public view returns (uint256) {
        Stake storage stake = stakes[user];
        if (stake.amount == 0 || stake.lockEndTime < block.timestamp) return 0;
        return block.timestamp - stake.lockEndTime;
    }

    function getCurrentAPR(address user) public view returns (uint256) {
        Stake storage stake = stakes[user];
        if (stakes[user].nftCount == 0) {
            return APR;
        } else {
            return APR + stake.nftCount * APR_Bonus;
        }
    }

    function getNFTInfo(address user) public view returns (uint256) {
        return mintedNFTs[user];
    }

    function getStakeNFTCount(address user) public view returns (uint256) {
        return stakes[user].nftCount;
    }

    function getNFTListByOwner(
        address user
    ) external view returns (uint256[] memory) {
        uint256 balance = _nftB.balanceOf(user);
        uint256[] memory ownedNFTs = new uint256[](balance);
        uint256 index = 0;
        uint256 tokenId = 0;

        while (index < balance) {
            if (_nftB.ownerOf(tokenId) == user) {
                ownedNFTs[index] = tokenId;
                index++;
            }
            tokenId++;
        }

        return ownedNFTs;
    }

    function getListStakedNFT(
        address user
    ) external view returns (uint256[] memory) {
        return stakedNFTs[user];
    }
}
