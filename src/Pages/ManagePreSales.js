import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import PresaleManager from "../Components/PresaleInfo/PresaleManager";
import PreSaleTest from "../Components/PresaleInfo/PresaleTest";
import PreSalesTools from "../Components/PresaleInfo/PreSalesTools";
import PresaleSteps from "../Components/PresaleInfo/PreSaleSteps";
import PreSaleExlude from "../Components/PresaleInfo/PreSaleExclude";
import PresaleDeposit from "../Components/PresaleInfo/PresaleDeposit";
import LoadingBar from "../Components/UI/LoadingBar";
import PresaleDetails from "../Components/PresaleInfo/PresaleDetails";
import AddRemoveWhitelist from "../Components/PresaleInfo/AddRemoveWhitelist";

import { getEllipsisTxt } from "../helpers/formatters";

import PresaleABI from "../abis/ABI_Presale.json";
import ABI_StorageLaunchpad from "../abis/ABI_StorageLaunchpad.json";
import ABI_LIQUIDITY_LOCK_PERSONAL from "../abis/presale/ABI_LIQUIDITY_LOCK_PERSONAL.json";
import { getPresaleDetails } from "../utils/apis";
import { useNetworkScanURL, useStorageContractAddress } from "../hooks";
import LinkWithSearchParams from "../Components/UI/LinkWithSearchParams";

