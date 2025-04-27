import { ActionIcon, rem, Space, TextInput, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../components/PageHeader";
import { IconSearch, IconUserCog } from "@tabler/icons-react";
import UserTable from "../components/UserTable";
import UserStatus from "../components/UserStatus";
import UserRole from "../components/UserRole";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewUserList } from "../actions/userAction";
import { AppIcons } from "../../../ui/shared/AppIcons";
import UploadOrganisationModal from "../components/UploadOrganisationModal";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userList } = useSelector((state) => state.users);

  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const userData = userList?.response;
  const totalData = userList?.total;

  const initialFilters = {
    page: 1,
    pageSize: 20,
  };

  const [filters, setFilters] = React.useState({
    ...initialFilters,
  });

  const organisations = [
    { value: "org1", label: "Organisation One" },
    { value: "org2", label: "Organisation Two" },
    { value: "org3", label: "Organisation Three" },
  ];

  useEffect(() => {
    dispatch(viewUserList(filters));
  }, [dispatch]);

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
            onChange={() => {
              //   debounceSearch(e.target.value);
            }}
          />
          {/* <Tooltip
            withArrow
            color="#2cd3b5"
            label="Upload organisation users"
            position="top"
          >
            <ActionIcon
              radius="50%"
              size={"lg"}
              variant="filled"
              onClick={() => {
                setImportOpen(true);
              }}
            >
              <AppIcons.IconUpload size={20} />
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
