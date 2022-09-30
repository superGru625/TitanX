import { ReactComponent as WavingDots } from "../../assets/images/loader/WavingDots.svg";

const LoadingDots = ({ text = "Loading ..." }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="size-2 font-medium">{text}</span>
            <WavingDots className="fill-black dark:fill-itemPurple w-24 h-12" />
        </div>
    );
};

export default LoadingDots;
