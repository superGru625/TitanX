const PreSaleExlude = ({
    presaleAddress,
    // TitanXLPRouterAddress = "0x252F6C5410A2a61Cc33A6dB6ae0F0016A58a9b03",
}) => {
    const Copy = ({ address }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 28 28"
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigator.clipboard.writeText(address);
            }}
        >
            <path
                d="M7.5 7.65938V19.6875C7.49982 20.8776 7.95231 22.0232 8.7657 22.892C9.57909 23.7607 10.6925 24.2876 11.88 24.3656L12.1875 24.375H20.4637C20.2699 24.9233 19.9109 25.398 19.4361 25.7338C18.9613 26.0696 18.394 26.2499 17.8125 26.25H11.25C9.75816 26.25 8.32742 25.6574 7.27252 24.6025C6.21763 23.5476 5.625 22.1168 5.625 20.625V10.3125C5.6247 9.73064 5.80486 9.16301 6.14068 8.68783C6.47649 8.21265 6.95142 7.85333 7.5 7.65938V7.65938ZM21.5625 3.75C22.3084 3.75 23.0238 4.04632 23.5512 4.57376C24.0787 5.10121 24.375 5.81658 24.375 6.5625V19.6875C24.375 20.4334 24.0787 21.1488 23.5512 21.6762C23.0238 22.2037 22.3084 22.5 21.5625 22.5H12.1875C11.4416 22.5 10.7262 22.2037 10.1988 21.6762C9.67131 21.1488 9.375 20.4334 9.375 19.6875V6.5625C9.375 5.81658 9.67131 5.10121 10.1988 4.57376C10.7262 4.04632 11.4416 3.75 12.1875 3.75H21.5625Z"
                fill="#FF9670"
            />
            <title id="copy-address">Copy Address</title>
        </svg>
    );
    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col w-full">
            <span className="size-2 font-semibold text-buttonLightOrange dark:text-buttonDarkOrange">
                Exclude those address’s from every fee!
            </span>
            <div className="flex flex-col lg:flex-row justify-between pt-6 size-sm w-full overflow-hidden">
                <span>Presale Address:</span>
                <span className="flex gap-1">
                    <span>{presaleAddress}</span>
                    <Copy address={presaleAddress} />
                </span>
            </div>
            {/* <div className="flex flex-col lg:flex-row justify-between pt-6 size-sm w-full overflow-hidden">
                <span>TitanX LPRouter:</span>
                <span className="flex gap-1">
                    <span>{TitanXLPRouterAddress}</span>
                    <Copy address={TitanXLPRouterAddress} />
                </span>
            </div> */}
        </div>
    );
};
export default PreSaleExlude;