const ManagePresale = () => {
    const NETWORK_SCAN_URL = useNetworkScanURL();
    const contractUrlOnScan = (_address) => {
        return `${NETWORK_SCAN_URL}${_address}`;
    };
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();
    const [searchParams] = useSearchParams();

    const [detailModalVisible, setDetailModalVisible] = useState(
        searchParams.get("detailmodal") === "true"
    );
    const [whitelistModalVisible, setWhitelistModalVisible] = useState(false);
    const [presaleContract, setPresaleContract] = useState(null);
    const [lockerLPContract, setLockerLPContract] = useState(null);
    const [presaleAddress, setPresaleAddress] = useState(null);

    const { active, account, library } = useWeb3React();

    const [tokenDetails, setTokenDetails] = useState(null);

    const [checkLoading, setcheckLoading] = useState(true);
    const [loadingMainData, setLoadingMainData] = useState(true);
    const [offChainData, setOffChainData] = useState({});
    useEffect(() => {
        if (active === true) {
            window.web3 = new Web3(library.provider);
            checkPresaleAddress();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, STORAGE_CONTRACT_ADDRESS]);

    const checkPresaleAddress = async () => {
        const web3 = window.web3;
        const _storageContract = await new web3.eth.Contract(
            ABI_StorageLaunchpad,
            STORAGE_CONTRACT_ADDRESS
        );
        const _totalProjects = await _storageContract.methods
            .getProjectsCount()
            .call();
        console.log(_totalProjects);
        for (let index = 0; index <= _totalProjects - 1; index++) {
            _storageContract.methods
                .entryListByPresaleAddress(index)
                .call({}, async (err, _presaleAddress) => {
                    let _preSaleContract = await new web3.eth.Contract(
                        PresaleABI,
                        _presaleAddress
                    );

                    try {
                        let _owner = await _preSaleContract.methods
                            .owner()
                            .call();

                        if (_owner === account) {
                            setPresaleAddress(_presaleAddress);
                            setPresaleContract(_preSaleContract);
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                });
        }
        setcheckLoading(false);
    };

    useEffect(() => {
        if (presaleContract != null) {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presaleContract]);

    const loadData = async () => {
        const web3 = window.web3;
        const _offChainData = await getPresaleDetails(presaleAddress);
        setOffChainData(_offChainData);

        let _tokenName,
            _tokenSymbol,
            _token,
            _tokenHardCap,
            _weiRaised,
            _tokenMaxContribution,
            _tokenMinContribution,
            _isWhitelist,
            _lockerLP;

        const BATCH_COUNT = 9;
        let counter = 0;

        await new Promise(function (resolve, reject) {
            presaleContract.methods
                .tokenName()
                .call({}, async (err, tokenName) => {
                    if (err) reject(err);
                    counter++;
                    _tokenName = tokenName;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .tokenSymbol()
                .call({}, async (err, tokenSymbol) => {
                    if (err) reject(err);
                    counter++;
                    _tokenSymbol = tokenSymbol;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods.token().call({}, async (err, token) => {
                if (err) reject(err);
                counter++;
                _token = token;
                if (counter === BATCH_COUNT) resolve();
            });

            presaleContract.methods
                .tokenHardCap()
                .call({}, async (err, tokenHardCap) => {
                    if (err) reject(err);
                    counter++;
                    _tokenHardCap = tokenHardCap;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .weiRaised()
                .call({}, async (err, weiRaised) => {
                    if (err) reject(err);
                    counter++;
                    _weiRaised = weiRaised;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .tokenMaxContribution()
                .call({}, async (err, tokenMaxContribution) => {
                    if (err) reject(err);
                    counter++;
                    _tokenMaxContribution = tokenMaxContribution;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .tokenMinContribution()
                .call({}, async (err, tokenMinContribution) => {
                    if (err) reject(err);
                    counter++;
                    _tokenMinContribution = tokenMinContribution;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .isWhitelist()
                .call({}, async (err, isWhitelist) => {
                    if (err) reject(err);
                    counter++;
                    _isWhitelist = isWhitelist;
                    if (counter === BATCH_COUNT) resolve();
                });

            presaleContract.methods
                .lockerLP()
                .call({}, async (err, lockerLP) => {
                    if (err) reject(err);
                    counter++;
                    _lockerLP = lockerLP;
                    const _lockerLPContract = new web3.eth.Contract(
                        ABI_LIQUIDITY_LOCK_PERSONAL,
                        _lockerLP
                    );
                    setLockerLPContract(_lockerLPContract);
                    if (counter === BATCH_COUNT) resolve();
                });
        });
        const tokenArray = [
            {
                name: "Name",
                text: _tokenName,
            },
            {
                name: "Symbol",
                text: _tokenSymbol,
            },
            {
                name: "Token Address",
                text: (
                    <a
                        href={contractUrlOnScan(_token)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-itemIndigo dark:text-itemPurple"
                    >
                        {getEllipsisTxt(_token)}
                    </a>
                ),
            },
            {
                name: "Presale Address",
                text: (
                    <a
                        href={contractUrlOnScan(presaleAddress)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-itemIndigo dark:text-itemPurple"
                    >
                        {getEllipsisTxt(presaleAddress)}
                    </a>
                ),
            },
            {
                name: "Presale Link",
                text: (
                    <LinkWithSearchParams
                        className="text-itemIndigo dark:text-itemPurple"
                        to={{
                            pathname: `/dashboard/presale/${presaleAddress}`,
                        }}
                    >
                        🔗 Here
                    </LinkWithSearchParams>
                ),
            },
        ];

        let _item = {
            tokenArray: tokenArray,
            tokenAddress: _token,
            weiRaised: window.web3.utils.fromWei(
                _weiRaised.toString(),
                "ether"
            ),
            hardCap: _tokenHardCap,
            minContribution: window.web3.utils.fromWei(
                _tokenMinContribution.toString(),
                "ether"
            ),
            maxContribution: window.web3.utils.fromWei(
                _tokenMaxContribution.toString(),
                "ether"
            ),
            isWhitelist: _isWhitelist,
            lockerLP: _lockerLP,
        };
        setTokenDetails(_item);
        setLoadingMainData(false);
    };

    return (
        <div className="flex flex-col main-container animation-fade-in">
            {checkLoading ? (
                <div className="text-black dark:text-white">
                    <LoadingBar text={"💭 Finding Your Presale..."} />
                </div>
            ) : presaleAddress !== null ? (
                loadingMainData ? (
                    <div className="text-black dark:text-white">
                        <LoadingBar text={"💭 Finding Your Presale..."} />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col lg:flex-row gap-6 mb-6">
                            <div className="flex flex-col w-full lg:w-[27%] gap-4">
                                <PresaleManager tokenDetails={tokenDetails} />
                                <PreSaleTest
                                    tokenArray={tokenDetails.tokenArray}
                                />
                            </div>

                            <div className="w-full lg:w-[46%]">
                                <PreSalesTools
                                    tokenDetails={tokenDetails}
                                    setDetailModalVisible={
                                        setDetailModalVisible
                                    }
                                    setWhitelistModalVisible={
                                        setWhitelistModalVisible
                                    }
                                    account={account}
                                    presaleContract={presaleContract}
                                    lockerLPContract={lockerLPContract}
                                    tokenName={tokenDetails.tokenArray[0].text}
                                    showDetailModal={setDetailModalVisible}
                                />
                            </div>
                            <div className="w-full lg:w-[27%]">
                                <PresaleSteps />
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-6">
                            <PreSaleExlude presaleAddress={presaleAddress} />
                            <PresaleDeposit
                                presaleContract={presaleContract}
                                presaleAddress={presaleAddress}
                                active={active}
                                account={account}
                                tokenDetails={tokenDetails}
                            />
                        </div>

                        <PresaleDetails
                            presaleAddress={presaleAddress}
                            offChainData={offChainData}
                            setVisible={setDetailModalVisible}
                            visible={detailModalVisible}
                        />

                        <AddRemoveWhitelist
                            account={account}
                            presaleContract={presaleContract}
                            setVisible={setWhitelistModalVisible}
                            visible={whitelistModalVisible}
                        />
                    </>
                )
            ) : (
                <span className="text-center size-2 text-black dark:text-white py-6 font-semibold">
                    ⛔ You don't have a presale yet.. ⛔
                </span>
            )}
        </div>
    );
};
export default ManagePresale;
