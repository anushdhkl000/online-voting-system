import React from "react";
import notFound from "../assets/imgs/notfFund.png";
import { Image } from "@mantine/core";

const PageNotFound = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="mt-5 rounded-full">
          <Image
            src={notFound}
            alt="Permission denied"
            className="w-36 h-36 object-contain"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-red-500">Permission Denied</h2>
          <p className="text-greay-500 max-w-md">
            You don't have access to view this page. Please contact support if
            you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
