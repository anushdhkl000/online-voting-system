import {
  ActionIcon,
  Button,
  Modal,
  rem,
  Space,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconUsersGroup } from "@tabler/icons-react";
import React, { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import GroupTable from "../components/GroupTable";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroup, getAllGroups } from "../actions/groupAction";
import { toast } from "react-toastify";
import ManageGroup from "../components/ManageGroup";
import { DEBOUNCE_TIME } from "../../../../constants/Pagination";
import debounce from "lodash.debounce";
import AssignGroup from "../components/AssignGroup";
import { getCandidates } from "../../candidates/actions/candidateAction";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import PageNotFound from "../../../../components/PageNotFound";

const GroupPageList = () => {
  const dispatch = useDispatch();

  const initialFilters = {
    page: 1,
    pageSize: 20,
  };

  const [filters, setFilters] = React.useState(initialFilters);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState(null);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [details, setDetails] = React.useState({
    subTitle: "create your symbol details",
    action: "add",
  });
  const [selectedData, setSelectedData] = React.useState(null);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [assignDetails, setAssignDetails] = React.useState(null);
  const [searchCandidate, setSearchCandidate] = React.useState(null);

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasViewGroup = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_GROUP,
    permission
  );

  const hasAddGroup = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.ADD_GROUP,
    permission
  );

  useEffect(() => {
    dispatch(getAllGroups({ ...filters }));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(getCandidates({ ...searchCandidate }));
  }, [searchCandidate]);

  const triggerAssign = (_val) => {
    setAssignOpen(true);
    setAssignDetails(_val);
  };

  const triggerEdit = (_val) => {
    setManageOpen(true);
    setDetails({
      subTitle: "edit your symbol details",
      action: "edit",
    });
    setSelectedData(_val);
  };

  const triggerDelete = (_val) => {
    setDeleteOpen(true);
    setSelectedDeleteId(_val._id);
  };

  const handleDeleteSubmit = () => {
    const loadingId = toast.loading("Deleting symbol...");

    dispatch(
      deleteGroup(selectedDeleteId, filters, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Something went wrong, please try again later.");
        }
        toast.success("Symbol deleted successfully.");
        setDeleteOpen(false);
        setSelectedDeleteId(null);
      })
    );
  };

  const handleSearch = (val) => {
    setFilters({
      ...filters,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);
  const isUser = localStorage.getItem("role");

  if (!hasViewGroup || isUser === "user") {
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Voting | Symbols</title>
      </Helmet>
      <Space h={10} />
      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconUsersGroup
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={
            <div className="flex items-center gap-4">
              Symbols
              {/* {<Loader color="red" size={18} />} */}
            </div>
          }
          subtitle="mange and track symbols"
        />
        <PageHeader.Right className="gap-6">
          <TextInput
            placeholder="Search symbols"
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
          {hasAddGroup && (
            <Tooltip
              withArrow
              color="#2cd3b5"
              label="Create Symbol"
              position="top"
            >
              <ActionIcon
                radius="50%"
                size={"lg"}
                variant="filled"
                onClick={() => {
                  setManageOpen(true);
                  setSelectedData(null);
                  setDetails({
                    subTitle: "create your symbol details",
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

      <GroupTable
        setFilters={setFilters}
        filters={filters}
        triggerAssign={triggerAssign}
        triggerEdit={triggerEdit}
        triggerDelete={triggerDelete}
      />
      {deleteOpen && (
        <div>
          <Modal
            opened={true}
            onClose={() => setDeleteOpen(false)}
            withCloseButton={false}
          >
            <div className=" items-center p-2">
              <div className="flex justify-center items-center gap-3 m-3">
                <AppIcons.IconTrash size={30} color="red" />
              </div>
              <Text className="text-lg font-medium text-center">
                Are you sure you want to delete this group?
              </Text>
              <div className="flex justify-end gap-3 mt-5">
                <Button size="sm" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => handleDeleteSubmit()}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* manage group model  */}
      {manageOpen && (
        <ManageGroup
          opened={manageOpen}
          close={() => setManageOpen(false)}
          details={details}
          filters={filters}
          setFilters={setFilters}
          selectedData={selectedData}
        />
      )}

      {assignOpen && (
        <AssignGroup
          setSearchCandidate={setSearchCandidate}
          opened={assignOpen}
          close={() => setAssignOpen(false)}
          assignDetails={assignDetails}
          filters={filters}
        />
      )}
    </div>
  );
};

export default GroupPageList;
