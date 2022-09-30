import { API_ENDPOINT } from "./constants";
import fetch from "node-fetch";

import { create } from "ipfs-http-client";
require("dotenv").config();

const getApiUrl = (uri) =>
    process.env.REACT_APP_LOCAL_API
        ? `http://localhost:4000${uri}`
        : `${API_ENDPOINT}${uri}`;

// const getApiUrl = (uri) => `${API_ENDPOINT}${uri}`;

export const getPresaleDetails = async (address) => {
    try {
        const response = await fetch(
            getApiUrl(`/presales/${address.toLowerCase()}`)
        );
        return await response.json();
    } catch (error) {
        return {};
    }
};

export const setPresaleDetails = async (address, preSaleData) => {
    const priorInfo = await getPresaleDetails(address.toLowerCase());
    if (Object.keys(priorInfo).length === 0) {
        // post
        try {
            const response = await fetch(getApiUrl(`/presales`), {
                method: "POST",
                body: JSON.stringify(preSaleData),
                headers: { "Content-Type": "application/json" },
            });
            return await response.json();
        } catch (error) {
            return {};
        }
    } else {
        // put
        try {
            const response = await fetch(
                getApiUrl(`/presales/${address.toLowerCase()}`),
                {
                    method: "PUT",
                    body: JSON.stringify(preSaleData),
                    headers: { "Content-Type": "application/json" },
                }
            );
            return await response.json();
        } catch (error) {
            return {};
        }
    }
};

export const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch(
            getApiUrl(`/presales/upload_presale_logo`),
            {
                method: "POST",
                body: formData,
            }
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return "";
    }
};

export const uploadToIpfs = async (file) => {
    const client = create("https://ipfs.infura.io:5001/api/v0");
    try {
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        return url;
    } catch (err) {
        console.log(err);
        return "";
    }
};

export const getPartnerDetails = async (address) => {
    try {
        const response = await fetch(
            getApiUrl(`/presales/partners/${address.toLowerCase()}`)
        );
        return await response.json();
    } catch (error) {
        return {};
    }
};

export const searchTokensFromPairs = async (query) => {
    try {
        const response = await fetch(getApiUrl(`/pairs/search/${query}`));
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const getTokenInformation = async (tokenAddress) => {
    try {
        const [response, PCS_RESULT] = await Promise.all([
            fetch(getApiUrl(`/coinprice/information/${tokenAddress}`)),
            fetch(`https://api.pancakeswap.info/api/v2/tokens/${tokenAddress}`),
        ]);
        if (response.status === 200) {
            let result = await response.json();
            let PCS_API_RESULT = await PCS_RESULT.json();
            localStorage.setItem(
                "lastClose",
                parseFloat(PCS_API_RESULT.data?.price)
            );
            return {
                ...result,
                price: parseFloat(PCS_API_RESULT.data?.price),
                symbol: PCS_API_RESULT.data?.symbol,
                name: PCS_API_RESULT.data?.name,
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getCreationBlock = async (contractAddress) => {
    try {
        const response = await fetch(
            getApiUrl(`/coinprice/creationBlockNumber/${contractAddress}`)
        );
        return await response.json();
    } catch (error) {
        return {};
    }
};

export const getLatestCoinPrice = async () => {
    try {
        const response = await fetch(getApiUrl(`/coinprice/latest`));
        return (await response.json()).usdPrice;
    } catch (error) {
        return 0;
    }
};

const MAX_CANDLE_REQUEST = 150;
export const getCandleDuringPeriod = async (
    tokenAddress,
    lastPrice,
    from,
    to,
    interval
) => {
    let lastClose = 0;
    if (lastClose === 0) {
        lastClose = localStorage.getItem("lastClose");
    }
    try {
        let fromArr = [],
            toArr = [];
        let curFrom = from,
            curTo = from;
        do {
            curTo += MAX_CANDLE_REQUEST * interval * 60;
            fromArr.push(curFrom);
            toArr.push(curTo <= to ? curTo : to);
            curFrom = curTo;
        } while (curTo < to);
        let candleBatches = await Promise.all(
            fromArr.map((item, index) =>
                fetch(
                    getApiUrl(
                        `/coinprice/candle/${tokenAddress}?from=${fromArr[index]}&to=${toArr[index]}&interval=${interval}`
                    )
                ).then(async (response) => await response.json())
            )
        );
        candleBatches = [].concat.apply([], candleBatches);
        candleBatches.forEach((item) => {
            if (item.open < 0) {
                item.open *= -lastClose;
                item.close *= -lastClose;
                item.high *= -lastClose;
                item.low *= -lastClose;
            } else lastClose = item.close;
        });
        localStorage.setItem("lastClose", lastClose);
        return candleBatches;
        // return await response.json();
    } catch (error) {
        return [];
    }
};

export const getPairsFromDEXList = async (address) => {
    try {
        const response = await fetch(getApiUrl(`/pairs/dex/${address}`));
        return await response.json();
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getSwaplogs = async (address) => {
    try {
        const response = await fetch(getApiUrl(`/pairs/logs/swap/${address}`));
        return await response.json();
    } catch (error) {
        console.log(error);
        return {};
    }
};
