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
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../components/PageHeader";
import {
  IconSearch,
  IconSquaresSelected,
  IconUsers,
} from "@tabler/icons-react";
import { AppIcons } from "../../../ui/shared/AppIcons";
import { useDispatch, useSelector } from "react-redux";
import { deleteCandidates, getCandidates } from "../actions/candidateAction";
import CandidateList from "../components/CandidateList";
import ManageCandidate from "../components/ManageCandidate";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../constants/Pagination";

const CandidatePageList = () => {
  const { candidateList } = useSelector((store) => store?.candidate);
  const dispatch = useDispatch();

  const initialFilters = {
    page: 1,
    pageSize: 5,
    search: "",
    sortBy: "_id",
    sortOrder: "desc",
  };

  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  const [manageOpen, setManageOpen] = useState(false);
  const [manageDetails, setManageDetails] = useState({
    subTitle: "create your candidates details",
    action: "add",
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const currentPage = candidateList?.currentPage;

  useEffect(() => {
    dispatch(getCandidates({ ...filters }));
  }, [filters]);

  const triggerEdit = (_val) => {
    setSelectedData(_val);
    setManageOpen(true);
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
    dispatch(getCandidates({ ...filters, page: filters.page + 1 }));
    setFilters({
      ...filters,
      page: currentPage + 1,
      pageSize: filters.pageSize,
    });
  };

  const handleSubmit = () => {
    const loadingId = toast.loading("Deleting candidate...");
    dispatch(
      deleteCandidates({ id: deleteId }, filters, (err) => {
        toast.dismiss(loadingId);
        console.log(err);
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
    setFilters({
      ...filters,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);

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
                setManageOpen(true);
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
        </PageHeader.Right>
      </PageHeader>
      <Space h={30} />
      <CandidateList
        triggerEdit={triggerEdit}
        triggerDelete={triggerDelete}
        filters={filters}
        setFilters={setFilters}
        triggerNextPage={triggerNextPage}
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
          selectedData={selectedData}
        />
      )}
    </div>
  );
};

export default CandidatePageList;
