import toast from "react-hot-toast";

export const showToast = (type = "SUCCESS", text = "", icon) => {
    if (icon) {
        toast(text, {
            icon,
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    } else if (type === "SUCCESS")
        toast.success(text, {
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    else {
        toast.error(text, {
            style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
            },
        });
    }
};
