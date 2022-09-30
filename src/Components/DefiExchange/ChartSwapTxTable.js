import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import LoadingBar from "../UI/LoadingBar";
import { widget } from "../../charting_library";
import { useRecoilState } from "recoil";
import { BNBPrice, TokenInfo } from "./Defaults";

import Iframe from "react-iframe";
import liquid from "../../assets/images/liquid.svg";
import Invalid_Token_Img from "../../assets/images/defi-exchange/invalid.png";
import Searching_Img from "../../assets/images/defi-exchange/searching.png";

import {
    useMyWeb3,
    useStakingTokenAddress,
    useIsMount,
    usePrevious,
} from "../../hooks";

import ABI_UNISWAP_V2_PAIR from "../../abis/global/ABI_UNISWAP_V2_PAIR.json";
import {
    getCandleDuringPeriod,
    getLatestCoinPrice,
    getPairsFromDEXList,
    getSwaplogs,
    getTokenInformation,
} from "../../utils/apis";
import { checksumedAddressImgLink, dateFormat } from "../../utils/utils";

import { WBNB_BUSD_PAIR } from "../../utils/constants";
import {
    calculateTokenPriceByPairInfo,
    calculateTokenPriceByReserve,
    getTradeVolume,
    parseSwapLog,
    parseTxSwapLog,
} from "../../helpers/txparser";

const defaultProps = {
    //datafeed: Datafeed, // our datafeed object
    containerId: "tv_chart_container",
    //datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: "/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    time_frames: [
        { text: "1M", resolution: "720", description: "1 month" },
        { text: "1W", resolution: "60" },
        { text: "1D", resolution: "15" },
    ],
};

let global_klines = [];

let transactionTable = {};

