import React, { useRef } from "react";
import toast from "react-hot-toast";

import {
    PRESALE_UPCOMING,
    PRESALE_FILLED,
    PRESALE_CANCELED,
    PRESALE_ENDED,
    PRESALE_ENDED_NOT_MET_SOFTCAP,
    MAX_UINT256,
    PRESALE_FINALISED,
} from "../../utils/constants";

import { numberConverter } from "../../utils/utils";

import ERC20Abi from "../../abis/ERC20.json";
import TokenTimer from "../UI/TokenTimer";
import { usePCSRouterV2 } from "../../hooks";

const ContributeAndClaim = ({
    presaleData,
    preSaleAddress,
    account,
    preSaleContract,
    presaleStatus,
    tokenAddress,
    forceUpdate,
}) => {
    const valueConRef = useRef(null);
    const PCS_ROUTER_V2 = usePCSRouterV2();

    const contribute = async () => {
        if (valueConRef.current.value > 0 && preSaleContract !== null) {
            try {
                await window.web3.eth.sendTransaction({
                    to: preSaleAddress,
                    from: account,
                    value: window.web3.utils.toWei(
                        valueConRef.current.value.toString(),
                        "ether"
                    ),
                });
                forceUpdate();
                toast.success("Contributed Successfully!", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    };
    const claimTokens = async () => {
        try {
            await preSaleContract.methods
                .claimTokensForContribution()
                .send({ from: account });
            forceUpdate();
        } catch (error) {
            console.log(error.message);
        }
    };
    const claim = async () => {
        console.log(account);
        try {
            console.log(preSaleContract.methods);
            await preSaleContract.methods
                .claimBackContributionFree()
                .send({ from: account });
            forceUpdate();
        } catch (error) {
            console.log(error.message);
        }
    };

    const approvePCSV2 = async () => {
        try {
            const web3 = window.web3;
            const tokenContract = await new web3.eth.Contract(
                ERC20Abi.abi,
                tokenAddress
            );

            await tokenContract.methods
                .approve(PCS_ROUTER_V2, MAX_UINT256)
                .send({ from: account });
        } catch (error) {
            console.log(error);
        }
    };

    const boxActionUIs = () => {
        switch (presaleStatus) {
            case PRESALE_UPCOMING:
                return (
                    <div className="size-1 w-3/4 mx-auto my-4">
                        <TokenTimer
                            status={presaleStatus}
                            currentTime={new Date().getTime() / 1000}
                            preSaleStartTime={presaleData.preSaleStartTime}
                            preSaleEndTime={presaleData.preSaleEndTime}
                            lockupTime={presaleData.lockupTime}
                        />
                    </div>
                );
            case PRESALE_FILLED:
            case PRESALE_ENDED:
                return (
                    <>
                        <span className="size-2 w-3/4 mx-auto my-3">
                            Presale reached cap, Waiting on developer to
                            finalise.
                        </span>
                        <button
                            className="bg-[#1fc7d4] text-white w-3/4 mx-auto mb-5 flex items-center justify-center gap-2"
                            onClick={approvePCSV2}
                        >
                            <img src="/images/Pancakeswap.svg" alt="PCS V2" />
                            Approve PCS
                        </button>
                    </>
                );

            case PRESALE_FINALISED:
                return (
                    <>
                        <button
                            className="bg-[#7F3DFF] text-white w-3/4 mx-auto mb-5"
                            onClick={claimTokens}
                        >
                            Claim Your Tokens
                        </button>

                        <button
                            className="bg-[#1fc7d4] text-white w-3/4 mx-auto mb-5 flex items-center justify-center gap-2"
                            onClick={approvePCSV2}
                        >
                            <img src="/images/Pancakeswap.svg" alt="PCS V2" />
                            Approve PCS
                        </button>
                    </>
                );
            case PRESALE_CANCELED:
            case PRESALE_ENDED_NOT_MET_SOFTCAP:
                return (
                    <button
                        className="bg-[#7F3DFF] text-white w-3/4 mx-auto mb-5"
                        onClick={claim}
                    >
                        Claim Contribution
                    </button>
                );
            default:
                // CASE TOKEN_PRESALE_DURING
                return (
                    <div className="flex flex-col items-center py-3">
                        {inputUI()}
                    </div>
                );
        }
    };

    const inputUI = () => {
        // if (presaleStatus == PRESALE_INPROGRESS)
        return (
            <div className="w-full lg:w-3/4 flex relative">
                <input
                    ref={valueConRef}
                    type="text"
                    className="rounded-full w-full pl-4"
                    placeholder={`1 BNB = ${presaleData.presaleRate} ${presaleData.tokenSymbol}`}
                />

                <button
                    className="right-0 h-full absolute bg-[#7F3DFF] text-white"
                    onClick={contribute}
                >
                    Contribute
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col px-4 justify-center text-center">
            <span className="size-2 py-2 font-semibold">
                {presaleData.tokenSymbol}
            </span>
            <span>Soft/Hard Cap:</span>
            <span className="size-1 text-itemIndigo dark:text-itemPurple font-semibold">
                {presaleData.softCap} BNB - {presaleData.hardCap} BNB
            </span>
            <span className="size-base font-semibold">
                {presaleData.progress} BNB / {presaleData.hardCap} BNB
            </span>

            <span className="relative h-3 text-left mx-4">
                <span className="absolute w-full h-full rounded-full bg-[#440AD34D]"></span>
                <span
                    className="absolute h-full presale-progress-bar rounded-full bg-[#440AD3]"
                    style={{
                        width: `${
                            (presaleData.progress / presaleData.hardCap) * 100
                        }%`,
                    }}
                ></span>
            </span>
            <span className="flex justify-between mx-5 font-medium">
                <span className="size-sm">{presaleData.minCon} BNB</span>
                <span className="size-sm">{presaleData.maxCon} BNB</span>
            </span>

            {boxActionUIs()}

            <div className="flex justify-around size-sm pt-6">
                <div className="flex flex-col items-center gap-2">
                    <span>Your contributed amount</span>
                    <span className="border-2 rounded-full border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple w-fit py-2 px-6 font-medium">
                        {presaleData.contribution} BNB
                    </span>
                </div>
                <div className="w-[1px] bg-[#BBB9B966] h-full"></div>
                <div className="flex flex-col items-center gap-2">
                    <span>Amount of purchased tokens</span>
                    <span className="border-2 rounded-full border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple w-fit py-2 px-6 font-medium">
                        {numberConverter(
                            presaleData.presaleRate * presaleData.contribution
                        )}{" "}
                        {presaleData.tokenSymbol}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default ContributeAndClaim;
