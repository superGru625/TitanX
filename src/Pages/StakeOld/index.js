import { useRef } from "react";
import Rewards from "./components/Rewards";
import StakeHeading from "./components/StakeHeading";
import StakeInfo from "./components/StakeInfo";
import HowToStake from "./components/HowToStake";

const StakeOld = () => {
    const stakeInfoRef = useRef(null);
    return (
        <div className="flex flex-col main-container animation-fade-in gap-6 pb-6">
            <StakeHeading />
            <StakeInfo ref={stakeInfoRef} />
            <Rewards
                refreshStakeInfo={() => {
                    stakeInfoRef.current.refreshInfo();
                }}
            />
            <HowToStake />
        </div>
    );
};
export default StakeOld;
