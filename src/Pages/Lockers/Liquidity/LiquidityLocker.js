import Web3 from "web3";

import { useEffect, useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

import LiquidityLockerCards from "./LiquidityLockerCards";
import LoadingBar from "../../../Components/UI/LoadingBar";

import ABI_StorageLaunchpad from "../../../abis/ABI_StorageLaunchpad.json";
import ABI_PRESALE from "../../../abis/ABI_Presale.json";
import ABI_LIQUIDITY_LOCK_PERSONAL from "../../../abis/presale/ABI_LIQUIDITY_LOCK_PERSONAL.json";

import {
    useIsMount,
    useRpcURL,
    useStorageContractAddress,
} from "../../../hooks";
import { getPresaleDetails } from "../../../utils/apis";
import { getTokenLink } from "../../../utils/constants";

const LiquidityLocker = () => {
    const isMount = useIsMount();

    const HTTP_RPC_URL = useRpcURL();
    const STORAGE_CONTRACT_ADDRESS = useStorageContractAddress();

    const [TokenLockersCardArray, setTokenLockersCardArray] = useState([]);
    const [loadingLockers, setLoadingLockers] = useState(true);

    useEffect(() => {
        const provider = new Web3(
            new Web3.providers.HttpProvider(HTTP_RPC_URL)
        );
        window.web3 = new Web3(provider);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [HTTP_RPC_URL]);

    useEffect(() => {
        // if (active)
        // console.log(isMount);
        if (isMount) loadTokenLockers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMount]);

    const loadTokenLockers = async () => {
        const _storageContract = new window.web3.eth.Contract(
            ABI_StorageLaunchpad,
            STORAGE_CONTRACT_ADDRESS
        );

        setLoadingLockers(true);

        const _totalProjects = parseInt(
            await _storageContract.methods.getProjectsCount().call()
        );
        let _lockersArray = [];
        let _counter = 0;

        // console.log(_totalProjects);
        await new Promise(function (resolve, reject) {
            for (let index = 0; index < _totalProjects; index++) {
                _storageContract.methods
                    .entryListByPresaleAddress(index)
                    .call()
                    // eslint-disable-next-line no-loop-func
                    .then(async (_presaleAddress) => {
                        const _presaleContract = new window.web3.eth.Contract(
                            ABI_PRESALE,
                            _presaleAddress
                        );

                        const [lockerLP, owner, tokenSymbol, offChainData] =
                            await Promise.all([
                                _presaleContract.methods.lockerLP().call(),
                                _presaleContract.methods.owner().call(),
                                _presaleContract.methods.tokenSymbol().call(),
                                getPresaleDetails(_presaleAddress),
                            ]);

                        if (parseInt(lockerLP) !== 0) {
                            const _lockerContract =
                                new window.web3.eth.Contract(
                                    ABI_LIQUIDITY_LOCK_PERSONAL,
                                    lockerLP
                                );

                            const [endOfLockTime] = await Promise.all([
                                _lockerContract.methods
                                    .LockedTimestamp()
                                    .call(),
                            ]);

                            _lockersArray.push({
                                lockerLP,
                                logo: getTokenLink(offChainData),
                                name: `${tokenSymbol}-WBNB LP`,
                                owner,
                                endOfLockTime: new Date(
                                    endOfLockTime * 1000
                                ).toLocaleString(),
                                time: endOfLockTime,
                            });
                        }
                        _counter++;

                        if (_counter === parseInt(_totalProjects)) {
                            resolve();
                        }
                    });
            }
        });

        setLoadingLockers(false);
        setTokenLockersCardArray(_lockersArray);
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
                            <LiquidityLockerCards {...el} key={i} />
                        ))
                    ) : (
                        <p>There is no Locked tokens</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default LiquidityLocker;
