import { useCallback, useEffect, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";

import {
    PRESALE_INPROGRESS,
    PRESALE_ENDED,
    PRESALE_UPCOMING,
} from "../../utils/constants";

const TokenTimer = ({
    status,
    preSaleStartTime,
    preSaleEndTime,
    lockupTime,
}) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        const forceUpdateInterval = setInterval(forceUpdate, 1000);

        return () => {
            clearInterval(forceUpdateInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const minutes = 60;
    const hours = minutes * 60;
    const days = hours * 24;
    let gap = preSaleStartTime - new Date().getTime() / 1000;
    if (status === PRESALE_UPCOMING)
        gap = preSaleStartTime - new Date().getTime() / 1000;
    else if (status === PRESALE_INPROGRESS)
        gap = preSaleEndTime - new Date().getTime() / 1000;
    else if (status === PRESALE_ENDED)
        gap = lockupTime - new Date().getTime() / 1000;
    else gap = lockupTime - new Date().getTime() / 1000; //if (status === PRESALE_INPROGRESS)

    const day = parseInt(gap / days);
    const hour = parseInt((gap % days) / hours);
    const min = parseInt((gap % hours) / minutes);
    const sec = parseInt(gap % 60);

    const statusText = {
        PRESALE_UPCOMING: "Sale starts in:",
        PRESALE_INPROGRESS: "Sale ends in:",
        PRESALE_ENDED: "Unlocked in",
        LIQUIDITY_UNLOCKED: "Liquidity unlocked",
        PRESALE_CANCELED: "Canceled",
        PRESALE_FILLED: "Hardcap Filled",
        PRESALE_ENDED_NOT_MET_SOFTCAP: "Cancelled",
    };
    let statusTimer = {
        PRESALE_UPCOMING: `${day < 10 ? "0" + day : day}:${
            hour < 10 ? "0" + hour : hour
        }:${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`,
        PRESALE_INPROGRESS: "",
        PRESALE_ENDED: "",
        LIQUIDITY_UNLOCKED: "",
    };
    statusTimer.PRESALE_ENDED = statusTimer.PRESALE_INPROGRESS =
        statusTimer.PRESALE_UPCOMING;
    return (
        <div className="flex justify-between w-full token-timer">
            <span className="flex items-center">
                <AiFillClockCircle className="size-1 mr-1 text-black dark:text-[#CDCDCD]" />
                {statusText[status]}
            </span>
            <span>{statusTimer[status]}</span>
        </div>
    );
};

export default TokenTimer;
