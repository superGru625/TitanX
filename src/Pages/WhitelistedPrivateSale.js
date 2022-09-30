import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

import WHITELISTED_CROWD_FUNDING_ABI from "../abis/WHITELISTED_CROWD_FUNDING_ABI.json";
import CROWD_FUNDING_ABI from "../abis/CROWD_FUNDING_ABI.json";
import TimeCounter from "../Components/TimeCounter/TimeCounter";
import {
    useRpcURL,
    useValidAccount,
    useWhitelistedCrowdFundingAddress,
    useCrowdFundingAddress,
} from "../hooks";
import { RPC_URLS } from "../connector";

const WhitelistedPrivateSale = () => {
    const WHITELISTED_CROWD_FUNDING_ADDRESS =
        useWhitelistedCrowdFundingAddress();
    const CROWD_FUNDING_ADDRESS = useCrowdFundingAddress();
    const HTTP_RPC_URL = useRpcURL();
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const { library } = useWeb3React();
    const { account } = useValidAccount();

    const bnbRef = useRef(null);

    const [hardCap, setHardCap] = useState(0);
    const [weiRaised, setWeiRaised] = useState(0);
    const [startTime, setStartTime] = useState(new Date().getTime() / 1000);
    const [endTime, setEndTime] = useState(new Date().getTime() / 1000);
    const [minBuy, setMinBuy] = useState(0);
    const [maxBuy, setMaxBuy] = useState(0);

    const [contributersValue_1, setContributersValue_1] = useState(0);
    const [contributersValue, setContributersValue] = useState(0);
    const tokenRate = "750k";

    const [, /*whitelisted*/ setWhitelisted] = useState(false);
    // const [tokenRate, setTokenRate] = useState(0);
    useEffect(() => {
        const forceUpdateInterval = setInterval(() => forceUpdate(), 1000);
        const loadContractDataInterval = setInterval(() => {
            loadContractData();
        }, 60000);
        return () => {
            clearInterval(forceUpdateInterval);
            clearInterval(loadContractDataInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (account) loadContractData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, RPC_URLS]);

    const loadContractData = async () => {
        try {
            const provider = new Web3(
                new Web3.providers.HttpProvider(HTTP_RPC_URL)
            );
            window.web3 = new Web3(library ? library.provider : provider);
            const _fundingContract = await new window.web3.eth.Contract(
                WHITELISTED_CROWD_FUNDING_ABI,
                WHITELISTED_CROWD_FUNDING_ADDRESS
            );
            const _fundingContract_1 = await new window.web3.eth.Contract(
                CROWD_FUNDING_ABI,
                CROWD_FUNDING_ADDRESS
            );
            const _weiHardCap = await _fundingContract.methods
                .weiHardCap()
                .call();
            const _minBuy = await _fundingContract.methods.minBuy().call();
            setMinBuy(window.web3.utils.fromWei(_minBuy.toString(), "ether"));
            const _maxBuy = await _fundingContract.methods.maxBuy().call();
            setMaxBuy(window.web3.utils.fromWei(_maxBuy.toString(), "ether"));
            const _weiRaised = await _fundingContract.methods
                .weiRaised()
                .call();
            const _startTime = await _fundingContract.methods
                .startTime()
                .call();
            setStartTime(_startTime);
            const _endTime = await _fundingContract.methods.endTime().call();
            setEndTime(_endTime);

            const _contributersValue = await _fundingContract.methods
                .ContributersValue(account)
                .call();

            const _contributersValue_1 = await _fundingContract_1.methods
                .ContributersValue(account)
                .call();
            const _isWhiteListed = await _fundingContract.methods
                .isWhitelisted(account)
                .call();
            setWhitelisted(_isWhiteListed);
            // const _tokenRate = await _fundingContract.methods.tokenRate().call();
            setHardCap(
                window.web3.utils.fromWei(_weiHardCap.toString(), "ether")
            );
            setWeiRaised(
                window.web3.utils.fromWei(_weiRaised.toString(), "ether")
            );
            setContributersValue(
                window.web3.utils.fromWei(
                    _contributersValue.toString(),
                    "ether"
                )
            );
            setContributersValue_1(
                window.web3.utils.fromWei(
                    _contributersValue_1.toString(),
                    "ether"
                )
            );
        } catch (error) {
            console.log(65, error);
        }
        // console.log("_tokenRate", _tokenRate);
    };

    const contributeBNB = async () => {
        const web3 = new Web3(Web3.givenProvider);
        const _wei = web3.utils.toWei(bnbRef.current.value, "ether");
        await web3.eth.sendTransaction({
            from: account,
            to: WHITELISTED_CROWD_FUNDING_ADDRESS,
            value: _wei,
        });
        toast.success(`Successfully Sent BNB!`, {
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
        loadContractData();
    };
    return (
        <div className="main-container component-container animation-fade-in p-3 md:p-6 2xl:p-8 flex flex-col items-center gap-y-6">
            <h3>Private Sale's Sold Out</h3>
            <span className="size-base">
                If missed this opportunity, do not worry,
                <br /> our presale begins on April 28th. There is still
                <br /> opportunity to get in and get involved early.
            </span>
            <div className="flex flex-row justify-center gap-4">
                <div className="flex flex-col items-center">
                    <button className="bg-itemIndigo dark:bg-itemPurple text-white rounded-full md:w-48">
                        30 BNB
                    </button>
                    <span className="text-center">
                        Round 1 - Your contributed amount ({contributersValue_1}{" "}
                        BNB)
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button className="bg-itemIndigo dark:bg-itemPurple text-white rounded-full md:w-48">
                        70 BNB
                    </button>
                    <span className="text-center">
                        Round 2 - Your contributed amount ({contributersValue}{" "}
                        BNB)
                    </span>
                </div>
            </div>
            <span className="size-1">
                Apply for TitanX whitelisted presale on April 28th
            </span>
            <a
                href="https://gleam.io/competitions/9DYqn-Títan-x"
                target={"_blank"}
                rel="noreferrer"
            >
                <button className="button bg-yellow rounded-full text-white w-40">
                    Apply
                </button>
            </a>
        </div>
    );
    // eslint-disable-next-line no-unreachable
    return (
        <div className="main-container component-container animation-fade-in p-3 md:p-6 2xl:p-8 flex flex-col">
            <span className="text-right size-base">
                {startTime > new Date().getTime() / 1000
                    ? "Starts in - "
                    : endTime > new Date().getTime() / 1000
                    ? "Ends in - "
                    : "Ended"}
                {startTime > new Date().getTime() / 1000 ? (
                    <TimeCounter
                        time={(startTime - new Date().getTime() / 1000) / 3600}
                    />
                ) : endTime > new Date().getTime() / 1000 ? (
                    <TimeCounter
                        time={(endTime - new Date().getTime() / 1000) / 3600}
                    />
                ) : (
                    ""
                )}
            </span>
            <span className="font-semibold size-3">
                TitanX Whitelisted Private Sale
            </span>
            <div className="flex flex-col lg:flex-row gap-x-32 2xl:gap-x-48 gap-y-3 mt-4 lg:mt-12 justify-center">
                <span className="text-itemIndigo dark:text-itemPurple size-base w-full lg:w-1/3 p-2 md:p-4">
                    All great stories start with a simple beginning. If your
                    beginning could be guaranteed to net you 10% greater reward,
                    wouldn't you take it? Begin your journey right and come
                    along with us and our dedicated team to see it through. We
                    are in this together
                    <br />
                    <br />
                    <br />
                    Private Sale Round 1 = 750k Títan per BNB <br />
                    Private Sale Round 2 = 750k Títan per BNB <br />
                    Presale = 650k Títan per BNB
                </span>
                <div className="flex flex-col justify-center w-full lg:w-1/3">
                    <span className="uppercase size-2 font-semibold pb-3">
                        Round 2 - {weiRaised}/{hardCap} BNB
                    </span>
                    <div className="border border-itemIndigo bg-[#440AD322] dark:bg-[#6e00ff22] rounded-full h-4 overflow-hidden">
                        <div
                            className="presale-progress-bar bg-[#440AD3] dark:bg-[#6e00ff] h-full relative"
                            style={{
                                width: `${(weiRaised / hardCap) * 100.0}%`,
                            }}
                        />
                    </div>
                    <div className="flex flex-row justify-between px-2">
                        <span>0 BNB</span>
                        <span>{hardCap} BNB</span>
                    </div>
                    <div className="relative mt-3 w-fit mx-auto">
                        <input
                            className="border-none bg-[#F1F1FA] placeholder-[#CDD0D2] rounded-full w-80 pl-4"
                            placeholder={`1 BNB = ${tokenRate} Títan`}
                            ref={bnbRef}
                        />
                        <button
                            className="absolute text-white right-0 h-full size-base py-0 px-4 border-2 border-[#F1F1FA] rounded-full bg-itemIndigo dark:bg-itemPurple hover:opacity-70"
                            onClick={contributeBNB}
                        >
                            Contribute
                        </button>
                    </div>
                    <span className="text-center size-sm mt-2">
                        Your contributed amount [{contributersValue} BNB]
                    </span>
                    <div className="my-4 py-2 font-medium text-[#62AB06] dark:text-white border-[1px] rounded-full border-[#62AB06] bg-[#3FE23166] w-96 mx-auto text-center">
                        Presale is now open to public.
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>Minimum Contribute: {minBuy} BNB</span>
                        <span>Maximum Contribute: {maxBuy} BNB</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-row relative font-semibold text-base lg:mx-12 my-3 lg:my-12">
                <div className="absolute top-7 h-4 rounded-full w-full bg-[#4A00FF4D] dark:bg-emerald-900"></div>
                <div className="relative flex flex-col items-center w-2/12">
                    <span className="uppercase opacity-70 leading-5 size-sm">
                        Round 1
                    </span>
                    <div className="w-full flex relative h-8">
                        {endTime < new Date().getTime() / 1000 && (
                            <>
                                <div className="h-2 ml-2 mt-3 w-[calc(100%-1.5rem)] rounded-full bg-pink-700 static z-[1]" />
                                <div className="absolute h-4 w-4 right-2 top-2 rounded-full bg-pink-700 z-[1]" />
                            </>
                        )}
                        <div className="absolute h-8 w-8 right-0 rounded-full bg-[#C4C4C4]" />
                    </div>
                    <span className="text-center">
                        Títan Community
                        <br />
                        Offering
                    </span>
                </div>
                <div className="relative flex flex-col items-center w-3/12">
                    <span className="uppercase opacity-70 leading-5 size-sm">
                        Round 2
                    </span>
                    <div className="h-8 w-8 ml-auto rounded-full bg-[#C4C4C4]" />
                    <span className="text-center">
                        Private Sale
                        <br />
                        Offering
                    </span>
                </div>
                <div className="relative flex flex-col items-center w-7/12">
                    <span className="uppercase opacity-70 leading-5 size-sm">
                        Round 3
                    </span>
                    <div className="h-8 w-8 ml-auto rounded-full bg-[#C4C4C4]" />
                    <span className="text-center">
                        Whitelisted
                        <br />
                        Presale
                    </span>
                </div>
            </div>
        </div>
    );
};
export default WhitelistedPrivateSale;
