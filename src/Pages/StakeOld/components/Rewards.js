import Web3 from "web3";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import {
    useOldStakingContractAddress,
    useOldStakingTokenAddress,
} from "../../../hooks";

import ABI_Staking_Old from "../../../abis/staking/ABI_Staking_Old.json";
import { abi as ABI_ERC20 } from "../../../abis/ERC20.json";
import { numberConverter } from "../../../utils/utils";
import { MAX_UINT256 } from "../../../utils/constants";
import { showToast } from "../../../utils/hot-toast";

const Rewards = ({ refreshStakeInfo }) => {
    const { account, library } = useWeb3React();
    const stakingContractAddress = useOldStakingContractAddress();
    const stakingTokenAddress = useOldStakingTokenAddress();

    const [stakingContract, setStakingContract] = useState();
    const [tokenContract, setTokenContract] = useState();
    const [decimals, setDecimals] = useState(0);

    const [allowance, setAllowance] = useState();

    const [numberofTokens, setNumberofTokens] = useState(0);
    const [rewards, setRewards] = useState(0);

    useEffect(() => {
        if (library) {
            loadStakeData(account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    const approveStakingContract = async () => {
        try {
            await tokenContract.methods
                .approve(stakingContractAddress, MAX_UINT256)
                .send({ from: account });
            showToast("SUCCESS", "Successfully approved the Staking Contract");
            loadStakeData();
        } catch (err) {
            console.log(err);
        }
    };

    const loadStakeData = async (accountAd) => {
        try {
            const web3 = new Web3(library.provider);
            window.web3 = web3;
            const _stakingContract = await new web3.eth.Contract(
                ABI_Staking_Old,
                stakingContractAddress
            );
            setStakingContract(_stakingContract);

            const _tokenContract = await new web3.eth.Contract(
                ABI_ERC20,
                stakingTokenAddress
            );

            const _decimals = await _tokenContract.methods.decimals().call();

            setTokenContract(_tokenContract);
            setDecimals(_decimals);

            const _allowance = await _tokenContract.methods
                .allowance(account, stakingContractAddress)
                .call();
            setAllowance(_allowance);

            const _dividendsOf = await _stakingContract.methods
                .dividendsOf(account)
                .call();
            const _bnbReward = web3.utils.fromWei(_dividendsOf.toString());
            setRewards(_bnbReward);
        } catch (e) {
            console.log("error", e);
        }
    };

    const stakeToken = async () => {
        try {
            const web3 = window.web3;

            const BN = web3.utils.BN;
            const _amount = new BN(10)
                .pow(new BN(decimals))
                .mul(new BN(numberofTokens));

            console.log(_amount, allowance);

            if (parseInt(_amount) > parseInt(allowance)) {
                console.log("need to allow more tokens");
                await tokenContract.methods
                    .approve(stakingContractAddress, MAX_UINT256)
                    .send({
                        from: account,
                    });
            }
            await stakingContract.methods.stake(_amount).send({
                from: account,
            });
            refreshStakeInfo();
            showToast("SUCCESS", "Successfully STAKED your token!");
        } catch (e) {
            showToast("ERROR", "Something went wrong!");
            console.log("error", e);
        }
    };

    const unstakeToken = async () => {
        try {
            const web3 = window.web3;

            const BN = web3.utils.BN;
            const _amount = new BN(10)
                .pow(new BN(decimals))
                .mul(new BN(numberofTokens));

            await stakingContract.methods.unstake(_amount).send({
                from: account,
            });
            refreshStakeInfo();
            showToast("SUCCESS", "Successfully UNSTAKED your token!");
        } catch (e) {
            showToast("ERROR", "Something went wrong!");
            console.log("error", e);
        }
    };
    const withdraw = async () => {
        try {
            await stakingContract.methods
                .withdraw(window.web3.utils.toWei(rewards))
                .send({
                    from: account,
                });
        } catch (err) {
            showToast("ERROR", "Something went wrong!");
            console.log(err);
        }
    };
    const setMax = async () => {
        const web3 = new Web3(Web3.givenProvider);
        let tokenContract = new web3.eth.Contract(
            ABI_ERC20,
            stakingTokenAddress
        );
        let balance = await tokenContract.methods.balanceOf(account).call();
        setNumberofTokens(balance / 10 ** decimals);
    };
    return (
        <div className="component-container rounded-2xl p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col text-itemIndigo dark:text-itemPurple bg-[#CED4FF] rounded-2xl p-4 shadow-inner justify-center items-center w-full lg:w-2/5">
                <span className="size-2 font-semibold">Rewards:</span>
                <span className="size-1 text-black font-medium">
                    {numberConverter(rewards)} in BNB
                </span>
                <div className="flex mt-4 justify-around w-full">
                    <button
                        className="bg-[#FF6E38] text-white rounded-full px-8 size-base"
                        onClick={withdraw}
                    >
                        Withdraw
                    </button>
                    {/* 
                    <button
                        className="border-2 border-[#FF6E38] text-[#FF6E38] hover:bg-[#FF6E38]/20 rounded-full size-base"
                        onClick={reInvestAll}
                    >
                        Compound
                    </button> */}
                </div>
            </div>
            <div className="flex flex-col text-itemIndigo dark:text-itemPurple bg-[#CED4FF] rounded-2xl p-8 shadow-inner justify-center w-full">
                <span>
                    1. Enter amount you wish to stake or press Max.
                    <br />
                    2. Press APPROVE and wait for 1st transaction. (Existing
                    stakers will not need to approve) <br />
                    3. Press the STAKE button, wait for transaction. <br />
                    4. Your tokens are staked! <br />
                </span>
                <div className="w-full my-3 relative font-medium size-1">
                    <input
                        className="w-full rounded-full border-none pl-6"
                        type="text"
                        value={numberofTokens}
                        onChange={(e) => {
                            setNumberofTokens(e.target.value);
                        }}
                    />
                    <span
                        className="absolute right-6 cursor-pointer pt-2 hover:opacity-75"
                        onClick={setMax}
                    >
                        MAX
                    </span>
                </div>
                <div className="flex flex-row justify-center gap-8">
                    {allowance > 0 ? (
                        <button
                            className="bg-[#FF6E38] text-white rounded-full py-2 w-40"
                            onClick={stakeToken}
                        >
                            Stake
                        </button>
                    ) : (
                        <button
                            className="bg-[#FF6E38] text-white rounded-full py-2 w-40"
                            onClick={approveStakingContract}
                        >
                            Approve
                        </button>
                    )}
                    <button
                        className="border-2 border-[#FF6E38] text-[#FF6E38] hover:bg-[#FF6E38]/20 rounded-full py-2 w-40"
                        onClick={unstakeToken}
                    >
                        Un-Stake
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Rewards;
