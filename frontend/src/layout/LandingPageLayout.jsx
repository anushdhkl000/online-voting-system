import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React from "react";
import {
  AppShell,
  Burger,
  Group,
  Flex,
  Box,
  Text,
  Button,
} from "@mantine/core";
import Header from "../components/Header";
import logo from "../assets/imgs/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const LandingPageLayout = (props) => {
  const matches = useMediaQuery("(min-width: 721px)");
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const hasAccessToken = localStorage.getItem("online_voting_access_token");
  const hasRefreshToken = localStorage.getItem("online_voting_refresh_token");

  return (
    <AppShell
      className="primary-bg"
      header={{ height: 60 }} // Increased header height
      footer={{ height: 50 }} // Adjusted footer height
      navbar={{
        width: 0,
        breakpoint: "721px",
        collapsed: { mobile: !opened },
      }}
      layout={opened ? "default" : "alt"}
      withBorder={true}
    >
      <AppShell.Header className="online-header secondary-bg">
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Flex align="center" gap="md">
            {!matches && (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="721px"
                size="sm"
              />
            )}
            <Box>
              <img
                src={logo}
                style={{ height: "40px", width: "40px" }}
                alt="Logo"
              />
            </Box>
            <Text fw="bold" fz="xl" c="black">
              {" "}
              Online Voting
            </Text>
          </Flex>
          <Flex>
            <div className="flex justify-start items-center gap-20 ms-10">
              <div>
                <Text
                  fw="normal"
                  fz="xl"
                  c="black"
                  className="cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Home
                </Text>
                {pathname === "/" && (
                  <div className="h-2 border-b-2 bottom-0 left-0 w-15 border-green-500"></div>
                )}
              </div>

              <div>
                <Text
                  fw="normal"
                  fz="xl"
                  c="black"
                  className="cursor-pointer"
                  onClick={() => navigate("/user/election")}
                >
                  Election
                </Text>
                {pathname === "/user/election" && (
                  <div className="h-2 border-b-2 bottom-0 left-0 w-18 border-green-500"></div>
                )}
              </div>
              <div>
                <Text
                  fw="normal"
                  fz="xl"
                  c="black"
                  className="cursor-pointer"
                  onClick={() => navigate("/about")}
                >
                  About
                </Text>
                {pathname === "/about" && (
                  <div className="h-2 border-b-2 bottom-0 left-0 w-15 border-green-500"></div>
                )}
              </div>
            </div>
          </Flex>
          <Box style={{ flex: 1 }}>
            {hasAccessToken && hasRefreshToken ? (
              <Header />
            ) : (
              <div>
                <div className="flex justify-end items-center pr-5">
                  <Button
                    variant="outline"
                    c="black"
                    className="cursor-point"
                    onClick={() => navigate("/login")}
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Main className="primary-bg" pb={50}>
        {props.children}
      </AppShell.Main>

      <AppShell.Footer className="secondary-bg" withBorder>
        <Group
          h="100%"
          px="md"
          justify="center"
          align="center"
          className="bg-gray-200"
        >
          <div style={{ fontSize: "0.875rem" }}>
            Copyright © Online voting 2025. All rights reserved.
          </div>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default LandingPageLayout;
