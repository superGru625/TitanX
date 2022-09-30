import { useEffect, useState } from "react";
import { MdOnlinePrediction, MdNotInterested } from "react-icons/md";
import { RiTimerFlashLine, RiTimer2Line } from "react-icons/ri";

const StealthStatus = ({ stealthData }) => {
    const [stealthStatus, setStealthStatus] = useState("");
    useEffect(() => {
        const timerInterval = setInterval(() => {
            const offset = new Date().getTime() / 1000 - stealthData.launchTime;
            if (offset < 3600) setStealthStatus("STEALTH_JUST_LAUNCHED");
            else if (offset < 7200)
                setStealthStatus("STEALTH_LAUNCHED_1HR_AGO");
            else setStealthStatus("STEALTH_ACTIVE");
        }, 1000);
        return () => {
            clearInterval(timerInterval);
        };
        // eslint-disable-next-line
    }, []);
    const stealthStatusIcon = {
        STEALTH_JUST_LAUNCHED: (
            <RiTimerFlashLine color="#3BB464" size={16} className="w-12" />
        ),
        STEALTH_LAUNCHED_1HR_AGO: (
            <RiTimer2Line color="#c7008a" size={16} className="w-12" />
        ),
        STEALTH_ACTIVE: (
            <MdOnlinePrediction color="#fe55ff" size={16} className="w-12" />
        ),
        STEALTH_DEAD: (
            <MdNotInterested color="#ffb500" size={16} className="w-12" />
        ),
    };
    const stealthStatusText = {
        STEALTH_JUST_LAUNCHED: "Just Launched",
        STEALTH_LAUNCHED_1HR_AGO: "Launched 1hr ago",
        STEALTH_ACTIVE: "Active",
        STEALTH_DEAD: "Dead",
    };
    return (
        <div className={`stealthStatus ${stealthStatus} w-full`}>
            {stealthStatusIcon[stealthStatus]}
            <span className="w-36"> {stealthStatusText[stealthStatus]}</span>
        </div>
    );
};

export default StealthStatus;
