import React, { useEffect, useState } from "react";
import { mainLinksData } from "./helper";
import classes from "../assets/css/DoubleNavbar.module.css";
import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
import { Tooltip, UnstyledButton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const Navbar = () => {
  const navigate = useNavigate();
  const matchesHeight = useMediaQuery("(min-height: 800px)");
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (location.pathname.startsWith("/election")) {
      setActive("election");
    } else if (location.pathname.startsWith("/candidate")) {
      setActive("candidate");
    } else if (location.pathname.startsWith("/group")) {
      setActive("group");
    } else if (location.pathname.startsWith("/user")) {
      setActive("user");
    } else {
      setActive("home");
    }
  }, [location.pathname]);

  const mainLinks = mainLinksData.reduce((acc, link) => {
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
        <div className="ps-5">
          {/* <pre>{JSON.stringify(active)}</pre> */}
          {mainLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
