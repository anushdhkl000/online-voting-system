import { Container, Group, Menu, UnstyledButton, rem } from "@mantine/core";

import {
  IconChevronDown,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { useMediaQuery } from "@mantine/hooks";

import { useNavigate } from "react-router-dom";

import React from "react";
// import classes from "../assets/css/Header.module.css";
import cx from "clsx";
import { useState } from "react";

const Header = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const matches = useMediaQuery("(min-width: 576px)");

  const navigate = useNavigate();
  const user_logout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  // const dispatch = useDispatch();

  // const navigateToPage = (e) => {
  //   const find = labels.find(({ label }) => label === e);

  //   if (!find) return;

  //   navigate(find.link);
  // };

  return (
    <div className="voting-header-container">
      <div className="voting-header-container h-10 flex items-center justify-end">
        <Menu
          width={200}
          position="bottom-end"
          transitionProps={{ transition: "pop-top-right" }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton>
              <Group gap={7}>
                <div
                  className="flex items-center justify-center"
                  // alt={user?.name}
                  radius="xl"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#E9F2FA",
                    borderRadius: "10px",
                  }}
                >
                  <IconUserCircle size={18} color="#1E57AB" />
                </div>
                {matches && (
                  <p
                    className="text-base"
                    style={{ fontWeight: "600", color: "#323B4B" }}
                    size="sm"
                    lh={1}
                    mr={3}
                  >
                    {localStorage.getItem("user_name")}
                  </p>
                )}

                <div className="hidden sm:block">
                  <IconChevronDown
                    color="#323B4B"
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={2}
                  />
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            {!matches && (
              <Menu.Label>
                <Group justify="flex-start">
                  <IconUserCircle size={16} color="#1E57AB" />{" "}
                  <p className="text-base text-black">
                    {localStorage.getItem("user_name")}
                  </p>
                </Group>
              </Menu.Label>
            )}

            <Menu.Item
              onClick={() => {
                user_logout();
              }}
              className="group"
            >
              <div className="flex items-center gap-2 group-hover:text-black">
                <IconLogout style={{ width: rem(16), height: rem(16) }} />
                Logout
              </div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
