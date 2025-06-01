import { Button, Modal, Space, Text, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import DataTable from "react-data-table-component";
import { PAGINATION } from "../../../../constants/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllElectionResults,
  trackYourVoteResults,
} from "../actions/userAction";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";

const ElectionResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm();
  const [checkVote, setCheckVote] = React.useState(false);
  const [candidate, setCandidate] = React.useState(null);

  const { electionResults } = useSelector((store) => store?.landingPage);

  const initialFilters = {
    page: 1,
    pageSize: 20,
  };

  useEffect(() => {
    dispatch(getAllElectionResults(initialFilters));
  }, [dispatch]);

  const tableData = electionResults?.response;

  const columns = [
    {
      id: "election",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Elections</div>,
      cell: (row) => row.election,
    },
    {
      id: "candidate",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Candidates</div>,
      cell: (row) => row.candidate,
    },
    {
      id: "symbol",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Symbols</div>,
      cell: (row) => row.party,
    },
    {
      id: "position",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Positions</div>,
      cell: (row) => row.position,
    },
    {
      id: "votes",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Votes</div>,
      cell: (row) => row.votes,
    },
    {
      id: "ranks",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Ranks</div>,
      cell: (row) => row.Rank,
    },
  ];

  const handleTrackVote = async () => {
    const data = form.values;
    dispatch(
      trackYourVoteResults({ token: data.token }, (err, res) => {
        if (err) {
          toast.error(err?.message || "Something went wrong Vote not found.");
        }
        if (res) {
          setCandidate(res?.response);
        }
      })
    );
  };

  return (
    <div>
      <Helmet>
        <title>Voting | Election Results</title>
      </Helmet>
      <Space h={10} />
      <div className="m-7">
        <PageHeader>
          <PageHeader.Left
            title={
              <div className="flex items-center gap-4">
                Election Results
                {/* {<Loader color="red" size={18} />} */}
              </div>
            }
            subtitle="view election results"
          />
          <PageHeader.Right className="gap-6">
            <Button
              variant="outline"
              onClick={() => {
                setCheckVote(true);
              }}
            >
              Track Your Vote
            </Button>
            <Button
              variant="outline"
              leftSection={<TiArrowBackOutline size={20} />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </PageHeader.Right>
        </PageHeader>
        <Space h={30} />
        <DataTable
          className="app-table fix-last-column w-full"
          paginationRowsPerPageOptions={[...PAGINATION.PAGE_SIZE_OPTIONS]}
          paginationPerPage={PAGINATION.PAGE_SIZE}
          fixedHeader
          highlightOnHover
          pointerOnHover
          responsive={true}
          columns={columns}
          data={tableData}
          //   pagination
          //   paginationServer
          //   paginationTotalRows={totalData}
        />
      </div>

      {checkVote && (
        <Modal
          opened={checkVote}
          onClose={() => {
            setCheckVote(false);
            form.reset();
            setCandidate(null);
          }}
          title={<Text fw="bold">Track Your Vote</Text>}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrackVote();
            }}
          >
            <TextInput
              label="Paste your voting Token here"
              placeholder="Enter token"
              {...form.getInputProps("token")}
            />
            <Space h={20} />
            {candidate && (
              <div className="flex justify-center">
                You Have voted for candidate :
                <Text c="blue" fw="bold" size="lg">
                  {"" + candidate?.firstName + " " + candidate?.lastName}
                </Text>
              </div>
            )}
            {!candidate && (
              <div className="flex justify-end gap-5">
                <Button type="submit">Track</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCheckVote(false);
                    form.reset();
                    setCandidate(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ElectionResults;
