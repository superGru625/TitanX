import Web3 from "web3";

import { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import Selects from "./Lockers/CreatePresale/Select";

import { useRpcURL, useStealthStorageAddress } from "../hooks";

import ABI_STEALTH_STORAGE from "../abis/stealth_launch/ABI_StealthStorage.json";

import StealthPresaleCard from "../Components/StealthPresale/StealthPresaleCard";
import LoadingBar from "../Components/UI/LoadingBar";

const StealthDashboard = () => {
    const STEALTH_STORAGE_ADDRESS = useStealthStorageAddress();
    const HTTP_RPC_URL = useRpcURL();
    const [launchPadArray, setLaunchPadArray] = useState([]);
    const [mainLoading, setMainLoading] = useState(true);

    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(provider);
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    const loadData = async () => {
        const web3 = window.web3;
        const _storageContract = await new web3.eth.Contract(
            ABI_STEALTH_STORAGE,
            STEALTH_STORAGE_ADDRESS
        );

        const _totalProjects = parseInt(
            await _storageContract.methods.getProjectsCount().call()
        );

        let _array = [];

        const batchRequest = new web3.BatchRequest();

        if (_totalProjects === 0) setMainLoading(false);
        await new Promise(function (resolve, reject) {
            for (let index = 0; index < _totalProjects; index++) {
                batchRequest.add(
                    _storageContract.methods
                        .entryListByPresaleAddress(index)
                        .call.request(async (err, _presaleAddress) => {
                            if (err) reject(err);
                            _array.push(_presaleAddress);
                            if (_array.length === _totalProjects) resolve();
                        })
                );
            }
            batchRequest.execute();
        });
        setLaunchPadArray(_array);
        setMainLoading(false);
    };
    const [, setFilterValue] = useState("");
    const [, setSortValue] = useState("");
    const sortHandler = (value) => {
        setSortValue(value);
    };
    const filterHandler = (value) => {
        setFilterValue(value);
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
            "InProgress",
            "Filled",
            "Ended",
            "Cancelled",
        ],
        initialValue: "Filter by",
        handler: filterHandler,
    };
    return (
        <div className="main-container component-container justify-center items-center text-center animation-fade-in">
            <div className="flex flex-col lg:flex-row lg:pl-6 gap-x-8 gap-y-4 py-4 items-center">
                <h4 className="hidden md:flex">Dashboard </h4>
                <div className="flex relative items-center">
                    <FiSearch
                        size={16}
                        className="absolute left-3 text-itemIndigo dark:text-itemPurple"
                    />
                    <input
                        type="text"
                        className="border-none rounded-full p-2.5 size-base w-80 2xl:w-96 pl-10 bg-inputBg placeholder:text-[#350C9C8A]"
                        placeholder="Enter token name or token symbol"
                    />
                </div>
                <div className="flex flex-row gap-2 lg:gap-6 lg:ml-auto lg:pr-6">
                    <div className="w-36 lg:w-40 text-black dark:text-[#350C9C8A]">
                        <Selects {...sortSelectProps} />
                    </div>
                    <div className="w-36 lg:w-40 text-black dark:text-[#350C9C8A]">
                        <Selects {...filterSelectProps} />
                    </div>
                </div>
            </div>
            {mainLoading ? (
                <LoadingBar />
            ) : (
                <div className="flex flex-col gap-y-1">
                    {launchPadArray.reverse().map((address, id) => (
                        <StealthPresaleCard key={id} address={address} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default StealthDashboard;
