import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NFTB
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const nftbAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'safeMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const nftbAddress = '0x091063913D601c47780B4Fd917De30b0764E48b9' as const

export const nftbConfig = { address: nftbAddress, abi: nftbAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Staking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakingAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'tokenA', internalType: 'address', type: 'address' },
      { name: 'nftB', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'newBaseAPR',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'APRUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'Id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'NFTDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NFTMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NFTsWithDrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WithDrawn',
  },
  {
    type: 'function',
    inputs: [],
    name: 'APR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'APR_Bonus',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NFT_PREREQUISITE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIME_LOCK',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: '_calculateReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_nftB',
    outputs: [{ name: '', internalType: 'contract NFTB', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_tokenA',
    outputs: [{ name: '', internalType: 'contract TokenA', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getCurrentAPR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getListStakedNFT',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getLockTimeRemaining',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getNFTInfo',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getNFTListByOwner',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getStakeDetail',
    outputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'pendingReward', internalType: 'uint256', type: 'uint256' },
      { name: 'calculatedReward', internalType: 'uint256', type: 'uint256' },
      { name: 'lockEndTime', internalType: 'uint256', type: 'uint256' },
      { name: 'nftCount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getStakeNFTCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'mintedNFTs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'nftDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stakedNFTs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'stakes',
    outputs: [
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'nftCount', internalType: 'uint256', type: 'uint256' },
      { name: 'lockEndTime', internalType: 'uint256', type: 'uint256' },
      { name: 'pendingReward', internalType: 'uint256', type: 'uint256' },
      { name: 'totalStakedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'nftDepositTime', internalType: 'uint256', type: 'uint256' },
      { name: 'mintedNFTCount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAPR', internalType: 'uint256', type: 'uint256' }],
    name: 'updateAPR',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withDrawn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'withDrawnNFT',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const stakingAddress =
  '0x83581f27f3d1D43834c64f8D73F9cbd2424e2F1a' as const

export const stakingConfig = {
  address: stakingAddress,
  abi: stakingAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenAAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_FAUCET_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SUPPLY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: '_stakingContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'faucet',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stakingContract', internalType: 'address', type: 'address' },
    ],
    name: 'setStakingContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferReward',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

export const tokenAAddress =
  '0x0A1ca52BA481Fa394f0D47Cb8B487831cd5F2303' as const

export const tokenAConfig = { address: tokenAAddress, abi: tokenAAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__
 */
export const useReadNftb = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadNftbBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadNftbGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'getApproved',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadNftbIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'isApprovedForAll',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"name"`
 */
export const useReadNftbName = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadNftbOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'ownerOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadNftbSupportsInterface = /*#__PURE__*/ createUseReadContract(
  { abi: nftbAbi, address: nftbAddress, functionName: 'supportsInterface' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadNftbSymbol = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadNftbTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'tokenURI',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__
 */
export const useWriteNftb = /*#__PURE__*/ createUseWriteContract({
  abi: nftbAbi,
  address: nftbAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteNftbApprove = /*#__PURE__*/ createUseWriteContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"safeMint"`
 */
export const useWriteNftbSafeMint = /*#__PURE__*/ createUseWriteContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'safeMint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteNftbSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: nftbAbi,
    address: nftbAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteNftbSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: nftbAbi,
    address: nftbAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteNftbTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__
 */
export const useSimulateNftb = /*#__PURE__*/ createUseSimulateContract({
  abi: nftbAbi,
  address: nftbAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateNftbApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"safeMint"`
 */
export const useSimulateNftbSafeMint = /*#__PURE__*/ createUseSimulateContract({
  abi: nftbAbi,
  address: nftbAddress,
  functionName: 'safeMint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateNftbSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nftbAbi,
    address: nftbAddress,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateNftbSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nftbAbi,
    address: nftbAddress,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nftbAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateNftbTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nftbAbi,
    address: nftbAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nftbAbi}__
 */
export const useWatchNftbEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nftbAbi,
  address: nftbAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nftbAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchNftbApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nftbAbi,
    address: nftbAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nftbAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchNftbApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nftbAbi,
    address: nftbAddress,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nftbAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchNftbTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nftbAbi,
    address: nftbAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useReadStaking = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"APR"`
 */
export const useReadStakingApr = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'APR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"APR_Bonus"`
 */
export const useReadStakingAprBonus = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'APR_Bonus',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"NFT_PREREQUISITE"`
 */
export const useReadStakingNftPrerequisite =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'NFT_PREREQUISITE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"TIME_LOCK"`
 */
export const useReadStakingTimeLock = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'TIME_LOCK',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"_calculateReward"`
 */
export const useReadStakingCalculateReward =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: '_calculateReward',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"_nftB"`
 */
export const useReadStakingNftB = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: '_nftB',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"_tokenA"`
 */
export const useReadStakingTokenA = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: '_tokenA',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getContractBalance"`
 */
export const useReadStakingGetContractBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getContractBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getCurrentAPR"`
 */
export const useReadStakingGetCurrentApr = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'getCurrentAPR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getListStakedNFT"`
 */
export const useReadStakingGetListStakedNft =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getListStakedNFT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getLockTimeRemaining"`
 */
export const useReadStakingGetLockTimeRemaining =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getLockTimeRemaining',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getNFTInfo"`
 */
export const useReadStakingGetNftInfo = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'getNFTInfo',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getNFTListByOwner"`
 */
export const useReadStakingGetNftListByOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getNFTListByOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getStakeDetail"`
 */
export const useReadStakingGetStakeDetail = /*#__PURE__*/ createUseReadContract(
  { abi: stakingAbi, address: stakingAddress, functionName: 'getStakeDetail' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getStakeNFTCount"`
 */
export const useReadStakingGetStakeNftCount =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getStakeNFTCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"mintedNFTs"`
 */
export const useReadStakingMintedNfTs = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'mintedNFTs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"owner"`
 */
export const useReadStakingOwner = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"stakedNFTs"`
 */
export const useReadStakingStakedNfTs = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'stakedNFTs',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"stakes"`
 */
export const useReadStakingStakes = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'stakes',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useWriteStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"claimReward"`
 */
export const useWriteStakingClaimReward = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'claimReward',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteStakingDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"nftDeposit"`
 */
export const useWriteStakingNftDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'nftDeposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteStakingRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteStakingTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"updateAPR"`
 */
export const useWriteStakingUpdateApr = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'updateAPR',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withDrawn"`
 */
export const useWriteStakingWithDrawn = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  address: stakingAddress,
  functionName: 'withDrawn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withDrawnNFT"`
 */
export const useWriteStakingWithDrawnNft = /*#__PURE__*/ createUseWriteContract(
  { abi: stakingAbi, address: stakingAddress, functionName: 'withDrawnNFT' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useSimulateStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: stakingAbi,
  address: stakingAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"claimReward"`
 */
export const useSimulateStakingClaimReward =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'claimReward',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateStakingDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"nftDeposit"`
 */
export const useSimulateStakingNftDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'nftDeposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateStakingRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateStakingTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"updateAPR"`
 */
export const useSimulateStakingUpdateApr =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'updateAPR',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withDrawn"`
 */
export const useSimulateStakingWithDrawn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'withDrawn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withDrawnNFT"`
 */
export const useSimulateStakingWithDrawnNft =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'withDrawnNFT',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__
 */
export const useWatchStakingEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stakingAbi,
  address: stakingAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"APRUpdated"`
 */
export const useWatchStakingAprUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'APRUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"Deposited"`
 */
export const useWatchStakingDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'Deposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"NFTDeposited"`
 */
export const useWatchStakingNftDepositedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'NFTDeposited',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"NFTMinted"`
 */
export const useWatchStakingNftMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'NFTMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"NFTsWithDrawn"`
 */
export const useWatchStakingNfTsWithDrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'NFTsWithDrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"RewardClaimed"`
 */
export const useWatchStakingRewardClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'RewardClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"WithDrawn"`
 */
export const useWatchStakingWithDrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    address: stakingAddress,
    eventName: 'WithDrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__
 */
export const useReadTokenA = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"MAX_FAUCET_AMOUNT"`
 */
export const useReadTokenAMaxFaucetAmount = /*#__PURE__*/ createUseReadContract(
  { abi: tokenAAbi, address: tokenAAddress, functionName: 'MAX_FAUCET_AMOUNT' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"MAX_SUPPLY"`
 */
export const useReadTokenAMaxSupply = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'MAX_SUPPLY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"_stakingContract"`
 */
export const useReadTokenAStakingContract = /*#__PURE__*/ createUseReadContract(
  { abi: tokenAAbi, address: tokenAAddress, functionName: '_stakingContract' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadTokenAAllowance = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTokenABalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadTokenADecimals = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"getContractBalance"`
 */
export const useReadTokenAGetContractBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'getContractBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"name"`
 */
export const useReadTokenAName = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTokenAOwner = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadTokenASymbol = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTokenATotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__
 */
export const useWriteTokenA = /*#__PURE__*/ createUseWriteContract({
  abi: tokenAAbi,
  address: tokenAAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteTokenAApprove = /*#__PURE__*/ createUseWriteContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"faucet"`
 */
export const useWriteTokenAFaucet = /*#__PURE__*/ createUseWriteContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'faucet',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTokenARenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"setStakingContract"`
 */
export const useWriteTokenASetStakingContract =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'setStakingContract',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteTokenATransfer = /*#__PURE__*/ createUseWriteContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTokenATransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTokenATransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferReward"`
 */
export const useWriteTokenATransferReward =
  /*#__PURE__*/ createUseWriteContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transferReward',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__
 */
export const useSimulateTokenA = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenAAbi,
  address: tokenAAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTokenAApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: tokenAAbi, address: tokenAAddress, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"faucet"`
 */
export const useSimulateTokenAFaucet = /*#__PURE__*/ createUseSimulateContract({
  abi: tokenAAbi,
  address: tokenAAddress,
  functionName: 'faucet',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTokenARenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"setStakingContract"`
 */
export const useSimulateTokenASetStakingContract =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'setStakingContract',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateTokenATransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTokenATransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTokenATransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link tokenAAbi}__ and `functionName` set to `"transferReward"`
 */
export const useSimulateTokenATransferReward =
  /*#__PURE__*/ createUseSimulateContract({
    abi: tokenAAbi,
    address: tokenAAddress,
    functionName: 'transferReward',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenAAbi}__
 */
export const useWatchTokenAEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: tokenAAbi,
  address: tokenAAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenAAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTokenAApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenAAbi,
    address: tokenAAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenAAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTokenAOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenAAbi,
    address: tokenAAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link tokenAAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTokenATransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: tokenAAbi,
    address: tokenAAddress,
    eventName: 'Transfer',
  })
