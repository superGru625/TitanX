import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import PresaleDetails from "../PresaleInfo/PresaleDetails";

const UploadStealthDetails = ({ token0Address, offChainData = {} }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="flex justify-between items-center pt-6">
            <div className="flex flex-col items-start">
                <span className="size-1">Enter project Information</span>
                <span className="text-comment">
                    Click the + to enter, Logo, Description, Socials.....
                </span>
            </div>

            <span
                className="px-3 border-black dark:border-white border-[1px] rounded-full size-1 cursor-pointer"
                onClick={() => setVisible(true)}
            >
                <BsPlus />
            </span>

            <PresaleDetails
                presaleAddress={token0Address}
                offChainData={offChainData}
                setVisible={setVisible}
                visible={visible}
            />
        </div>
    );
};

export default UploadStealthDetails;
