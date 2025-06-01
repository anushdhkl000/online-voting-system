import { Button, Modal, Space } from "@mantine/core";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { removeOrganisations } from "../actions/organisationAction";

const RemoveOrganisation = ({
  opened,
  close,
  selectedValue,
  filters,
  setSelectedValue,
}) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (!selectedValue) return;
    const loadingId = toast.loading("Deleting organisation...");
    dispatch(
      removeOrganisations(selectedValue?._id, filters, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error(
            err?.response?.data?.message ||
              "Something went wrong organisation not deleted."
          );
          return;
        }
        toast.success("Organisation deleted successfully");
        close();
        setSelectedValue(null);
        return;
      })
    );
  };

  return (
    <div>
      <Modal opened={opened} onClose={close} size="sm" withCloseButton={false}>
        <div className="flex justify-center mt-3">
          <AppIcons.IconTrash color="red" size={40} />
        </div>
        <div className=" flex justify-center text-center p-2 text-gray-600">
          Are you sure you want to delete this organisation?
        </div>
        <Space h={20} />
        <div className="flex justify-end">
          <Button onClick={close}>Cancel</Button>
          <Space w={20} />
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDelete(selectedValue?._id)}
          >
            Delete
          </Button>
        </div>
        <Space h={4} />
      </Modal>
    </div>
  );
};

export default RemoveOrganisation;
