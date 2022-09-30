import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BsShieldLock } from "react-icons/bs";

import { LP_LOCKER_ADDRESS } from "../../../utils/constants";

import ERC20Abi from "../../../abis/ERC20.json";
import LiquidityLockerDappABI from "../../../abis/LiquidityLockerDappABI.json";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const CreateLiquidityLocker = () => {
    const { active, account, library } = useWeb3React();

    useEffect(() => {
        if (active === true) {
            window.web3 = new Web3(library.provider);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const navigate = useNavigate();

    const tokenAddressRef = useRef(null);
    const amountOfTokenToLockRef = useRef(null);

    const logoLinkRef = useRef(null);

    const createLockRef = useRef(null);
    const approveRef = useRef(null);
    const [isApproveNow, setIsApproveNow] = useState(false);
    const [lockContractAddress, setLockContractAddress] = useState(null);

    const [unlockDate, setUnlockDate] = useState();

    const approveFunction = async () => {
        if (active === true) {
            const web3 = window.web3;
            if (isApproveNow === true || lockContractAddress != null) {
                let _tokenContract = await new window.web3.eth.Contract(
                    ERC20Abi.abi,
                    tokenAddressRef.current.value
                );

                const tokensToSend = web3.utils.toWei(
                    amountOfTokenToLockRef.current.value.toString(),
                    "ether"
                );
                console.log(tokensToSend);
                await _tokenContract.methods
                    .transfer(lockContractAddress, tokensToSend.toString())
                    .send({ from: account })
                    .on("confirmation", (confirmationNumber, receipt) => {
                        navigate(`/applabtocken/${lockContractAddress}`);
                    })
                    .on("error", function (error, receipt) {});
            }
        } else {
            // connect()
        }
    };

    const createLockFunction = async () => {
        if (
            active === true &&
            tokenAddressRef.current.value !== "" &&
            amountOfTokenToLockRef.current.value !== "" &&
            unlockDate &&
            logoLinkRef.current.value !== ""
        ) {
            const web3 = window.web3;
            const lockerContract = await new web3.eth.Contract(
                LiquidityLockerDappABI,
                LP_LOCKER_ADDRESS
            );

            const _lockerFees = await lockerContract.methods
                .lockerFees()
                .call();
            console.log(_lockerFees);
            // const _unixTime0 = new Date().getTime() / 1000;
            const _unixTime1 = unlockDate.getTime() / 1000;
            // const _unixTime = parseInt(_unixTime1 - _unixTime0).toFixed(0);

            console.log(_unixTime1);
            const _lockerContract = await lockerContract.methods
                .createLockerContract(
                    tokenAddressRef.current.value,
                    _unixTime1.toString(),
                    logoLinkRef.current.value
                )
                .send({ from: account, value: _lockerFees.toString() })
                .on("confirmation", (confirmationNumber, receipt) => {
                    approveRef.current.className = "button active";
                    setIsApproveNow(true);
                })
                .on("error", function (error, receipt) {});

            setLockContractAddress(
                _lockerContract.events.OwnershipTransferred[0].address
            );
        }
    };

    return (
        <div className="flex flex-col component-container main-container animation-fade-in items-center text-center py-8 px-4">
            <BsShieldLock className="text-itemIndigo dark:text-itemPurple size-6" />
            <span className="text-itemIndigo dark:text-itemPurple size-1 font-semibold pt-2">
                Lock Liqudity
            </span>
            <span className="mb-8">
                Lock tokens in a instant. Simply fill out the below form
            </span>
            <div className="w-full lg:w-1/2 2xl:w-1/3 flex flex-col gap-2">
                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">Token Address</span>
                    <input
                        className="bg-inputBg placeholder-[#440AD399] border-none rounded-2xl pl-3 w-full"
                        ref={tokenAddressRef}
                        placeholder="Enter contact address"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">
                        Enter amount of tokens to lock
                    </span>
                    <input
                        className="bg-inputBg placeholder-[#440AD399] border-none rounded-2xl pl-3 w-full"
                        disabled={isApproveNow}
                        ref={amountOfTokenToLockRef}
                        placeholder="1000000"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">Unlock Date</span>
                    {/* <input
                        disabled={isApproveNow}
                        ref={unlockDateRef}
                        placeholder="2022-11-22"
                    /> */}

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            value={unlockDate}
                            onChange={setUnlockDate}
                            variant="inline"
                            className="bg-inputBg placeholder-[#440AD399] border-none rounded-2xl pl-3 w-full"
                            disabled={isApproveNow}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            format="yyyy/MM/dd HH:mm"
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">Logo Link</span>
                    <input
                        className="bg-inputBg placeholder-[#440AD399] border-none rounded-2xl pl-3 w-full"
                        disabled={isApproveNow}
                        ref={logoLinkRef}
                        placeholder="Logolink.png/jpg"
                    />
                </div>
            </div>
            <div className="flex flex-row pt-4 gap-x-4 lg:gap-x-8 gap-y-4">
                <button
                    className="size-sm lg:size-base bg-itemIndigo dark:bg-itemPurple text-white rounded-full w-32 lg:w-40"
                    ref={createLockRef}
                    onClick={createLockFunction}
                >
                    Create Lock
                </button>

                <button
                    className="size-sm lg:size-base border-2 border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple rounded-full w-32 lg:w-40"
                    ref={approveRef}
                    onClick={approveFunction}
                >
                    Deposit
                </button>
            </div>
        </div>
    );
};
export default CreateLiquidityLocker;
