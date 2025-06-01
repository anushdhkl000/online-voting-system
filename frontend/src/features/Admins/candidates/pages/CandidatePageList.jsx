import {
  ActionIcon,
  Button,
  Image,
  Modal,
  rem,
  Space,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import { IconSearch, IconUser, IconUsers } from "@tabler/icons-react";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteCandidates,
  getCandidates,
  resetCandidateList,
} from "../actions/candidateAction";
import CandidateList from "../components/CandidateList";
import ManageCandidate from "../components/ManageCandidate";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../../constants/Pagination";
import { useForm } from "@mantine/form";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import PageNotFound from "../../../../components/PageNotFound";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChoosePosition from "../components/ChoosePosition";

const CandidatePageList = () => {
  const store = useSelector((store) => store);
  const { candidateList } = useSelector((store) => store?.candidate);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const electionId = searchParams.get("electionId");

  const hasCandidateView = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_CANDIDATE,
    permission
  );

  const hasCandidateAdd = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.ADD_CANDIDATE,
    permission
  );

  const dispatch = useDispatch();
  const form = useForm();

  const [type, setType] = useState("individual");

  const initialFilters = {
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: "_id",
    sortOrder: "desc",
  };

  const [filters, setFilters] = useState({
    ...initialFilters,
    type,
  });

  const [manageOpen, setManageOpen] = useState(false);
  const [chooseOpen, setChooseOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const [manageDetails, setManageDetails] = useState({
    subTitle: "create your candidates details",
    action: "add",
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const currentPage = candidateList?.currentPage;
  const electionPosition = candidateList?.electionPosition;

  useEffect(() => {
    dispatch(
      getCandidates({ ...filters, electionId, type, forceReplace: true })
    );
  }, [electionId]);

  const triggerEdit = (_val) => {
    setSelectedData(_val);
    setManageOpen(true);
    setChooseOpen(false);
    setManageDetails({
      subTitle: "edit your candidates details",
      action: "edit",
    });
  };

  const triggerDelete = (_val) => {
    setDeleteOpen(true);
    setDeleteId(_val);
  };

  const triggerNextPage = () => {
    dispatch(
      getCandidates({
        ...filters,
        type: type,
        electionId: electionId,
        page: filters.page + 1,
        forceReplace: false,
      })
    );
    setFilters({
      ...filters,
      type,
      page: currentPage + 1,
      pageSize: filters.pageSize,
    });
  };

  const handleSubmit = () => {
    const loadingId = toast.loading("Deleting candidate...");

    dispatch(
      deleteCandidates({ id: deleteId }, { ...filters, electionId }, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error(err.response.data.message);
          return;
        }
        toast.success("Candidate deleted successfully");
        setDeleteOpen(false);
      })
    );
  };

  const handleSearch = (val) => {
    dispatch(resetCandidateList());
    dispatch(
      getCandidates({
        ...filters,
        page: 1,
        electionId,
        forceReplace: true,
        search: val,
        type: form.getInputProps("type").value,
      })
    );

    setFilters({
      ...filters,
      page: 1,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);
  const isUser = localStorage.getItem("role");

  if (!hasCandidateView || isUser === "user") {
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }

  const triggerPosition = (_val) => {
    setChooseOpen(false);
    setManageOpen(true);
    setPosition(_val);
  };

  return (
    <div>
      <Helmet>
        <title>Voting | Candidates</title>
      </Helmet>
      <Space h={10} />
      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconUsers
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={
            <div className="flex items-center gap-4">
              Candidates
              {/* {<Loader color="red" size={18} />} */}
            </div>
          }
          subtitle="mange and track candidates"
        />
        <PageHeader.Right className="gap-6">
          {electionId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              rightSection="Back"
            >
              <AppIcons.TiArrowBackOutline size={26} />
            </Button>
          )}
          <TextInput
            placeholder="Search candidates"
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

          {hasCandidateAdd && electionId && (
            <Tooltip
              withArrow
              color="#2cd3b5"
              label="Create Candidate"
              position="top"
            >
              <ActionIcon
                radius="50%"
                size={"lg"}
                variant="filled"
                onClick={() => {
                  // setManageOpen(true);
                  setChooseOpen(true);
                  setSelectedData(null);
                  setManageDetails({
                    subTitle: "create your candidates details",
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
      {/* <Space h={30} />
      <div className="w-3/12">
        <form>
          <Tabs
            defaultValue="individual"
            onChange={(val) => {
              form.getInputProps("type").onChange(val);
              setType(val);
              setFilters({
                ...filters,
                page: 1,
              });
              dispatch(resetCandidateList());
              dispatch(
                getCandidates({
                  ...filters,
                  page: 1,
                  type: val,
                  electionId,
                  forceReplace: true,
                })
              );
            }}
          >
            <Tabs.List>
              <Tabs.Tab value="individual" leftSection={<IconUser size={12} />}>
                Individual
              </Tabs.Tab>
              <Tabs.Tab value="group" leftSection={<IconUsers size={12} />}>
                Group
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </form>
      </div> */}

      <Space h={30} />
      <CandidateList
        triggerEdit={triggerEdit}
        triggerDelete={triggerDelete}
        filters={filters}
        type={type}
        setFilters={setFilters}
        triggerNextPage={triggerNextPage}
        electionId={electionId}
      />
      <Space h={20} />
      {deleteOpen && (
        <div>
          <Modal
            opened={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            withCloseButton={false}
          >
            <div className=" items-center p-4">
              <div className="flex justify-center items-center gap-3 m-4">
                <AppIcons.IconTrash size={30} color="red" />
              </div>
              <Text className="text-lg font-medium">
                Are you sure you want to delete this candidate?
              </Text>
              <div className="flex justify-end gap-3 mt-5">
                <Button size="sm" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => handleSubmit()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {manageOpen && (
        <ManageCandidate
          opened={manageOpen}
          close={() => setManageOpen(false)}
          manageDetails={manageDetails}
          filters={filters}
          type={type}
          selectedData={selectedData}
          electionId={electionId}
          position={position}
        />
      )}

      {chooseOpen && (
        <ChoosePosition
          opened={chooseOpen}
          close={() => setChooseOpen(false)}
          triggerPosition={triggerPosition}
          electionPosition={electionPosition}
        />
      )}
    </div>
  );
};

export default CandidatePageList;
