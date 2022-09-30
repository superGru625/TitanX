import React from "react";

const PresaleManager = ({ tokenDetails }) => {
    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col">
            <span className="size-2 font-semibold">Presale Manager</span>
            <span className="py-4 text-center">
                Update,Deposit and manage presale with ease
            </span>
            <span className="text-itemIndigo dark:text-itemPurple font-bold text-center">
                {tokenDetails.weiRaised} BNB / {tokenDetails.hardCap} BNB
            </span>
            <span className="relative h-3 text-left mx-4">
                <span className="absolute w-full h-full rounded-full bg-[#B961FF4D]"></span>
                <span
                    className="absolute h-full presale-progress-bar rounded-full bg-[#B961FF]"
                    style={{
                        width: `${
                            (tokenDetails.weiRaised / tokenDetails.hardCap) *
                            100
                        }%`,
                    }}
                ></span>
            </span>
            <span className="flex justify-between mx-5 font-medium pt-1">
                <span className="size-sm">0.1 BNB</span>
                <span className="size-sm">2 BNB</span>
            </span>
        </div>
    );
};
export default PresaleManager;
