import { ReactComponent as DoubleRing } from "../../assets/images/loader/DoubleRing.svg";

const LoadingBar = ({ text = "Loading ..." }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="size-2 font-medium">{text}</span>
            <DoubleRing className="fill-black dark:fill-itemPurple w-24 h-24" />
        </div>
    );
};

export default LoadingBar;
