import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
    AppShell,
    Burger,

    Group,

} from "@mantine/core";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const PageLayout = (props) => {
    const matches = useMediaQuery("(min-width: 721px)");
    // const path = window.location.pathname;
    // const pathSegments = path.split("/");
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            className="primary-bg"
            header={{ height: 60 }}
            navbar={{
                // width: openedSublinks ? 300 : 80,
                width: 80,
                breakpoint: "721px",
                collapsed: { mobile: !opened }
            }}
            padding="md"
            layout={opened ? "default" : "alt"}
            withBorder={true}>
            <AppShell.Header className="online-header secondary-bg ">
                <Group h="100%" px="xs" className="header-burger">
                    {!matches && <Burger opened={opened} onClick={toggle} hiddenFrom="721px" size="sm" />}
                    <Header />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar className="secondary-bg">
                {/* <DoubleNavbar
                    activeTitle={activeTitle}
                    setActiveTitle={(e) => setActiveTitle(e)}
                    openedSublinks={openedSublinks}
                    leftData={props?.fileDirectory?.menu || []}
                    // permissionLinks={permissionLinks}
                    burgerOpen={opened}
                    burgerClick={toggle}
                    openSublinks={() => setOpenedSublinks((prevValue) => !prevValue)}
                    matches={matches}
                /> */}
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main className="primary-bg">{props.children}</AppShell.Main>
        </AppShell>
    )
}

export default PageLayout;