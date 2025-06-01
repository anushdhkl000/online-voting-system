import { ActionIcon, rem, Space, TextInput, Tooltip } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import { IconSearch, IconStack2Filled } from "@tabler/icons-react";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import OrganisationTable from "../components/OrganisationTable";
import ManageOrganisation from "../components/ManageOrganisation";
import { useDispatch, useSelector } from "react-redux";
import { getOrganisations } from "../actions/organisationAction";
import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../../constants/Pagination";
import RemoveOrganisation from "../components/RemoveOrganisation";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";
import PageNotFound from "../../../../components/PageNotFound";

const Organisation = () => {
  const dispatch = useDispatch();

  const [manageOpen, setManageOpen] = useState(false);
  const [details, setDetails] = useState({
    subTitle: "create your organisation",
    action: "add",
  });

  const [selectedValue, setSelectedValue] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const initialFilters = {
    page: 1,
    pageSize: 20,
    search: "",
  };

  const [filters, setFilters] = useState({
    ...initialFilters,
  });

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasViewOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_ORGANISATION,
    permission
  );

  const hasAddOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.ADD_ORGANISATION,
    permission
  );

  const hasEditOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.EDIT_ORGANISATION,
    permission
  );

  const hasDeleteOrganisation = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.DELETE_ORGANISATION,
    permission
  );

  const handleSearch = (val) => {
    setFilters({
      ...filters,
      search: val,
    });
  };

  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);

  useEffect(() => {
    dispatch(getOrganisations({ ...filters }));
  }, [filters]);

  const triggerEdit = (_val) => {
    setManageOpen(true);
    setDetails({
      subTitle: "edit your organisation",
      action: "edit",
    });

    setSelectedValue(_val);
  };

  const triggerDelete = (_val) => {
    setSelectedValue(_val);
    setDeleteOpen(true);
  };

  const isUser = localStorage.getItem("role");
  if (!hasViewOrganisation || isUser === "user") {
    return (
      <div>
        <PageNotFound />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Voting | Organisation</title>
      </Helmet>

      <Space h={10} />
      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconStack2Filled
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={
            <div className="flex items-center gap-4">
              Organisations
              {/* {<Loader color="red" size={18} />} */}
            </div>
          }
          subtitle="mange your organisations"
        />
        <PageHeader.Right className="gap-6">
          <TextInput
            placeholder="Search organisations"
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
          {hasAddOrganisation && (
            <Tooltip
              withArrow
              color="#2cd3b5"
              label="Create organisation"
              position="top"
            >
              <ActionIcon
                radius="50%"
                size={"lg"}
                variant="filled"
                onClick={() => {
                  setManageOpen(true);
                  setDetails({
                    subTitle: "create your organisation",
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
      <OrganisationTable
        filters={filters}
        setFilters={setFilters}
        triggerEdit={triggerEdit}
        triggerDelete={triggerDelete}
      />

      {manageOpen && (hasAddOrganisation || hasEditOrganisation) && (
        <ManageOrganisation
          opened={manageOpen}
          close={() => setManageOpen(false)}
          details={details}
          filters={filters}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      )}

      {deleteOpen && hasDeleteOrganisation && (
        <RemoveOrganisation
          opened={deleteOpen}
          close={() => setDeleteOpen(false)}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          filters={filters}
        />
      )}
    </div>
  );
};

export default Organisation;
