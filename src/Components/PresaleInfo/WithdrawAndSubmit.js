import React from "react";

const WithdrawAndSubmit = ({ presaleData, preSaleContract, account }) => {
    const claimBackContribtuion = async () => {
        await preSaleContract.methods
            .claimBackContribtuion()
            .send({ from: account });
    };
    const publicCancel = async () => {
        await preSaleContract.methods.cancelPresale().send({ from: account });
    };
    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 mt-6">
            <div className="flex flex-col w-full gap-2 justify-center items-center">
                <span className="size-1 text-center">Emergency withdraw</span>
                <div className="flex flex-row items-start gap-2">
                    <span className="text-[#FF5617] text-center size-sm">
                        Warning! 15% early withdraw fee will be taken.
                    </span>
                    <button
                        className="text-white size-sm py-2 rounded-full border-2 border-[#FF0000] bg-[#E74949] font-medium"
                        onClick={claimBackContribtuion}
                    >
                        Withdraw
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full gap-2 justify-center items-center">
                <span className="size-1 text-center">Public Cancel</span>
                <div className="flex flex-row items-start gap-2">
                    <span className="text-[#440AD399] dark:text-itemPurple text-center size-sm">
                        Once activated owner has 48 hours to finalize or presale
                        will be cancelled
                    </span>
                    <button
                        className="text-white size-sm py-2 rounded-full border-2 border-[#440AD399] bg-[#B961FF] font-medium"
                        onClick={publicCancel}
                        disabled={presaleData.presaleState !== 1}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
export default WithdrawAndSubmit;
