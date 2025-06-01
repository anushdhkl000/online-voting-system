import React, { useEffect, useState } from "react";
import { mainLinksData } from "./helper";
import classes from "../assets/css/DoubleNavbar.module.css";
import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { Tooltip, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSelector } from "react-redux";
import checkPermission from "../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../constants/permissionConstant";

const Navbar = () => {
  const navigate = useNavigate();
  const matchesHeight = useMediaQuery("(min-height: 800px)");
  const [active, setActive] = useState("home");

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  useEffect(() => {
    if (location.pathname.startsWith("/election")) {
      setActive("election");
    } else if (location.pathname.startsWith("/candidate")) {
      setActive("candidate");
    } else if (location.pathname.startsWith("/symbol")) {
      setActive("symbol");
    } else if (location.pathname.startsWith("/user")) {
      setActive("user");
    } else if (location.pathname.startsWith("/organisation")) {
      setActive("organisation");
    } else {
      setActive("dashboard");
    }
  }, [location.pathname]);

  const permissionLinks = {
    Dashboard: localStorage.getItem("role") === "user" ? false : true,
    Election:
      localStorage.getItem("role") === "user"
        ? false
        : checkPermission(
            PERMISSION_FEATURE_COSNTANTS.VIEW_ELECTION,
            permission
          ),
    Candidate:
      localStorage.getItem("role") === "user"
        ? false
        : checkPermission(
            PERMISSION_FEATURE_COSNTANTS.VIEW_CANDIDATE,
            permission
          ),
    Symbol:
      localStorage.getItem("role") === "user"
        ? false
        : checkPermission(PERMISSION_FEATURE_COSNTANTS.VIEW_GROUP, permission),
    User:
      localStorage.getItem("role") === "user"
        ? false
        : checkPermission(PERMISSION_FEATURE_COSNTANTS.VIEW_USER, permission),
    Organisation:
      localStorage.getItem("role") === "user"
        ? false
        : checkPermission(
            PERMISSION_FEATURE_COSNTANTS.VIEW_ORGANISATION,
            permission
          ),
  };

  const filteredLinks = mainLinksData.filter((item) => {
    // Convert label to match the key in permissionLinks (e.g., "Symbols" -> "Symbol")
    const permissionKey = item.label.replace(/s$/, ""); // Remove trailing 's' if needed
    return permissionLinks[permissionKey] !== false;
  });

  // Result:
  // filteredLinks will contain only the items where the corresponding permission is not false

  const mainLinks = filteredLinks.reduce((acc, link) => {
    // if (!permissionLinks[link.label]) return acc;
    return acc.concat(
      <Tooltip
        label={link.label}
        className={classes.mainLinkToolTip}
        // position="right"
        withArrow
        color="white"
        c="#2cd3b5"
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton
          onClick={() => {
            const toLinks = link.link;
            const active = link.value;
            // const satisfyingLink = toLinks.find(
            //   (toLink) => permissionLinks[toLink.label]
            // );

            setActive(active);
            navigate(toLinks);
          }}
          className={classes.mainLink}
          data-active={link.value === active || undefined}
          // disabled={link.value === active || undefined}
          style={{
            ...(matchesHeight && {
              position: "absolute",
              bottom: "15px",
            }),
            width: "44px",
            height: "44px",
          }}
        >
          <link.icon
            style={{
              width: "20px",
              height: "20px",
            }}
            stroke={1.5}
          />
          <small style={{ fontSize: "8px" }}>{link.label}</small>
        </UnstyledButton>
      </Tooltip>
    );
  }, []);

  return (
    <nav>
      <div>
        <div className={classes.logo}>
          <img
            height={40}
            src={logo}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", height: "40px", width: "40px" }}
          />
        </div>
        <div className="ps-5">{mainLinks}</div>
      </div>
    </nav>
  );
};

export default Navbar;
