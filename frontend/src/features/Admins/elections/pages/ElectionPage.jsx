import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import {
  IconSearch,
  IconSquaresSelected,
  IconStack2Filled,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Loader,
  rem,
  Space,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import ElectionTable from "../components/ElectionTable";
import { useDispatch, useSelector } from "react-redux";
import { getElections } from "../actions/electionAction";
import ManageElection from "../components/ManageElection";
import DeleteElection from "../components/DeleteElection";
import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../../constants/Pagination";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import PageNotFound from "../../../../components/PageNotFound";
import AssignPosition from "../components/AssignPosition";

const ElectionPage = () => {
  const dispatch = useDispatch();

  const [manageOpen, setManageOpen] = useState(false);
  const [details, setDetails] = useState({
    subTitle: "create your elections details",
    action: "add",
  });

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasAddElection = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.ADD_ELECTION,
    permission
  );

  const hasViewElectionList = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_ELECTION,
    permission
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const [assignPositionOpen, setAssignPositionOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);

  const initialFilters = {
    page: 1,
    pageSize: 20,
    search: "",
    sortBy: "_id",
    sortOrder: "desc",
  };

  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  useEffect(() => {
    dispatch(getElections({ ...filters }));
  }, [filters]);

  const triggerEdit = (_val) => {
    setDetails({
      subTitle: "edit your elections details",
      action: "edit",
    });
    setManageOpen(true);
    setSelectedValue(_val);
  };

  const triggerDelete = (_val) => {
    setSelectedValue(_val);
    setDeleteOpen(true);
  };

  const handleSearch = (val) => {
    setFilters({
      ...filters,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);
  const isUser = localStorage.getItem("role");

  if (!hasViewElectionList || isUser === "user") {
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }

  const triggerAssignPosition = (_val) => {
    setAssignPositionOpen(true);
    setSelectedElection(_val);
  };

  return (
    <div>
      <Helmet>
        <title>Voting | Elections</title>
      </Helmet>
      <Space h={10} />
      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconStack2Filled
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={
            <div className="flex items-center gap-4">
              Elections
              {/* {<Loader color="red" size={18} />} */}
            </div>
          }
          subtitle="mange and track elections"
        />
        <PageHeader.Right className="gap-6">
          <TextInput
            placeholder="Search elections"
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
          {hasAddElection && (
            <Tooltip
              withArrow
              color="#2cd3b5"
              label="Create Election"
              position="top"
            >
              <ActionIcon
                radius="50%"
                size={"lg"}
                variant="filled"
                onClick={() => {
                  setManageOpen(true);
                  setDetails({
                    subTitle: "create your elections details",
                    action: "add",
                  });
                }}
              >
                <AppIcons.Plus size={20} />
              </ActionIcon>
            </Tooltip>
          )}
        </PageHeader.Right>
      </PageHeader>
      <Space h={30} />

      <ElectionTable
        triggerEdit={triggerEdit}
        triggerDelete={triggerDelete}
        filters={filters}
        setFilters={setFilters}
        triggerAssignPosition={triggerAssignPosition}
      />

      {manageOpen && (
        <ManageElection
          details={details}
          open={manageOpen}
          close={() => setManageOpen(false)}
          selectedValue={selectedValue}
        />
      )}
      {deleteOpen && (
        <DeleteElection
          deleteOpen={deleteOpen}
          close={() => setDeleteOpen(false)}
          selectedValue={selectedValue}
        />
      )}

      {assignPositionOpen && (
        <AssignPosition
          opened={assignPositionOpen}
          close={() => setAssignPositionOpen(false)}
          selectedElection={selectedElection}
        />
      )}
    </div>
  );
};

export default ElectionPage;
