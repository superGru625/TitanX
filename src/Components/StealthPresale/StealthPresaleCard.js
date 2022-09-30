import { useEffect, useState } from "react";

import { AiFillPieChart, AiFillClockCircle } from "react-icons/ai";
import { BsShieldLockFill } from "react-icons/bs";

// import TimeCounter from "../TimeCounter/TimeCounter";

import { getPresaleDetails } from "../../utils/apis";

import ABI_NATIVE_TOKEN from "../../abis/stealth_launch/ABI_NativeToken.json";
import { abi as ABI_ERC20 } from "../../abis/ERC20.json";
import { numberConverter, sec2Format } from "../../utils/utils";
import LoadingBar from "../UI/LoadingBar";
import { getTokenLink } from "../../utils/constants";
import LinkWithSearchParams from "../UI/LinkWithSearchParams";
import StealthStatus from "../UI/StealthStatus";

const StealthPresaleCard = ({ address }) => {
    const [loading, setLoading] = useState(true);
    const [stealthData, setStealthData] = useState({});

    const [launchTime, setLaunchTime] = useState();
    const [currentTime, setCurrentTime] = useState();

    useEffect(() => {
        const forceUpdateInterval = setInterval(() => {
            setCurrentTime(Date.now() / 1000);
        }, 1000);
        return () => {
            clearInterval(forceUpdateInterval);
        };
    }, []);

    useEffect(() => {
        loadStealthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    const loadStealthData = async () => {
        const web3 = window.web3;
        const _nativeContract = await new web3.eth.Contract(
            ABI_NATIVE_TOKEN,
            address
        );

        let _tokensForLiquidity0,
            _tokensForLiquidity1,
            _token0,
            _token1,
            _token0Decimal,
            _token0Symbol,
            _token0TotalSupply,
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

        const BATCH_COUNT = 9;
        let counter = 0;

        await new Promise(function (resolve, reject) {
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

        const _offChainData = await getPresaleDetails(_token0.toLowerCase());

        setStealthData({
            token0: _token0,
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
        setLoading(false);
    };

    return stealthData.finalized ? (
        <LinkWithSearchParams
            to={{ pathname: `/dashboard/stealth-presale/${address}` }}
            className="group flex flex-row flex-wrap rounded-none py-4 px-12 gap-x-12 gap-y-4 items-center cursor-pointer card-component justify-center"
        >
            {loading ? (
                <LoadingBar text="" />
            ) : (
                <>
                    <img
                        src={getTokenLink(stealthData.offChainData)}
                        alt="ProfilePicture"
                        className="w-20 2xl:w-24 h-20 2xl:h-24 presale-logo"
                    />
                    <span className="size-1 font-bold tracking-wider md:text-left">
                        {stealthData.token0Symbol} - {stealthData.token1Symbol}
                    </span>
                    <span className="w-96 h-24 text-left overflow-hidden text-ellipsis">
                        {stealthData.offChainData.description}
                    </span>
                    <div className="w-36 flex gap-4 md:ml-auto relative">
                        <span className="absolute hidden group-hover:block size-xs text-white right-0 translate-x-1/2 -translate-y-full bg-amber-500 dark:bg-amber-400/50 rounded-lg py-1 px-2">
                            Reserved
                        </span>
                        <AiFillPieChart className="size-1 text-black dark:text-[#CDCDCD]" />
                        <span>
                            {stealthData.nativeBalance}{" "}
                            {stealthData.token1Symbol}
                        </span>
                    </div>
                    <div className="w-36 flex gap-4 items-center relative">
                        <span className="absolute hidden group-hover:block size-xs text-white right-0 -translate-y-full bg-lime-500 dark:bg-lime-400/50 rounded-lg py-1 px-2">
                            Launched
                        </span>
                        <AiFillClockCircle className="size-1 text-black dark:text-[#CDCDCD]" />
                        {sec2Format(currentTime - launchTime)}
                    </div>
                    <div className="w-28 flex gap-4 relative">
                        <span className="absolute hidden group-hover:block size-xs text-white right-0 translate-x-1/2 -translate-y-full bg-red-500 dark:bg-red-400/50 rounded-lg py-1 px-2">
                            LP %
                        </span>
                        <BsShieldLockFill className="size-1 text-black dark:text-[#CDCDCD]" />
                        {numberConverter(
                            stealthData.tokensForLiquidity0 /
                                stealthData.token0TotalSupply,
                            3
                        )}
                        %
                    </div>
                    <div className="w-48 flex">
                        <StealthStatus stealthData={stealthData} />
                    </div>
                </>
            )}
        </LinkWithSearchParams>
    ) : (
        <></>
    );
};

export default StealthPresaleCard;
