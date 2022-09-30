import { useRef } from "react";
import AppStake from "../Components/StakeComponents/AppStake";
import StakeInfo from "../Components/StakeComponents/StakeInfo";
import Rewards from "../Components/StakeComponents/Rewards";
import HowToStake from "../Components/StakeComponents/HowToStake";

const Stake = () => {
    const stakeInfoRef = useRef(null);
    return (
        <div className="flex flex-col main-container animation-fade-in gap-6 pb-6">
            <AppStake />
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
export default Stake;
