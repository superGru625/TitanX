import { useEffect, useState } from "react";
import ERC20Abi from "../../abis/ERC20.json";
import { MAX_UINT256 } from "../../utils/constants";

const PresaleDeposit = ({
    presaleContract,
    presaleAddress,
    tokenDetails,
    active,
    account,
}) => {
    const [allowance, setAllowance] = useState(0);
    const [tokensTotalNeeded, setTokensTotalNeeded] = useState(0);
    const [tokenContract, setTokenContract] = useState();
    useEffect(() => {
        if (active && account.length) {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, account]);

    const loadData = async () => {
        const web3 = window.web3;
        const _tokensTotalNeeded = await presaleContract.methods
            .tokensTotalNeeded()
            .call();
        const _tokenContract = await new web3.eth.Contract(
            ERC20Abi.abi,
            tokenDetails.tokenAddress
        );
        setTokenContract(_tokenContract);

        const _decimals = await _tokenContract.methods.decimals().call();
        setTokensTotalNeeded(parseInt(_tokensTotalNeeded / 10 ** _decimals));
        const _allowance = await _tokenContract.methods
            .allowance(account, presaleAddress)
            .call();
        setAllowance(parseInt(_allowance));

        // console.log(_allowance, _tokensTotalNeeded);
        // const
    };

    const approvePresale = async () => {
        await tokenContract.methods
            .approve(presaleAddress, MAX_UINT256)
            .send({ from: account });
        loadData();
    };

    const depositeToken = async () => {
        await presaleContract.methods
            .depositTokensForPresale()
            .send({ from: account });
        loadData();
    };
    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col w-full">
            <span className="size-2 font-semibold">Deposit Presale Tokens</span>
            <div className="flex justify-between items-start flex-col">
                <span className="pt-4">
                    You need {tokensTotalNeeded}#
                    {tokenDetails.tokenArray[1].text} to deposit and complete
                    your presale
                </span>
                <span className="pb-1 text-buttonLightOrange dark:text-buttonDarkOrange">
                    Make sure fees are disable before depositing tokens!
                </span>
                {allowance > tokensTotalNeeded ? (
                    <button
                        className="bg-itemIndigo dark:bg-itemPurple text-white font-normal mx-auto"
                        onClick={depositeToken}
                    >
                        Deposit
                    </button>
                ) : (
                    <button
                        className="bg-itemIndigo dark:bg-itemPurple text-white font-normal mx-auto"
                        onClick={approvePresale}
                    >
                        Approve Presale Address
                    </button>
                )}
            </div>
        </div>
    );
};
export default PresaleDeposit;
