import React from "react";
import { getEllipsisTxt } from "../../helpers/formatters";
import { useNetworkScanURL } from "../../hooks";

const PreInfoCard = ({ preSaleinfoArray, tokenAddress, presaleAddress }) => {
    const NETWORK_SCAN_URL = useNetworkScanURL();
    const contractUrlOnScan = (_address) => {
        return `${NETWORK_SCAN_URL}${_address}`;
    };
    return (
        <div className="flex flex-col">
            <div className="font-semibold size-2 py-4 text-center">
                Presale Information
            </div>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
            <div className="flex flex-col p-4 gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span>Token Address</span>
                        <span className="size-xs text-[#FF4F0E]">
                            Do not send funds direct to token address!
                        </span>
                    </div>
                    <span className="text-itemIndigo dark:text-itemPurple">
                        {tokenAddress === null ? (
                            ".........."
                        ) : (
                            <a
                                href={contractUrlOnScan(tokenAddress)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {getEllipsisTxt(tokenAddress)}
                            </a>
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Presale Address</span>
                    <span className="text-itemIndigo dark:text-itemPurple">
                        {presaleAddress === null ? (
                            ".........."
                        ) : (
                            <a
                                href={contractUrlOnScan(presaleAddress)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {getEllipsisTxt(presaleAddress)}
                            </a>
                        )}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Listing on</span>
                    <a
                        href="https://pancakeswap.finance/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-itemIndigo dark:text-itemPurple"
                    >
                        Pancakeswap
                    </a>
                </div>

                {preSaleinfoArray &&
                    preSaleinfoArray.map((el, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center"
                        >
                            <span className="name">{el.name}</span>
                            <span className="number">{el.number}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default PreInfoCard;
