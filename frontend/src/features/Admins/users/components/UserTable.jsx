import React, { useState } from "react";
import { PAGINATION } from "../../../../constants/Pagination";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import DataTable from "react-data-table-component";
import { Badge, Image, Modal, Text, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import { useSelector } from "react-redux";
import base_url from "../../../../helpers/Costant";

const UserTable = ({
  setFilters,
  filters,
  triggerRole,
  triggerStatus,
  triggerPermission,
  triggerVerifyDetails,
  userData,
  totalData,
}) => {
  const { height } = useViewportSize();
  const matchesWidth = useMediaQuery("(min-width: 768px");
  const matchesHeight = useMediaQuery("(min-height: 600px)");

  const [selectedImage, setSelectedImage] = useState(null);
  const [identityDocumentOpen, setIdentityDocumentOpen] = useState(false);

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasUpdateUserRole = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_ROLE,
    permission
  );

  const hasUpdateUserStatus = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_STATUS,
    permission
  );

  const hasUpdateUserPermission = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.UPDATE_USER_PERMISSION,
    permission
  );
  const baseUrl = base_url + "public/uploads/";

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
      id: "userId",
      sortable: false,
      name: <div className="text-sm line-clamp-2">UserId</div>,
      cell: (row) => {
        return (
          <Text size="sm" fw="bold">
            {row.userTokenId}
          </Text>
        );
      },
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
      id: "identityNumber",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Identity Number</div>,
      cell: (row) => row.identityNumber,
    },
    {
      id: "identityDocument",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Identity Document</div>,
      cell: (row) => {
        return (
          <div className="flex items-center">
            {row.identityDocument && (
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <Image
                  src={baseUrl + row.identityDocument}
                  alt={row.identityDocument || "document"}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setSelectedImage(row.identityDocument);
                    setIdentityDocumentOpen(true);
                  }}
                />
              </div>
            )}
          </div>
        );
      },
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
      id: "verifyDetails",
      sortable: false,
      name: <div className="text-sm">Verify Details</div>,
      cell: (row) => {
        return (
          <Tooltip
            label="Verify user details"
            position="top"
            withArrow
            color="brand"
          >
            <div
              onClick={() => {
                if (row.role === "super-admin") return;
                if (row.isVerifiedDetails) return;
                triggerVerifyDetails(row);
              }}
            >
              {row.isVerifiedDetails ? (
                row.role !== "super-admin" && (
                  <AppIcons.IconRosetteDiscountCheckFilled
                    color="#15e54a"
                    size={20}
                  />
                )
              ) : (
                <AppIcons.IconRosetteDiscountCheck color="gray" size={20} />
              )}
            </div>
          </Tooltip>
        );
      },
    },
    (hasUpdateUserRole || hasUpdateUserStatus || hasUpdateUserPermission) && {
      id: "actions",
      sortable: false,
      name: <div className="text-sm line-clamp-2">Actions</div>,
      cell: (row) => {
        return (
          <div className="flex justify-end  gap-2">
            {hasUpdateUserPermission &&
              row.role !== "super-admin" &&
              row.role !== "user" && (
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
              )}
            {hasUpdateUserStatus && row.role !== "super-admin" && (
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
            )}
            {hasUpdateUserRole && row.role !== "super-admin" && (
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
      {identityDocumentOpen && (
        <Modal
          size="xl"
          opened={identityDocumentOpen}
          onClose={() => setIdentityDocumentOpen(false)}
        >
          <div>
            <div className=" overflow-hidden ">
              <Image
                src={baseUrl + selectedImage}
                alt={selectedImage || "document"}
                width="w-full"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserTable;
