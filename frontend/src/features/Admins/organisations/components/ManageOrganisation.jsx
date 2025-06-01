import { Button, Grid, Modal, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  addOrganisations,
  updateOrganisations,
} from "../actions/organisationAction";

const ManageOrganisation = ({
  opened,
  close,
  details,
  filters,
  selectedValue,
  setSelectedValue,
}) => {
  const form = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedValue) return;

    if (details.action === "add") return;
    form.setFieldValue("organisation", selectedValue.organisation);
  }, [selectedValue]);

  const handleSubmit = () => {
    const data = form.values;
    if (details.action === "add") {
      const loadingId = toast.loading("Creating organisation...");
      dispatch(
        addOrganisations(data, filters, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Organisation with the same name already exists");
            return;
          }
          toast.success("Organisation created successfully");
          close();
          setSelectedValue(null);
        })
      );
    }

    if (details.action === "edit") {
      if (!selectedValue) return;
      const loadingId = toast.loading("Updating organisation...");
      dispatch(
        updateOrganisations(data, selectedValue?._id, filters, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Organisation update failed");
            return;
          }
          toast.success("Organisation updated successfully");
          close();
        })
      );
    }
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        size="sm"
        title={
          <div>
            <div className="font-bold">Manage Organisation</div>
            <div className="text-sm text-gray-400">{details.subTitle}</div>
          </div>
        }
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 10 }}>
              <TextInput
                label="Name"
                withAsterisk
                {...form.getInputProps("organisation")}
              />
            </Grid.Col>
          </Grid>
          <Space h={30} />
          <div className="flex justify-end m-5">
            <Button
              className="me-5"
              onClick={() => {
                form.reset();
                close();
              }}
              variant="fill"
            >
              Cancel
            </Button>
            <Button variant="outline" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageOrganisation;
