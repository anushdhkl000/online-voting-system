import {
  Button,
  FileInput,
  Grid,
  Modal,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { useDispatch } from "react-redux";
import { addGroup, editGroup } from "../actions/groupAction";
import { toast } from "react-toastify";

const ManageGroup = ({ opened, close, details, filters, selectedData }) => {
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      name: "",
      symbol: null,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name should have at least 2 letters" : null,
      symbol: (value) => (value === null ? "Symbol is required" : null),
    },
  });

  React.useEffect(() => {
    if (details.action === "edit" && selectedData) {
      form.setValues({
        name: selectedData?.name,
        symbol: selectedData?.symbol,
      });
    }
  }, [selectedData]);

  const handleSubmt = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("symbol", values.symbol);
    if (details.action === "edit" && selectedData) {
      const loadingId = toast.loading("Editing symbols...");
      const id = selectedData._id;
      dispatch(
        editGroup(formData, id, filters, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error(
              err?.response?.data?.message || "Failed to create symbols"
            );
            return;
          }
          toast.success("Symbols edited successfully");
          close();
        })
      );
    } else {
      const loadingId = toast.loading("Creating symbols...");
      dispatch(
        addGroup(formData, filters, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error(
              err?.response?.data?.message || "Failed to create symbols"
            );
            return;
          }
          toast.success("Symbols created successfully");
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
        size="md"
        title={
          <div>
            <div className="font-bold">Manage Symbol</div>
            <div className="text-sm text-gray-400">{details.subTitle}</div>
          </div>
        }
      >
        <Space h={10} />
        <form onSubmit={form.onSubmit((values) => handleSubmt(values))}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Name"
                withAsterisk
                {...form.getInputProps("name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <FileInput
                label="Symbol"
                placeholder="select symbol"
                withAsterisk={false}
                {...form.getInputProps("symbol")}
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

export default ManageGroup;
