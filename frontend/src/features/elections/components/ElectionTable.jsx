import React from "react";
import DataTable from "react-data-table-component";
import { PAGINATION } from "../../../constants/Pagination";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { DateFormat } from "../../../helpers/FormatDate";
import { Badge, Button, Space, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../ui/shared/AppIcons";

const ElectionTable = ({ triggerEdit, triggerDelete, filters, setFilters }) => {
  const { height } = useViewportSize();
  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");

  const { electionList } = useSelector((store) => store?.elections);

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
      id: "status",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Status</div>,
      cell: (row) => {
        return Date.now() > new Date(row.endedAt).getTime() ? (
          <Badge color="red">expired</Badge>
        ) : (
          <Badge color="teal">ongoing</Badge>
        );
      },
    },
    {
      id: "actions",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Actions</div>,
      cell: (row) => {
        return (
          <div className="flex justify-end">
            <Tooltip label="Edit Election" position="top" withArrow>
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
            <Space w={10} />
            <Tooltip label="Delete Election" position="top" withArrow>
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
