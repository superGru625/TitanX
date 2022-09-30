import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
} from "react-pro-sidebar";

import { useEffect } from "react";
import { ROUTE_LISTS } from "../../utils/routes";
import LinkWithSearchParams from "../UI/LinkWithSearchParams";

const Sidebar = ({ collapsed, setCollapsed }) => {
    useEffect(() => {
        if (window.innerWidth < 575) {
            setCollapsed(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setActive = (e) => {
        document
            .querySelectorAll(".pro-inner-item")
            .forEach((item) => (item.className = "pro-inner-item"));
        e.target.closest(".pro-inner-item").className += " active-inner-item";
        return;
    };
    const setActiveSubMenu = (e) => {
        document
            .querySelectorAll(".pro-inner-item")
            .forEach((item) => (item.className = "pro-inner-item"));
        e.target.closest(".pro-inner-item").className += " active-inner-item";
        return;
    };
    return (
        <div className="left-sidebar">
            <ProSidebar collapsed={collapsed}>
                <LinkWithSearchParams to={{ pathname: "/" }}>
                    <SidebarHeader>
                        <div className="sidebar-logo" />
                    </SidebarHeader>
                </LinkWithSearchParams>
                <Menu iconShape="square">
                    {ROUTE_LISTS.map((item, i) => {
                        return item.nested === true ? (
                            <SubMenu
                                key={i}
                                title={item.title}
                                icon={item.icon}
                            >
                                {item.children.map((subItem, subI) => {
                                    return (
                                        <MenuItem
                                            key={subI}
                                            icon={subItem.icon}
                                            onClick={setActiveSubMenu}
                                        >
                                            {subItem.title}
                                            {subItem.external ? (
                                                <a
                                                    rel="noopener noreferrer"
                                                    href={subItem.link}
                                                    target="_blank"
                                                >
                                                    {" "}
                                                </a>
                                            ) : (
                                                <LinkWithSearchParams
                                                    to={{
                                                        pathname: subItem.link,
                                                    }}
                                                />
                                            )}
                                        </MenuItem>
                                    );
                                })}
                            </SubMenu>
                        ) : (
                            <MenuItem
                                key={i}
                                icon={item.icon}
                                onClick={setActive}
                            >
                                {item.title}
                                {item.external ? (
                                    <a
                                        rel="noopener noreferrer"
                                        href={item.link}
                                        target="_blank"
                                    >
                                        {" "}
                                    </a>
                                ) : (
                                    <LinkWithSearchParams
                                        to={{
                                            pathname: item.link,
                                        }}
                                    />
                                )}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </ProSidebar>
            <div className="hidden">
                <div className="hidden pro-sidebar popper-inner pro-sidebar-inner pro-sidebar-header pro-icon-wrapper pro-inner-item active-inner-item pro-inner-list-item border-cyan-800"></div>
            </div>
        </div>
    );
};

export default Sidebar;
