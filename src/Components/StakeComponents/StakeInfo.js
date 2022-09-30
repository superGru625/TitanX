import Web3 from "web3";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

// import CountUp from "react-countup";
import {
    useRpcURL,
    useStakingAddress,
    useStakingTokenAddress,
    useValidAccount,
} from "../../hooks";

import ABI_STAKING from "../../abis/staking/ABI_Staking.json";
import { abi as ABI_ERC20 } from "../../abis/ERC20.json";
import { numberConverter } from "../../utils/utils";
import LoadingBar from "../UI/LoadingBar";

const StakeInfo = forwardRef((props, ref) => {
    const { account } = useValidAccount();
    const HTTP_RPC_URL = useRpcURL();

    const stakingContractAddress = useStakingAddress();
    const stakingTokenAddress = useStakingTokenAddress();

    const [staked, setStakedMoney] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [bnbDist, setTotalBnbDsitributed] = useState(0);
    const [totalStaked, setTotalStaked] = useState(0);
    const [totalStakers, setTotalStakers] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);

    const [loading, setLoading] = useState(true);

    useImperativeHandle(ref, () => ({
        refreshInfo() {
            loadStakeData();
        },
    }));

    useEffect(() => {
        if (stakingContractAddress.length >= 0) {
            loadStakeData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, HTTP_RPC_URL]);

    const stakeInfo = [
        {
            title: "You Staked",
            number: staked,
        },
        {
            title: "Ape Balance",
            number: tokenBalance,
        },
        {
            title: "Total Distributed BNB",
            number: bnbDist,
        },
        {
            title: "Total Stakers",
            number: totalStakers,
        },
        {
            title: "Total Staked",
            number: totalStaked,
        },
        {
            title: "Total Supply",
            number: totalSupply,
        },
    ];

    const loadStakeData = async () => {
        try {
            const provider = new Web3(
                new Web3.providers.HttpProvider(HTTP_RPC_URL)
            );
            const web3 = new Web3(provider);
            const contract = await new web3.eth.Contract(
                ABI_STAKING,
                stakingContractAddress
            );
            const tokenContract = await new web3.eth.Contract(
                ABI_ERC20,
                stakingTokenAddress
            );
            const _decimals = await tokenContract.methods.decimals().call();
            const BATCH_COUNT = 6;
            let counter = 0;

            await new Promise(function (resolve, reject) {
                contract.methods
                    .StakerStorage(account)
                    .call({}, async (err, _stakerStorage) => {
                        if (err) reject(err);
                        const tokensStaked =
                            _stakerStorage.tokensStaked / 10 ** _decimals;
                        setStakedMoney(numberConverter(tokensStaked));
                        if (++counter === BATCH_COUNT) resolve();
                    });

                contract.methods.totalRecieved().call({}, (err, totalDist) => {
                    if (err) reject(err);
                    const bnbD = web3.utils.fromWei(totalDist.toString());
                    setTotalBnbDsitributed(numberConverter(bnbD));
                    if (++counter === BATCH_COUNT) resolve();
                });

                tokenContract.methods
                    .balanceOf(account)
                    .call({}, (err, balanceOf) => {
                        if (err) reject(err);
                        setTokenBalance(
                            numberConverter(balanceOf / 10 ** _decimals)
                        );
                        if (++counter === BATCH_COUNT) resolve();
                    });

                contract.methods.totalStaked().call({}, (err, ttlStaked) => {
                    if (err) reject(err);
                    setTotalStaked(
                        numberConverter(ttlStaked / 10 ** _decimals)
                    );
                    if (++counter === BATCH_COUNT) resolve();
                });

                contract.methods.getStakersCount().call({}, (err, tStaker) => {
                    if (err) reject(err);
                    setTotalStakers(tStaker);
                    if (++counter === BATCH_COUNT) resolve();
                });

                tokenContract.methods
                    .totalSupply()
                    .call({}, (err, ttlSupply) => {
                        if (err) reject(err);
                        setTotalSupply(
                            numberConverter(ttlSupply / 10 ** _decimals)
                        );
                        if (++counter === BATCH_COUNT) resolve();
                    });
            });

            setLoading(false);
            //var rewards_takeable = await contract.methods.dividendsOf(account).call();
            //var withdrawable = await contract.methods.withdraw(rewards_takeable).send({from: account});
        } catch (e) {
            setLoading(false);
            console.log("error", e);
        }
    };

    return (
        <div className="component-container rounded-2xl p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
                <>
                    <LoadingBar text="" />
                    <LoadingBar text="" />
                    <LoadingBar text="" />
                </>
            ) : (
                stakeInfo.map(
                    (el, i) =>
                        el.number && (
                            <div
                                className="flex flex-col text-itemIndigo dark:text-itemPurple bg-[#CED4FF] rounded-2xl p-4 shadow-inner"
                                key={i}
                            >
                                <span className="size-1">{el.title}:</span>
                                <span className="size-2 font-semibold">
                                    {el.number}
                                    {/* {
                                        <CountUp
                                            start={0}
                                            end={parseInt(el.number)}
                                            duration={0.5}
                                        />
                                    }
                                    {Number.isNaN(
                                        parseInt(
                                            el.number
                                                .split("")
                                                .reverse()
                                                .join("")
                                        )
                                    )
                                        ? el.number.substr(-2)
                                        : ""} */}
                                </span>
                            </div>
                        )
                )
            )}
        </div>
    );
});
export default StakeInfo;
