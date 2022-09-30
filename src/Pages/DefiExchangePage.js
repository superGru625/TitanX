import React from "react";
import ChartSwapTxTable from "../Components/DefiExchange/ChartSwapTxTable";
import MarketInfo from "../Components/DefiExchange/MarketInfo";

const DefiExchange = () => {
    return (
        <div className="flex flex-col mx-6 animation-fade-in">
            <MarketInfo />
            <ChartSwapTxTable />
        </div>
    );
};
export default DefiExchange;
