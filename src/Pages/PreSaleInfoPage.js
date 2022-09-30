import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Heart from "react-heart";

import WhiteListPresale from "../Components/PresaleInfo/WhiteListedPresale";
import WithdrawAndSubmit from "../Components/PresaleInfo/WithdrawAndSubmit";
// import PreSaleStartsIn from "../Components/PresaleInfo/PreSaleStartsIn";
import ContributeAndClaim from "../Components/PresaleInfo/ContributeAndClaim";
import PreInfoCard from "../Components/PresaleInfo/PreInfoCard";
import SocialLinks from "../Components/PresaleInfo/SocialLinks";
import LoadingBar from "../Components/UI/LoadingBar";

import PresaleABI from "../abis/ABI_Presale.json";
import ERC20_ABI from "../abis/ERC20.json";
import { getPresaleDetails } from "../utils/apis";
import { timeConverter } from "../utils/utils";

import {
    PRESALE_UPCOMING,
    PRESALE_INPROGRESS,
    PRESALE_FILLED,
    PRESALE_CANCELED,
    PRESALE_ENDED,
    PRESALE_ENDED_NOT_MET_SOFTCAP,
    getTokenLink,
    PRESALE_FINALISED,
} from "../utils/constants";
import TokenStatus from "../Components/UI/TokenStatus";
import TokenTimer from "../Components/UI/TokenTimer";
import TokenDistributionChart from "../Components/PresaleInfo/TokenDistributionChart";
import { useRpcURL, useValidAccount } from "../hooks";

