import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import React, { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { abi as ABI_ERC20 } from "../abis/ERC20.json";
import ABI_STEALTH_DEPLOYER from "../abis/stealth_launch/ABI_StealthDeployer.json";

import {
    useBUSDAddress,
    useStealthDeployerAddress,
    useNetworkScanURL,
    usePCSRouterV2,
} from "../hooks";
import { MAX_UINT256 } from "../utils/constants";
import { getEllipsisTxt } from "../helpers/formatters";

import CREATION_SUCCESS_PNG from "../assets/images/stealth/stealth-creation-success.png";
import UploadStealthDetails from "../Components/StealthPresale/UploadStealthDetails";

const CreateStealth = () => {
    const { account, library } = useWeb3React();
    const NETWORK_SCAN_URL = useNetworkScanURL();
    const STEALTH_DEPLOYER_ADDRESS = useStealthDeployerAddress();
    const BUSD_ADDRESS = useBUSDAddress();
    const PCSV2_ROUTER = usePCSRouterV2();
    const [currentStep, setCurrentStep] = useState(1);

    const token0AddressRef = useRef();
    const pairSelectRef = useRef();

    const token0AmountRef = useRef();
    const token1AmountRef = useRef();

    const [token0Contract, setToken0Contract] = useState();
    const [token1Contract, setToken1Contract] = useState();

    const [token0Information, setToken0Information] = useState({});

    const [lockupTime, setLockupTime] = useState(new Date());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const token1Choice = useMemo(() => {
        if (pairSelectRef) return parseInt(pairSelectRef?.current?.value);
        return 0;
    });

    const approveTokens = async () => {
        token0Contract.methods
            .approve(STEALTH_DEPLOYER_ADDRESS, MAX_UINT256)
            .send({ from: account });
        if (token1Choice === 1)
            token1Contract.methods
                .approve(STEALTH_DEPLOYER_ADDRESS, MAX_UINT256)
                .send({ from: account });
    };
    useEffect(() => {
        if (library) window.web3 = new Web3(library.provider);
    }, [library]);
    useEffect(() => {
        const web3 = window.web3;
        const loadTokenContracts = async () => {
            const _token0Address = token0AddressRef.current.value;
            const _token0Contract = await new web3.eth.Contract(
                ABI_ERC20,
                _token0Address
            );
            setToken0Contract(_token0Contract);
            const _token0Symbol = await _token0Contract.methods.symbol().call();
            setToken0Information((information) => ({
                ...information,
                symbol: _token0Symbol,
            }));

            const _token0Decimals = await _token0Contract.methods
                .decimals()
                .call();
            setToken0Information((information) => ({
                ...information,
                decimals: _token0Decimals,
            }));
            // BUSD is token 1
            if (token1Choice === 1) {
                const _token1Contract = await new web3.eth.Contract(
                    ABI_ERC20,
                    BUSD_ADDRESS
                );
                setToken1Contract(_token1Contract);
            }
        };
        if (currentStep === 2) {
            // load token 0, 1 names
            loadTokenContracts();
        }

        const checkAllowance = async () => {
            const _allowance0 = await token0Contract.methods
                .allowance(account, STEALTH_DEPLOYER_ADDRESS)
                .call();
            if (
                _allowance0 <
                10 ** token0Information.decimals * token0AmountRef.current.value
            ) {
                toast.error("Allowance is not enough to create!", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
                return;
            }
            if (token1Choice === 0) return;
            const _allowance1 = await token1Contract.methods
                .allowance(account, STEALTH_DEPLOYER_ADDRESS)
                .call();
            if (_allowance1 < 10 ** 18 * token1AmountRef.current.value) {
                toast.error("Allowance for BUSD is not enough to create!", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        };
        if (currentStep === 3) {
            // check Allowance
            checkAllowance();
        }
        // if (currentStep === 5) setCurrentStep(4);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    const previousStep = () => {
        setCurrentStep((currentStep) =>
            currentStep > 1 ? currentStep - 1 : currentStep
        );
    };

    const nextStep = () => {
        setCurrentStep((currentStep) =>
            currentStep < 4 ? currentStep + 1 : currentStep
        );
    };

    const finalizeCreation = async () => {
        try {
            if (token1Choice === 1) {
                // in case of BUSD
                const web3 = window.web3;
                const _deplyerContract = await new web3.eth.Contract(
                    ABI_STEALTH_DEPLOYER,
                    STEALTH_DEPLOYER_ADDRESS
                );
                const BN = web3.utils.BN;
                const _tokensForLiquidity0 = new BN(10)
                    .pow(new BN(token0Information.decimals))
                    .mul(new BN(token0AmountRef.current.value));

                const _tokensForLiquidity1 = new BN(10)
                    .pow(new BN(18))
                    .mul(new BN(token1AmountRef.current.value));

                await _deplyerContract.methods
                    .createStealthIndividualTokens(
                        token0AddressRef.current.value,
                        BUSD_ADDRESS,
                        _tokensForLiquidity0,
                        _tokensForLiquidity1,
                        parseInt(lockupTime.getTime() / 1000),
                        PCSV2_ROUTER
                    )
                    .send({ from: account });
            } else {
                // in case of token 1 is BNB
                const web3 = window.web3;
                const _deplyerContract = await new web3.eth.Contract(
                    ABI_STEALTH_DEPLOYER,
                    STEALTH_DEPLOYER_ADDRESS
                );

                const BN = web3.utils.BN;
                const _tokensForLiquidity0 = new BN(10)
                    .pow(new BN(token0Information.decimals))
                    .mul(new BN(token0AmountRef.current.value));

                // amoung of wei
                const _tokensForLiquidity1 = web3.utils.toWei(
                    token1AmountRef.current.value,
                    "ether"
                );
                await _deplyerContract.methods
                    .createStealthNative(
                        token0AddressRef.current.value,
                        _tokensForLiquidity0,
                        _tokensForLiquidity1,
                        parseInt(lockupTime.getTime() / 1000),
                        PCSV2_ROUTER
                    )
                    .send({ from: account, value: _tokensForLiquidity1 });
            }

            toast.success("Stealth Created Successfully!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            setCurrentStep(5);
        } catch (error) {
            toast.error("There was error while creating!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    };
    return (
        <div className="main-container component-container items-center text-center animation-fade-in flex flex-col">
            <h3 className="px-6 pt-6 lg:pt-8">Create a Stealth Launch</h3>
            <span className="px-6 py-4 lg:py-6 size-1">
                Please fill the form below to create a stealth launch
            </span>
            <span className="text-mainOrange lg:w-5/12 px-6">
                You must have the ability to whitelist (exclude Fromfee)
                multiple addresses or turn off special transfer if any burn,
                rebase or other special transfers are to take place
            </span>

            {account ? (
                <div className="w-full lg:w-5/12 flex flex-col">
                    <div className="flex flex-row justify-around items-center p-6  border-b">
                        {Array.from(Array(4).keys()).map((index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`stealth-step ${
                                        index < currentStep
                                            ? "stealth-step-active"
                                            : "stealth-step-deactive"
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                {index !== 3 && (
                                    <div
                                        className={`w-12 lg:w-32 h-2 rounded-full ${
                                            index < currentStep
                                                ? "stealth-step-active"
                                                : "stealth-step-deactive"
                                        }`}
                                    ></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div
                        className={`flex-col ${
                            currentStep === 1 ? "flex" : "hidden"
                        }`}
                    >
                        <h5 className="mr-auto pt-4">Enter the Pair Address</h5>
                        <span className="mr-auto text-comment">
                            Please enter the pair address you wish to create.
                        </span>

                        <span className="mr-auto pt-6 size-1">
                            Token Address
                        </span>
                        <input
                            className="input w-full bg-inputBg rounded-full pl-6 placeholder-[#440AD388]"
                            placeholder="Enter contact address"
                            ref={token0AddressRef}
                        />

                        <span className="mr-auto pt-6 size-1">Select Pair</span>

                        <select
                            className="text-black border bg-inputBg outline-none border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 block py-3 px-4 w-full"
                            ref={pairSelectRef}
                        >
                            <option value={0}>BNB</option>
                            <option value={1}>BUSD</option>
                        </select>
                        <span className="mr-auto">
                            Pick a pair you wish to pair with your token EG:
                            BNB, BUSD ....
                        </span>
                    </div>

                    <div
                        className={`flex-col ${
                            currentStep === 2 ? "flex" : "hidden"
                        }`}
                    >
                        <h5 className="mr-auto pt-4">
                            Enter the amount to tokens for liqudity
                        </h5>
                        <span className="mr-auto text-comment">
                            Please enter the amount of tokens.
                        </span>

                        <span className="mr-auto pt-6 size-1">
                            Enter the amount of {token0Information.symbol}
                        </span>
                        <input
                            className="input w-full bg-inputBg rounded-full pl-6 placeholder-[#440AD388]"
                            placeholder="Enter Amount"
                            ref={token0AmountRef}
                        />
                        <span className="mr-auto">
                            Enter the amount of tokens to create pair with
                        </span>

                        <span className="mr-auto pt-6 size-1">
                            Enter the amount of {token1Choice ? "BUSD" : "BNB"}
                        </span>
                        <input
                            ref={token1AmountRef}
                            className="input w-full bg-inputBg rounded-full pl-6 placeholder-[#440AD388]"
                            placeholder="Enter Amount"
                        />

                        <button
                            className="rounded-full text-white w-fit px-6 mt-6 bg-mainOrange mx-auto"
                            onClick={approveTokens}
                        >
                            Approve {token0Information.symbol}
                            {token1Choice === 1 && " & BUSD"}
                        </button>
                    </div>

                    <div
                        className={`flex-col ${
                            currentStep === 3 ? "flex" : "hidden"
                        }`}
                    >
                        <h5 className="mr-auto pt-4">
                            What’s your project budget?
                        </h5>
                        <span className="mr-auto text-comment">
                            Please select the project budget range you have in
                            mind.
                        </span>

                        <span className="mr-auto pt-6 size-1">Lockup Time</span>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                value={lockupTime}
                                onChange={setLockupTime}
                                variant="inline"
                                style={{
                                    padding: "5px 0",
                                    color: "#fff",
                                    width: "100%",
                                    fontSize: "14px",
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                format="yyyy/MM/dd HH:mm"
                            />
                        </MuiPickersUtilsProvider>

                        <span className="mr-auto">
                            Pick a date the liquidity will unlock, The minimum
                            lock time is 10 days.
                        </span>

                        <span className="mr-auto pt-6 size-1">
                            Select Router
                        </span>
                        <div className="flex justify-around">
                            <div className="flex items-center rounded-2xl border border-itemIndigo dark:border-itemPurple p-6">
                                <input
                                    type="radio"
                                    id="pcs_router"
                                    name="router_radio"
                                    className="router-radio"
                                    defaultChecked
                                />
                                <label
                                    htmlFor="pcs_router"
                                    className="ml-4 flex"
                                >
                                    PancakeSwap
                                    <img
                                        src="/images/Pancakeswap.svg"
                                        className="ml-3"
                                        alt="PCS V2"
                                    />
                                </label>
                            </div>

                            <div className="flex items-center rounded-2xl border border-itemIndigo dark:border-itemPurple p-6">
                                <input
                                    type="radio"
                                    id="other_router"
                                    name="router_radio"
                                    disabled
                                    className="router-radio"
                                />
                                <label
                                    htmlFor="other_router"
                                    className="ml-4 flex"
                                >
                                    More coming soon
                                </label>
                            </div>
                        </div>

                        <UploadStealthDetails
                            token0Address={token0AddressRef?.current?.value}
                        />
                    </div>

                    <div
                        className={`flex-col items-center ${
                            currentStep === 4 ? "flex" : "hidden"
                        }`}
                    >
                        <h5 className="pt-4">Check your details are Correct</h5>

                        <span className="text-comment">
                            Please review all the information you previously
                            typed
                            <br />
                            in the past steps, and if all is okay, submit.
                        </span>
                        <div className="flex flex-col w-96 py-4 gap-3">
                            <div className="flex justify-between">
                                <span>Token Address</span>
                                <span>
                                    <a
                                        href={`${NETWORK_SCAN_URL}${token0AddressRef?.current?.value}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-itemIndigo dark:text-itemPurple"
                                    >
                                        {getEllipsisTxt(
                                            token0AddressRef?.current?.value,
                                            6
                                        )}
                                    </a>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Listed on</span>
                                <span>Pancakeswap</span>
                            </div>
                            <div className="flex justify-between">
                                <span>
                                    Starting{" "}
                                    {token1Choice === 1 ? "BUSD" : "BNB"}
                                </span>
                                <span>{token1AmountRef?.current?.value}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Liquidity lock time</span>
                                <span>{lockupTime.toLocaleString()}</span>
                            </div>
                        </div>
                        <span className="text-comment">
                            If your details are correct go ahead and Create
                            stealth
                        </span>
                    </div>
                    {currentStep === 5 && (
                        <div className="flex flex-col items-center">
                            <img
                                className="w-48 my-6"
                                src={CREATION_SUCCESS_PNG}
                                alt="creation success"
                            />
                            <span className="size-1 font-bold">
                                Congratulations your Stealth is Live.
                            </span>
                            <span className="text-comment py-6">
                                Visit the stealth dashboard to see your stealth
                                in action. <br />
                                Good luck with your project.
                            </span>
                        </div>
                    )}
                    {currentStep !== 5 && (
                        <div className="flex justify-between p-6">
                            <button
                                className={`rounded-full border border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple hover:bg-indigo-600 hover:bg-opacity-20 w-40 lg:w-48 size-base 
                        ${currentStep === 1 && "invisible"}`}
                                onClick={previousStep}
                            >
                                Previous step
                            </button>
                            {currentStep !== 4 ? (
                                <button
                                    className="rounded-full bg-itemIndigo dark:bg-itemPurple text-white hover:opacity-70 w-40 lg:w-48 size-base"
                                    onClick={nextStep}
                                >
                                    Next step
                                </button>
                            ) : (
                                <button
                                    className="rounded-full bg-itemPurple dark:bg-itemIndigo text-white hover:opacity-70 w-40 lg:w-48 size-base"
                                    onClick={finalizeCreation}
                                >
                                    Create Stealth
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <span className="py-8 size-2 font-bold">
                    You have to connect wallet
                </span>
            )}
        </div>
    );
};

export default CreateStealth;
