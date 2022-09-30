import { Skeleton } from "antd";
import Blockies from "react-blockies";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
    if (!props.address) return <Skeleton.Avatar active size={40} />;

    return (
        <Blockies
            seed={props.address.toLowerCase()}
            className="identicon"
            {...props}
        />
    );
}

export default Blockie;
