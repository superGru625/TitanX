import React from "react";
import LinkWithSearchParams from "../../../Components/UI/LinkWithSearchParams";
import TimeCounter from "../../../Components/TimeCounter/TimeCounter";
import { getEllipsisTxt } from "../../../helpers/formatters";

const LiquidityLockerCards = (props) => {
    const { logo, name, endOfLockTime, owner, time, lockerLP } = props;

    return (
        <LinkWithSearchParams
            to={{ pathname: `/dashboard/liquidity/${lockerLP}` }}
            className="flex flex-col card-component justify-center items-center p-4"
        >
            <img
                src={logo}
                alt="ProfilePicture"
                className="w-16 h-16 presale-logo"
            />
            <span className="pt-2">{name}</span>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px] w-full my-3" />
            <div className="flex flex-col mx-2 size-sm w-full px-2">
                <div className="flex flex-row w-full justify-between">
                    <span className="text-itemIndigo dark:text-itemPurple">
                        Unlock Date/Time
                    </span>
                    <span className="liquidity bnb-last">{endOfLockTime}</span>
                </div>
                <div className="flex flex-row w-full justify-between items-center mt-3">
                    <span className="text-itemIndigo dark:text-itemPurple">
                        Owner
                    </span>
                    <span>{getEllipsisTxt(owner)}</span>
                </div>
            </div>
            <div className="bg-opacity-50 dark:bg-opacity-50 bg-black dark:bg-white h-[1px] w-full my-3" />
            <div className="flex flex-row justify-between w-full">
                <span>Unlocks in:</span>
                <span>
                    <TimeCounter
                        time={(time - new Date().getTime() / 1000) / 3600}
                    />
                </span>
            </div>
            <button className="text-white bg-itemIndigo dark:bg-itemPurple size-base w-full mt-6">
                View Lock
            </button>
        </LinkWithSearchParams>
    );
};
export default LiquidityLockerCards;
