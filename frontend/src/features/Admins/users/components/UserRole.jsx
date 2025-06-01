import { Button, Modal, Select, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserRole } from "../actions/userAction";
import { toast } from "react-toastify";

const UserRole = ({ opened, close, selectedUserId, filters }) => {
  const dispatch = useDispatch();

  const form = useForm({});

  useEffect(() => {
    if (!selectedUserId) return;
    form.setValues({ id: selectedUserId._id });
    form.setValues({
      role: selectedUserId.role,
    });
  }, [selectedUserId]);

  const handleSubmit = (values) => {
    const loadingId = toast.loading("Updating user role...");
    dispatch(
      updateUserRole(
        { userId: values.id, role: values.role, filters },
        (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Failed to update user role");
            return;
          }
          toast.success("User role updated successfully");
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
            <h4 className="text-md mb-5 font-medium">Update User Role</h4>
            <div className="text-sm font-medium w-9/12">
              <Select
                label="Role"
                withAsterisk
                data={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "User" },
                ]}
                {...form.getInputProps("role")}
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

export default UserRole;
