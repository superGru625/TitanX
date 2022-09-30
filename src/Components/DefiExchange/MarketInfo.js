import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { TokenInfo, BNBPrice } from "./Defaults";
import {
    checksumedAddressImgLink,
    floatConverter,
    numberConverter,
} from "../../utils/utils";
import { GiMineWagon } from "react-icons/gi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import {
    AiFillPieChart,
    AiOutlineSwap,
    AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { SiSolidity } from "react-icons/si";

const MarketInfo = () => {
    const [tokenInfo] = useRecoilState(TokenInfo);
    const [bnbPrice] = useRecoilState(BNBPrice);

    const bnbPriceRef = useRef(null);
    const tokenPriceRef = useRef(null);

    useEffect(() => {
        if (bnbPrice) {
            bnbPriceRef.current.classList.add("animate-ping");
            setTimeout(() => {
                bnbPriceRef.current.classList.remove("animate-ping");
            }, 2000);
        }
    }, [bnbPrice]);

    useEffect(() => {
        if (tokenInfo) {
            tokenPriceRef.current.classList.add("animate-ping");
            setTimeout(() => {
                tokenPriceRef.current.classList.remove("animate-ping");
            }, 2000);
        }
        //animation-ping-once
    }, [tokenInfo]);

    const TotalSupply = Math.round(
        parseFloat(tokenInfo.minted - tokenInfo.burned)
    );

    const liqudityArray = [
        {
            title: `Contract`,
            icon: <SiSolidity className="text-slate-300 size-1" />,
            link: `https://bscscan.com/token/${tokenInfo.id}#code`,
        },
        {
            title: `Transactions`,
            icon: <AiOutlineSwap className="text-slate-300 size-1" />,
            link: `https://bscscan.com/token/${tokenInfo.id}`,
        },
        {
            title: `Holders`,
            icon: <AiOutlineUsergroupAdd className="text-slate-300 size-1" />,
            link: `https://bscscan.com/token/${tokenInfo.id}#balances`,
        },
    ];
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div
                className={`flex rounded-2xl max-w-full overflow-y-visible overflow-x-auto px-2 py-1 ${
                    tokenInfo.symbol === "Loading"
                        ? " pointer-events-none grayscale"
                        : ""
                }`}
            >
                <div className="market-info-card min-w-[15rem] px-8 lg:px-4">
                    <img
                        ref={tokenPriceRef}
                        src={checksumedAddressImgLink(tokenInfo.id)}
                        className="w-12 h-12 rounded-full"
                        alt={`${tokenInfo.id}`}
                        onError={(e) => {
                            e.target.src = "/images/unknown.svg";
                        }}
                    />
                    <div className="flex flex-col text-black dark:text-white size-base">
                        <span className="text-itemIndigo dark:text-itemPurple font-bold">
                            {tokenInfo.symbol}/
                            {tokenInfo.symbol === "WBNB" ? "BUSD" : "WBNB"}
                        </span>
                        ${floatConverter(tokenInfo.price)}
                    </div>
                </div>
                <div className="market-info-card ml-4" title="BNB Price">
                    <div
                        ref={bnbPriceRef}
                        className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center"
                    >
                        <BsFillLightningChargeFill className="text-yellow size-1" />
                    </div>
                    <div className="flex flex-col text-black dark:text-white size-base items items-start">
                        <span className="text-black dark:text-white font-medium">
                            BNB Price
                        </span>
                        <span className=" text-itemIndigo dark:text-itemPurple">
                            ${numberConverter(bnbPrice)}
                        </span>
                    </div>
                </div>
                <a
                    href={`https://pancakeswap.finance/swap?outputCurrency=${tokenInfo.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="market-info-card ml-4"
                    title="By token on PancakeSwap"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <img
                            className="w-12 h-12 rounded-full"
                            src="/images/Pancakeswap.svg"
                            alt="buy on pancakeswap"
                        />
                    </div>
                    <div className="flex flex-col text-black dark:text-white size-base items items-start">
                        <span className="text-black dark:text-white font-medium">
                            Buy {tokenInfo.symbol}
                        </span>
                    </div>
                </a>
                <div
                    className="market-info-card ml-4"
                    title="Circulating Supply"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <GiMineWagon className="text-slate-300 size-1" />
                    </div>
                    <div className="flex flex-col text-black dark:text-white size-base items items-start">
                        <span className="text-black dark:text-white font-medium">
                            C.Supply
                        </span>
                        <span className=" text-itemIndigo dark:text-itemPurple">
                            {numberConverter(TotalSupply, 3)}
                        </span>
                    </div>
                </div>
                <div className="market-info-card ml-4">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <AiFillPieChart className="text-slate-300 size-1" />
                    </div>
                    <div className="flex flex-col text-black dark:text-white size-base items-start">
                        <span className="text-black dark:text-white font-medium">
                            Market Cap
                        </span>
                        <span className=" text-itemIndigo dark:text-itemPurple">
                            {"$"}
                            {numberConverter(
                                parseInt(
                                    parseFloat(
                                        tokenInfo.minted - tokenInfo.burned
                                    ) * tokenInfo.price
                                )
                            )}
                        </span>
                    </div>
                </div>
                {liqudityArray.map((el, i) => (
                    <a
                        className="market-info-card ml-4"
                        key={i}
                        href={el.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                            {el.icon}
                        </div>
                        <span className="text-black dark:text-white font-medium size-base">
                            {el.title}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default MarketInfo;
