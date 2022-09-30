import Web3 from "web3";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineLockClock } from "react-icons/md";

import lockerTokenAbi from "../../abis/TokenLockerabi.json";
import ERC20Abi from "../../abis/ERC20.json";
import { timeConverter } from "../../utils/utils";

import { useValidAccount } from "../../hooks";

const TokenLockerInfo = () => {
    const { account } = useValidAccount();
    const { tokenAddress } = useParams();

    const [tokenArray, setTokenArray] = useState([]);
    const [logo, setLogo] = useState(null);
    const [name, setname] = useState(null);

    const navigate = useNavigate();
    const [endTime, setEndTime] = useState(
        new Date("May 05, 2022 20:00:00").getTime()
    );

    const [currentTime, setcurrentTime] = useState(new Date().getTime());
    const gap = endTime - currentTime; //177670892

    const seconds = 1000; // in milliseconds
    const minutes = seconds * 60;
    const hours = minutes * 60;
    const days = hours * 24;

    const day = Math.floor(gap / days);
    const hour = Math.floor((gap % days) / hours);
    const minute = Math.floor((gap % hours) / minutes);
    const second = Math.floor((gap % minutes) / seconds);

    useEffect(() => {
        setTimeout(() => setcurrentTime(new Date().getTime()), 1000);
        loadDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime]);

    useEffect(() => {
        const _tokenArray = [
            { title: "Token Name", details: "loading..." },
            { title: "Token Address", details: "loading..." },
            { title: "Owner Address", details: "loading..." },
            { title: "Amount of Tokens Locked", details: "loading..." },
            { title: "Unlock Date/Time", details: "loading..." },
            {
                title: "Unlock in ",
                details: `${day < 10 ? "0" + day : day}:${
                    hour < 10 ? "0" + hour : hour
                }:${minute < 10 ? "0" + minute : minute}:${
                    second < 10 ? "0" + second : second
                }`,
            },
            { title: "Rewards earned during Lock", details: "loading..." },
            { title: "Token Name", details: "loading..." },
        ];

        setTokenArray(_tokenArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDetails = async () => {
        if (tokenAddress != null) {
            try {
                const web3 = new Web3(Web3.givenProvider);
                let lockerTokenContract = await new web3.eth.Contract(
                    lockerTokenAbi.abi,
                    tokenAddress
                );
                let lockedTokenAdress = await lockerTokenContract.methods
                    .lockedToken()
                    .call();

                //console.log(lockerTokenContract);

                let unlockdatetime = await lockerTokenContract.methods
                    .LockedTimestamp()
                    .call();
                let lockedBalance = await lockerTokenContract.methods
                    .LockedBalance()
                    .call();
                let owner = await lockerTokenContract.methods.owner().call();
                // let RewardsWithdrawn = await lockerTokenContract.methods.RewardsWithdrawn().call();

                let Logo = await lockerTokenContract.methods.Logo().call();
                setLogo(Logo);

                let _tokenContract = await new web3.eth.Contract(
                    ERC20Abi.abi,
                    lockedTokenAdress
                );
                let _name = await _tokenContract.methods.name().call();
                let _decimals = await _tokenContract.methods.decimals().call();
                setname(_name);
                // let _symbol = await _tokenContract.methods.symbol().call();

                setEndTime(unlockdatetime * 1000);

                const _tokenArray = [
                    { title: "Token Name", details: _name },
                    { title: "Token Address", details: lockedTokenAdress },
                    { title: "Owner Address", details: owner },
                    {
                        title: "Amount of Tokens Locked",
                        details:
                            lockedBalance.toString() /
                            10 ** _decimals.toString(),
                    },
                    {
                        title: "Unlock Date/Time",
                        details: timeConverter(unlockdatetime.toString()),
                    },
                    {
                        title: "Unlock in ",
                        details: `${day < 10 ? "0" + day : day}:${
                            hour < 10 ? "0" + hour : hour
                        }:${minute < 10 ? "0" + minute : minute}:${
                            second < 10 ? "0" + second : second
                        }`,
                    },
                    { title: "Rewards earned during Lock", details: "111" },
                    { title: "Token Name", details: _name },
                ];

                setTokenArray(_tokenArray);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const lock30More = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                lockerTokenAbi.abi,
                tokenAddress
            );

            console.log(lockerTokenContract);

            await lockerTokenContract.methods
                .Lock30moreDays()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadDetails();
                })
                .on("error", function (error, receipt) {
                    loadDetails();
                });
        }
    };

    const lock1yearMore = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                lockerTokenAbi.abi,
                tokenAddress
            );

            await lockerTokenContract.methods
                .Lock1moreYear()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadDetails();
                })
                .on("error", function (error, receipt) {
                    loadDetails();
                });
        }
    };

    const unlocklockedTokens = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                lockerTokenAbi.abi,
                tokenAddress
            );

            await lockerTokenContract.methods
                .claimlockedTokens()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadDetails();
                })
                .on("error", function (error, receipt) {
                    loadDetails();
                });
        }
    };

    const withdrawTokensReward = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                lockerTokenAbi.abi,
                tokenAddress
            );

            await lockerTokenContract.methods
                .withdrawTokensReward(tokenAddress)
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadDetails();
                })
                .on("error", function (error, receipt) {
                    loadDetails();
                });
        }
    };

    return (
        <div className="main-container animation-fade-in component-container p-6 items-center flex flex-col">
            <div className="flex flex-row justify-between items-start w-full pb-12">
                <IoIosArrowBack
                    className="size-4 cursor-pointer text-itemIndigo dark:text-itemPurple"
                    onClick={() => navigate("/dashboard/lock-token")}
                />
                <div className="flex flex-col text-center">
                    <img
                        className="w-24 2xl:w-32 h-24 2xl:h-32 presale-logo"
                        src={logo && logo}
                        alt="Token Logo"
                    />
                    <span className="size-1 font-medium">{name && name}</span>
                </div>
                <MdOutlineLockClock className="size-4" />
            </div>
            <div className="flex flex-col overflow-hidden gap-6 w-full lg:w-3/4 2xl:w-1/2">
                {tokenArray &&
                    tokenArray.map((el, i) => (
                        <div className="flex flex-col" key={i}>
                            <div className="flex flex-col lg:flex-row justify-between px-8">
                                <span>{el.title}</span>
                                <span className="text-right">{el.details}</span>
                            </div>
                            <div className="h-[1px] bg-black dark:bg-gray-600 bg-opacity-15" />
                        </div>
                    ))}
                <div className="flex flex-col">
                    <div className="flex flex-col lg:flex-row justify-between px-8">
                        <span>Lock Further</span>
                        <span className="text-right flex flex-row gap-2 justify-end">
                            <button
                                className="border-2 border-itemIndigo dark:border-itemPurple rounded-full py-1 size-base hover:bg-pink-500/[.2]"
                                onClick={lock30More}
                            >
                                30 Days
                            </button>
                            <button
                                className="border-2 border-itemIndigo dark:border-itemPurple rounded-full py-1 size-base hover:bg-pink-500/[.2]"
                                onClick={lock1yearMore}
                            >
                                1 Year
                            </button>
                        </span>
                    </div>
                    <div className="h-[1px] bg-black dark:bg-gray-600 bg-opacity-15" />
                </div>
            </div>
            <div className="flex flex-row pt-4 gap-4 lg:gap-8 justify-center">
                <button
                    className="bg-itemIndigo dark:bg-itemPurple text-white rounded-full w-44 lg:w-48 2xl:w-72 size-sm lg:size-base"
                    onClick={unlocklockedTokens}
                >
                    Unlock
                </button>
                <button
                    className="border-2 border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple rounded-full w-44 lg:w-48 2xl:w-72 size-sm lg:size-base"
                    onClick={withdrawTokensReward}
                >
                    Withdraw Rewards
                </button>
            </div>
        </div>
    );
};
export default TokenLockerInfo;
