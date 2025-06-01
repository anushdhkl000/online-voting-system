import { Button, Grid, Modal, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { securityQuestionConstant } from "../../../../constants/securityQuestionConstant";
import { useDispatch } from "react-redux";
import {
  addedSecurityQuestion,
  checkSecurityQuestion,
} from "../actions/authAction";
import { toast } from "react-toastify";

const SecurityQuestionModal = ({
  blocked = true,
  opened,
  close,
  emails,
  setUpdatedDevice,
}) => {
  // Generate validation schema dynamically
  const dynamicValidation = securityQuestionConstant.reduce((acc, question) => {
    acc[question.value] = (value) =>
      !value ? "Security question is required" : null;
    return acc;
  }, {});

  const form = useForm({
    validate: dynamicValidation,
  });
  const dispatch = useDispatch();

  const handleSubmt = (values) => {
    // Convert to expected format
    const expectedJson = {
      securityQuestion: Object.keys(values).map((question) => ({
        question,
        answer: values[question],
      })),
    };
    if (!blocked) {
      const loadingId = toast.loading("Adding security question...");
      dispatch(
        addedSecurityQuestion({ ...expectedJson }, (err) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error(err.response.data.message);
            return;
          }
          toast.success("Security question added successfully");
          close();
        })
      );
    } else {
      const loadingId = toast.loading("Checking security answer...");
      dispatch(
        checkSecurityQuestion({ ...expectedJson, emails }, (err, response) => {
          toast.dismiss(loadingId);
          if (err) {
            toast.error(err?.message || "Something went wrong");
            return;
          }
          if (response) {
            setUpdatedDevice(response.updatedDevice);
          }
          close();
        })
      );
    }
  };

  return (
    <div>
      <Modal
        withCloseButton={false}
        opened={opened}
        close={close}
        className="bg-teal-50"
        size="md"
        title={
          <div>
            <div className="font-bold">Security Question</div>
            <div className="text-sm text-gray-400">
              add your security question
            </div>
          </div>
        }
      >
        <div>
          <Space h={20} />
          <form onSubmit={form.onSubmit((values) => handleSubmt(values))}>
            <div>
              {securityQuestionConstant.map((question) => {
                return (
                  <TextInput
                    className="mb-5"
                    label={question.label}
                    withAsterisk
                    {...form.getInputProps(question.value)}
                  />
                );
              })}
            </div>

            <Space h={30} />
            <div className="flex justify-end m-5">
              {blocked && (
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
              )}

              <Button variant="outline" type="submit">
                {blocked ? "Check" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityQuestionModal;
