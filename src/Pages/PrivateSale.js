import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

import { CROWD_FUNDING_ADDRESS } from "../utils/constants";
import CROWD_FUNDING_ABI from "../abis/CROWD_FUNDING_ABI.json";
import TimeCounter from "../Components/TimeCounter/TimeCounter";

const PrivateSale = () => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const { active, account } = useWeb3React();

    const bnbRef = useRef(null);

    const [hardCap, setHardCap] = useState(0);
    const [weiRaised, setWeiRaised] = useState(0);
    const [startTime, setStartTime] = useState(new Date().getTime() / 1000);
    const [endTime, setEndTime] = useState(new Date().getTime() / 1000);
    const [, setMinBuy] = useState(0);

    const [contributersValue, setContributersValue] = useState(0);
    const tokenRate = "750k";
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
    }, []);
    useEffect(() => {
        account && loadContractData();
    }, [account, active]);

    const loadContractData = async () => {
        const web3 = new Web3(Web3.givenProvider);
        const _fundingContract = await new web3.eth.Contract(
            CROWD_FUNDING_ABI,
            CROWD_FUNDING_ADDRESS
        );
        const _weiHardCap = await _fundingContract.methods.weiHardCap().call();
        const _minBuy = await _fundingContract.methods.minBuy().call();
        setMinBuy(_minBuy);

        const _weiRaised = await _fundingContract.methods.weiRaised().call();
        const _startTime = await _fundingContract.methods.startTime().call();
        setStartTime(_startTime);
        const _endTime = await _fundingContract.methods.endTime().call();
        setEndTime(_endTime);

        console.log(_startTime);

        const _contributersValue = await _fundingContract.methods
            .ContributersValue(account)
            .call();
        // const _tokenRate = await _fundingContract.methods.tokenRate().call();

        setHardCap(web3.utils.fromWei(_weiHardCap.toString(), "ether"));
        setWeiRaised(web3.utils.fromWei(_weiRaised.toString(), "ether"));
        setContributersValue(
            web3.utils.fromWei(_contributersValue.toString(), "ether")
        );
        // setTokenRate(_tokenRate);
        // console.log("_tokenRate", _tokenRate);
    };

    const contributeBNB = async () => {
        const web3 = new Web3(Web3.givenProvider);
        const _wei = web3.utils.toWei(bnbRef.current.value, "ether");
        await web3.eth.sendTransaction({
            from: account,
            to: CROWD_FUNDING_ADDRESS,
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
            <span className="font-semibold size-3">TitanX Private Sale</span>
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
                        Round 1 - {weiRaised}/{hardCap} BNB
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
export default PrivateSale;
