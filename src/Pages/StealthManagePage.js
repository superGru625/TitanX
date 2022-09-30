import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import LoadingBar from "../Components/UI/LoadingBar";
import {
    useNetworkScanURL,
    // useRpcURL,
    useStealthStorageAddress,
} from "../hooks";
import { getPresaleDetails } from "../utils/apis";
import { numberConverter, sec2Format } from "../utils/utils";

import ABI_NATIVE_TOKEN from "../abis/stealth_launch/ABI_NativeToken.json";
import { abi as ABI_ERC20 } from "../abis/ERC20.json";
import ABI_STEALTH_STORAGE from "../abis/stealth_launch/ABI_StealthStorage.json";
import ABI_STEALTH_LOCK from "../abis/stealth_launch/ABI_StealthLiquidityLock.json";

import UploadStealthDetails from "../Components/StealthPresale/UploadStealthDetails";
import { getEllipsisTxt } from "../helpers/formatters";

const StealthManagePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const STEALTH_STORAGE_ADDRESS = useStealthStorageAddress();

    const { active, library, account } = useWeb3React();

    const { address } = useParams();

    const [loading, setLoading] = useState(true);
    const [stealthData, setStealthData] = useState({});
    const [lockerContract, setLockerContract] = useState(null);

    const [, setLaunchTime] = useState();
    const [lockedTimestamp, setLockedTimestamp] = useState();
    const [currentTime, setCurrentTime] = useState();

    const [stealthContract, setStealthContract] = useState();

    const NETWORK_SCAN_URL = useNetworkScanURL();
    const contractUrlOnScan = (_address) => {
        return `${NETWORK_SCAN_URL}${_address}`;
    };

    useEffect(() => {
        const forceUpdateInterval = setInterval(() => {
            setCurrentTime(Date.now() / 1000);
        }, 1000);
        return () => {
            clearInterval(forceUpdateInterval);
        };
    }, []);

    useEffect(() => {
        const loadFirstAddress = async () => {
            const web3 = new Web3(library.provider);
            const _storageContract = await new web3.eth.Contract(
                ABI_STEALTH_STORAGE,
                STEALTH_STORAGE_ADDRESS
            );
            const _firstStealth = await _storageContract.methods
                .ProjectStoreByOwner(account, 0)
                .call();
            if (parseInt(_firstStealth.StealthContract)) {
                navigate({
                    pathname: `/dashboard/manage-stealth/${_firstStealth.StealthContract}`,
                    search: searchParams.toString(),
                });
            } else {
                setLoading(false);
            }
        };
        if (!library) {
            return;
        }

        window.web3 = new Web3(library.provider);

        if (address === undefined) {
            loadFirstAddress();
            return;
        }
        loadStealthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, library]);

    const loadStealthData = async () => {
        const web3 = window.web3;
        const _nativeContract = await new web3.eth.Contract(
            ABI_NATIVE_TOKEN,
            address
        );

        setStealthContract(_nativeContract);

        let _owner,
            _token0,
            _tokensForLiquidity0,
            _token0Decimal,
            _token0Symbol,
            _token1,
            _token0Name,
            _token0TotalSupply,
            _tokensForLiquidity1,
            _token1Decimal,
            _token1Symbol,
            _token1TotalSupply,
            _launchTime,
            _lockerLP,
            _lockedTimestamp,
            _finalized;

        _token0 = await _nativeContract.methods.token0().call();

        const _token0ERC20Contract = await new web3.eth.Contract(
            ABI_ERC20,
            _token0
        );

        _token1 = await _nativeContract.methods.token1().call();

        const _token1ERC20Contract = await new web3.eth.Contract(
            ABI_ERC20,
            _token1
        );

        const BATCH_COUNT = 11;
        let counter = 0;

        await new Promise(function (resolve, reject) {
            _nativeContract.methods.owner().call({}, async (err, owner) => {
                if (err) reject(err);
                _owner = owner;
                if (account !== _owner) navigate("/dashboard");
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });
            _nativeContract.methods
                .tokensForLiquidity0()
                .call({}, async (err, tokensForLiquidity0) => {
                    if (err) reject(err);
                    _tokensForLiquidity0 = tokensForLiquidity0;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
            _nativeContract.methods
                .tokensForLiquidity1()
                .call({}, async (err, tokensForLiquidity1) => {
                    if (err) reject(err);
                    _tokensForLiquidity1 = tokensForLiquidity1;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
            _nativeContract.methods
                .launchTime()
                .call({}, async (err, launchTime) => {
                    if (err) reject(err);
                    _launchTime = launchTime;
                    setLaunchTime(_launchTime);
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
            _nativeContract.methods
                .lockerLP()
                .call({}, async (err, lockerLP) => {
                    if (err) reject(err);
                    _lockerLP = lockerLP;
                    const _lockerContract = await new web3.eth.Contract(
                        ABI_STEALTH_LOCK,
                        lockerLP
                    );
                    _lockedTimestamp = await _lockerContract.methods
                        .LockedTimestamp()
                        .call();
                    setLockedTimestamp(_lockedTimestamp);
                    setLockerContract(_lockerContract);
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
            _nativeContract.methods
                .finalized()
                .call({}, async (err, finalized) => {
                    if (err) reject(err);
                    _finalized = finalized;
                    console.log(finalized);
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token0ERC20Contract.methods
                .decimals()
                .call({}, async (err, decimals) => {
                    if (err) reject(err);
                    _token0Decimal = decimals;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token0ERC20Contract.methods
                .symbol()
                .call({}, async (err, symbol) => {
                    if (err) reject(err);
                    _token0Symbol = symbol;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token0ERC20Contract.methods.name().call({}, async (err, name) => {
                if (err) reject(err);
                _token0Name = name;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _token0ERC20Contract.methods
                .totalSupply()
                .call({}, async (err, totalSupply) => {
                    if (err) reject(err);
                    _token0TotalSupply = totalSupply;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
            _token1ERC20Contract.methods
                .decimals()
                .call({}, async (err, decimals) => {
                    if (err) reject(err);
                    _token1Decimal = decimals;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token1ERC20Contract.methods
                .symbol()
                .call({}, async (err, symbol) => {
                    if (err) reject(err);
                    _token1Symbol = symbol;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token1ERC20Contract.methods
                .totalSupply()
                .call({}, async (err, totalSupply) => {
                    if (err) reject(err);
                    _token1TotalSupply = totalSupply;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
        });

        const _offChainData = await getPresaleDetails(_token0.toLowerCase());

        setStealthData({
            owner: _owner,
            token0: _token0.toLowerCase(),
            token0Name: _token0Name,
            token0Symbol: _token0Symbol,
            token1Symbol: _token1Symbol,
            tokenBalance: numberConverter(
                _tokensForLiquidity0 / 10 ** _token0Decimal,
                3
            ),
            nativeBalance: numberConverter(
                _tokensForLiquidity1 / 10 ** _token1Decimal,
                3
            ),
            offChainData: _offChainData,
            tokensForLiquidity0: _tokensForLiquidity0,
            token0TotalSupply: _token0TotalSupply,
            finalized: _finalized,
            lockerLP: _lockerLP,
            token1TotalSupply: _token1TotalSupply,
        });

        setLoading(false);
    };

    const onLaunchStealth = async () => {
        await stealthContract.methods.launchSteahlth().send({ from: account });
    };
    const claimLockedTokens = async () => {
        console.log(lockerContract);
        await lockerContract.methods
            .claimLockedTokens()
            .send({ from: account });
    };
    const withdrawFunds = async () => {
        await stealthContract.methods.withdrawFunds().send({ from: account });
    };
    return (
        <div className="flex flex-col component-container animation-fade-in main-container pt-6">
            {active ? (
                loading ? (
                    <LoadingBar />
                ) : address ? (
                    <div className="main-container component-container items-center text-center animation-fade-in flex flex-col">
                        <h3 className="px-6 lg:pt-8">Manage Your Stealth</h3>

                        <div className="w-full lg:w-5/12 flex flex-col pt-8">
                            <div className="flex items-center justify-between p-3 border-b border-b-gray-300">
                                <div className="flex flex-col items-start">
                                    <span className="size-base">
                                        Finalise Stealth
                                    </span>
                                    <span>
                                        Once you click finalise the liquidity
                                        will be create
                                    </span>
                                </div>
                                <button
                                    className="w-32 rounded-full px-6 border border-itemIndigo dark:border-itemPurple size-sm hover:bg-itemIndigo hover:bg-opacity-30"
                                    onClick={onLaunchStealth}
                                >
                                    Finalize
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 border-b border-b-gray-300">
                                <div className="flex flex-col items-start">
                                    <span className="size-base">
                                        Unlock Liquidity
                                    </span>
                                    {lockedTimestamp > currentTime && (
                                        <span>
                                            Liquidity unlocks in{" "}
                                            {sec2Format(
                                                lockedTimestamp - currentTime
                                            )}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="w-32 rounded-full px-6 border border-itemIndigo dark:border-itemPurple size-sm hover:bg-itemIndigo hover:bg-opacity-30"
                                    onClick={claimLockedTokens}
                                >
                                    Unlock
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 border-b border-b-gray-300">
                                <div className="flex flex-col items-start">
                                    <span className="size-base">
                                        Changed your mind?
                                    </span>
                                    <span>
                                        Withdraw the tokens you deposited{" "}
                                    </span>
                                </div>
                                <button
                                    className="w-32 rounded-full px-6 border border-itemIndigo dark:border-itemPurple size-sm hover:bg-itemIndigo hover:bg-opacity-30"
                                    onClick={withdrawFunds}
                                >
                                    Withdraw
                                </button>
                            </div>
                            <UploadStealthDetails
                                token0Address={stealthData.token0}
                                offChainData={stealthData.offChainData}
                            />
                            <div className="flex items-center justify-between mt-4 p-3">
                                <span>Token Address</span>

                                <a
                                    href={contractUrlOnScan(stealthData.token0)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-itemIndigo dark:text-itemPurple"
                                >
                                    {getEllipsisTxt(stealthData.token0)}
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h4 className="mx-auto pt-12">
                        You don't have any Stealth
                    </h4>
                )
            ) : (
                <h4 className="mx-auto pt-12">Please Connect Your Wallet</h4>
            )}
        </div>
    );
};

export default StealthManagePage;
