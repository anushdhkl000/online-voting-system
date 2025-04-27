import React from "react";
import { PAGINATION } from "../../../constants/Pagination";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import DataTable from "react-data-table-component";
import { Badge, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../ui/shared/AppIcons";

const UserTable = ({
  setFilters,
  filters,
  triggerRole,
  triggerStatus,
  triggerPermission,
  userData,
  totalData,
}) => {
  const { height } = useViewportSize();
  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");

  const columns = [
    {
      id: "name",
      sortable: false,
      name: <div className="text-sm line-clamp-2">First Name</div>,
      cell: (row) =>
        row.firstName || row.lastName ? row.firstName + " " + row.lastName : "",
    },
    {
      id: "email",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Email</div>,
      cell: (row) => row.email,
    },
    {
      id: "phone",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Phone</div>,
      cell: (row) => row.phone,
    },
    {
      id: "role",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Role</div>,
      cell: (row) => row.role,
    },
    {
      id: "status",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Status</div>,
      cell: (row) => {
        return (
          <div>
            {row.isActive ? (
              <Badge color="green">Active</Badge>
            ) : (
              <Badge color="red">Inactive</Badge>
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
          <div className="flex justify-end  gap-2">
            <Tooltip
              label="Update user permissions"
              position="top"
              withArrow
              color="brand"
            >
              <div
                variant="outline"
                color="red"
                onClick={() => {
                  triggerPermission(row);
                }}
              >
                <AppIcons.IconEyeEdit color="orange" size={20} />
              </div>
            </Tooltip>

            <Tooltip
              label="Update user status"
              position="top"
              withArrow
              color="brand"
            >
              <div
                variant="outline"
                color="red"
                onClick={() => {
                  triggerStatus(row);
                }}
              >
                <AppIcons.IconFilterEdit color="gray" size={20} />
              </div>
            </Tooltip>
            <Tooltip
              label="Update user role"
              position="top"
              withArrow
              color="brand"
            >
              <div
                variant="outline"
                color="red"
                onClick={() => {
                  triggerRole(row);
                }}
              >
                <AppIcons.IconUserEdit color="gray" size={20} />
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
        data={userData}
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

export default UserTable;
