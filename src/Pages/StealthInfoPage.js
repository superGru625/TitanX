import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StealthInfoCard from "../Components/StealthPresale/StealthPresaleInfo/StealthInfoCard";
import LoadingBar from "../Components/UI/LoadingBar";
import { useRpcURL } from "../hooks";
import { getPresaleDetails } from "../utils/apis";
import { numberConverter } from "../utils/utils";

import ABI_NATIVE_TOKEN from "../abis/stealth_launch/ABI_NativeToken.json";
import { abi as ABI_ERC20 } from "../abis/ERC20.json";
import StealthDescription from "../Components/StealthPresale/StealthPresaleInfo/StealthDescription";
import TokenDistribtuion from "../Components/StealthPresale/StealthPresaleInfo/TokenDistribution";

const StealthInfoPage = () => {
    const HTTP_RPC_URL = useRpcURL();
    const { library } = useWeb3React();

    const { address } = useParams();

    const [loading, setLoading] = useState(true);
    const [stealthData, setStealthData] = useState({});

    const [stealthInfoArray, setStealthInfoArray] = useState();

    const [, setLaunchTime] = useState();
    const [, setCurrentTime] = useState();

    useEffect(() => {
        const forceUpdateInterval = setInterval(() => {
            setCurrentTime(Date.now() / 1000);
        }, 1000);
        return () => {
            clearInterval(forceUpdateInterval);
        };
    }, []);

    useEffect(() => {
        const provider = new Web3.providers.HttpProvider(HTTP_RPC_URL);
        window.web3 = new Web3(library?.provider ? library.provider : provider);
        loadStealthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const loadStealthData = async () => {
        const web3 = window.web3;
        const _nativeContract = await new web3.eth.Contract(
            ABI_NATIVE_TOKEN,
            address
        );

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

        const BATCH_COUNT = 12;
        let counter = 0;

        await new Promise(function (resolve, reject) {
            _nativeContract.methods.owner().call({}, (err, owner) => {
                if (err) reject(err);
                _owner = owner;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _nativeContract.methods
                .tokensForLiquidity0()
                .call({}, (err, tokensForLiquidity0) => {
                    if (err) reject(err);
                    _tokensForLiquidity0 = tokensForLiquidity0;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _nativeContract.methods
                .tokensForLiquidity1()
                .call({}, (err, tokensForLiquidity1) => {
                    if (err) reject(err);
                    _tokensForLiquidity1 = tokensForLiquidity1;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _nativeContract.methods.launchTime().call({}, (err, launchTime) => {
                if (err) reject(err);
                _launchTime = launchTime;
                setLaunchTime(_launchTime);
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _nativeContract.methods.finalized().call({}, (err, finalized) => {
                if (err) reject(err);
                _finalized = finalized;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _token0ERC20Contract.methods
                .decimals()
                .call({}, (err, decimals) => {
                    if (err) reject(err);
                    _token0Decimal = decimals;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token0ERC20Contract.methods.symbol().call({}, (err, symbol) => {
                if (err) reject(err);
                _token0Symbol = symbol;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _token0ERC20Contract.methods.name().call({}, (err, name) => {
                if (err) reject(err);
                _token0Name = name;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _token0ERC20Contract.methods
                .totalSupply()
                .call({}, (err, totalSupply) => {
                    if (err) reject(err);
                    _token0TotalSupply = totalSupply;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token1ERC20Contract.methods
                .decimals()
                .call({}, (err, decimals) => {
                    if (err) reject(err);
                    _token1Decimal = decimals;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });

            _token1ERC20Contract.methods.symbol().call({}, (err, symbol) => {
                if (err) reject(err);
                _token1Symbol = symbol;
                counter++;
                if (counter === BATCH_COUNT) resolve();
            });

            _token1ERC20Contract.methods
                .totalSupply()
                .call({}, (err, totalSupply) => {
                    if (err) reject(err);
                    _token1TotalSupply = totalSupply;
                    counter++;
                    if (counter === BATCH_COUNT) resolve();
                });
        });

        console.log("owner", _owner, _token0);
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
            launchTime: _launchTime,
            token1TotalSupply: _token1TotalSupply,
        });

        setStealthInfoArray([
            { name: "Listed On", number: "Pancakeswap" },
            {
                name: `Starting ${"BNB"}`,
                number: numberConverter(
                    _tokensForLiquidity1 / 10 ** _token1Decimal,
                    3
                ),
            },
            {
                name: "Liquidity %",
                number: `${numberConverter(
                    _tokensForLiquidity0 / _token0TotalSupply,
                    3
                )} %`,
            },
            {
                name: "Launch Date",
                number: new Date(_launchTime * 1000).toLocaleString(),
            },
        ]);

        setLoading(false);
    };
    return (
        <div
            className={`flex flex-col animation-fade-in main-container presale-page presale-page-${
                parseInt(address.slice(0, 4)) % 4
            }`}
        >
            {loading ? (
                <LoadingBar />
            ) : (
                <>
                    <div className="flex flex-col-reverse lg:flex-row gap-8 mb-8">
                        <div className="component-container w-full lg:w-[27%] rounded-2xl shadow-lg">
                            <StealthInfoCard
                                token0Address={stealthData.token0}
                                stealthAddress={address}
                                stealthInfoArray={stealthInfoArray}
                            />
                        </div>

                        <div className="w-full lg:w-[73%] flex flex-col lg:flex-row gap-8">
                            <div className="component-container w-full lg:w-[63%]  rounded-2xl shadow-lg flex flex-col">
                                <StealthDescription stealthData={stealthData} />
                            </div>
                            <div className="component-container w-full lg:w-[37%]  rounded-2xl shadow-lg flex flex-col">
                                <TokenDistribtuion
                                    erc20Address={stealthData.token0}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StealthInfoPage;
