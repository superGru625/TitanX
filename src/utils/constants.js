//STEALTH DEPLOYER
export const CROWD_FUNDING_ADDRESS =
    "0x1f1790a5c7e7953fe20e694d2e2c61d3e3ce0a4f";

export const LP_LOCKER_ADDRESS = "0x6943a9A3bb248B9e561f9c17E8414a4247A3EA07";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const RANDOM_ADDRESS = "0xA0B0c0D0824421469e351B41704960F74A08e0Af";

export const MAX_UINT256 =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const PRESALE_UPCOMING = "PRESALE_UPCOMING";
export const PRESALE_INPROGRESS = "PRESALE_INPROGRESS";
export const PRESALE_FILLED = "PRESALE_FILLED";
export const PRESALE_CANCELED = "PRESALE_CANCELED";
export const PRESALE_ENDED = "PRESALE_ENDED";
export const PRESALE_FINALISED = "PRESALE_FINALISED";
export const PRESALE_ENDED_NOT_MET_SOFTCAP = "PRESALE_ENDED_NOT_MET_SOFTCAP";
export const LIQUIDITY_UNLOCKED = "LIQUIDITY_UNLOCKED";

export const API_ENDPOINT = "https://data.titanx.org";
export const GOOGLE_NFT_SCRIPT_API_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbz4hKTQxQpkydePhleIiFi1xPLc226naH5Y5AQSWbNi8q1klODbESh13uywgwWhIthNTg/exec";
export const INTEREST_EP =
    "https://script.google.com/macros/s/AKfycbzKBkR5rG_10v1MJ8rEdlFA_YFzk9G6GPd3cZJx4cSHcHt9IDtBMGcZPcwLAhV1RxL6NA/exec";

export const DEFAULT_TOKEN_IMAGE = "/images/presale-default.svg";
export const DEFAULT_PARTNER_LOGO = "/images/verified.svg";

export const getTokenLink = (offChainData, type = "logo") => {
    let link = "";
    if (type === "logo") link = DEFAULT_TOKEN_IMAGE;
    offChainData?.external_links?.forEach((item) => {
        if (item.name === type) link = item.link;
    });
    return link;
};

export const TG_PRICE_BOT = "https://t.me/TitanX_Pricebot";

export const MINT_PRICE_BNB = 0.15;

export const NETWORKS = {
    97: {
        name: "bsc-testnet",
    },
    56: {
        name: "bsc",
    },
};

export const getChainId = (name) => {
    for (const chainId in NETWORKS)
        if (NETWORKS[chainId] === name) return chainId;
};

export const getPartnerLogo = (offChainData) => {
    let link = DEFAULT_PARTNER_LOGO;
    if (offChainData?.logo_link?.length) link = offChainData.logo_link;
    return link;
};

export const REMOVED_PRESALES = [
    "0xdE12C0aF6a364DbDDe2A9168801409ed95007d41",
    "0x8B1b55d603746556e25fd4071413CBDE244CE576",
];

export const INTENSE_SLIPPAGE = 500; //500%

export const PREMIUM_PARTNERS = [
    "0x35C6B73748272329cBf4ca0762F8765b70343914",
    // "0x6D83B516e1f6999DD20A98753EC17D6d70804Be0",
];

export const PREMIUM_PRESALES = [
    "0x9164C6909f9b39cf00c0AC15cF0b9fd2C7a9A2dc",
    "0xc4f65fE1Fe00847B3ac0F5deE6165cb50b64329F",
];

export const GRAPHQL_KEY = "BQY1dxugNaRu12iz2KYsfszkMMptB9HX"; //"BQYuq0a8yHb2oa6bDx9R3GO2LNWAtR2q";

export const SUBGRAPH_ENDPOINT =
    "https://api.thegraph.com/subgraphs/name/pancakeswap/pairs";

// V2 Pair subscription

export const WBNB_BUSD_PAIR = "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16";
export const LOG_TOPIC_SWAP =
    "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822";
