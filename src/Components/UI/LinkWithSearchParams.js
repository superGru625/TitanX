import { NavLink, useSearchParams } from "react-router-dom";

const LinkWithSearchParams = (props) => {
    const [searchParams] = useSearchParams();
    return (
        <NavLink
            {...props}
            to={{
                pathname: props.to.pathname,
                search: `chain=${searchParams.get("chain")}`,
            }}
        >
            {props.children}
        </NavLink>
    );
};

export default LinkWithSearchParams;
