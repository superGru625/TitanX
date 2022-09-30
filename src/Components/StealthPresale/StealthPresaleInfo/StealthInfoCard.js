import React from "react";
import { getEllipsisTxt } from "../../../helpers/formatters";
import { useNetworkScanURL } from "../../../hooks";
import LinkWithSearchParams from "../../UI/LinkWithSearchParams";

const StealthInfoCard = ({
    stealthInfoArray,
    token0Address,
    stealthAddress,
}) => {
    const NETWORK_SCAN_URL = useNetworkScanURL();
    const contractUrlOnScan = (_address) => {
        return `${NETWORK_SCAN_URL}${_address}`;
    };
    return (
        <div className="flex flex-col h-full">
            <div className="font-semibold size-2 p-4">Presale Information</div>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
            <div className="flex flex-col p-4 gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span>Token Address</span>
                        <span className="size-xs text-[#FF4F0E]">
                            Do not send funds direct to
                            <br /> the token address!
                        </span>
                    </div>
                    <span className="text-itemIndigo dark:text-itemPurple">
                        {token0Address === null ? (
                            ".........."
                        ) : (
                            <a
                                href={contractUrlOnScan(token0Address)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {getEllipsisTxt(token0Address)}
                            </a>
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Stealth Address</span>
                    <span className="text-itemIndigo dark:text-itemPurple">
                        {stealthAddress === null ? (
                            ".........."
                        ) : (
                            <a
                                href={contractUrlOnScan(stealthAddress)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {getEllipsisTxt(stealthAddress)}
                            </a>
                        )}
                    </span>
                </div>

                {stealthInfoArray &&
                    stealthInfoArray.map((el, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center"
                        >
                            <span className="name">{el.name}</span>
                            <span className="number">{el.number}</span>
                        </div>
                    ))}
            </div>
            {
                <LinkWithSearchParams
                    to={{
                        pathname: `/dashboard/manage-stealth/${stealthAddress}`,
                    }}
                    className="button hidden bg-emerald-600 mt-auto mb-4 px-6 mx-auto size-sm text-white"
                >
                    Manage Your Stealth
                </LinkWithSearchParams>
            }
        </div>
    );
};
export default StealthInfoCard;
