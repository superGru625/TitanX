import { MdContentCopy } from "react-icons/md";
const ClipboardCopy = ({ copyText }) => {
    return (
        <span
            onClick={() => {
                navigator.clipboard.writeText(copyText);
            }}
        >
            <MdContentCopy color="#239419" style={{ width: "45px" }} />
        </span>
    );
};

export default ClipboardCopy;
