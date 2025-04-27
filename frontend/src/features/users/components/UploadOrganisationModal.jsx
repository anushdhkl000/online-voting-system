import React, { useState } from "react";
import {
  Modal,
  Select,
  FileInput,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch } from "react-redux";
import { uploadOrganisationUsers } from "../actions/userAction";

const UploadOrganisationModal = ({ opened, onClose, organisations }) => {
  const [selectedOrg, setSelectedOrg] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const form = useForm({});
  const dispatch = useDispatch();

  const handleImport = (values) => {
    const formData = new FormData();
    formData.append("organisation", values.organisation);
    formData.append("file", values.file);

    console.log("Selected Organisation:", formData);

    dispatch(uploadOrganisationUsers(formData, (err) => {}));

    if (selectedOrg) {
      // Reset form
      setSelectedOrg(null);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      title={
        <div>
          <div className="font-bold mb-1">Upload Organisation Users</div>
          <div className="text-sm text-gray-400">
            Select an organisation and upload a file to import users.
          </div>
        </div>
      }
      size="md"
      centered
    >
      <form onSubmit={form.onSubmit((values) => handleImport(values))}>
        <Stack spacing="md">
          <Select
            label="Organisation"
            placeholder="Select an organisation"
            value={selectedOrg}
            data={organisations}
            required
            {...form.getInputProps("organisation")}
          />

          <FileInput
            label="User Data File"
            placeholder="Select file"
            value={selectedFile}
            accept=".csv,.xlsx,.xls"
            required
            {...form.getInputProps("file")}
          />

          <Group mt="md">
            <Button variant="fill" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              type="submit"
              disabled={
                !form.getInputProps("organisation").value ||
                !form.getInputProps("file").value
              }
            >
              Import
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UploadOrganisationModal;
