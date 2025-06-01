import { ActionIcon, rem, Space, TextInput, Tooltip } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import { IconSearch, IconUserCog } from "@tabler/icons-react";
import UserTable from "../components/UserTable";
import UserStatus from "../components/UserStatus";
import UserRole from "../components/UserRole";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewUserList } from "../actions/userAction";

import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../../constants/Pagination";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import PageNotFound from "../../../../components/PageNotFound";
import VerifyUserDetails from "../components/VerifyUserDetails";
import { AppIcons } from "../../../../ui/shared/AppIcons";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userList } = useSelector((state) => state.users);

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [verifyDetailsOpen, setVerifyDetailsOpen] = useState(false);

  const userData = userList?.response;
  const totalData = userList?.total;

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasViewUser = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_USER,
    permission
  );

  const initialFilters = {
    page: 1,
    pageSize: 20,
  };

  const [filters, setFilters] = React.useState({
    ...initialFilters,
  });

  // const organisations = [
  //   { value: "org1", label: "Organisation One" },
  //   { value: "org2", label: "Organisation Two" },
  //   { value: "org3", label: "Organisation Three" },
  // ];

  useEffect(() => {
    dispatch(viewUserList(filters));
  }, [dispatch, filters]);

  const triggerStatus = (_val) => {
    setSelectedUserId(_val);
    setStatusOpen(true);
  };

  const triggerRole = (_val) => {
    setSelectedUserId(_val);
    setRoleOpen(true);
  };

  const triggerPermission = (_val) => {
    setSelectedUserId(_val);
    navigate("/user/permission", { state: { selectedUserId: _val } });
  };

  const handleSearch = (val) => {
    setFilters({
      ...filters,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);
  const isUser = localStorage.getItem("role");
  if (!hasViewUser || isUser === "user") {
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }

  const triggerVerifyDetails = (_val) => {
    setSelectedUserId(_val);
    setVerifyDetailsOpen(true);
  };

  return (
    <div>
      <Helmet>
        <title>Voting | User</title>
      </Helmet>
      <Space h={10} />

      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconUserCog
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={
            <div className="flex items-center gap-4">
              Users
              {/* {<Loader color="red" size={18} />} */}
            </div>
          }
          subtitle="mange and track users"
        />
        <PageHeader.Right className="gap-6">
          <TextInput
            placeholder="Search users"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            onChange={(e) => {
              debounceSearch(e.target.value);
            }}
          />
          {/* <Tooltip
            withArrow
            color="#2cd3b5"
            label="Manage group permissions"
            position="top"
          >
            <ActionIcon
              radius="50%"
              size={"lg"}
              variant="filled"
              onClick={() => {
                // setImportOpen(true);
                navigate("/user/permission");
              }}
            >
              <AppIcons.IconEyeEdit color="black" size={20} />
            </ActionIcon>
          </Tooltip> */}
        </PageHeader.Right>
      </PageHeader>
      <Space h={30} />
      <UserTable
        filters={filters}
        setFilters={setFilters}
        triggerStatus={triggerStatus}
        triggerRole={triggerRole}
        triggerPermission={triggerPermission}
        userData={userData}
        totalData={totalData}
        triggerVerifyDetails={triggerVerifyDetails}
      />
      {statusOpen && (
        <UserStatus
          opened={statusOpen}
          close={() => setStatusOpen(false)}
          selectedUserId={selectedUserId}
          filters={filters}
        />
      )}
      {roleOpen && (
        <UserRole
          opened={roleOpen}
          close={() => setRoleOpen(false)}
          selectedUserId={selectedUserId}
          filters={filters}
        />
      )}

      {verifyDetailsOpen && (
        <VerifyUserDetails
          opened={verifyDetailsOpen}
          close={() => setVerifyDetailsOpen(false)}
          selectedUserId={selectedUserId}
          filters={filters}
        />
      )}
      {/* {importOpen && (
        <UploadOrganisationModal
          opened={importOpen}
          onClose={() => setImportOpen(false)}
          organisations={organisations}
        />
      )} */}
    </div>
  );
};

export default UserList;
