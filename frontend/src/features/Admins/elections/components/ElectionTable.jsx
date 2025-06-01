import React from "react";
import DataTable from "react-data-table-component";
import { PAGINATION } from "../../../../constants/Pagination";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { DateFormat } from "../../../../helpers/FormatDate";
import { Badge, Button, Space, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ElectionTable = ({
  triggerEdit,
  triggerDelete,
  triggerAssignPosition,
  filters,
  setFilters,
}) => {
  const { height } = useViewportSize();
  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");
  const navigate = useNavigate();

  const { electionList } = useSelector((store) => store?.elections);

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasEditElection = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.EDIT_ELECTION,
    permission
  );

  const hasDeleteElection = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.DELETE_ELECTION,
    permission
  );

  const tableData = electionList?.data;
  const totalData = electionList?.total;

  const columns = [
    {
      id: "title",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Title</div>,
      cell: (row) => row.title,
    },
    {
      id: "timeZone",
      sortable: false,
      name: <div className="text-sm line-clamp-2">TimeZone</div>,
      cell: (row) => row.timeZone,
    },
    {
      id: "startedAt",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Started At</div>,
      cell: (row) => DateFormat(row.startedAt),
    },
    {
      id: "endedAt",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Ended At</div>,
      cell: (row) => DateFormat(row.endedAt),
    },
    {
      id: "candidate",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Candidates</div>,
      cell: (row) => row.candidateCount,
    },
    {
      id: "status",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Status</div>,
      cell: (row) => {
        const now = Date.now();
        const startDate = new Date(row.startedAt).getTime();
        const endDate = new Date(row.endedAt).getTime();

        if (now < startDate) {
          return <Badge color="blue">upcoming</Badge>;
        } else if (now >= startDate && now <= endDate) {
          return <Badge color="teal">ongoing</Badge>;
        } else {
          return <Badge color="red">expired</Badge>;
        }
      },
    },
    (hasDeleteElection || hasDeleteElection) && {
      id: "actions",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Actions</div>,
      cell: (row) => {
        const now = Date.now();
        const startDate = new Date(row.startedAt).getTime();
        const endDate = new Date(row.endedAt).getTime();
        return (
          <div className="flex justify-end">
            <Tooltip
              color="brand"
              label="Assign Position to Election"
              position="top"
              withArrow
            >
              <div
                variant="outline"
                color="orange"
                onClick={() => {
                  if (now >= startDate && now <= endDate) {
                    toast.warning(
                      "You can only assign and update position to an election that is upcomming."
                    );
                    return;
                  }

                  triggerAssignPosition(row);
                }}
                disab
              >
                <AppIcons.IconAdjustmentsPlus
                  className="text-orange-400"
                  size={20}
                />
              </div>
            </Tooltip>
            <Space w={10} />
            {hasEditElection && (
              <Tooltip
                color="brand"
                label="Edit Election"
                position="top"
                withArrow
              >
                <div
                  variant="outline"
                  color="red"
                  onClick={() => {
                    triggerEdit(row);
                  }}
                >
                  <AppIcons.IconEdit color="gray" size={20} />
                </div>
              </Tooltip>
            )}
            <Space w={10} />
            {hasDeleteElection && (
              <Tooltip
                color="brand"
                label="Delete Election"
                position="top"
                withArrow
              >
                <div
                  variant="outline"
                  color="red"
                  onClick={() => {
                    triggerDelete(row);
                  }}
                >
                  <AppIcons.IconTrash className="text-red-400" size={20} />
                </div>
              </Tooltip>
            )}
            <Space w={10} />
            {hasDeleteElection && (
              <Tooltip
                color="brand"
                label="View Candidates"
                position="top"
                withArrow
              >
                <div
                  variant="outline"
                  onClick={() => {
                    // triggerDelete(row);
                    navigate("candidate?electionId=" + row._id);
                  }}
                >
                  <AppIcons.IconLayoutDashboard color="gray" size={20} />
                </div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
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
        pagination
        paginationServer
        paginationTotalRows={totalData}
        onChangePage={(_page) => {
          setFilters({
            ...filters,
            page: _page,
          });
        }}
        onChangeRowsPerPage={(_rpp, page) => {
          setFilters({
            ...filters,
            page: page,
            pageSize: _rpp,
          });
        }}
        fixedHeaderScrollHeight={`${
          matchesHeight ? height - (matchesWidth ? 250 : 400) : 350
        }px`}
      />
    </div>
  );
};

export default ElectionTable;
