import {
    IconNotes,
    IconSquaresSelected,
    IconStack2Filled,
    IconUserCog,
    IconUsers,
    IconUsersGroup
} from "@tabler/icons-react";

export const subLinks = {
    home: [
        {
            label: "Home",
            link: "/"
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
            label: "Groups",
            link: "/group"
        },
        {
            label: "Users",
            link: "/user"
        },
    ]

};

export const mainLinksData = [
    {
        icon: IconSquaresSelected,
        label: "Home",
        value: "home",
        link: "/"
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
        icon: IconUsersGroup,
        label: "Groups",
        value: "group",
        link: "/group"
    },
    {
        icon: IconUserCog,
        label: "Users",
        value: "user",
        link: "/user"
    }
]


export const labels = Object.keys(subLinks).reduce((acc, cur) => acc.concat(subLinks[cur]), []);

