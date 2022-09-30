import React, { useEffect, useState } from "react";
import { getTokenLink } from "../../../utils/constants";
import { sec2Format } from "../../../utils/utils";
import StealthStatus from "../../UI/StealthStatus";

const StealthDescription = ({ stealthData }) => {
    const [currentTime, setCurrentTime] = useState();

    useEffect(() => {
        const forceUpdateInterval = setInterval(() => {
            setCurrentTime(Date.now() / 1000);
        }, 1000);
        return () => {
            clearInterval(forceUpdateInterval);
        };
    }, []);

    return (
        <div className="flex flex-col">
            <div className="font-semibold p-4 flex justify-between items-center">
                <span className="size-2">Stealth Started</span>
                <span className="size-1">
                    {sec2Format(currentTime - stealthData.launchTime)} ago
                </span>
            </div>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
            <div className="flex flex-col p-4 gap-3">
                <div className="flex items-center">
                    <img
                        src={getTokenLink(stealthData.offChainData)}
                        className="w-24 2xl:w-32 h-24 2xl:h-32 presale-logo"
                        alt="stealth logo"
                    />
                    <div className="ml-4">
                        <span className="size-base font-semibold">
                            {stealthData.token0Symbol}
                        </span>
                        <br /> ({stealthData.token0Name})
                    </div>
                    <div className="ml-auto">
                        <StealthStatus stealthData={stealthData} />
                    </div>
                </div>
                <span className="font-bold size-1">About</span>
                <span className="text-comment">
                    {stealthData.offChainData.description}
                </span>
                <a
                    className="button bg-mainOrange mr-auto size-sm text-white flex"
                    href={`https://pancakeswap.finance/swap?outputCurrency=${stealthData.token0}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Buy on PancakeSwap
                    <img
                        src="/images/Pancakeswap.svg"
                        className="ml-3"
                        alt="PCS V2"
                    />
                </a>
            </div>
        </div>
    );
};

export default StealthDescription;
