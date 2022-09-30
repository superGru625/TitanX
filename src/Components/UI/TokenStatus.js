import {
    FiClock,
    FiCheck,
    FiLock,
    FiUnlock,
    FiLayers,
    FiSlash,
    FiPieChart,
} from "react-icons/fi";
import { FaStopCircle } from "react-icons/fa";
const TokenStatus = ({ presaleStatus }) => {
    const presaleStatusIcon = {
        PRESALE_UPCOMING: (
            <FiClock color="#ffd303" size={12} style={{ marginRight: "3px" }} />
        ),
        PRESALE_INPROGRESS: (
            <FiCheck color="#3BB464" size={12} style={{ marginRight: "3px" }} />
        ),
        PRESALE_FILLED: (
            <FiLayers
                color="#c7008a"
                size={12}
                style={{ marginRight: "3px" }}
            />
        ),
        PRESALE_ENDED: (
            <FiLock color="#c7008a" size={12} style={{ marginRight: "3px" }} />
        ),
        PRESALE_ENDED_NOT_MET_SOFTCAP: (
            <FiPieChart
                color="#c7008a"
                size={12}
                style={{ marginRight: "3px" }}
            />
        ),
        LIQUIDITY_UNLOCKED: (
            <FiUnlock
                color="#2bd900"
                size={12}
                style={{ marginRight: "3px" }}
            />
        ),
        PRESALE_CANCELED: (
            <FiSlash color="#ff0000" size={12} style={{ marginRight: "3px" }} />
        ),
        PRESALE_FINALISED: (
            <FaStopCircle
                className="text-indigo-700"
                size={12}
                style={{ marginRight: "3px" }}
            />
        ),
    };
    const presaleStatusText = {
        PRESALE_UPCOMING: "Upcoming",
        PRESALE_INPROGRESS: "In progress",
        PRESALE_FILLED: "Filled",
        PRESALE_ENDED: "Ended",
        PRESALE_FINALISED: "Finalised",
        PRESALE_CANCELED: "Failed",
        PRESALE_ENDED_NOT_MET_SOFTCAP: "Failed",
        LIQUIDITY_UNLOCKED: "Liquidity Unlocked",
    };
    return (
        <div className={`tokenStatus ${presaleStatus} w-full`}>
            {presaleStatusIcon[presaleStatus]}
            {presaleStatusText[presaleStatus]}
        </div>
    );
};

export default TokenStatus;
