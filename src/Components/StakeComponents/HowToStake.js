import { AiFillCaretRight } from "react-icons/ai";

const HowToStake = () => {
    const HowToStake = [
        "Connect your wallet",
        "Enter the amount you wish to stake",
        "Remove any comma's or decimals",
        "Click Approve/Stake-2 transactions will come through. Please wait for both",
    ];

    const HowToUnStake = [
        "Connect your wallet",
        "Enter the amount you wish to unstake",
        "Remove any comma's or decimals",
        "Click Unstake and confirm transaction",
    ];
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="component-container rounded-2xl p-6 w-full flex flex-col">
                <span className="size-2 text-itemIndigo dark:text-[#FF6E38] pb-2">
                    How To Stake :
                </span>
                {HowToStake.map((el, i) => (
                    <div
                        key={i}
                        className="flex flex-row gap-1 py-1 items-center"
                    >
                        <AiFillCaretRight color="#708CA5" />
                        <span>{el}</span>
                    </div>
                ))}
            </div>
            <div className="component-container rounded-2xl p-6 w-full flex flex-col">
                <span className="size-2 text-itemIndigo dark:text-[#FF6E38] pb-2">
                    How To Unstake :
                </span>
                {HowToUnStake.map((el, i) => (
                    <div
                        key={i}
                        className="flex flex-row gap-1 py-1 items-center"
                    >
                        <AiFillCaretRight color="#708CA5" />
                        <span>{el}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default HowToStake;
