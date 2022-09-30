import React from "react";
import { BsTelegram } from "react-icons/bs";

const PreSaleTest = ({ tokenArray }) => {
    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col h-full">
            {tokenArray.map((el, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                    <span>{el.name}</span>
                    <span>{el.text}</span>
                </div>
            ))}

            <div className="flex  justify-between py-2 items-center">
                <div className="flex flex-col">
                    <span>Need Support?</span>
                    <span className="size-xs">
                        If you still cannot finalize then after receiving
                        support please cancel your sale and test your contract
                        thoroughly on our supported test nets!
                    </span>
                </div>
                <div>
                    <a
                        href="https://t.me/TitanDevSupport"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <BsTelegram color="#23C7EB" size={24} />
                    </a>
                </div>
            </div>
        </div>
    );
};
export default PreSaleTest;
