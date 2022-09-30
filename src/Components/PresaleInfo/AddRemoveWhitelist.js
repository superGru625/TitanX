import { useRef } from "react";
import toast from "react-hot-toast";

const AddRemoveWhitelist = ({
    visible,
    setVisible,
    presaleContract,
    account,
}) => {
    const web3 = window.web3;
    const textAreaRef = useRef(null);
    const addWhiteList = async (adding) => {
        let tempArray = textAreaRef.current.value.split("\n");
        let addArray = [];
        tempArray.forEach((element) => {
            if (element.trim().length === 0) return;
            if (web3.utils.isAddress(element.trim()))
                addArray.push(element.trim());
        });
        if (addArray.length === 0) {
            toast.error(`List is empty or contains invalid addresses`, {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            return;
        }
        if (adding) {
            await presaleContract.methods
                .addWhitelist(addArray)
                .send({ from: account });
        } else {
            await presaleContract.methods
                .removeFromWhitelist(addArray)
                .send({ from: account });
        }
        toast.success(
            `${addArray.length} address(es) were ${
                adding ? "added" : "removed"
            }`,
            {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            }
        );
        console.log(addArray);
        setVisible(false);
    };

    return (
        <div className={`${visible ? "flex" : "hidden"} ace-modal`}>
            <div
                className="ace-modal-overlay"
                onClick={() => setVisible(false)}
            />
            <div className="ace-modal-main w-10/12 md:w-1/3">
                <div className="ace-modal-header">
                    <span>Add/Remove Whitelist.</span>
                    <button
                        type="button"
                        className="ace-modal-close-button"
                        onClick={() => setVisible(false)}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="ace-modal-body p-6 flex flex-col">
                    <span className="text-[#FC591D]">
                        Make sure there are no duplicates.
                    </span>
                    <textarea
                        ref={textAreaRef}
                        rows="6"
                        className="w-full bg-[#CED4FF]"
                        placeholder="Enter addresses seperated by a new line."
                    ></textarea>
                    <span className="font-semibold py-2 text-center">
                        We Recommend only adding 200 each time.
                    </span>
                    <div className="flex flex-row justify-around pt-8">
                        <button
                            className="bg-itemIndigo dark:bg-itemPurple text-white rounded-full w-40"
                            onClick={() => addWhiteList(true)}
                        >
                            Add
                        </button>
                        <button
                            className="border-2 border-itemIndigo dark:border-itemPurple text-itemIndigo dark:text-itemPurple rounded-full w-40"
                            onClick={() => {
                                addWhiteList(false);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddRemoveWhitelist;
