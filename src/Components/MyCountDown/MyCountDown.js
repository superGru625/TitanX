import React, { useEffect, useState } from "react";

const MyCountDown = ({ dayCount, timeCount, date }) => {
    const endTime = new Date(dayCount || timeCount || date).getTime();

    var dd = String(new Date(date).getDate()).padStart(2, "0");
    var mm = String(new Date(date).getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = new Date(date).getFullYear();

    const dates = mm + "/" + dd + "/" + yyyy;
    const [currentTime, setcurrentTime] = useState(new Date().getTime());
    const gap = endTime - currentTime; //177670892

    const seconds = 1000; // in milliseconds
    const minutes = seconds * 60;
    const hours = minutes * 60;
    const days = hours * 24;

    const day = Math.floor(gap / days);
    const hour = Math.floor((gap % days) / hours);
    const minute = Math.floor((gap % hours) / minutes);
    const second = Math.floor((gap % minutes) / seconds);

    useEffect(() => {
        const timeoutInterval = setTimeout(
            () => setcurrentTime(new Date().getTime()),
            1000
        );
        return () => {
            clearInterval(timeoutInterval);
        };
    }, [currentTime]);

    return (
        <>
            {dayCount &&
                `${day < 10 ? "0" + day : day}:${
                    hour < 10 ? "0" + hour : hour
                }:${minute < 10 ? "0" + minute : minute}:${
                    second < 10 ? "0" + second : second
                }`}
            {timeCount &&
                `${hour < 10 ? "0" + hour : hour}:${
                    minute < 10 ? "0" + minute : minute
                }:${second < 10 ? "0" + second : second}`}
            {date &&
                `${dates} ${hour < 10 ? "0" + hour : hour}:${
                    minute < 10 ? "0" + minute : minute
                }:${second < 10 ? "0" + second : second}`}
        </>
    );
};

export default MyCountDown;
