import Moment from "moment";

export const parseTxs = (json, bnbprice) => {
    var resp = [];
    for (var i = 0; i < json.data.ethereum.dexTrades.length; i++) {
        var item = json.data.ethereum.dexTrades[i];
        let date = Moment(
            item.block.timestamp.time,
            "YYYY-MM-DD HH:mm:ss"
        ).toDate();
        date = new Date(
            date.getTime() - new Date().getTimezoneOffset() * 60 * 1000
        );
        const builtTime = date.toLocaleTimeString();
        const realSide = item.side === "BUY" ? "SELL" : "BUY";
        var resp_item = {
            timeStamp: date.getTime(),
            time: builtTime,
            side: realSide,
            symbol: item.quoteCurrency.symbol,
            baseSymbol: item.baseCurrency.symbol,
            baseAmount: "$" + (item.quotePrice * bnbprice).toFixed(8),
            quoteSymbol: item.quoteCurrency.symbol,
            quoteAmount: parseFloat(item.baseAmount).toFixed(2),
            quotePrice: parseFloat(item.quotePrice).toFixed(8),
            totalBnb: parseFloat(item.quoteAmount).toFixed(8),
            txhash: `https://bscscan.com/tx/${item.transaction.hash}`,
            exchange: item.exchange.fullName,
        };
        resp.push(resp_item);
    }
    return resp;
};

export const getTradeAmount = (tradeObj, tokenInfo) => {
    return {
        amount0: tradeObj.data.amount0In + tradeObj.data.amount0Out,
        amount1: tradeObj.data.amount1In + tradeObj.data.amount1Out,
        price:
            (tradeObj.data.amount1In + tradeObj.data.amount1Out) /
            (tradeObj.data.amount0In + tradeObj.data.amount0Out),
    };
};

export const parseSwapLog = (log, tokenInfo) => {
    if (tokenInfo === undefined) {
        return {
            amount0:
                parseFloat(log.returnValues.amount0In) +
                parseFloat(log.returnValues.amount0Out),
            amount1:
                parseFloat(log.returnValues.amount1In) +
                parseFloat(log.returnValues.amount1Out),
            price:
                (parseFloat(log.returnValues.amount1In) +
                    parseFloat(log.returnValues.amount1Out)) /
                (parseFloat(log.returnValues.amount0In) +
                    parseFloat(log.returnValues.amount0Out)),
        };
    }
    const result = {
        amount0:
            parseFloat(log.returnValues.amount0In) +
            parseFloat(log.returnValues.amount0Out),
        amount1:
            parseFloat(log.returnValues.amount1In) +
            parseFloat(log.returnValues.amount1Out),
        price:
            (parseFloat(log.returnValues.amount1In) +
                parseFloat(log.returnValues.amount1Out)) /
            (parseFloat(log.returnValues.amount0In) +
                parseFloat(log.returnValues.amount0Out)),
    };
    if (tokenInfo.isBUSDPaired === true) {
        if (tokenInfo.isToken1BUSD === true) {
            result.amount0 = result.amount0 / 10 ** tokenInfo.decimals;
            result.amount1 = result.amount1 / 10 ** 18; //WBNB - decimals
        } else {
            result.amount0 = result.amount0 / 10 ** 18; //WBNB - decimals
            result.amount1 = result.amount1 / 10 ** tokenInfo.decimals;
        }
    } else {
        if (tokenInfo.isToken1BNB === true) {
            result.amount0 = result.amount0 / 10 ** tokenInfo.decimals;
            result.amount1 = result.amount1 / 10 ** 18; //WBNB - decimals
        } else {
            result.amount0 = result.amount0 / 10 ** 18; //WBNB - decimals
            result.amount1 = result.amount1 / 10 ** tokenInfo.decimals;
        }
    }
    return result;
};

export const getTradeVolume = (sum0, sum1, tokenInfo, price) => {
    let result = 0;

    if (tokenInfo.isBUSDPaired === true) {
        if (tokenInfo.isToken1BUSD === true) {
            result = sum1;
        } else {
            result = sum0;
        }
    } else {
        if (tokenInfo.isToken1BNB === true) {
            result = sum0 * price;
        } else {
            result = sum1 * price;
        }
    }
    return result;
};

export const calculateTokenPriceByPairInfo = (
    sum0,
    sum1,
    bnbPrice,
    tokenInfo
) => {
    let result;
    if (tokenInfo.isBUSDPaired === true) {
        if (tokenInfo.isToken1BUSD === true) {
            result = sum1 / sum0;
        } else {
            result = sum0 / sum1;
        }
    } else {
        if (tokenInfo.isToken1BNB === true) {
            result = (sum1 / sum0) * bnbPrice;
        } else {
            result = (sum0 / sum1) * bnbPrice;
        }
    }
    return result;
};

export const calculateTokenPriceByReserve = (reserves, bnbPrice, tokenInfo) => {
    let result;
    if (tokenInfo.isBUSDPaired === true) {
        if (tokenInfo.isToken1BUSD === true) {
            console.log(140);
            result =
                reserves._reserve1 /
                10 ** tokenInfo.decimals /
                (reserves._reserve0 / 10 ** 18);
        } else {
            result =
                reserves._reserve0 /
                10 ** tokenInfo.decimals /
                (reserves._reserve1 / 10 ** 18);
        }
    } else {
        if (tokenInfo.isToken1BNB === true) {
            result =
                (reserves._reserve1 /
                    10 ** tokenInfo.decimals /
                    (reserves._reserve0 / 10 ** 18)) *
                bnbPrice;
        } else {
            result =
                (reserves._reserve0 /
                    10 ** 18 /
                    (reserves._reserve1 / 10 ** tokenInfo.decimals)) *
                bnbPrice;
        }
    }
    return result;
};

export const parseTxSwapLog = (logs, tokenInfo) => {
    if (!logs || !tokenInfo) return [];
    return logs.map((log) => {
        let side = "";
        let totalUSD = 0;
        let priceUSD = 0;
        let quoteAmount = 0;
        const result = parseSwapLog(log, tokenInfo);

        if (tokenInfo.isBUSDPaired === true) {
            if (tokenInfo.isToken1BUSD === true) {
                totalUSD = result.amount1;
                priceUSD = totalUSD / result.amount0;
                quoteAmount = result.amount0;
                log.returnValues.amount0In > 0
                    ? (side = "SELL")
                    : (side = "BUY");
            } else {
                totalUSD = result.amount0;
                priceUSD = totalUSD / result.amount1;
                quoteAmount = result.amount1;
                log.returnValues.amount1In > 0
                    ? (side = "SELL")
                    : (side = "BUY");
            }
        } else {
            if (tokenInfo.isToken1BNB === true) {
                totalUSD = result.amount1 * log.coinPrice;
                priceUSD = totalUSD / result.amount0;
                quoteAmount = result.amount0;
                log.returnValues.amount0In > 0
                    ? (side = "SELL")
                    : (side = "BUY");
            } else {
                totalUSD = result.amount0 * log.coinPrice;
                priceUSD = totalUSD / result.amount1;
                quoteAmount = result.amount1;
                log.returnValues.amount1In > 0
                    ? (side = "SELL")
                    : (side = "BUY");
            }
        }
        return {
            timeStamp: log.timeStamp,
            coinPrice: log.coinPrice?.toFixed(3),
            side,
            totalUSD: totalUSD.toFixed(3),
            priceUSD: priceUSD.toFixed(3),
            quoteAmount: quoteAmount.toFixed(3),
            transactionHash: `https://bscscan.com/tx/${log.transactionHash}`,
        };
    });
};
