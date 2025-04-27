import React from "react";
import { PAGINATION } from "../../../constants/Pagination";
import DataTable from "react-data-table-component";
import { Image, Space, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../ui/shared/AppIcons";
import base_url from "../../../helpers/Costant";
import { useSelector } from "react-redux";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";

const GroupTable = ({
  setFilters,
  filters,
  triggerAssign,
  triggerEdit,
  triggerDelete,
}) => {
  const { height } = useViewportSize();
  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");

  const baseUrl = base_url + "public/uploads/";
  const { groupList } = useSelector((store) => store?.group);

  const tableData = groupList.data;
  const totalData = groupList.total;

  const columns = [
    {
      id: "name",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Name</div>,
      cell: (row) => row.name,
    },
    {
      id: "symbol",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Group Symbol</div>,
      cell: (row) => {
        return (
          <div className="flex items-center">
            {row.symbol && (
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <Image
                  src={baseUrl + row.symbol}
                  alt={row.symbol || "symbol"}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
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
            <Tooltip
              label="Assign Group"
              color="#2CD3B5"
              position="top"
              withArrow
            >
              <div
                onClick={() => {
                  triggerAssign(row);
                }}
              >
                <AppIcons.IconHomeEdit color="gray" size={20} />
              </div>
            </Tooltip>
            <Space w={10} />
            <Tooltip
              label="Edit Group"
              color="#2CD3B5"
              position="top"
              withArrow
            >
              <div
                onClick={() => {
                  triggerEdit(row);
                }}
              >
                <AppIcons.IconEdit color="orange" size={20} />
              </div>
            </Tooltip>
            <Space w={10} />
            <Tooltip
              label="Delete Group"
              color="#2CD3B5"
              position="top"
              withArrow
            >
              <div
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
        fixedHeaderScrollHeight={`${
          matchesHeight ? height - (matchesWidth ? 250 : 400) : 350
        }px`}
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
      />
    </div>
  );
};

export default GroupTable;
