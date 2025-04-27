import { Button, Modal, Space } from "@mantine/core";
import React from "react";
import { AppIcons } from "../../../ui/shared/AppIcons";
import { useDispatch } from "react-redux";
import { deleteElections } from "../actions/electionAction";
import { toast } from "react-toastify";

const DeleteElection = ({ deleteOpen, close, selectedValue }) => {
  const dispatch = useDispatch();

  const handleDelete = (_val) => {
    if (!_val) return;
    const loadingId = toast.loading("Deleting election...");
    dispatch(
      deleteElections({ id: _val }, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Something went wrong election not deleted.");
          return;
        }
        toast.success("Election deleted successfully");
        close();
        return;
      })
    );
  };

  return (
    <div>
      <Modal
        opened={deleteOpen}
        onClose={close}
        size="sm"
        withCloseButton={false}
      >
        <div className="flex justify-center mt-3">
          <AppIcons.IconTrash color="red" size={40} />
        </div>
        <div className="p-2 text-gray-600">
          Are you sure you want to delete this election?
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

export default DeleteElection;
