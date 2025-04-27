import { Button, Modal, Select, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUserStatus } from "../actions/userAction";

const UserStatus = ({ opened, close, selectedUserId, filters }) => {
  const dispatch = useDispatch();
  const form = useForm({});

  useEffect(() => {
    if (!selectedUserId) return;
    form.setValues({ id: selectedUserId._id });
    form.setValues({
      status: selectedUserId.isActive ? "true" : "false",
    });
  }, [selectedUserId]);

  const handleSubmit = (values) => {
    const loadingId = toast.loading("Updating user status...");
    dispatch(
      updateUserStatus(
        { userId: values.id, status: values.status, filters },
        (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Failed to update user status");
            return;
          }
          toast.success("User status updated successfully");
          close();
        }
      )
    );
  };

  return (
    <div>
      <Modal
        opened={opened}
        withCloseButton={false}
        size="sm"
        close={() => close()}
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <div className="mt-1">
            <h4 className="text-md mb-5 font-medium">Update User Status</h4>
            <div className="text-sm font-medium w-9/12">
              <Select
                label="Status"
                withAsterisk
                data={[
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
                {...form.getInputProps("status")}
              />
            </div>
            <Space h={30} />
            <div className="flex justify-end gap-5 mb-2">
              <Button onClick={() => close()}>Cancel</Button>
              <Button variant="outline" type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserStatus;
