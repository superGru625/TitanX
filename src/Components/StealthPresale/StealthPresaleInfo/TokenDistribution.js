import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

import ERC20_ABI from "../../../abis/ERC20.json";
import ABI_LOCKER_CONTRACT from "../../../abis/LiquidityLockerDappABI.json";
import LOCKER_TOKEN from "../../../abis/TokenLockerabi.json";

import { DEAD_ADDRESS, ZERO_ADDRESS } from "../../../utils/constants";
import { numberConverter, percentageConverter } from "../../../utils/utils";
import { useLockerAddress, useRpcURL } from "../../../hooks";

const TokenDistribtuion = ({ erc20Address }) => {
    const HTTP_RPC_URL = useRpcURL();
    const LOCKER_ADDRESS = useLockerAddress();
    const { active, library } = useWeb3React();

    const [totalSupply, setTotalSupply] = useState(0);
    const [chartValues, setChartValues] = useState([]);

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
        const _lockerContract = await new web3.eth.Contract(
            ABI_LOCKER_CONTRACT,
            LOCKER_ADDRESS
        );

        const getAllLockers = await _lockerContract.methods
            .getAllLockers()
            .call();

        let _lockedAmount = 0;

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
                    if (token === erc20Address) {
                        const _balance = await _lockerTokenContract.methods
                            .LockedBalance()
                            .call();
                        _lockedAmount = parseInt(
                            web3.utils.fromWei(_balance.toString(), "ether")
                        );
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

        let _totalSupply = parseInt(
            (await tokenContract.methods.totalSupply().call()) / 10 ** _decimals
        );

        setTotalSupply(_totalSupply);

        let _chartValues = [0, 0, 0, 0, 0];
        _chartValues[0] = burnedAmount;
        _chartValues[1] = 0;
        _chartValues[2] = _lockedAmount;
        _chartValues[3] =
            _totalSupply - _chartValues.reduce((pv, cv) => pv + cv, 0);
        setChartValues(_chartValues);
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
        labels: ["Burned", "Liquidity", "Locked", "Unlocked"],
    };

    return (
        <div className="flex flex-col">
            <div className="font-semibold size-2 p-4">Token Distribution</div>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
            <div className="flex relative items-center pt-6">
                <div className="relative w-2/3 -translate-x-[15%]">
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
                <div className="w-1/2 absolute right-0 pl-3 flex flex-col size-xs items-center gap-y-2">
                    <span className="donut-label w-full label-burned">
                        Burned{" "}
                        {percentageConverter(chartValues[0], totalSupply)}
                    </span>
                    <span className="donut-label w-full label-listing">
                        Liquidity{" "}
                        {percentageConverter(chartValues[1], totalSupply)}
                    </span>
                    <span className="donut-label w-full label-unlocked">
                        Locked{" "}
                        {percentageConverter(chartValues[2], totalSupply)}
                    </span>
                    <span className="donut-label w-full label-locked">
                        Unlocked{" "}
                        {percentageConverter(chartValues[3], totalSupply)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TokenDistribtuion;
