const WhiteListPresale = ({ isWhitelisted, isWhitelist }) => {
    return (
        <div className="flex flex-col text-center gap-2">
            <div className="font-semibold size-1 tracking-wider">
                {isWhitelist ? "Whitelisted Presale!" : "Public Presale"}
            </div>
            {isWhitelist ? (
                <>
                    <span>
                        Your wallet needs to be whitelisted to participate in
                        this presale.
                    </span>
                    {isWhitelisted ? (
                        <div className="mx-6 py-2 font-medium text-[#62AB06] dark:text-white border-[1px] rounded-full border-[#62AB06] bg-[#3FE23166]">
                            Your wallet is whitelisted! 🥳
                        </div>
                    ) : (
                        <div className="mx-6 py-2 font-medium text-[#D93410] dark:text-white border-[1px] rounded-full border-[#D93410] bg-[#D9341080]">
                            No your wallet is not whitelisted!
                        </div>
                    )}
                </>
            ) : (
                <span>Sale is open to public no requirements</span>
            )}
        </div>
    );
};
export default WhiteListPresale;
