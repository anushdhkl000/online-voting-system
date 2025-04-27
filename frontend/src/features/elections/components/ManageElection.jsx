import { Button, Grid, Modal, Space, TextInput } from "@mantine/core";
import { joiResolver, useForm } from "@mantine/form";
import { DateInput, DatePickerInput } from "@mantine/dates";
import React, { useEffect } from "react";
import { addElectionSchema } from "../schemas/formSchema";
import { useDispatch } from "react-redux";
import { addElections, editElections } from "../actions/electionAction";
import { toast } from "react-toastify";

const ManageElection = (props) => {
  const { open, close, details, selectedValue } = props;

  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      title: "",
      startDate: "",
      endDate: "",
      timeZone: "melbourne",
    },
    validate: joiResolver(addElectionSchema),
  });

  useEffect(() => {
    if (!selectedValue) return;

    if (details.action === "add") return;
    form.setFieldValue("id", selectedValue._id);
    form.setFieldValue("title", selectedValue.title);
    form.setFieldValue("startDate", new Date(selectedValue.startedAt));
    form.setFieldValue("endDate", new Date(selectedValue.endedAt));
    form.setFieldValue("timeZone", selectedValue.timeZone);
  }, [selectedValue]);

  const handleSubmt = (values) => {
    if (values.id) {
      const loadingId = toast.loading("Editing election...");
      dispatch(
        editElections(values, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Election with the same name already exists");
            return;
          }
          toast.success("Election created successfully");
          close();
          return;
        })
      );
    } else {
      const loadingId = toast.loading("Creating election...");
      dispatch(
        addElections(values, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Election with the same name already exists");
            return;
          }
          toast.success("Election created successfully");
          close();
          return;
        })
      );
    }
  };

  return (
    <div>
      <Modal
        opened={open}
        onClose={close}
        size="lg"
        title={
          <div>
            <div className="font-bold">Manage Election</div>
            <div className="text-sm text-gray-400">{details.subTitle}</div>
          </div>
        }
      >
        <form onSubmit={form.onSubmit((values) => handleSubmt(values))}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput
                label="Title"
                withAsterisk
                {...form.getInputProps("title")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput
                label="Start Date"
                valueFormat="DD/MM/YYYY"
                withAsterisk
                {...form.getInputProps("startDate")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput
                label="End Date"
                valueFormat="DD/MM/YYYY"
                withAsterisk
                {...form.getInputProps("endDate")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="TimeZone"
                withAsterisk
                {...form.getInputProps("timeZone")}
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

export default ManageElection;
