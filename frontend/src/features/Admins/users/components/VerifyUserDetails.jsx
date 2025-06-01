import { Button, Modal, Select, Space } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyUserDetails } from "../actions/userAction";
import { toast } from "react-toastify";
import { AppIcons } from "../../../../ui/shared/AppIcons";

const VerifyUserDetails = ({ opened, close, selectedUserId, filters }) => {
  const dispatch = useDispatch();

  const form = useForm({});

  useEffect(() => {
    if (!selectedUserId) return;
    form.setValues({ id: selectedUserId._id });
    form.setValues({
      verify: String(selectedUserId.isVerifiedDetails),
    });
  }, [selectedUserId.isVerifiedDetails, selectedUserId]);

  const handleSubmit = (values) => {
    const loadingId = toast.loading("Verifying user details...");
    dispatch(
      verifyUserDetails(
        { userId: values.id, verify: "true", filters },
        (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error("Failed to verify user details");
            return;
          }
          toast.success("User details verified successfully");
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
            <div className="flex justify-center">
              <AppIcons.IconRosetteDiscountCheckFilled
                size={40}
                color="#15e54a"
              />
            </div>
            <Space h={10} />
            <h4 className="flex text-center text-md mb-5 font-medium">
              Are you sure you want to validate the user's details ?
            </h4>
            {/* <div className="text-sm font-medium w-9/12">
              <Select
                label="Verify Details"
                withAsterisk
                data={[
                  { value: "true", label: "Verify" },
                  { value: "false", label: "Not Verify" },
                ]}
                {...form.getInputProps("verify")}
              />
            </div> */}
            <Space h={30} />
            <div className="flex justify-end gap-5 mb-2">
              <Button onClick={() => close()}>Cancel</Button>
              <Button variant="outline" type="submit">
                Verify
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VerifyUserDetails;
