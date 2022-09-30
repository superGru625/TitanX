import { useEffect, useState } from "react";
import { getEllipsisTxt } from "../../helpers/formatters";
import "./identicon.css";
import { Skeleton } from "antd";
import Blockie from "../UI/Blockie";

function Address(props) {
    const account = props.account;
    const [address, setAddress] = useState();
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        setAddress(props?.address || account);
    }, [account, props]);

    if (!address)
        return (
            <Skeleton
                paragraph={{ rows: 1, width: "100%" }}
                title={false}
                active
            />
        );

    const Check = () => (
        <svg
            className="w-6 h-6 animation-fade-in"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="#21BF96"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l5 5l10 -10" />
            <title id="copied-address">Copied!</title>
        </svg>
    );

    return (
        <div className="size-1 font-medium flex items-center justify-center gap-3">
            {props.avatar === "left" && <Blockie address={address} size={6} />}
            <p className="text-itemIndigo dark:text-itemPurple size-base">
                {props.size ? getEllipsisTxt(address, props.size) : address}
            </p>
            {props.avatar === "right" && <Blockie address={address} size={6} />}
            {isClicked ? (
                <Check />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 animation-fade-in"
                    viewBox="0 0 28 28"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigator.clipboard.writeText(address);
                        setIsClicked(true);
                        setTimeout(() => {
                            setIsClicked(false);
                        }, 2000);
                    }}
                >
                    <path
                        d="M7.5 7.65938V19.6875C7.49982 20.8776 7.95231 22.0232 8.7657 22.892C9.57909 23.7607 10.6925 24.2876 11.88 24.3656L12.1875 24.375H20.4637C20.2699 24.9233 19.9109 25.398 19.4361 25.7338C18.9613 26.0696 18.394 26.2499 17.8125 26.25H11.25C9.75816 26.25 8.32742 25.6574 7.27252 24.6025C6.21763 23.5476 5.625 22.1168 5.625 20.625V10.3125C5.6247 9.73064 5.80486 9.16301 6.14068 8.68783C6.47649 8.21265 6.95142 7.85333 7.5 7.65938V7.65938ZM21.5625 3.75C22.3084 3.75 23.0238 4.04632 23.5512 4.57376C24.0787 5.10121 24.375 5.81658 24.375 6.5625V19.6875C24.375 20.4334 24.0787 21.1488 23.5512 21.6762C23.0238 22.2037 22.3084 22.5 21.5625 22.5H12.1875C11.4416 22.5 10.7262 22.2037 10.1988 21.6762C9.67131 21.1488 9.375 20.4334 9.375 19.6875V6.5625C9.375 5.81658 9.67131 5.10121 10.1988 4.57376C10.7262 4.04632 11.4416 3.75 12.1875 3.75H21.5625Z"
                        fill="#FF9670"
                    />
                    <title>Copy Address</title>
                </svg>
            )}
        </div>
    );
}

export default Address;
