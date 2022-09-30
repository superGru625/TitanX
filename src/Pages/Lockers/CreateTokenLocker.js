import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useRef, useEffect, useState } from "react";
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { BsShieldLock } from "react-icons/bs";

import { useNavigate } from "react-router-dom";

import ERC20Abi from "../../abis/ERC20.json";

import {
    useBUSDAddress,
    useLockerAddress,
    useRpcURL,
    useValidAccount,
} from "../../hooks";
import ABI_TOKEN_LOCK_DAPP from "../../abis/token_locker/ABI_Token_Lock_Dapp.json";

const CreateTokenLocker = () => {
    const { active, library } = useWeb3React();
    const { account } = useValidAccount();
    const HTTP_RPC_URL = useRpcURL();
    const LOCKER_ADDRESS = useLockerAddress();
    const [lockerContract, setLockerContract] = useState(null);

    const BUSD_ADDRESS = useBUSDAddress();
    const navigate = useNavigate();

    const tokenAddressRef = useRef(null);
    const rewardTokenAddressRef = useRef(null);
    const amountOfTokenToLockRef = useRef(null);

    const logoLinkRef = useRef(null);

    const createLockRef = useRef(null);
    const approveRef = useRef(null);
    const [isApproveNow, setIsApproveNow] = useState(false);
    const [lockContractAddress, setLockContractAddress] = useState(null);

    const [unlockDate, setUnlockDate] = useState();

    useEffect(() => {
        if (active) {
            window.web3 = new Web3(library.provider);

            const loadLockerDappContract = async () => {
                const _lockerContract = await new window.web3.eth.Contract(
                    ABI_TOKEN_LOCK_DAPP,
                    LOCKER_ADDRESS
                );
                setLockerContract(_lockerContract);
            };

            loadLockerDappContract();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    const approveFunction = async () => {
        if (active === true) {
            if (isApproveNow === true || lockContractAddress != null) {
                let _tokenContract = await new window.web3.eth.Contract(
                    ERC20Abi.abi,
                    tokenAddressRef.current.value
                );

                const _decimals = await _tokenContract.methods
                    .decimals()
                    .call();

                const BN = window.web3.utils.BN;
                const tokensToSend = new BN(10)
                    .pow(new BN(_decimals))
                    .mul(new BN(amountOfTokenToLockRef.current.value));

                await _tokenContract.methods
                    .transfer(lockContractAddress, tokensToSend.toString())
                    .send({ from: account })
                    .on("confirmation", (confirmationNumber, receipt) => {
                        navigate(`/dashboard/lock-token`);
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
            rewardTokenAddressRef.current.value !== "" &&
            amountOfTokenToLockRef.current.value !== "" &&
            unlockDate &&
            logoLinkRef.current.value !== ""
        ) {
            const _lockerFees = await lockerContract.methods
                .lockerFees()
                .call();
            console.log("lockerfee");
            const _lockTimeStart = unlockDate.getTime() / 1000;

            const _lockerContract = await lockerContract.methods
                .createLockerContract(
                    tokenAddressRef.current.value,
                    rewardTokenAddressRef.current.value,
                    _lockTimeStart.toString(),
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
                Lock Tokens
            </span>
            <span className="mb-8">
                Lock tokens in a instant. Simply fill out the below form
            </span>
            <div className="w-full lg:w-1/2 2xl:w-1/3 flex flex-col gap-2">
                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">Token Address</span>
                    <input
                        className="smooth-input"
                        ref={tokenAddressRef}
                        placeholder="Enter contact address"
                    />
                </div>
                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">
                        Reward Token Address
                    </span>
                    <input
                        className="smooth-input"
                        defaultValue={BUSD_ADDRESS}
                        ref={rewardTokenAddressRef}
                        placeholder="Enter contact address"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">
                        Enter amount of tokens to lock
                    </span>
                    <input
                        className="smooth-input"
                        ref={amountOfTokenToLockRef}
                        placeholder="1000000"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <span className="font-medium pl-3">Unlock Date</span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            value={unlockDate}
                            onChange={setUnlockDate}
                            variant="inline"
                            className="w-full"
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
                        className="smooth-input"
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
export default CreateTokenLocker;
