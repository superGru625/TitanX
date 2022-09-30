import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineLockClock } from "react-icons/md";

import { getPresaleDetails } from "../../../utils/apis";
import { getTokenLink } from "../../../utils/constants";
import ABI_StorageLaunchpad from "../../../abis/ABI_StorageLaunchpad.json";
import ABI_PRESALE from "../../../abis/ABI_Presale.json";
import ABI_LIQUIDITY_LOCK_PERSONAL from "../../../abis/presale/ABI_LIQUIDITY_LOCK_PERSONAL.json";
import { abi as ABI_ERC20 } from "../../../abis/ERC20.json";
import {
    useIsMount,
    useRpcURL,
    useValidAccount,
    useNetworkScanURL,
    useStorageContractAddress,
} from "../../../hooks";
import LoadingBar from "../../../Components/UI/LoadingBar";

const LiquidityInfo = () => {
    const isMount = useIsMount();

    const NETWORK_SCAN_URL = useNetworkScanURL();
    const [pageStatus, setPageStatus] = useState(0);
    const HTTP_RPC_URL = useRpcURL();
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const { account } = useValidAccount();
    const { library } = useWeb3React();
    const { tokenAddress } = useParams();

    const [tokenArray, setTokenArray] = useState([]);
    const [logo, setLogo] = useState(null);
    const [name, setname] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(library ? library.provider : provider);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    useEffect(() => {
        // if (active)
        if (isMount) loadTokenLockers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMount]);

    const loadTokenLockers = async () => {
        const _storageContract = new window.web3.eth.Contract(
            ABI_StorageLaunchpad,
            STORAGE_CONTRACT_ADDRESS
        );

        const _totalProjects = parseInt(
            await _storageContract.methods.getProjectsCount().call()
        );
        const idArr = Array.from(
            { length: _totalProjects },
            (_, offset) => offset
        );
        const presaleAddresses = await Promise.all(
            idArr.map((projectIndex) =>
                _storageContract.methods
                    .entryListByPresaleAddress(projectIndex)
                    .call()
            )
        );

        const lockerLPs = await Promise.all(
            presaleAddresses.map((presaleAddress) => {
                const _presaleContract = new window.web3.eth.Contract(
                    ABI_PRESALE,
                    presaleAddress
                );
                return _presaleContract.methods.lockerLP().call();
            })
        );
        const correctPresaleId = lockerLPs.indexOf(tokenAddress);
        if (correctPresaleId < 0) setPageStatus(2);
        if (correctPresaleId >= 0) {
            const _presaleContract = new window.web3.eth.Contract(
                ABI_PRESALE,
                presaleAddresses[correctPresaleId]
            );

            let _lockerTokenContract = await new window.web3.eth.Contract(
                ABI_LIQUIDITY_LOCK_PERSONAL,
                tokenAddress
            );

            const [offChainData, symbol, name, erc20Address, owner, lpAddress] =
                await Promise.all([
                    getPresaleDetails(presaleAddresses[correctPresaleId]),
                    _presaleContract.methods.tokenSymbol().call(),
                    _presaleContract.methods.tokenName().call(),
                    _presaleContract.methods.token().call(),
                    _presaleContract.methods.owner().call(),
                    _presaleContract.methods.uniswapV2Pair().call(),
                ]);
            const lpContract = new window.web3.eth.Contract(
                ABI_ERC20,
                lpAddress
            );
            const [lockBalance, endOfLockTime] = await Promise.all([
                lpContract.methods.balanceOf(tokenAddress).call(),
                _lockerTokenContract.methods.endOfLockTime().call(),
            ]);

            setname(`${symbol}-WBNB LP`);
            setLogo(getTokenLink(offChainData));

            setTokenArray([
                {
                    title: "Token Name",
                    text: `${symbol} / ${name}`,
                },
                {
                    title: "Token Address",
                    text: erc20Address,
                    link: `${NETWORK_SCAN_URL}token/${erc20Address}`,
                },
                {
                    title: "Owner Address",
                    text: owner,
                    link: `${NETWORK_SCAN_URL}address/${owner}`,
                },
                {
                    title: "Presale Address",
                    text: presaleAddresses[correctPresaleId],
                    link: `${NETWORK_SCAN_URL}address/${presaleAddresses[correctPresaleId]}`,
                },
                {
                    title: "Locked Amount",
                    text: (lockBalance / 10 ** 18).toFixed(3),
                },
                {
                    title: "Unlock Date/Time",
                    text: new Date(endOfLockTime * 1000).toLocaleString(
                        "en-us"
                    ),
                },
            ]);
            setPageStatus(1);
        }
    };

    const lock30More = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                ABI_LIQUIDITY_LOCK_PERSONAL,
                tokenAddress
            );

            await lockerTokenContract.methods
                .Lock30moreDays()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadTokenLockers();
                })
                .on("error", function (error, receipt) {
                    loadTokenLockers();
                });
        }
    };

    const lock1yearMore = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                ABI_LIQUIDITY_LOCK_PERSONAL,
                tokenAddress
            );

            await lockerTokenContract.methods
                .Lock1moreYear()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadTokenLockers();
                })
                .on("error", function (error, receipt) {
                    loadTokenLockers();
                });
        }
    };

    const unlocklockedTokens = async () => {
        if (tokenAddress != null) {
            let lockerTokenContract = await new window.web3.eth.Contract(
                ABI_LIQUIDITY_LOCK_PERSONAL,
                tokenAddress
            );

            await lockerTokenContract.methods
                .claimLockedTokens()
                .send({ from: account })
                .on("confirmation", (confirmationNumber, receipt) => {
                    loadTokenLockers();
                })
                .on("error", function (error, receipt) {
                    loadTokenLockers();
                });
        }
    };

    return (
        <div className="main-container animation-fade-in component-container items-center flex flex-col p-6">
            {pageStatus === 0 && <LoadingBar />}
            {pageStatus === 1 && (
                <>
                    <div className="flex flex-row justify-between items-start w-full">
                        <IoIosArrowBack
                            className="size-4 cursor-pointer text-itemIndigo dark:text-itemPurple"
                            onClick={() => navigate(-1)}
                        />
                        <div className="flex flex-col items-center">
                            <img
                                className="w-24 presale-logo"
                                src={logo && logo}
                                alt="Token Logo"
                            />
                            <span className="size-1 font-medium">
                                {name && name}
                            </span>
                        </div>

                        <MdOutlineLockClock className="size-4" />
                    </div>

                    <div className="flex flex-col overflow-hidden gap-6 w-full lg:w-3/4 2xl:w-1/2">
                        {tokenArray &&
                            tokenArray.map((el, i) => (
                                <div className="flex flex-col" key={i}>
                                    <div className="flex flex-col lg:flex-row justify-between px-8">
                                        {el.title && <span>{el.title}</span>}
                                        <span className="text-right">
                                            {!el.link && <span>{el.text}</span>}
                                            {el.link && (
                                                <a
                                                    href={el.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-itemIndigo dark:text-itemPurple"
                                                >
                                                    {el.text}
                                                </a>
                                            )}
                                        </span>
                                    </div>
                                    <div className="h-[1px] bg-black dark:bg-gray-600 bg-opacity-15" />
                                </div>
                            ))}
                        <div className="flex flex-col">
                            <div className="flex flex-col lg:flex-row justify-between px-8 items-end">
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
                    </div>
                </>
            )}
        </div>
    );
};
export default LiquidityInfo;
