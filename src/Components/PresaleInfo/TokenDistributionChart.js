import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { FaTimes } from "react-icons/fa";

import ERC20_ABI from "../../abis/ERC20.json";

import ABI_LOCKER_CONTRACT from "../../abis/LiquidityLockerDappABI.json";
import LOCKER_TOKEN from "../../abis/TokenLockerabi.json";
import ABI_StorageLaunchpad from "../../abis/ABI_StorageLaunchpad.json";

import {
    DEAD_ADDRESS,
    getPartnerLogo,
    ZERO_ADDRESS,
} from "../../utils/constants";
import { numberConverter, percentageConverter } from "../../utils/utils";
import { getPartnerDetails } from "../../utils/apis";
import {
    useLockerAddress,
    useRpcURL,
    useStorageContractAddress,
} from "../../hooks";

const TokenDistributionChart = ({
    presaleAddress,
    erc20Address,
    preSaleContract,
}) => {
    const HTTP_RPC_URL = useRpcURL();
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const LOCKER_ADDRESS = useLockerAddress();
    const { active, library } = useWeb3React();

    const [totalSupply, setTotalSupply] = useState(0);
    const [chartValues, setChartValues] = useState([]);
    const [projectStore, setProjectStore] = useState({});
    const [partnerKYCDetails, setPartnerKYCDetails] = useState({});
    const [partnerAuditDetails, setPartnerAuditDetails] = useState({});

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const loadData = async () => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        const web3 = new Web3(library ? library.provider : provider);

        const tokenContract = await new web3.eth.Contract(
            ERC20_ABI.abi,
            erc20Address
        );
        let _decimals = await tokenContract.methods.decimals().call();
        console.log(_decimals);
        const _lockerContract = await new web3.eth.Contract(
            ABI_LOCKER_CONTRACT,
            LOCKER_ADDRESS
        );

        const getAllLockers = await _lockerContract.methods
            .getAllLockers()
            .call();

        let _lockedAmount = 0;
        console.log("getAllLockers", getAllLockers);
        for (let lockerAddress of getAllLockers) {
            const _lockerTokenContract = new web3.eth.Contract(
                LOCKER_TOKEN.abi,
                lockerAddress
            );
            _lockerTokenContract.methods
                .lockedToken()
                .call()
                // eslint-disable-next-line no-loop-func
                .then(async (token) => {
                    if (token.toLowerCase() === erc20Address.toLowerCase()) {
                        const _balance = await _lockerTokenContract.methods
                            .LockedBalance()
                            .call();
                        _lockedAmount = _balance / 10 ** _decimals;
                        console.log(_balance, _lockedAmount);
                    }
                });
        }

        let burnedAmount = parseInt(
            web3.utils.fromWei(
                (
                    await tokenContract.methods.balanceOf(DEAD_ADDRESS).call()
                ).toString(),
                "ether"
            )
        );
        burnedAmount += parseInt(
            web3.utils.fromWei(
                (
                    await tokenContract.methods.balanceOf(ZERO_ADDRESS).call()
                ).toString(),
                "ether"
            )
        );

        let presaleAmount =
            (await preSaleContract.methods.tokensForPresale().call()) /
            10 ** _decimals;
        let _totalSupply =
            (await tokenContract.methods.totalSupply().call()) /
            10 ** _decimals;
        // console.log(_totalSupply);

        setTotalSupply(_totalSupply);

        let _listingAmount = parseInt(
            (await preSaleContract.methods.tokensForLiquidity().call()) /
                10 ** _decimals
        );

        let _chartValues = [0, 0, 0, 0, 0];
        _chartValues[0] = burnedAmount;
        _chartValues[1] = presaleAmount;
        _chartValues[2] = _listingAmount;
        _chartValues[3] = _lockedAmount;

        _chartValues[4] =
            _totalSupply - _chartValues.reduce((pv, cv) => pv + cv, 0);
        setChartValues(_chartValues);

        const _storageContract = await new web3.eth.Contract(
            ABI_StorageLaunchpad,
            STORAGE_CONTRACT_ADDRESS
        );
        const _projectStore = await _storageContract.methods
            .ProjectStoreByOwner(presaleAddress)
            .call();
        setProjectStore(_projectStore);
        const _partnerKYCDetails = await getPartnerDetails(
            _projectStore.kycComment
        );
        setPartnerKYCDetails(_partnerKYCDetails);

        const _partnerAuditDetails = await getPartnerDetails(
            _projectStore.auditComment
        );
        setPartnerAuditDetails(_partnerAuditDetails);
        // console.log(_partnerKYCDetails);
    };

    const chartOptions = {
        chart: {
            type: "donut",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        legend: {
            show: false,
        },
        labels: ["Burned", "Presale", "Listing", "Locked", "Unlocked"],
    };

    return (
        <div className="flex relative items-center">
            <div className="relative w-7/12 -translate-x-[15%]">
                <Chart
                    options={chartOptions}
                    series={chartValues}
                    type="donut"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center size-sm">
                    Total Supply
                    <br />
                    {numberConverter(totalSupply)}
                </span>
            </div>
            <div className="w-1/2 absolute right-0 flex flex-col size-xs items-end">
                <div className="flex flex-wrap justify-around gap-y-3 pr-1">
                    <span className="donut-label label-burned">
                        Burned <br />
                        {percentageConverter(chartValues[0], totalSupply)}
                    </span>
                    <span className="donut-label label-presale">
                        Presale <br />
                        {percentageConverter(chartValues[1], totalSupply)}
                    </span>
                    <span className="donut-label label-listing">
                        Listing <br />
                        {percentageConverter(chartValues[2], totalSupply)}
                    </span>
                    <span className="donut-label label-unlocked">
                        Locked <br />
                        {percentageConverter(chartValues[3], totalSupply)}
                    </span>
                    <span className="donut-label label-locked">
                        Unlocked <br />
                        {percentageConverter(chartValues[4], totalSupply)}
                    </span>
                </div>
                <div className="flex flex-row pt-2 gap-x-2 lg:w-[120%]">
                    <div
                        className="rounded-sm bg-[#C4C4C433] hover:bg-[#C4C4C466] duration-150 p-1 flex flex-row gap-x-1 items-center cursor-pointer"
                        onClick={() => {
                            if (projectStore.isKYC)
                                window.open(projectStore.isKYCLink, "_black");
                        }}
                    >
                        {projectStore.isKYC ? (
                            <img
                                src={getPartnerLogo(partnerKYCDetails)}
                                alt="KYC partner logo"
                                className="w-8 h-8"
                            />
                        ) : (
                            <FaTimes className="size-base" />
                        )}
                        <span className="text-center size-xs">
                            {projectStore.isKYC ? (
                                <>
                                    KYC
                                    <br />
                                    Certificate
                                </>
                            ) : (
                                <>
                                    No KYC
                                    <br />
                                    Certificate
                                </>
                            )}
                        </span>
                    </div>
                    <div
                        className="rounded-sm bg-[#C4C4C433] hover:bg-[#C4C4C466] duration-150 p-1 flex flex-row gap-x-1 items-center cursor-pointer"
                        onClick={() => {
                            if (projectStore.isAudited)
                                window.open(projectStore.isAuditLink, "_black");
                        }}
                    >
                        {projectStore.isAudited ? (
                            <img
                                src={getPartnerLogo(partnerAuditDetails)}
                                alt="Audit partner logo"
                                className="w-8 h-8"
                            />
                        ) : (
                            <FaTimes className="size-base" />
                        )}
                        <span className="text-center size-xs">
                            {projectStore.isAudited ? (
                                <>
                                    Audit
                                    <br />
                                    Certificate
                                </>
                            ) : (
                                <>
                                    No Audit
                                    <br />
                                    Certificate
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenDistributionChart;
