import React from "react";
import DataTable from "react-data-table-component";
import { PAGINATION } from "../../../../constants/Pagination";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { Space, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { useSelector } from "react-redux";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";

const OrganisationTable = ({
  filters,
  setFilters,
  triggerEdit,
  triggerDelete,
}) => {
  const { height } = useViewportSize();
  const { organisationList } = useSelector((store) => store?.organisation);

  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");

  const tableData = organisationList?.response?.results || [];
  const totalData = organisationList?.response?.total || 0;

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasEditOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.EDIT_ORGANISATION,
    permission
  );

  const hasDeleteOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.DELETE_ORGANISATION,
    permission
  );

  const columns = [
    {
      id: "organisation",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Name</div>,
      cell: (row) => row.organisation,
    },
    {
      id: "orgId",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Organnisations ID</div>,
      cell: (row) => row.organisationId,
    },
    (hasEditOrganisation || hasDeleteOrganisation) && {
      id: "actions",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Actions</div>,
      cell: (row) => {
        return (
          <div className="flex justify-end">
            {hasEditOrganisation && (
              <Tooltip
                color="brand"
                label="Edit Organisation"
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
            {hasDeleteOrganisation && (
              <Tooltip
                color="brand"
                label="Delete Organisation"
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

export default OrganisationTable;
