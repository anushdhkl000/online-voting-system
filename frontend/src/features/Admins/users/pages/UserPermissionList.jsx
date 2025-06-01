import {
  Box,
  Button,
  Checkbox,
  Group,
  Loader,
  Radio,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import PageHeader from "../../../../components/PageHeader";
import { IconUserCog } from "@tabler/icons-react";
import { useListState } from "@mantine/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserFeaturePermission,
  viewFeaturePermissionList,
} from "../actions/userAction";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { getUserPermissionFeatures } from "../../../../actions/indexAction";

const UserPermissionList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { featurePermissionList } = useSelector((state) => state.users);
  const featurePermissionListData = featurePermissionList?.response;
  const selectedUserId = location.state?.selectedUserId;

  // Initialize form with empty values
  const form = useForm({
    initialValues: {
      permissions: {},
    },
  });

  const [groups, handlers] = useListState([]);

  useEffect(() => {
    if (!selectedUserId) return;
    dispatch(viewFeaturePermissionList({ userId: selectedUserId?._id }));
  }, [dispatch]);

  // When data loads, initialize form values
  useEffect(() => {
    if (featurePermissionListData) {
      const initialValues = {};
      handlers.setState(featurePermissionListData);

      featurePermissionListData.forEach((group) => {
        group.Child.forEach((child) => {
          initialValues[child.key] = child.checked || false;
        });
      });
      // handlers.apply(featurePermissionListData?.response);
      form.setValues({
        permissions: initialValues,
      });
    }
  }, [featurePermissionListData]);

  const updateChildChecked = (childKey, checked) => {
    form.setFieldValue(`permissions.${childKey}`, checked);
  };

  const toggleAllChildren = (groupIndex, checked) => {
    const updatedPermissions = { ...form.values.permissions };

    groups[groupIndex].Child.forEach((child) => {
      updatedPermissions[child.key] = checked;
    });

    form.setValues({
      permissions: updatedPermissions,
    });
  };

  useEffect(() => {
    if (!selectedUserId) return;
    form.setValues({
      userId: selectedUserId?._id,
    });
  }, [selectedUserId?._id]);

  const handleSubmit = (values) => {
    // Convert permissions object to an array of only checked feature keys
    const checkedFeatures = Object.entries(values.permissions)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, isChecked]) => isChecked)
      .map(([featureId]) => featureId);

    const data = {
      userId: selectedUserId?._id,
      features: checkedFeatures,
    };

    const loadingId = toast.loading("Adding user permission...");
    dispatch(
      addUserFeaturePermission(data, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Failed to add user permission");
          return;
        }
        dispatch(getUserPermissionFeatures());
        toast.success("User permission added successfully");
        navigate(-1);
      })
    );
  };

  return (
    <div>
      <Helmet>
        <title>Voting | User Permissions</title>
      </Helmet>
      <Space h={10} />
      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconUserCog
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title={<div className="flex items-center gap-4">Users</div>}
          subtitle="mange and track users"
        />
        <PageHeader.Right className="gap-6">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            rightSection="Back"
          >
            <TiArrowBackOutline size={26} />
          </Button>
          <Button
            variant="fill"
            size="md"
            onClick={() => form.onSubmit(handleSubmit)()}
          >
            Save
          </Button>
        </PageHeader.Right>
      </PageHeader>
      <Space h={30} />

      <div className="ms-10">
        {/* {!selectedUserId && (
          <Radio.Group
            name="favoriteFramework"
            label="Select your favorite framework/library"
            description="This is anonymous"
            withAsterisk
          >
            <Group>
              <Radio name="group" value="user" label="User" />
              <Radio name="group" value="admin" label="Admin" />
            </Group>
          </Radio.Group>
        )} */}
        {selectedUserId && (
          <>
            <Text color="cyan" fw={600}>
              User: {selectedUserId?.firstName + " " + selectedUserId?.lastName}
            </Text>
            <Space h={10} />

            <Text className="text-start" color="gray" fw={500}>
              ------------------------- User Permission List
              -------------------------
            </Text>
          </>
        )}

        <Space h={10} />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {groups.map((group, groupIndex) => {
              const groupPermissions = group.Child.map(
                (child) => form.values.permissions[child.key]
              );

              const allChildrenChecked = groupPermissions.every(Boolean);
              const someChildrenChecked =
                groupPermissions.some(Boolean) && !allChildrenChecked;

              return (
                <Box key={group.parent}>
                  <Checkbox
                    checked={allChildrenChecked}
                    indeterminate={someChildrenChecked}
                    label={group.parent}
                    onChange={() =>
                      toggleAllChildren(groupIndex, !allChildrenChecked)
                    }
                    mb="sm"
                  />
                  {/* Children Checkboxes */}
                  <Stack gap="xs" ml="md">
                    {group.Child.map((child) => (
                      <Checkbox
                        key={child.key}
                        label={child.label}
                        checked={form.values.permissions[child.key] || false}
                        onChange={(event) =>
                          updateChildChecked(
                            child.key,
                            event.currentTarget.checked
                          )
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default UserPermissionList;
