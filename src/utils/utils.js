import Web3 from "web3";

export const getUnixTime = (time) =>
    Math.round(new Date(time).getTime() / 1000);

export const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
        date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
};

export const numberConverter = (value, decimals = 3) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(value)) >= 1.0e12
        ? (Math.abs(Number(value)) / 1.0e12).toFixed(decimals) + " T"
        : Math.abs(Number(value)) >= 1.0e9
        ? (Math.abs(Number(value)) / 1.0e9).toFixed(decimals) + " B"
        : Math.abs(Number(value)) >= 1.0e6
        ? (Math.abs(Number(value)) / 1.0e6).toFixed(decimals) + " M"
        : Math.abs(Number(value)) >= 1.0e3
        ? (Math.abs(Number(value)) / 1.0e3).toFixed(decimals) + " K"
        : Math.abs(Number(value)).toFixed(decimals);
};

export const percentageConverter = (value, total) => {
    return ((value * 100) / total).toFixed(2) + " %";
};

export const sec2Format = (_seconds) => {
    const seconds = parseInt(_seconds);
    const _days = parseInt(seconds / 3600 / 24);
    const _hours = parseInt((seconds % (3600 * 24)) / 3600);
    const _mins = parseInt((seconds % 3600) / 60);
    const _secs = parseInt(seconds % 60);
    return `${_days > 0 ? _days + " Days" : ""} ${_hours
        .toString()
        .padStart(2, "0")}:${_mins.toString().padStart(2, "0")}:${_secs
        .toString()
        .padStart(2, "0")}`;
};

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
export const floatConverter = (value) => {
    const len = 1 / value;
    if (getBaseLog(10, len) > 4) {
        let multipled = value * 10 ** parseInt(getBaseLog(10, len) - 2);
        return "0.00.." + multipled.toFixed(6).toString().slice(4);
    }
    if (value < 1) return value.toFixed(5);
    else if (value < 10) return value.toFixed(4);
    return value.toFixed(3);
};

export const checksumedAddressImgLink = (address) => {
    try {
        return `https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/${Web3.utils.toChecksumAddress(
            address
        )}/logo.png`;
    } catch (error) {
        return "/images/unknown.svg";
    }
};

export const dateFormat = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    // var year = a.getFullYear();
    var month = (a.getMonth() + 1).toString().padStart(2, "0");
    var date = a.getDate().toString().padStart(2, "0");
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time =
        date +
        "/" +
        month +
        /* "/" + year +*/ " " +
        hour +
        ":" +
        min +
        ":" +
        sec;
    return time;
};