const PreSaleInfoPage = () => {
    const HTTP_RPC_URL = useRpcURL();
    const { active, library } = useWeb3React();
    const { account } = useValidAccount();

    const [preSaleContract, setPresaleContract] = useState(null);
    const [presaleData, setPresaleData] = useState(false);
    const [preSaleinfoArray, setPreSaleinfoArray] = useState([]);
    const [tokenAddress, setTokenAddress] = useState(null);
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [isWhitelist, setIsWhitelist] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const { address } = useParams();
    const [offChainData, setOffChainData] = useState({});

    const [liked, setLiked] = useState(true);

    const [presaleStatus, setPresaleStatus] = useState("");
    const [finalized, setFinalized] = useState(false);

    const [currentTime, setcurrentTime] = useState(new Date().getTime() / 1000);

    useEffect(() => {
        if (presaleStatus !== "") {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presaleStatus]);

    useEffect(() => {
        const timeUpdateInterval = setInterval(
            () => setcurrentTime(new Date().getTime() / 1000),
            1000
        );
        const loadDataInterval = setInterval(() => {
            loadData();
        }, 5000);
        return () => {
            clearInterval(timeUpdateInterval);
            clearInterval(loadDataInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    useEffect(() => {
        if (!presaleData) return;
        if (finalized === true) setPresaleStatus(PRESALE_FINALISED);
        else if (
            presaleData.progress >=
            presaleData.hardCap - presaleData.minCon
        )
            setPresaleStatus(PRESALE_FILLED);
        else if (currentTime < presaleData.preSaleStartTime)
            setPresaleStatus(PRESALE_UPCOMING);
        else if (currentTime < presaleData.preSaleEndTime) {
            if (presaleData.presaleState === 0)
                setPresaleStatus(PRESALE_CANCELED);
            else {
                // setPresaleStatus(PRESALE_ENDED);
                setPresaleStatus(PRESALE_INPROGRESS);
            }
        } else {
            //time ended
            if (presaleData.progress < presaleData.softCap)
                setPresaleStatus(PRESALE_ENDED_NOT_MET_SOFTCAP);
            else if (presaleData.presaleState === 0)
                setPresaleStatus(PRESALE_CANCELED);
            else setPresaleStatus(PRESALE_ENDED);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presaleData, currentTime]);

    useEffect(() => {
        const fetchOffchain = async () => {
            const _offChainData = await getPresaleDetails(address);
            setOffChainData(_offChainData);
        };
        if (address === "" || address === null || address === undefined) {
        } else {
            const provider = new Web3.providers.HttpProvider(HTTP_RPC_URL);
            window.web3 = new Web3(library ? library.provider : provider);
            fetchOffchain();
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    const loadData = async () => {
        const web3 = window.web3;

        let _preSaleContract = await new web3.eth.Contract(PresaleABI, address);
        setPresaleContract(_preSaleContract);

        // console.log(await _preSaleContract.methods.lockerLP().call());

        let _tokenName,
            _tokenSymbol,
            _tokenAddress,
            _presaleState,
            _finalized,
            _hardCap,
            _tokenListingRate,
            _tokenPresaleRate,
            _isWhitelisted,
            _isWhitelist,
            _contribution,
            _Mincontribution,
            _Maxcontribution,
            _tokenLockTime,
            _preSaleStartTime,
            _preSaleEndTime,
            _liqudity,
            _progress;

        let counter = 0;
        const BATCH_COUNT = 18;
        try {
            await new Promise((resolve, reject) => {
                _preSaleContract.methods
                    .tokenName()
                    .call({}, (err, tokenName) => {
                        if (err) reject(err);
                        counter++;
                        _tokenName = tokenName;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenSymbol()
                    .call({}, (err, tokenSymbol) => {
                        if (err) reject(err);
                        counter++;
                        _tokenSymbol = tokenSymbol;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .token()
                    .call({}, (err, tokenAddress) => {
                        if (err) reject(err);
                        counter++;
                        _tokenAddress = tokenAddress;

                        setTokenAddress(_tokenAddress);
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .presaleState()
                    .call({}, (err, presaleState) => {
                        if (err) reject(err);
                        counter++;
                        _presaleState = parseInt(presaleState);
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .finalized()
                    .call({}, (err, finalized) => {
                        if (err) reject(err);
                        counter++;
                        _finalized = finalized;
                        setFinalized(_finalized);
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenHardCap()
                    .call({}, (err, hardCap) => {
                        if (err) reject(err);
                        counter++;
                        _hardCap = hardCap;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenListingRate()
                    .call({}, (err, tokenListingRate) => {
                        if (err) reject(err);
                        counter++;
                        _tokenListingRate = tokenListingRate;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenPresaleRate()
                    .call({}, (err, tokenPresaleRate) => {
                        if (err) reject(err);
                        counter++;
                        _tokenPresaleRate = tokenPresaleRate;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .isWhitelisted(account)
                    .call({}, (err, isWhitelisted) => {
                        if (err) {
                            reject(err);
                        }
                        counter++;
                        _isWhitelisted = isWhitelisted;
                        setIsWhitelisted(_isWhitelisted);
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .isWhitelist()
                    .call({}, (err, isWhitelist) => {
                        if (err) reject(err);
                        counter++;
                        _isWhitelist = isWhitelist;
                        setIsWhitelist(_isWhitelist);
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .getContribution(account)
                    .call({}, (err, contribution) => {
                        if (err) reject(err);
                        counter++;
                        _contribution = contribution;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenMinContribution()
                    .call({}, (err, Mincontribution) => {
                        if (err) reject(err);
                        counter++;
                        _Mincontribution = Mincontribution;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenMaxContribution()
                    .call({}, (err, Maxcontribution) => {
                        if (err) reject(err);
                        counter++;
                        _Maxcontribution = Maxcontribution;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenLockTime()
                    .call({}, (err, tokenLockTime) => {
                        if (err) reject(err);
                        counter++;
                        _tokenLockTime = tokenLockTime;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenStartTime()
                    .call({}, (err, preSaleStartTime) => {
                        if (err) reject(err);
                        counter++;
                        _preSaleStartTime = preSaleStartTime;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenEndTime()
                    .call({}, (err, preSaleEndTime) => {
                        if (err) reject(err);
                        counter++;
                        _preSaleEndTime = preSaleEndTime;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .tokenDEXLiquidity()
                    .call({}, (err, liqudity) => {
                        if (err) reject(err);
                        counter++;
                        _liqudity = liqudity;
                        if (counter === BATCH_COUNT) resolve();
                    });

                _preSaleContract.methods
                    .weiRaised()
                    .call({}, (err, progress) => {
                        if (err) reject(err);
                        counter++;
                        _progress = progress;
                        if (counter === BATCH_COUNT) resolve();
                    });
            });
        } catch (error) {
            return;
        }
        if (_tokenAddress === undefined) return;
        let _tokenContract = await new web3.eth.Contract(
            ERC20_ABI.abi,
            _tokenAddress
        );
        const _decimals = await _tokenContract.methods.decimals().call();

        const _preInfoArray = [
            {
                name: "Soft Cap",
                number: _hardCap / 2,
            },
            {
                name: "Hard Cap",
                number: _hardCap,
            },
            {
                name: "Liquidity%",
                number: _liqudity + "%",
            },
            {
                name: "Enable Whitelist",
                number: _isWhitelisted ? "Yes" : "No",
            },
            {
                name: "Listing Rate",
                number: _tokenListingRate,
            },
            {
                name: "Presale Rate",
                number: _tokenPresaleRate / 10 ** _decimals,
            },
            {
                name: "Minimum Contribution",
                number: web3.utils.fromWei(
                    _Mincontribution.toString(),
                    "ether"
                ),
            },
            {
                name: "Maximum Contribution",
                number: web3.utils.fromWei(
                    _Maxcontribution.toString(),
                    "ether"
                ),
            },
            {
                name: "Presale Start Date",
                number: timeConverter(_preSaleStartTime),
            },
            {
                name: "Presale End Date",
                number: timeConverter(_preSaleEndTime),
            },
            {
                name: "Liquity Lock Time",
                number: timeConverter(_tokenLockTime),
            },
        ];

        setPresaleData({
            tokenName: _tokenName,
            presaleState: _presaleState,
            tokenSymbol: _tokenSymbol,
            preSaleStartTime: _preSaleStartTime,
            preSaleEndTime: _preSaleEndTime,
            hardCap: _hardCap,
            softCap: _hardCap / 2,
            minCon: web3.utils.fromWei(_Mincontribution.toString(), "ether"),
            maxCon: web3.utils.fromWei(_Maxcontribution.toString(), "ether"),
            contribution: web3.utils.fromWei(_contribution.toString(), "ether"),
            lockupTime: _tokenLockTime,
            progress: web3.utils.fromWei(_progress.toString(), "ether"),
            presaleRate: _tokenPresaleRate / 10 ** _decimals,
        });
        // console.log(_tokenSymbol)

        setPreSaleinfoArray(_preInfoArray);
        setLoadingData(false);
    };

    return (
        <div
            className={`flex flex-col animation-fade-in main-container presale-page presale-page-${
                parseInt(address.slice(0, 4)) % 4
            }`}
        >
            {loadingData ? (
                <LoadingBar />
            ) : (
                <>
                    <div
                        className="flex h-32 lg:h-48 2xl:h-64 rounded-2xl presale-banner px-2 md:px-8 mb-12 text-white"
                        style={{
                            backgroundImage: getTokenLink(
                                offChainData,
                                "banner"
                            )
                                ? `url(${getTokenLink(offChainData, "banner")})`
                                : "",
                        }}
                    >
                        <img
                            src={getTokenLink(offChainData)}
                            className="presale-logo w-24 lg:w-32 2xl:w-48 h-24 lg:h-32 2xl:h-48 translate-y-2/3 2xl:translate-y-1/2"
                            alt="token avatar"
                        />
                        <div className="hidden lg:flex flex-col justify-end text-center pl-8">
                            <span className="size-1 lg:size-2">Socials</span>
                            <div className="flex gap-4 size-2">
                                <SocialLinks offChainData={offChainData} />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full text-right">
                            <span className="size-1">
                                {presaleData.tokenName}
                            </span>
                            <span className="size-sm">Soft/Hard Cap:</span>
                            <span className="size-base">
                                {presaleData.softCap}-{presaleData.hardCap} BNB
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse lg:flex-row gap-8 mb-8">
                        <div className="component-container w-full lg:w-[27%] rounded-2xl shadow-lg">
                            <PreInfoCard
                                preSaleinfoArray={preSaleinfoArray}
                                tokenAddress={tokenAddress}
                                presaleAddress={address}
                            />
                        </div>
                        <div className="w-full lg:w-[73%] flex flex-col lg:flex-row gap-8">
                            <div className="component-container w-full lg:w-[63%]  rounded-2xl shadow-lg flex flex-col">
                                <div className="ml-auto py-2 pr-4">
                                    <TokenStatus
                                        presaleStatus={presaleStatus}
                                    />
                                </div>
                                <div className="px-3 pb-1">
                                    <TokenTimer
                                        status={presaleStatus}
                                        currentTime={currentTime}
                                        preSaleStartTime={
                                            presaleData.preSaleStartTime
                                        }
                                        preSaleEndTime={
                                            presaleData.preSaleEndTime
                                        }
                                        lockupTime={presaleData.lockupTime}
                                    />
                                </div>
                                <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
                                <ContributeAndClaim
                                    presaleData={presaleData}
                                    preSaleAddress={address}
                                    active={active}
                                    account={account}
                                    preSaleContract={preSaleContract}
                                    presaleStatus={presaleStatus}
                                    tokenAddress={tokenAddress}
                                    forceUpdate={loadData}
                                />
                                <WithdrawAndSubmit
                                    preSaleAddress={address}
                                    active={active}
                                    account={account}
                                    preSaleContract={preSaleContract}
                                    presaleData={presaleData}
                                />
                            </div>
                            <div className="component-container w-full lg:w-[37%] rounded-2xl shadow-lg flex flex-col pb-4">
                                <div className="font-semibold size-2 py-4 text-center">
                                    Project Break down
                                </div>
                                <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px]"></div>
                                <div className="p-4 flex flex-col">
                                    <div className="flex size-2 items-center mb-1">
                                        <span className="font-semibold text-itemIndigo dark:text-itemPurple">
                                            About
                                        </span>
                                        <div className="w-8 ml-1">
                                            <Heart
                                                isActive={liked}
                                                onClick={() => setLiked(!liked)}
                                                activeColor="#FFCDD2"
                                                inactiveColor="#440AD3"
                                                animationTrigger="hover"
                                                animationScale={1.2}
                                            />
                                        </div>
                                    </div>
                                    <span>{offChainData.description}</span>
                                </div>
                                <TokenDistributionChart
                                    presaleAddress={address}
                                    erc20Address={tokenAddress}
                                    preSaleContract={preSaleContract}
                                />
                                <WhiteListPresale
                                    isWhitelisted={isWhitelisted}
                                    isWhitelist={isWhitelist}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default PreSaleInfoPage;
