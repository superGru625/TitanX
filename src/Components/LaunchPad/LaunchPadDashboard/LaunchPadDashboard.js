import Web3 from "web3";
import React, { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import { VscTriangleDown } from "react-icons/vsc";

import LaunchPadCard from "./LaunchPadCard";
import Selects from "../../../Pages/Lockers/CreatePresale/Select";
import LoadingBar from "../../../Components/UI/LoadingBar";

import {
    useRpcURL,
    useStorageContractAddress,
    useValidAccount,
} from "../../../hooks";

import {
    PRESALE_UPCOMING,
    PRESALE_INPROGRESS,
    PRESALE_FILLED,
    PRESALE_ENDED,
    PRESALE_CANCELED,
    PRESALE_ENDED_NOT_MET_SOFTCAP,
    PRESALE_FINALISED,
    REMOVED_PRESALES,
} from "../../../utils/constants";

import { getPresaleDetails } from "../../../utils/apis";

import ABI_StorageLaunchpad from "../../../abis/ABI_StorageLaunchpad.json";
import PresaleABI from "../../../abis/ABI_Presale.json";
const LaunchPadDashboard = () => {
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const HTTP_RPC_URL = useRpcURL();
    const { account } = useValidAccount();

    const [launchPadArray, setLaunchPadArray] = useState([]);
    const [mainLoading, setMainLoading] = useState(true);

    const [filterValue, setFilterValue] = useState("");
    const [sortValue, setSortValue] = useState("");

    const [showAll, setShowAll] = useState(false);

    const sortHandler = (value) => {
        setSortValue(value);
    };
    const filterHandler = (value) => {
        setFilterValue(value);
    };

    const adjustedArray = () => {
        if (launchPadArray.length === 0) return [];
        let resultArr = launchPadArray.filter(
            (item) => !REMOVED_PRESALES.includes(item.presaleAddress)
        );
        switch (sortValue) {
            case "HardCap":
                resultArr = resultArr.sort((a, b) => b.hardCap - a.hardCap);
                break;
            case "SoftCap":
                resultArr = resultArr.sort((a, b) => b.hardCap - a.hardCap);
                break;
            case "LP percent":
                resultArr = resultArr.sort((a, b) => b.liquidity - a.liquidity);
                break;
            case "Start time":
                resultArr = resultArr.sort(
                    (a, b) => b.preSaleStartTime - a.preSaleStartTime
                );
                break;
            case "End time":
                resultArr = resultArr.sort(
                    (a, b) => b.preSaleEndTime - a.preSaleEndTime
                );
                break;
            default:
                break;
        }
        switch (filterValue) {
            case "All":
            case "KYC":
                break;
            case "Upcoming":
                resultArr = resultArr.filter(
                    (item) => item.status === PRESALE_UPCOMING
                );
                break;
            case "In Progress":
                resultArr = resultArr.filter(
                    (item) => item.status === PRESALE_INPROGRESS
                );
                break;
            case "Filled":
                resultArr = resultArr.filter(
                    (item) => item.status === PRESALE_FILLED
                );
                break;
            case "Ended":
                resultArr = resultArr.filter(
                    (item) => item.status === PRESALE_ENDED
                );
                break;
            case "Cancelled":
                resultArr = resultArr.filter(
                    (item) =>
                        item.status === PRESALE_ENDED_NOT_MET_SOFTCAP ||
                        item.status === PRESALE_CANCELED
                );
                break;
            default:
                break;
        }
        return resultArr;
    };
    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(provider);
        if (HTTP_RPC_URL) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    const loadData = async () => {
        const web3 = window.web3;
        const _storageContract = new web3.eth.Contract(
            ABI_StorageLaunchpad,
            STORAGE_CONTRACT_ADDRESS
        );

        const _totalProjects = await _storageContract.methods
            .getProjectsCount()
            .call();
        let _array = [];

        const BATCH_COUNT = 12;
        const batchRequest = new web3.BatchRequest();
        if (parseInt(_totalProjects) === 0) setMainLoading(false);
        for (let index = 0; index < _totalProjects.toString(); index++) {
            batchRequest.add(
                _storageContract.methods
                    .entryListByPresaleAddress(index)
                    // eslint-disable-next-line no-loop-func
                    .call.request(async (err, _presaleAddress) => {
                        if (err) {
                            console.log(err);
                        }
                        let _preSaleContract = new web3.eth.Contract(
                            PresaleABI,
                            _presaleAddress
                        );
                        let _tokenName,
                            _hardCap,
                            _contribution,
                            _Mincontribution,
                            _Maxcontribution,
                            _tokenLockTime,
                            _preSaleStartTime,
                            _preSaleEndTime,
                            _liqudity,
                            _presaleState,
                            _finalized,
                            _progress,
                            _projectStore;
                        try {
                            await new Promise(function (resolve, reject) {
                                let counter = 0;
                                const subBatchRequest = new web3.BatchRequest();

                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenName()
                                        .call.request(
                                            async (err, tokenName) => {
                                                if (err) reject(err);
                                                counter++;
                                                _tokenName = tokenName;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenHardCap()
                                        .call.request(async (err, hardCap) => {
                                            if (err) reject(err);
                                            counter++;
                                            _hardCap = hardCap;
                                            if (counter === BATCH_COUNT)
                                                resolve();
                                        })
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .presaleState()
                                        .call.request(
                                            async (err, presaleState) => {
                                                if (err) reject(err);
                                                counter++;
                                                _presaleState =
                                                    parseInt(presaleState);
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );

                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .finalized()
                                        .call.request(
                                            async (err, finalized) => {
                                                if (err) reject(err);
                                                counter++;
                                                _finalized = finalized;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .getContribution(account)
                                        .call.request(
                                            async (err, contribution) => {
                                                if (err) {
                                                    reject(err);
                                                }
                                                counter++;
                                                _contribution = contribution;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenMinContribution()
                                        .call.request(
                                            async (err, Mincontribution) => {
                                                if (err) reject(err);
                                                counter++;
                                                _Mincontribution =
                                                    Mincontribution;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenMaxContribution()
                                        .call.request(
                                            async (err, MaxContribution) => {
                                                if (err) reject(err);
                                                counter++;
                                                _Maxcontribution =
                                                    MaxContribution;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenLockTime()
                                        .call.request(
                                            async (err, tokenLockTime) => {
                                                if (err) reject(err);
                                                counter++;
                                                _tokenLockTime = tokenLockTime;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenStartTime()
                                        .call.request(
                                            async (err, tokenStartTime) => {
                                                if (err) reject(err);
                                                counter++;
                                                _preSaleStartTime =
                                                    tokenStartTime;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenEndTime()
                                        .call.request(
                                            async (err, tokenEndTime) => {
                                                if (err) reject(err);
                                                counter++;
                                                _preSaleEndTime = tokenEndTime;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );

                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .tokenDEXLiquidity()
                                        .call.request(
                                            async (err, tokenDEXLiquidity) => {
                                                if (err) reject(err);
                                                counter++;
                                                _liqudity = tokenDEXLiquidity;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.add(
                                    _preSaleContract.methods
                                        .weiRaised()
                                        .call.request(
                                            async (err, weiRaised) => {
                                                if (err) reject(err);
                                                counter++;
                                                _progress = weiRaised;
                                                if (counter === BATCH_COUNT)
                                                    resolve();
                                            }
                                        )
                                );
                                subBatchRequest.execute();
                            });
                        } catch (error) {
                            console.log(341, error);
                        }
                        let offChainData;
                        [offChainData, _projectStore] = await Promise.all([
                            getPresaleDetails(_presaleAddress),
                            _storageContract.methods
                                .ProjectStoreByOwner(_presaleAddress)
                                .call(),
                        ]);

                        let _item = {
                            index: index,
                            cardId: _array.length,
                            offChainData: offChainData,
                            presaleAddress: _presaleAddress,
                            audit: "",
                            name: _tokenName,
                            presaleState: _presaleState,
                            finalized: _finalized,
                            con: _contribution,
                            minCon: window.web3.utils.fromWei(
                                _Mincontribution.toString(),
                                "ether"
                            ),
                            maxCon: window.web3.utils.fromWei(
                                _Maxcontribution.toString(),
                                "ether"
                            ),
                            softCap: _hardCap / 2,
                            hardCap: _hardCap,
                            progress: window.web3.utils.fromWei(
                                _progress.toString(),
                                "ether"
                            ),
                            liquidity: _liqudity,
                            lockupTime: _tokenLockTime,
                            preSaleStartTime: parseInt(_preSaleStartTime),
                            preSaleEndTime: parseInt(_preSaleEndTime),
                            projectStore: _projectStore,
                        };
                        const currentTime = parseInt(
                            new Date().getTime() / 1000
                        );
                        if (_item.finalized === true) {
                            _item.status = PRESALE_FINALISED;
                        } else if (
                            _item.progress >=
                            _item.hardCap - _item.minCon
                        )
                            _item.status = PRESALE_FILLED;
                        else if (currentTime < _item.preSaleStartTime)
                            _item.status = PRESALE_UPCOMING;
                        else if (currentTime < _item.preSaleEndTime) {
                            if (_item.presaleState === 0)
                                _item.status = PRESALE_CANCELED;
                            else {
                                // _item.status = PRESALE_ENDED;
                                _item.status = PRESALE_INPROGRESS;
                            }
                        } else {
                            //time ended
                            if (_item.progress < _item.softCap)
                                _item.status = PRESALE_ENDED_NOT_MET_SOFTCAP;
                            else if (_item.presaleState === 0) {
                                _item.status = PRESALE_CANCELED;
                            } else _item.status = PRESALE_ENDED;
                        }

                        _array.push(_item);
                        if (
                            _array.length ===
                            parseInt(_totalProjects.toString())
                        ) {
                            setMainLoading(false);
                            _array = _array.sort((a, b) => b.index - a.index);
                            setLaunchPadArray(_array);
                        }
                    })
            );
        }
        batchRequest.execute();
    };

    const sortSelectProps = {
        select: ["HardCap", "SoftCap", "LP percent", "Start time", "End time"],
        initialValue: "Sort by",
        handler: sortHandler,
    };
    const filterSelectProps = {
        select: [
            "All",
            "KYC",
            "Upcoming",
            "In Progress",
            "Filled",
            "Ended",
            "Cancelled",
        ],
        initialValue: "Filter by",
        handler: filterHandler,
    };

    return (
        <div className="flex flex-col main-container component-container animation-fade-in">
            <div className="flex flex-col lg:flex-row lg:pl-6 gap-x-8 gap-y-4 py-4 justify-center items-center">
                <div className="flex relative items-center">
                    <FiSearch
                        size={16}
                        className="absolute left-3 text-itemIndigo dark:text-itemPurple"
                    />
                    <input
                        type="text"
                        className="rounded-lg p-2 size-base w-96 pl-10 border-2 bg-transparent text-black dark:text-white border-inputBg focus:border-cyan-400 duration-150"
                        placeholder="Enter token name or token symbol"
                    />
                </div>
                <div className="flex flex-row gap-2 lg:gap-6">
                    <div className="w-36 lg:w-40 text-black dark:text-[#350C9C8A]">
                        <Selects {...sortSelectProps} />
                    </div>
                    <div className="w-36 lg:w-40 text-black dark:text-[#350C9C8A]">
                        <Selects {...filterSelectProps} />
                    </div>
                </div>
            </div>
            <div className="size-1 mx-auto font-bold tracking-wider text-orange-400 dark:text-yellow">
                Free to setup launchpad - We only charge if your project is
                successful.
            </div>
            <div className="flex py-6 justify-center flex-col">
                {mainLoading ? (
                    <LoadingBar />
                ) : launchPadArray.length === 0 ? (
                    <span className="size-4 mx-auto font-bold tracking-wider text-purple dark:text-yellow">
                        Nothing To Show
                    </span>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full px-8 gap-x-8 gap-y-8 2xl:gap-x-8 2xl:gap-y-12">
                            {adjustedArray().map((el, i) => {
                                let className = "";
                                if (i >= 5) className = "2xl:hidden lg:hidden";
                                else if (i >= 4)
                                    className += " lg:hidden 2xl:block";
                                return (
                                    <div
                                        className={!showAll ? className : ""}
                                        key={i}
                                    >
                                        <LaunchPadCard {...el} />
                                    </div>
                                );
                            })}
                        </div>
                        {showAll === false && (
                            <div className="w-full pt-24 pb-12 text-center relative flex items-center flex-col">
                                <div className="w-full border-2 border-[#6E00FF66] dark:border-itemPurple"></div>
                                <button
                                    className="absolute -translate-y-1/2 bg-[#E2E5FA] dark:bg-itemPurple text-itemIndigo dark:text-white font-medium flex items-center gap-2 px-12"
                                    onClick={() => setShowAll(true)}
                                >
                                    LOAD MORE <VscTriangleDown />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default LaunchPadDashboard;
