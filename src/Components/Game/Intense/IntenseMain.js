import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaTelegramPlane, FaDiscord } from "react-icons/fa";

import Blockie from "../../../Components/UI/Blockie";
import { showToast } from "../../../utils/hot-toast";

import IntensePng from "../../../assets/images/game/intense/intense-rocket.png";
import IntenseRadial from "../../../assets/images/game/intense/radial-group.svg";
import IntenseRule from "../../../assets/images/game/intense/intense-rule.png";

import { getEllipsisTxt } from "../../../helpers/formatters";
import {
    useNetworkScanURL,
    useIntenseAddress,
    useOldStakingTokenAddress,
    useRpcURL,
} from "../../../hooks";

import ABI_INTENSE from "../../../abis/game/INTENSE_ABI.json";
import { abi as ABI_ERC20 } from "../../../abis/ERC20.json";
import { INTENSE_SLIPPAGE, MAX_UINT256 } from "../../../utils/constants";
import { numberConverter } from "../../../utils/utils";
const IntenseMain = () => {
    const netWorkScanUrl = useNetworkScanURL("tx");
    const addressScanUrl = useNetworkScanURL("address");
    const INTENSE_ADDRESS = useIntenseAddress(); //"0x12F413eCBC07B155965f90fe1A14C7e8334c0bb1";
    const TITAN_TOKEN_ADDRESS = useOldStakingTokenAddress();
    // ("0xb4a8fa569670c14161fef8b8a95fcca85608a60e");
    const HTTP_RPC_URL = useRpcURL();
    const { account, library } = useWeb3React();

    const amountRef = useRef(null);

    const [intenseContract, setIntenseContract] = useState();
    const [titanTokenContract, setTitanTokenContract] = useState();
    const [decimals, setDecimals] = useState();
    const [allowance, setAllowance] = useState();
    const [balance, setBalance] = useState(0);
    const [contractBalance, setContractBalance] = useState(0);

    const [collapseDelay, setCollapseDelay] = useState(600);
    const [hasWinner, setHasWinner] = useState(false);

    const [lastWinners, setLastWinners] = useState([]);
    const [lastBidTime, setLastBidTime] = useState(0);
    const [lastBidder, setLastBidder] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date().getTime() / 1000);

    const intenseBgm = useRef(null);

    useEffect(() => {
        const fetchHasWinner = async () => {
            const _hasWinner = await intenseContract.methods.hasWinner().call();
            setHasWinner(_hasWinner);

            intenseContract.methods
                .lastBidTime()
                .call({}, async (err, _lastBidTime) => {
                    setLastBidTime(_lastBidTime);
                });

            intenseContract.methods
                .lastBidder()
                .call({}, async (err, _lastBidder) => {
                    setLastBidder(_lastBidder);
                });

            titanTokenContract.methods
                .balanceOf(INTENSE_ADDRESS)
                .call({}, async (err, _contractBalance) => {
                    setContractBalance(_contractBalance);
                });
        };
        const intervalFetchHasWinner = setInterval(() => {
            if (intenseContract && titanTokenContract) fetchHasWinner();
        }, 5000);
        const intervalPer1Sec = setInterval(() => {
            setCurrentTime(new Date().getTime() / 1000);
        }, 1000);
        return () => {
            clearInterval(intervalFetchHasWinner);
            clearInterval(intervalPer1Sec);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intenseContract, titanTokenContract]);
    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(library ? library.provider : provider);
        loadIntenseData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [library, HTTP_RPC_URL, account]);

    const loadIntenseData = async () => {
        const web3 = window.web3;
        const _intenseContract = await new web3.eth.Contract(
            ABI_INTENSE,
            INTENSE_ADDRESS
        );

        setIntenseContract(_intenseContract);
        const _tokenContract = await new web3.eth.Contract(
            ABI_ERC20,
            TITAN_TOKEN_ADDRESS
        );
        setTitanTokenContract(_tokenContract);

        _tokenContract.methods.decimals().call({}, async (err, _decimals) => {
            setDecimals(_decimals);
        });
        _tokenContract.methods
            .allowance(account, INTENSE_ADDRESS)
            .call({}, async (err, _allowance) => {
                setAllowance(parseInt(_allowance));
            });

        _tokenContract.methods
            .balanceOf(account)
            .call({}, async (err, _balance) => {
                setBalance(_balance);
            });

        _tokenContract.methods
            .balanceOf(INTENSE_ADDRESS)
            .call({}, async (err, _balance) => {
                setContractBalance(_balance);
            });

        _intenseContract.methods
            .lastBidTime()
            .call({}, async (err, _lastBidTime) => {
                setLastBidTime(_lastBidTime);
            });

        _intenseContract.methods
            .lastBidder()
            .call({}, async (err, _lastBidder) => {
                setLastBidder(_lastBidder);
            });
        _intenseContract.methods
            .collapseDelay()
            .call({}, async (err, _collapseDelay) => {
                setCollapseDelay(_collapseDelay);
            });

        const _lastBlockNumber = await web3.eth.getBlockNumber();

        _intenseContract
            .getPastEvents("OnWin", { fromBlock: _lastBlockNumber - 4900 })
            .then((events) => {
                setLastWinners(
                    events.reverse().map((item) => {
                        return {
                            ...item.returnValues,
                            txHash: item.transactionHash,
                        };
                    })
                );
            });

        // _intenseContract.events.OnBid((err, event) => {
        //     console.log(event);
        // });
        // _intenseContract.events.OnWin((err, event) => {
        //     console.log(event);
        // });
    };

    const approveIntense = async () => {
        await titanTokenContract.methods
            .approve(INTENSE_ADDRESS, MAX_UINT256)
            .send({ from: account });
        showToast("SUCCESS", "Successfully approved the Intense Contract");
        loadIntenseData();
    };
    const participate = async () => {
        // showToast("SUCCESS", "Sorry you didn't win this time", "📢");
        if (hasWinner) {
            showToast("SUCCESS", "The Winner has to claim first", "💬");
            return;
        }
        const web3 = window.web3;

        const BN = web3.utils.BN;
        const _amount = new BN(10)
            .pow(new BN(decimals))
            .mul(new BN(amountRef.current.value));

        await intenseContract.methods
            .participate(_amount, INTENSE_SLIPPAGE)
            .send({ from: account });
        showToast("SUCCESS", "Sorry you didn't win this time", "📢");
        loadIntenseData();
    };
    const claimReward = async () => {
        await intenseContract.methods.claimReward().send({ from: account });
        showToast("SUCCESS", "Successfully claimed the reward", "🏆");
        loadIntenseData();
    };

    const setMin = async () => {
        const _contractBalance = await titanTokenContract.methods
            .balanceOf(INTENSE_ADDRESS)
            .call();
        setContractBalance(_contractBalance);
        amountRef.current.value =
            parseInt(_contractBalance / 10 ** decimals / 100) + 1;
    };

    const setMax = async () => {
        const _contractBalance = await titanTokenContract.methods
            .balanceOf(INTENSE_ADDRESS)
            .call();
        setContractBalance(_contractBalance);
        amountRef.current.value = parseInt(
            ((_contractBalance / 10 ** decimals) * (100 + INTENSE_SLIPPAGE)) /
                10000
        );
    };

    const counterContext = () => {
        const offset = collapseDelay - (currentTime - lastBidTime);
        if (offset < 0) {
            return "Claim Reward";
        } else {
            if (offset < 31 && intenseBgm.current.paused) {
                console.log("play", intenseBgm.current.paused);
                intenseBgm.current.play();
            }
            return `${parseInt(offset / 60)}m ${parseInt(offset % 60)}s`;
        }
    };
    return (
        <div className="flex flex-col w-full text-white bg-intenseBg">
            <audio
                preload="auto"
                src="/bgm/intense-bgm.mp3"
                ref={intenseBgm}
            ></audio>
            <div className="absolute right-0 w-[50vw] md:w-[27vw] aspect-square fill-itemPurple opacity-30 radial-pattern md:bg-[length:50%]" />
            <div className="flex flex-col-reverse md:flex-row pt-24 relative">
                <div className="absolute bottom-0 w-[50vw] md:w-[27vw] aspect-video fill-itemPurple opacity-70 radial-pattern md:bg-[length:50%]" />
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start pl-3 md:pl-24 static z-[1]">
                    <span className="text-itemPurple font-semibold size-3 py-2">
                        INTENSE !
                    </span>
                    <span className="text-white font-semibold text-center md:text-left size-4 md:size-6 leading-tight md:leading-snug">
                        Welcome to the <br />
                        <font className="text-intenseOrange">TitanX</font> verse
                    </span>
                    <span className="size-2 text-white py-2">
                        Participate with $TÍTAN
                    </span>
                    <span className="size-2 text-white">
                        Win 70% of the JACKPOT!
                    </span>

                    <div className="flex flex-row gap-3 md:gap-4 2xl:gap-8 py-4">
                        <button
                            className="bg-itemPurple text-intenseBg size-1 font-semibold rounded-xl w-40 2xl:w-64"
                            onClick={() => {
                                const yCoordinate =
                                    document
                                        .getElementById("play_control")
                                        .getBoundingClientRect().top +
                                    window.pageYOffset;
                                const yOffset = -180;
                                window.scrollTo({
                                    top: yCoordinate + yOffset,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            Play NOW
                        </button>
                        <button
                            className="bg-white text-intenseBg size-1 font-semibold rounded-xl w-40 2xl:w-64"
                            onClick={() => {
                                const yCoordinate =
                                    document
                                        .getElementById("play_how")
                                        .getBoundingClientRect().top +
                                    window.pageYOffset;
                                const yOffset = -80;
                                window.scrollTo({
                                    top: yCoordinate + yOffset,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            Explore how
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative">
                    <img
                        className="absolute w-3/4 h-3/4 left-0 right-0 bottom-0 mx-auto"
                        src={IntenseRadial}
                        alt="radial background"
                    />
                    <img
                        className="w-3/4 mx-auto z-[1] relative"
                        src={IntensePng}
                        alt="logo"
                    />
                </div>
            </div>
            <div
                id="play_control"
                className="flex flex-col items-center px-3 md:px-12 relative z-[1]"
            >
                <div className="flex flex-col w-full py-3 px-3 md:px-12 2xl:px-24 intense-interaction-panel md:-translate-y-12 2xl:w-3/4">
                    <span className="size-base ml-auto font-medium flex gap-4">
                        <a
                            href={`${addressScanUrl}${lastBidder}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-itemPurple duration-200"
                        >
                            {lastBidder &&
                                `Last Bidder: ${getEllipsisTxt(
                                    lastBidder,
                                    6
                                )} `}
                        </a>
                        {numberConverter(balance / 10 ** decimals)} TÍTAN
                        available
                    </span>
                    <div className="flex flex-col md:flex-row md:justify-between">
                        <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start">
                            <span className="font-semibold size-1 tracking-wide text-itemPurple">
                                JACKPOT!
                            </span>
                            <span className="font-medium size-2">
                                {numberConverter(
                                    (contractBalance / 10 ** decimals) * 0.7
                                )}{" "}
                                TÍTAN
                            </span>
                            <span className="font-light">
                                {counterContext()}
                            </span>
                        </div>
                        <div className="flex flex-row relative w-full md:w-3/4 my-2">
                            <button
                                className="absolute px-6 bg-itemIndigo text-white border-[6px] border-white left-0 h-full"
                                onClick={setMin}
                            >
                                MIN
                            </button>
                            <input
                                ref={amountRef}
                                defaultValue={"0"}
                                className="rounded-full bg-white w-full size-1 py-4 px-28 text-itemIndigo font-bold"
                            />
                            <button
                                className="absolute px-6 bg-itemCyan text-white border-[6px] border-white right-0 h-full"
                                onClick={setMax}
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-3 md:gap-12 md:pt-6">
                        {!allowance && (
                            <button
                                className="bg-itemPurple text-white size-1 rounded-2xl w-40 md:w-48"
                                onClick={approveIntense}
                            >
                                Approve
                            </button>
                        )}
                        <button
                            className="border-itemPurple hover:bg-indigo-300 hover:bg-opacity-10 border-2 text-itemPurple size-1 rounded-2xl w-40 md:w-48"
                            onClick={participate}
                        >
                            Participate
                        </button>
                        {hasWinner && (
                            <button
                                className="relative bg-itemPurple text-white size-1 rounded-2xl w-40 md:w-48"
                                onClick={claimReward}
                            >
                                <span className="absolute animation-slow-ping inline-flex h-full w-full rounded-2xl bg-itemPurple opacity-75 left-0 top-0"></span>
                                <span className="z-1 relative">Get Reward</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-0">
                <div className="ml-auto w-[50vw] md:w-[27vw] aspect-square fill-itemPurple opacity-70 radial-pattern md:bg-[length:50%]" />
                <div className="mr-auto w-[50vw] md:w-[27vw] aspect-square fill-itemPurple opacity-70 radial-pattern md:bg-[length:50%]" />
            </div>
            <div
                id="play_how"
                className="my-6 mr-auto md:w-11/12 w-full intense-rule-panel flex flex-col md:flex-row gap-x-24 justify-center relative"
            >
                <div className="flex md:w-2/5 flex-col justify-between items-center pt-12">
                    <span className="font-medium size-3">GAME RULES 📃</span>
                    <img
                        className="w-3/4"
                        src={IntenseRule}
                        alt="intense rule"
                    />
                </div>
                <div className="flex px-4 md:w-2/5 flex-col justify-center gap-6 2xl:gap-y-12 py-4">
                    <div className="flex flex-row gap-3 items-center">
                        <div className="rule-item-handle">⏳</div>
                        <div className="flex flex-col">
                            <span className="size-2 font-semibold">
                                How it works
                            </span>
                            <span className="size-sm font-light">
                                Intense has a 30 minute countdown timer.
                                Participate and the countdown starts, You can
                                win 2 ways, Instantly win 70% or if nobody
                                participates within the countdown you win 70% of
                                the JACKPOT .. <br />
                                <br />
                                Minimum bid is 1% of jackpot balance giving you
                                a 1% chance to win instantly <br />
                                Maximum bid is 10% of jackpot balance giving you
                                a 10% chance to win instantly
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <div className="rule-item-handle">⚔️</div>
                        <div className="flex flex-col">
                            <span className="size-2 font-semibold">
                                Instant Winner
                            </span>
                            <span className="size-sm font-light">
                                If a user instant wins, Intense jackpot balance
                                is distributed as follows: 70% credited
                                instantly to winner’s address 10% is burned 20%
                                carries over to the next round
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <div className="rule-item-handle">🎖️</div>
                        <div className="flex flex-col">
                            <span className="size-2 font-semibold">Lose</span>
                            <span className="size-sm font-light">
                                If a user loses the instant draw: 90% goes to
                                Intense balance 10% is burned
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <div className="rule-item-handle">♾️</div>
                        <div className="flex flex-col">
                            <span className="size-2 font-semibold">
                                Lose but nobody plays
                            </span>
                            <span className="size-sm font-light">
                                If nobody bids over a 30 minute period: 70% goes
                                to the last bidder 20% carries over to the next
                                round 10% gets burned
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-6 ml-auto md:w-11/12 w-full intense-winner-panel flex flex-col relative p-6 md:p-12">
                <div className="flex flex-row justify-between">
                    <span className="size-3 font-semibold">
                        Last Winners 🏆
                    </span>
                    {/* <select className="border bg-[#3e1870] text-white size-base outline-none border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 block py-3 px-4">
                        <option>Today</option>
                        <option>Last Week</option>
                        <option>Last Month</option>
                        <option>Total</option>
                    </select> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-6 pt-4 md:pt-8">
                    {lastWinners.map((item, i) => (
                        <a
                            key={i}
                            href={`${netWorkScanUrl}${item.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-row w-4/5 md:w-2/3 2xl:w-1/2 mx-auto winner-card rounded-2xl p-4 gap-2 items-center"
                        >
                            <Blockie
                                scale={5}
                                address={item.author}
                                className="rounded-2xl"
                            />
                            <div className="flex flex-col ga-2">
                                <span>{getEllipsisTxt(item.author, 5)}</span>
                                <span className="text-itemPurple">
                                    {numberConverter(
                                        item.amount / 10 ** decimals,
                                        0
                                    )}{" "}
                                    TÍtan
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="flex flex-row gap-3 md:gap-8 pt-6 justify-center">
                    <button className="border border-itemPurple intense-hover rounded-2xl h-12 w-12 flex flex-col p-0 justify-center items-center">
                        <BiChevronLeft className="size-3" />
                    </button>
                    <button className="border border-itemPurple intense-hover rounded-2xl h-12 w-12 flex flex-col p-0 justify-center items-center">
                        <BiChevronRight className="size-3" />
                    </button>
                </div>
            </div>
            <div className="my-3 md:mt-6 md:mb-12 overflow-hidden w-11/12 md:w-3/4 mx-auto flex flex-col items-center intense-community-panel p-3 lg:pt-12 lg:pb-6 rounded-3xl relative">
                <span className="size-2 lg:size-3 font-semibold static z-[1]">
                    Join our community to earn
                </span>
                <span className="size-1 font-light text-center static z-[1]">
                    Join the growing community that are earning tokens and
                    makeing passive income while doing what they love.
                </span>
                <div className="flex flex-row gap-3 md:gap-6 2xl:gap-12 pt-3 lg:pt-6 static z-[1]">
                    <a
                        href="https://t.me/TitanXProject"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#40B3E0] text-white rounded-xl flex
                        items-center gap-2 lg:size-1 py-3 px-4"
                    >
                        <FaTelegramPlane />
                        Telegram
                    </a>
                    <a
                        href="https://discord.gg/QgZrKMuH"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#5865F2] text-white rounded-xl flex items-center gap-2 lg:size-1 py-3 px-4"
                    >
                        <FaDiscord />
                        Discord
                    </a>
                </div>
                <div className="absolute h-full w-full top-0 fill-itemPurple opacity-30 radial-pattern" />
            </div>
        </div>
    );
};
export default IntenseMain;
