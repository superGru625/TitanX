const PresaleSteps = () => {
    const presaleStepsArray = [
        {
            image: "./images/presalesteps1.svg",
            name: "Exclude presale from fee’s",
            warning: "Only for liquidity generators!",
        },
        {
            image: "./images/presalesteps2.svg",
            name: "Remove Fees",
            warning: "Only for liquidity generators!",
        },
        {
            image: "./images/presalesteps3.svg",
            name: "Deposit Tokens",
        },
        {
            image: "./images/presalesteps4.svg",
            name: "Finalise Presale",
        },
        {
            image: "./images/presalesteps5.svg",
            name: "Burn Tokens",
            warning: "Optional!",
        },
        {
            image: "./images/presalesteps6.svg",
            name: "Enable fee’s",
            warning: "Only for liquidity generators!",
        },
        {
            image: "./images/presalesteps7.svg",
            name: "Withdraw Liquidity",
        },
    ];
    return (
        <div className="component-container rounded-2xl shadow-lg p-6 flex flex-col h-full">
            <span className="size-2 font-semibold">Presale Steps</span>
            <div className="flex flex-col items-start pt-2 gap-3">
                {presaleStepsArray.map((el, i) => (
                    <div className="flex flex-row items-baseline gap-3" key={i}>
                        <span className="size-1 font-medium">{`${i}.`}</span>
                        <div className="flex flex-col">
                            <span className="size-base">{el.name}</span>
                            {el.warning && (
                                <span className="text-[#FF6E38] size-sm">
                                    {el.warning}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PresaleSteps;
