import { useMediaQuery } from "@mantine/hooks";
import React from "react";

const HeaderRight = ({ children, className = "" }) => {
  return (
    <div className={"flex items-center gap-2" + " " + className}>
      {children}
    </div>
  );
};

const HeaderLeft = ({
  className = "",
  children,
  title,
  subtitle = "",
  icon = null,
}) => {
  const matches = useMediaQuery("(min-width:768px)");
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon}
      <div className={`flex items-center gap-2 ${className}`}>
        <div>
          <h2 className="header_title !text-base !md:text-2xl">{title}</h2>
          <p
            className={`${
              matches ? "" : "text-xs"
            } header_subtitle text-gray-700`}
          >
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

const IconWrapper = ({ children, className = "" }) => {
  return <div className={`rounded px-3 py-3 ${className}`}>{children}</div>;
};

const PageHeader = ({ children }) => {
  const matches = useMediaQuery("(min-width:821px)");
  return (
    <div
      className={`flex gap-2 justify-between ${
        matches ? "items-start flex-wrap" : "items-center"
      }`}
    >
      {children}
    </div>
  );
};

PageHeader.Left = HeaderLeft;
PageHeader.Right = HeaderRight;
PageHeader.IconWrapper = IconWrapper;

export default PageHeader;