const ChartSwapTxTable = () => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const { tokenAddress } = useParams();

    const isMount = useIsMount();

    const web3 = useMyWeb3();

    const TitanTokenAddress = useStakingTokenAddress();

    const [pending, setPending] = useState(true);

    const [bnbPrice, setBnbPrice] = useRecoilState(BNBPrice);
    const [tokenInfo, setTokenInfo] = useRecoilState(TokenInfo);

    const prevTokenInfo = usePrevious(tokenInfo);

    const queryToken = tokenAddress === undefined ? tokenInfo.id : tokenAddress;

    const [isInvalid, setIsInvalid] = useState(false);
    // eslint-disable-next-line
    let tvWdiget = null;

    const ChartDataFeeds = () => {
        const configurationData = {
            supports_marks: true,
            supports_timescale_marks: true,
            supports_time: true,
            supported_resolutions: [
                "1",
                "5",
                "15",
                "30",
                "60",
                "240",
                "720",
                "1D",
            ],
        };

        const lastCloseObject = {
            time: 0,
            open: 0,
            close: 0,
            high: 0,
            low: 0,
            volume: 0,
            interval: 0,
            timerId: -1,
            blockNumber: 0,
        };

        const DataFeedObject = {
            onReady: (callback) => {
                setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
            },
            resolveSymbol: async (
                symbolName,
                onSymbolResolvedCallback,
                onResolveErrorCallback
            ) => {
                const symbolInfo = (symbol) => ({
                    name: symbol.split("-")[0],
                    description:
                        symbol.split("-")[0] + " / " + symbol.split("-")[1],
                    ticker: symbol.split("-")[0],
                    exchange: "TitanX.org",
                    //listed_exchange: 'Binance',
                    timezone: "Asia/Shanghai",
                    //type: 'crypto',
                    session: "24x7",
                    minmov: 1,
                    pricescale: 1000000000,
                    has_intraday: true,
                    intraday_multipliers: [
                        "1",
                        "5",
                        "15",
                        "30",
                        "60",
                        "240",
                        "720",
                        "1440",
                    ],
                    supported_resolutions:
                        configurationData.supported_resolutions,
                    data_status: "streaming",
                });

                //var symbols = await getSymbols();
                const symbol = "N/A"; //symbols.name;

                return symbol
                    ? onSymbolResolvedCallback(symbolInfo(symbolName))
                    : onResolveErrorCallback(
                          "[resolveSymbol]: symbol not found"
                      );
            },
            // get historical data for the symbol
            // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
            getBars: async (
                symbolInfo,
                interval,
                periodParams,
                onHistoryCallback,
                onErrorCallback
            ) => {
                if (interval !== localStorage.getItem("tv_interval")) {
                    console.log(
                        "doMagic-trigger",
                        interval,
                        localStorage.getItem("tv_interval")
                    );
                    localStorage.setItem("tv_interval", interval);
                    doMagic();
                    return;
                }
                const { from, to /*firstDataRequest*/ } = periodParams;
                let klines = [];
                console.log(96, interval, from, to, (to - from) / 60);
                let resolution = parseInt(interval);
                if (interval === "1D") resolution = 1440;
                if (interval === "1W") resolution = 10080;
                lastCloseObject.interval = resolution;

                klines = await getCandleDuringPeriod(
                    tokenInfo.id,
                    tokenInfo.price,
                    from,
                    to,
                    resolution
                );
                klines = klines.map((bar, index, array) => {
                    if (
                        bar.high > bar.open * 1.02 &&
                        bar.high > bar.close * 1.02
                    )
                        bar.high = bar.open * 1.02;
                    if (bar.low * 1.02 < bar.open && bar.low * 1.02 < bar.close)
                        bar.low = bar.open / 1.02;
                    if (bar.high > bar.open * 100 || bar.high > bar.close * 100)
                        bar.high = bar.open;
                    if (
                        Math.abs(bar.low) > bar.open * 100 ||
                        Math.abs(bar.low) > bar.close * 100
                    )
                        bar.low = bar.open;
                    if (index + 1 <= array.length - 1) {
                        const nextBar = array[index + 1];
                        bar.close = nextBar.open;
                    }
                    return bar;
                });

                klines = klines.filter(
                    (bar) =>
                        bar.time > from * 1000 &&
                        bar.time <= to * 1000 &&
                        bar.time < new Date().getTime()
                );
                // console.log("klines", klines);

                if (
                    klines.length > 0 &&
                    global_klines.length > 0 &&
                    global_klines.findIndex(
                        (item) =>
                            item.time ===
                            klines.at(-1).time + resolution * 60 * 1000
                    ) >= 0
                ) {
                    const offset =
                        global_klines.find(
                            (item) =>
                                item.time ===
                                klines.at(-1).time + resolution * 60 * 1000
                        ).open - klines.at(-1).close;
                    klines.forEach((item) => {
                        item.open += offset;
                        item.close += offset;
                        item.high += offset;
                        item.low += offset;
                    });
                    console.log(offset);
                }

                if (klines.length) {
                    if (klines.at(-1).time >= lastCloseObject.time) {
                        console.log("update last close object");
                        lastCloseObject.time = klines.at(-1).time;
                        lastCloseObject.open = klines.at(-1).open;
                        lastCloseObject.close = klines.at(-1).close;
                        lastCloseObject.high = klines.at(-1).high;
                        lastCloseObject.low = klines.at(-1).low;
                        lastCloseObject.volume = klines.at(-1).volume;
                        lastCloseObject.interval = resolution;
                    }
                    global_klines = klines.concat(global_klines);
                    onHistoryCallback(klines, { noData: false });
                } else {
                    onHistoryCallback(klines, { noData: true });
                }
            },
            //subscription to real-time updates
            subscribeBars: async (
                symbolInfo,
                resolution,
                onRealtimeCallback,
                subscribeUID,
                onResetCacheNeededCallback
            ) => {
                const updateTokenPriceByWBNB = async () => {
                    const cachedBnbPrice = localStorage.getItem("coin_price");
                    const pairContract = new web3.eth.Contract(
                        ABI_UNISWAP_V2_PAIR,
                        tokenInfo.pair
                    );
                    const _lastBlockNumber = await web3.eth.getBlockNumber();

                    const newTime =
                        new Date().getTime() -
                        (new Date().getTime() %
                            (lastCloseObject.interval * 60000));
                    if (newTime !== lastCloseObject.time) {
                        // console.log("lastCloseObject-297", lastCloseObject);
                        lastCloseObject.volume = 0;
                        lastCloseObject.open = lastCloseObject.close;
                        lastCloseObject.high = lastCloseObject.close;
                        lastCloseObject.low = lastCloseObject.close;
                    }
                    lastCloseObject.time = newTime;

                    const events = await pairContract.getPastEvents("Swap", {
                        fromBlock: lastCloseObject.blockNumber
                            ? lastCloseObject.blockNumber
                            : _lastBlockNumber - 5,
                    });

                    let sum0 = 0,
                        sum1 = 0;
                    let appendList = [];
                    events.reverse().forEach((item) => {
                        appendList.push(item);
                        const parsedLog = parseSwapLog(item, tokenInfo);
                        sum0 += parsedLog.amount0;
                        sum1 += parsedLog.amount1;
                    });
                    appendNewLogs(appendList);

                    if (sum0 > 0) {
                        const price = calculateTokenPriceByPairInfo(
                            sum0,
                            sum1,
                            cachedBnbPrice,
                            tokenInfo
                        );

                        setTokenInfo({
                            ...tokenInfo,
                            price,
                        });
                        lastCloseObject.volume += getTradeVolume(
                            sum0,
                            sum1,
                            tokenInfo,
                            price
                        );
                        lastCloseObject.close = price;
                        lastCloseObject.high =
                            price > lastCloseObject.high
                                ? price
                                : lastCloseObject.high;
                        lastCloseObject.low =
                            price < lastCloseObject.low
                                ? price
                                : lastCloseObject.low;
                        // console.log((sum1 / sum0) * cachedBnbPrice);
                    }
                    // there's not swap logs
                    else {
                        const reserves = await pairContract.methods
                            .getReserves()
                            .call();
                        const price = calculateTokenPriceByReserve(
                            reserves,
                            cachedBnbPrice,
                            tokenInfo
                        );

                        setTokenInfo({
                            ...tokenInfo,
                            price,
                        });
                        lastCloseObject.close = price;
                        lastCloseObject.high =
                            price > lastCloseObject.high
                                ? price
                                : lastCloseObject.high;
                        lastCloseObject.low =
                            price < lastCloseObject.low
                                ? price
                                : lastCloseObject.low;
                    }

                    lastCloseObject.blockNumber = _lastBlockNumber;
                    // console.log(lastCloseObject, lastCloseObject.interval);
                    return onRealtimeCallback({ ...lastCloseObject });
                };
                lastCloseObject.timerId = setInterval(() => {
                    updateTokenPriceByWBNB();
                }, 10000);
                // (
                //     "lastCloseObject.timerId",
                //     lastCloseObject.timerId,
                //     tokenInfo
                // );
            },
            unsubscribeBars: (subscriberUID) => {
                clearInterval(lastCloseObject.timerId);
            },
        };

        return DataFeedObject;
    };

    useEffect(() => {
        localStorage.setItem("coin_price", bnbPrice);
    }, [bnbPrice]);

    useEffect(() => {
        const updateWBNBPrice = async () => {
            const WBNB_BUSD_PAIR_Contract = new web3.eth.Contract(
                ABI_UNISWAP_V2_PAIR,
                WBNB_BUSD_PAIR
            );
            const _lastBlockNumber = await web3.eth.getBlockNumber();

            WBNB_BUSD_PAIR_Contract.getPastEvents("Swap", {
                fromBlock: _lastBlockNumber - 5,
            }).then((events) => {
                let sum0 = 0,
                    sum1 = 0;
                events.forEach((item) => {
                    const parsedLog = parseSwapLog(item);
                    sum0 += parsedLog.amount0 / 10 ** 18;
                    sum1 += parsedLog.amount1 / 10 ** 18;
                });
                if (sum0 > 0) setBnbPrice(sum1 / sum0);
            });
        };
        const _updateInterval = setInterval(() => {
            updateWBNBPrice();
        }, 10000);
        return () => {
            clearInterval(_updateInterval);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (tokenAddress) {
            setPending(true);
            setTokenInfo({
                ...tokenInfo,
                symbol: "Loading",
                name: "Loading",
                id: tokenAddress,
            });
        } else {
            setPending(true);
            setTokenInfo({
                ...tokenInfo,
                symbol: "Loading",
                name: "Loading",
                id: TitanTokenAddress,
            });
        }
        // eslint-disable-next-line
    }, [tokenAddress]);

    const appendNewLogs = (appendList) => {
        const cachedBnbPrice = parseFloat(localStorage.getItem("coin_price"));

        if (transactionTable.logs) {
            appendList = appendList.filter((item) => {
                item.coinPrice = cachedBnbPrice;
                item.timeStamp = parseInt(new Date().getTime() / 1000);
                return (
                    item.blockNumber > transactionTable.logs.at(0).blockNumber
                );
            });

            transactionTable.logs = appendList.concat(transactionTable.logs);
            // console.log(appendList, transactionTable.logs.length);
            forceUpdate();
        }
    };

    async function doMagic() {
        let interval = localStorage.getItem("tv_interval");
        if (interval === null) {
            localStorage.setItem("tv_interval", 5);
            interval = "5";
        }

        const dataFeeds = ChartDataFeeds();
        const colorTheme = localStorage.getItem("color-theme") || "dark";
        const widgetOptions = {
            debug: false,
            symbol: `${tokenInfo.symbol}-USD`,
            datafeed: dataFeeds,
            interval,
            container: defaultProps.containerId,
            library_path: defaultProps.libraryPath,
            locale: "en",
            disabled_features: ["use_localstorage_for_settings"],
            enabled_features: ["study_templates", "disable_resolution_rebuild"],
            //charts_storage_url: defaultProps.chartsStorageUrl,
            //charts_storage_api_version: defaultProps.chartsStorageApiVersion,
            client_id: defaultProps.clientId,
            user_id: defaultProps.userId,
            fullscreen: defaultProps.fullscreen,
            autosize: defaultProps.autosize,
            studies_overrides: defaultProps.studiesOverrides,
            time_frames: defaultProps.time_frames,
            overrides: {},
            theme: colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1),
            timezone: new window.Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
        };
        tvWdiget = new widget(widgetOptions);

        // ("tableData", tableData, "bnbprice-", bnbPrice);
    }

    async function initializeTokenInformation() {
        setIsInvalid(false);
        const [initialTokenInfo, bnbPrice] = await Promise.all([
            getTokenInformation(queryToken),
            getLatestCoinPrice(),
        ]);
        getPairsFromDEXList(queryToken);

        if (initialTokenInfo === null) {
            setIsInvalid(true);
            return;
        }
        setTokenInfo(initialTokenInfo);
        setBnbPrice(bnbPrice);
    }

    const establishTransactionTable = async () => {
        const _transactionTable = await getSwaplogs(tokenInfo.pair);
        transactionTable = _transactionTable;
        setPending(false);
    };

    useEffect(() => {
        if (isMount === false) {
            if (tokenInfo.symbol === "Loading") {
                initializeTokenInformation();
            } else if (prevTokenInfo?.pair !== tokenInfo.pair) {
                // console.log("Do Magic", tokenInfo);
                // (prevTokenInfo, tokenInfo);
                establishTransactionTable();
                doMagic();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenInfo]);

    const columns = useMemo(
        () => [
            {
                name: "TIME",
                selector: (row) => dateFormat(row.timeStamp),
                sortable: true,
                id: 22,
                sortFunction: (rowA, rowB) => {
                    if (rowA.timeStamp > rowB.timeStamp) {
                        return 1;
                    }

                    if (rowA.timeStamp < rowB.timeStamp) {
                        return -1;
                    }

                    return 0;
                },
            },
            {
                name: "SIDE",
                selector: (row) => row.side,
                sortable: true,
            },
            {
                name: "PRICE USD",
                selector: (row) => row.priceUSD,
                sortable: true,
            },
            {
                name: "PRICE BNB",
                selector: (row) => row.coinPrice,
                sortable: true,
            },
            {
                name: `${tokenInfo.symbol.toUpperCase()} SIZE`,
                selector: (row) => row.quoteAmount,
                sortable: true,
            },
            {
                name: "TOTAL($)",
                selector: (row) => row.totalUSD,
                sortable: true,
            },
            // {
            //     name: "EXCHANGE",
            //     selector: (row) => row.exchange,
            //     sortable: true,
            // },
            {
                name: "TX",
                sortable: true,
                cell: (row) => (
                    <a
                        href={row.transactionHash}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2"
                    >
                        <img
                            src={liquid}
                            alt="liquid"
                            className="w-8 h-8 bg-white rounded-full"
                        />
                        TxHash
                    </a>
                ),
            },
        ],
        [tokenInfo]
    );
    return (
        <div className="flex flex-col pb-6">
            <div className="flex flex-col lg:flex-row gap-4 py-4">
                <div className="lg:w-2/3">
                    <div
                        id="tv_chart_container"
                        className="h-full min-h-[400px] rounded-2xl component-container overflow-hidden shadow-lg"
                    >
                        {isInvalid ? (
                            <div className="animation-fade-in flex flex-col h-full justify-center">
                                <img
                                    className="mx-auto w-80"
                                    alt="invalid token"
                                    src={Invalid_Token_Img}
                                />
                                <h5 className="text-center text-black dark:text-white">
                                    Invalid Token Address!
                                </h5>
                            </div>
                        ) : (
                            <div className="animation-fade-in flex flex-col h-full justify-center">
                                <img
                                    className="mx-auto w-80"
                                    alt="searhing token"
                                    src={Searching_Img}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:w-1/3">
                    <div className="">
                        <Iframe
                            url={`https://titanx-pancakeswap.netlify.app/?outputCurrency=${tokenInfo.id}`}
                            height="600px"
                            width="500px"
                            className="w-full rounded-2xl overflow-hidden shadow-lg"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center shadow-lg overflow-hidden token-trasaction-table component-container rounded-2xl text-black dark:text-white">
                <DataTable
                    title={
                        <div className="flex text-yellow items-center">
                            <img
                                src={checksumedAddressImgLink(tokenInfo.id)}
                                className="w-12 h-12 rounded-full"
                                alt={`${tokenInfo.id}`}
                                onError={(e) => {
                                    e.target.src = "/images/unknown.svg";
                                }}
                            />
                            <span className="ml-2">
                                {tokenInfo.symbol.toUpperCase()} TRANSACTIONS
                            </span>
                        </div>
                    }
                    columns={columns}
                    data={parseTxSwapLog(transactionTable?.logs, tokenInfo)}
                    defaultSortFieldId={22}
                    defaultSortAsc={false}
                    progressPending={pending}
                    progressComponent={<LoadingBar text="" />}
                    theme="solarized"
                />
                <div className="px-12 rounded-lg shadow-lg text-center">
                    Load More
                </div>
            </div>
            <button className="hidden rdt_Pagination rdt_TableRow rdt_TableHeadRow"></button>
        </div>
    );
};
export default ChartSwapTxTable;

createTheme("solarized", {
    text: {
        primary: "unset",
    },
    background: {
        default: "transparent",
    },
});
