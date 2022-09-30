import React, { useEffect, useState } from "react";

import { AiFillPieChart } from "react-icons/ai";
import { BsShieldLockFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";

import TokenStatus from "../../UI/TokenStatus";
import TokenTimer from "../../UI/TokenTimer";
import {
    getTokenLink,
    PREMIUM_PARTNERS,
    PREMIUM_PRESALES,
} from "../../../utils/constants";
import LinkWithSearchParams from "../../UI/LinkWithSearchParams";
import { getPartnerDetails } from "../../../utils/apis";

const LaunchPadCard = (props) => {
    const {
        offChainData,
        presaleAddress,
        audit,
        name,
        softCap,
        hardCap,
        progress,
        liquidity,
        lockupTime,
        preSaleStartTime,
        preSaleEndTime,
        minCon,
        maxCon,
        presaleState,
        status,
        projectStore,
    } = props;

    const [partnerKYCDetails, setPartnerKYCDetails] = useState({});
    useEffect(() => {
        const loadPartnerInfo = async () => {
            const _partnerKYCDetails = await getPartnerDetails(
                projectStore.partnerAddress
            );
            setPartnerKYCDetails(_partnerKYCDetails);
        };
        if (projectStore.partnerAddress) loadPartnerInfo();
        // eslint-disable-next-line
    }, []);
    return (
        <LinkWithSearchParams
            to={{
                pathname: `/dashboard/presale/${presaleAddress}`,
            }}
            className={`flex flex-col card-component card-component-${
                parseInt(presaleAddress.slice(0, 4)) % 4
            } pb-4 relative ${
                PREMIUM_PRESALES.includes(presaleAddress)
                    ? "premium-presale"
                    : ""
            }`}
        >
            {PREMIUM_PARTNERS.includes(projectStore.partnerAddress) && (
                <img
                    className="absolute z-[2] w-12 h-12 border-2 border-orange-400 rounded-full"
                    src={partnerKYCDetails.logo_link}
                    alt="premium badge"
                />
            )}
            <div
                className={`absolute presale-card-bg`}
                // style={{
                //     backgroundImage: getTokenLink(offChainData, "banner")
                //         ? `url(${getTokenLink(offChainData, "banner")})`
                //         : "",
                // }}
            />
            <div className="top-content pt-2 z-[2]">
                <div className="flex justify-center items-center">
                    {audit && (
                        <div
                            className={`status ${presaleState}`}
                            style={{
                                background: "#C4D7F0",
                                borderRadius: "14px",
                            }}
                        >
                            {audit}
                        </div>
                    )}
                    <div className="ml-auto mr-2 flex gap-2">
                        {projectStore.isKYC && (
                            <div
                                className="rounded-lg bg-[#44C40033] hover:bg-[#44C40066] duration-150 p-1 flex flex-row gap-x-1 items-center cursor-pointer text-white"
                                onClick={() => {
                                    if (projectStore.isKYC)
                                        window.open(
                                            projectStore.isKYCLink,
                                            "_black"
                                        );
                                }}
                            >
                                <FaCheckCircle />
                                <span className="text-center size-xs">KYC</span>
                            </div>
                        )}
                        {projectStore.isAudited && (
                            <div
                                className="rounded-lg bg-[#44C40033] hover:bg-[#44C40066] duration-150 p-1 flex flex-row gap-x-1 items-center cursor-pointer text-white"
                                onClick={() => {
                                    if (projectStore.isAudited)
                                        window.open(
                                            projectStore.isAuditLink,
                                            "_black"
                                        );
                                }}
                            >
                                <FaCheckCircle />
                                <span className="text-center size-xs">
                                    Audit
                                </span>
                            </div>
                        )}
                        <TokenStatus presaleStatus={status} />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col w-full pl-2 text-white">
                        <span className="size-2 font-semibold">{name}</span>
                        <span className="size-base mt-4 font-semibold ">
                            {softCap} BNB - {hardCap} BNB
                        </span>
                        <span className="size-sm">Soft/Hard Cap:</span>
                    </div>
                </div>
                <div className="flex flex-row justify-end h-24">
                    <img
                        src={getTokenLink(offChainData)}
                        alt="ProfilePicture"
                        className="w-24 2xl:w-28 h-24 2xl:h-28 presale-logo -translate-y-1/3"
                    />
                </div>
            </div>
            <div className="flex flex-col z-[2] pl-4 pb-1">
                <span className="size-2 presale-span-about font-semibold">
                    About
                </span>
                <span className="size-xs px-4 text-[#CDCDCD] presale-description">
                    {offChainData.description}
                </span>
            </div>
            <div className="flex flex-col z-[2] text-[#CDCDCD]">
                <span className="size-xs">
                    PROGRESS ({((progress / hardCap) * 100).toFixed(2)}%)
                </span>
                <span className="relative h-2">
                    <span className="absolute w-full h-full presale-progress-panel"></span>
                    <span
                        className="absolute h-full presale-progress-bar"
                        style={{ width: `${(progress / hardCap) * 100}%` }}
                    ></span>
                </span>
                <span className="flex justify-between">
                    <span className="size-xs">{minCon} BNB</span>
                    <span className="size-xs">{maxCon} BNB</span>
                </span>
            </div>
            <div className="flex flex-row z-[2] justify-between py-2 px-2 size-sm">
                <div className="flex flex-col presale-span-about font-semibold gap-2">
                    <span className="flex items-center">
                        <AiFillPieChart className="size-1 mr-1 text-black dark:text-[#CDCDCD]" />
                        Liquidity%
                    </span>
                    <span className="flex items-center">
                        <BsShieldLockFill className="size-1 mr-1 text-black dark:text-[#CDCDCD]" />
                        Lockup Time
                    </span>
                    {/* <span>Sale starts in:</span> */}
                </div>

                <div className="flex flex-col text-right font-medium gap-2">
                    <span>{liquidity}%</span>
                    <span>
                        {Math.floor(
                            (lockupTime - new Date().getTime() / 1000) /
                                (60 * 60 * 24)
                        )}{" "}
                        DAYS
                    </span>
                </div>
            </div>
            <div className="w-full px-2 h-6">
                <TokenTimer
                    status={status}
                    preSaleStartTime={preSaleStartTime}
                    preSaleEndTime={preSaleEndTime}
                    lockupTime={lockupTime}
                />
            </div>
            <div className="w-full flex py-1">
                <button className="size-sm py-1 text-[#E3E3E3] mx-6 w-full">
                    View Presale
                </button>
            </div>
        </LinkWithSearchParams>
    );
};
export default LaunchPadCard;
