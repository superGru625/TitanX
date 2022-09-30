import { atom } from "recoil";

export const BNBBalance = atom({
    key: "BNBBalance", // unique ID (with respect to other atoms/selectors)
    default: 0, // default value (aka initial value)
});

export const BNBPrice = atom({
    key: "BNBPrice", // unique ID (with respect to other atoms/selectors)
    default: 0, // default value (aka initial value)
});

export const SearchTokenState = atom({
    key: "SearchTokenState", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

export const TokenInfo = atom({
    key: "TokenInfo",
    default: {
        id: "0xb314b8703e07eb1861f1c4b99bef65e379c52bbc",
        symbol: "Loading",
        price: 0,
        minted: 0,
        burned: 0,
        decimals: 0,
        name: "Loading",
        pair: "",
        isToken1BNB: true,
        isToken1BUSD: false,
        isBUSDPaired: false,
    },
});

export const QuoteTokenInfo = atom({
    key: "QuoteTokenInfo",
    default: {
        id: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
});
