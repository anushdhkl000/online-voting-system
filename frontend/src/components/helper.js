import {
    IconCategoryPlus,
    IconSitemap,
    IconSquaresSelected,
    IconStack2Filled,
    IconUserCog,
    IconUsers
} from "@tabler/icons-react";

export const subLinks = {
    home: [
        {
            label: "Dashboard",
            link: "/dashboard"
        },
        {
            label: "Elections",
            link: "/election"
        },
        {
            label: "Candidates",
            link: "/candidate"
        },
        {
            label: "Symbols",
            link: "/symbol"
        },
        {
            label: "Users",
            link: "/user"
        },
        {
            label: "Organisations",
            link: "/organisation"
        },
    ]

};

export const mainLinksData = [
    {
        icon: IconSquaresSelected,
        label: "Dashboard",
        value: "dashboard",
        link: "/dashboard"
    },
    {
        icon: IconStack2Filled,
        label: "Elections",
        value: "election",
        link: "/election"
    },
    {
        icon: IconUsers,
        label: "Candidates",
        value: "candidate",
        link: "/candidate"
    },
    {
        icon: IconCategoryPlus,
        label: "Symbols",
        value: "symbol",
        link: "/symbol"
    },
    {
        icon: IconUserCog,
        label: "Users",
        value: "user",
        link: "/user"
    },
    {
        icon: IconSitemap,
        label: "Organisations",
        value: "organisation",
        link: "/organisation"
    }
]


export const labels = Object.keys(subLinks).reduce((acc, cur) => acc.concat(subLinks[cur]), []);

