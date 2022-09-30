import Web3 from "web3";
import { makeBatchRequest } from "web3-batch-request";

import { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import { BsShieldLock } from "react-icons/bs";

import TokenLockerCard from "./TokenLockersCard";
import LoadingBar from "../../../Components/UI/LoadingBar";
import { useLockerAddress, useRpcURL } from "../../../hooks";

import ABI_TOKEN_LOCK_DAPP from "../../../abis/token_locker/ABI_Token_Lock_Dapp.json";
import ABI_TOKEN_LOCKER from "../../../abis/token_locker/ABI_Token_Locker.json";
import { abi as ABI_ERC20 } from "../../../abis/ERC20.json";

const TokenLocker = () => {
    const HTTP_RPC_URL = useRpcURL();
    const LOCKER_ADDRESS = useLockerAddress();
    const [lockerContract, setLockerContract] = useState(null);
    const [TokenLockersCardArray, setTokenLockersCardArray] = useState([]);
    const [loadingLockers, setLoadingLockers] = useState(false);

    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(provider);

        const loadLockerDappContract = async () => {
            const _lockerContract = await new window.web3.eth.Contract(
                ABI_TOKEN_LOCK_DAPP,
                LOCKER_ADDRESS
            );
            setLockerContract(_lockerContract);
        };

        loadLockerDappContract();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    useEffect(() => {
        if (lockerContract) {
            loadTokenLockers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockerContract]);

    const loadTokenLockers = async () => {
        setLoadingLockers(true);

        const getAllLockers = await lockerContract.methods
            .getAllLockers()
            .call();
        const _lockersArray = [];
        for (let i = getAllLockers.length; i >= 0; i--) {
            const tokenLockerAddress = getAllLockers[i];
            let _item = {};
            try {
                const web3 = window.web3;
                const _tokenLockerContract = await new web3.eth.Contract(
                    ABI_TOKEN_LOCKER,
                    tokenLockerAddress
                );

                _item.owneraddress = tokenLockerAddress;
                const multiCall = [
                    {
                        ethCall:
                            await _tokenLockerContract.methods.lockedToken()
                                .call,
                        //onSuccess: result => lta = result,
                        onError: () => {},
                    },
                    {
                        ethCall:
                            await _tokenLockerContract.methods.LockedTimestamp()
                                .call,
                        onSuccess: (result) => {
                            _item.time = result;
                        },
                        onError: () => {},
                    },
                    {
                        ethCall:
                            await _tokenLockerContract.methods.LockedBalance()
                                .call,
                        onSuccess: (result) => (_item.lockedBalance = result),
                        onError: () => {},
                    },
                    {
                        ethCall: await _tokenLockerContract.methods.Logo().call,
                        onSuccess: (result) => (_item.profile = result),
                        onError: () => {},
                    },
                ];

                const [locketTokenAddress] = await makeBatchRequest(
                    web3,
                    multiCall,
                    { allowFailures: true, verbose: false }
                );

                const _tokenContract = await new web3.eth.Contract(
                    ABI_ERC20,
                    locketTokenAddress.value
                );

                _item.name = await _tokenContract.methods.symbol().call();

                _item.unlockdatetime = new Date(
                    _item.time * 1000
                ).toLocaleString();

                if (_item.owneraddress !== undefined) {
                    _lockersArray.push(_item);
                }
            } catch (error) {
                // console.log(error);
            }
        }

        setTokenLockersCardArray(_lockersArray);
        setLoadingLockers(false);
    };
    return (
        <div className="flex flex-col main-container animation-fade-in gap-6">
            <div className="component-container p-6 rounded-2xl shadow-lg justify-center items-center flex flex-col">
                <BsShieldLock className="text-itemIndigo dark:text-itemPurple size-6" />
                <span className="font-medium py-1 text-itemIndigo dark:text-itemPurple ">
                    View Token Lockers
                </span>

                <span className="text-center">
                    Lock your tokens with apelock and earn/withdraw rewards
                    whilst locked
                </span>
            </div>
            <div className="component-container h-full p-6 rounded-2xl shadow-lg items-center flex flex-col">
                <div className="flex flex-row relative max-w-2xl w-full mb-6">
                    <FiSearch
                        size={16}
                        className="absolute text-itemIndigo dark:text-itemPurple h-full left-4"
                    />
                    <input
                        type="text"
                        className="bg-inputBg placeholder-[#440AD399] border-none rounded-full pl-12 w-full"
                        placeholder="Enter token address to view lock"
                    />
                </div>
                {loadingLockers && <LoadingBar />}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full px-8 gap-x-8 gap-y-8 2xl:gap-x-8 2xl:gap-y-12">
                    {TokenLockersCardArray !== [] ? (
                        TokenLockersCardArray.map((el, i) => (
                            <TokenLockerCard {...el} key={i} />
                        ))
                    ) : (
                        <p>There is no Locked tokens</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default TokenLocker;
