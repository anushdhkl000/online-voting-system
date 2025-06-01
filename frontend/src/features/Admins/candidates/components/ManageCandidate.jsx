// import {
//   Button,
//   FileInput,
//   Grid,
//   Group,
//   Modal,
//   Radio,
//   Space,
//   Textarea,
//   TextInput,
// } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { addCandidates, editCandidates } from "../actions/candidateAction";
// import { toast } from "react-toastify";

// const ManageCandidate = ({
//   selectedData,
//   opened,
//   close,
//   manageDetails,
//   filters,
// }) => {
//   const form = useForm({});
//   const dispatch = useDispatch();
//   const candidateId = Math.floor(100000 + Math.random() * 900000);

//   const handleSubmt = (values) => {
//     const formData = new FormData();
//     formData.append("firstName", values.firstName);
//     formData.append("lastName", values.lastName);
//     formData.append("age", values.age);
//     formData.append("candidateProfile", values.candidateProfile);
//     formData.append("document", values.document);
//     formData.append("gender", values.gender);
//     formData.append("descriptions", values.descriptions);
//     formData.append("candidateID", candidateId);
//     if (selectedData) {
//       const loadingId = toast.loading("Editing candidate...");
//       dispatch(
//         editCandidates(formData, selectedData._id, filters, (err) => {
//           toast.dismiss(loadingId);
//           if (err) {
//             toast.error("Failed to edit candidate");
//             return;
//           }
//           toast.success("Candidate updated successfully");
//           close();
//         })
//       );
//     } else {
//       const loadingId = toast.loading("Adding candidate...");
//       dispatch(
//         addCandidates(formData, filters, (err) => {
//           toast.dismiss(loadingId);
//           if (err) {
//             toast.error("Candidate with the same name already exists");
//             return;
//           }
//           toast.success("Candidate created successfully");
//           close();
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     if (selectedData) {
//       form.setValues({
//         firstName: selectedData?.firstName,
//         lastName: selectedData?.lastName,
//         age: selectedData?.age,
//         gender: selectedData?.gender,
//         descriptions: selectedData?.descriptions,
//       });
//     }
//   }, []);

//   return (
//     <div>
//       <Modal
//         opened={opened}
//         onClose={close}
//         size="lg"
//         title={
//           <div>
//             <div className="font-bold">Manage Candidate</div>
//             <div className="text-sm text-gray-400">
//               {manageDetails.subTitle}
//             </div>
//           </div>
//         }
//       >
//         <form onSubmit={form.onSubmit((values) => handleSubmt(values))}>
//           <Radio.Group
//             label="Candidate Type"
//             withAsterisk
//             {...form.getInputProps("candidateType")}
//           >
//             <Group mt="xs">
//               <Radio value="individual" label="Individual" />
//               <Radio value="group" label="Group" />
//             </Group>
//           </Radio.Group>
//           <Space h={20} />
//           <Grid>
//             {form.getInputProps("candidateType").value === "individual" && (
//               <>
//                 <Grid.Col span={{ base: 12, md: 4 }}>
//                   <TextInput
//                     label="First name"
//                     withAsterisk
//                     {...form.getInputProps("firstName")}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 4 }}>
//                   <TextInput
//                     label="Last name"
//                     withAsterisk
//                     {...form.getInputProps("lastName")}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 4 }}>
//                   <TextInput
//                     label="Age"
//                     type="number"
//                     withAsterisk
//                     {...form.getInputProps("age")}
//                   />
//                 </Grid.Col>
//               </>
//             )}
//             {form.getInputProps("candidateType").value === "group" && (
//               <>
//                 <Grid.Col span={{ base: 12, md: 6 }}>
//                   <TextInput
//                     label="Group name"
//                     withAsterisk
//                     {...form.getInputProps("groupName")}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 6 }}>
//                   <TextInput
//                     label="Candidate"
//                     withAsterisk
//                     {...form.getInputProps("firstName")}
//                   />
//                 </Grid.Col>

//                 <Grid.Col span={{ base: 12, md: 4 }}>
//                   <TextInput
//                     label="Age"
//                     type="number"
//                     withAsterisk
//                     {...form.getInputProps("age")}
//                   />
//                 </Grid.Col>
//                 <Grid.Col span={{ base: 12, md: 2 }}>Add candidate +</Grid.Col>
//               </>
//             )}

//             <Grid.Col span={{ base: 12, md: 6 }}>
//               <FileInput
//                 label="Candidate profile"
//                 placeholder="select candidate profile"
//                 withAsterisk={selectedData?.candidateProfile ? false : true}
//                 {...form.getInputProps("candidateProfile")}
//               />
//             </Grid.Col>
//             <Grid.Col span={{ base: 12, md: 6 }}>
//               <FileInput
//                 label="Document"
//                 placeholder="select document"
//                 withAsterisk={selectedData?.document ? false : true}
//                 {...form.getInputProps("document")}
//               />
//             </Grid.Col>
//             {form.getInputProps("candidateType").value === "individual" && (
//               <Grid.Col span={{ base: 12, md: 6 }}>
//                 <Radio.Group
//                   label="Gender"
//                   withAsterisk
//                   {...form.getInputProps("gender")}
//                 >
//                   <Group mt="xs">
//                     <Radio value="male" label="Male" />
//                     <Radio value="female" label="Female" />
//                     <Radio value="other" label="Other" />
//                   </Group>
//                 </Radio.Group>
//               </Grid.Col>
//             )}
//             <Grid.Col span={{ base: 12, md: 6 }}>
//               <Textarea
//                 minRows={2}
//                 maxRows={4}
//                 label="Description"
//                 withAsterisk
//                 {...form.getInputProps("descriptions")}
//               />
//             </Grid.Col>
//           </Grid>
//           <Space h={30} />
//           <div className="flex justify-end m-5">
//             <Button
//               className="me-5"
//               onClick={() => {
//                 form.reset();
//                 close();
//               }}
//               variant="fill"
//             >
//               Cancel
//             </Button>
//             <Button variant="outline" type="submit">
//               Save
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageCandidate;

import {
  Button,
  FileInput,
  Grid,
  Group,
  Modal,
  Radio,
  Space,
  Textarea,
  TextInput,
  ActionIcon,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addCandidates, editCandidates } from "../actions/candidateAction";
import { toast } from "react-toastify";
import { IconPlus } from "@tabler/icons-react";
// import { candidateSchema } from "../schemas/candidateSchema";

const ManageCandidate = ({
  selectedData,
  opened,
  close,
  manageDetails,
  filters,
  type,
  electionId,
  position,
}) => {
  const form = useForm({
    initialValues: {
      candidateType: "individual",
      members: [{ userId: "" }], // Initialize with one member
    },
    // validate: joiResolver(candidateSchema),
  });
  const dispatch = useDispatch();
  const candidateId = Math.floor(100000 + Math.random() * 900000);
  const [memberCount, setMemberCount] = useState(1);

  const handleSubmit = (values) => {
    const formData = new FormData();
    if (!electionId) return;

    formData.append("electionId", electionId);

    if (position?._id) {
      formData.append("positionId", position?._id);
    }

    if (values.candidateType === "individual") {
      // formData.append("firstName", values.firstName);
      // formData.append("lastName", values.lastName);
      // formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("userId", values.userId);
    } else {
      formData.append("groupName", values.groupName);
      // Append members array as JSON string
      formData.append("members", JSON.stringify(values.members));
    }

    formData.append("candidateProfile", values.candidateProfile);
    formData.append("document", values.document);
    formData.append("descriptions", values.descriptions);
    formData.append("candidateID", candidateId);
    formData.append("candidateType", values.candidateType);

    if (selectedData) {
      const loadingId = toast.loading("Editing candidate...");
      dispatch(
        editCandidates(
          formData,
          selectedData._id,
          { ...filters, electionId, page: 1, type },
          (err) => {
            toast.dismiss(loadingId);
            if (err) {
              toast.error("Failed to edit candidate");
              return;
            }
            toast.success("Candidate updated successfully");
            close();
          }
        )
      );
    } else {
      const loadingId = toast.loading("Adding candidate...");
      dispatch(
        addCandidates(
          formData,
          { ...filters, electionId, page: 1, type },
          (err) => {
            toast.dismiss(loadingId);
            if (err) {
              toast.error(
                err?.response?.data?.message ||
                  "Candidate with the same name already exists"
              );
              return;
            }
            toast.success("Candidate created successfully");
            close();
          }
        )
      );
    }
  };

  const addMemberField = () => {
    form.insertListItem("members", { userId: "" });
    setMemberCount(memberCount + 1);
  };

  const removeMemberField = (index) => {
    form.removeListItem("members", index);
    setMemberCount(memberCount - 1);
  };

  useEffect(() => {
    if (selectedData) {
      const initialValues = {
        candidateType: selectedData.candidateType || type || "individual",
        descriptions: selectedData?.descriptions,
      };

      if (
        selectedData.candidateType === "individual" ||
        type === "individual"
      ) {
        // initialValues.firstName = selectedData?.firstName;
        // initialValues.lastName = selectedData?.lastName;
        // initialValues.age = selectedData?.age;
        initialValues.gender = selectedData?.gender;
        initialValues.userId = selectedData?.userId;
      } else {
        initialValues.groupName = selectedData?.groupName;
        initialValues.members = selectedData?.members || [{ userId: "" }];
        setMemberCount(selectedData?.members?.length || 1);
      }

      form.setValues(initialValues);
    }
  }, [selectedData]);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={
          <div>
            <div className="font-bold">Manage Candidate</div>
            <div className="text-sm text-gray-400">
              {manageDetails.subTitle}
            </div>
          </div>
        }
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          {/* <Radio.Group
            label="Candidate Type"
            withAsterisk
            {...form.getInputProps("candidateType")}
          >
            <Group mt="xs">
              <Radio value="individual" label="Individual" />
              <Radio value="group" label="Group" />
            </Group>
          </Radio.Group>
          <Space h={20} /> */}
          <Grid>
            {/* {form.values.candidateType === "individual" && (
              <>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="First name"
                    withAsterisk
                    {...form.getInputProps("firstName")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Last name"
                    withAsterisk
                    {...form.getInputProps("lastName")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Age"
                    type="number"
                    withAsterisk
                    {...form.getInputProps("age")}
                  />
                </Grid.Col>
              </>
            )} */}

            {form.values.candidateType === "individual" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="UserID"
                  placeholder="Add your registered userID"
                  withAsterisk
                  {...form.getInputProps("userId")}
                  disabled={selectedData?._id}
                />
              </Grid.Col>
            )}

            {form.values.candidateType === "group" && (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Group gap="xs">
                    <TextInput
                      label="Group name"
                      withAsterisk
                      style={{ flex: 1 }}
                      {...form.getInputProps("groupName")}
                    />
                    <ActionIcon
                      variant="filled"
                      color="blue"
                      onClick={addMemberField}
                      style={{ marginTop: "24px" }}
                    >
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}></Grid.Col>

                {form.values.members?.map((_, index) => (
                  <React.Fragment key={index}>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label={`Candidate ${index + 1} UserId`}
                        withAsterisk
                        {...form.getInputProps(`members.${index}.userId`)}
                      />
                    </Grid.Col>
                    {/* <Grid.Col span={{ base: 12, md: 4 }}>
                      <TextInput
                        label={`Age`}
                        type="number"
                        withAsterisk
                        {...form.getInputProps(`members.${index}.age`)}
                      />
                    </Grid.Col> */}
                    <Grid.Col span={{ base: 12, md: 2 }}>
                      {index > 0 && (
                        <Button
                          variant="subtle"
                          color="red"
                          onClick={() => removeMemberField(index)}
                          style={{ marginTop: "24px" }}
                        >
                          Remove
                        </Button>
                      )}
                    </Grid.Col>
                  </React.Fragment>
                ))}
              </>
            )}

            <Grid.Col span={{ base: 12, md: 6 }}>
              <FileInput
                label="Candidate profile"
                placeholder="select candidate profile"
                withAsterisk={selectedData?.candidateProfile ? false : true}
                {...form.getInputProps("candidateProfile")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <FileInput
                label="Document"
                placeholder="Add your manifesto"
                withAsterisk={selectedData?.document ? false : true}
                {...form.getInputProps("document")}
              />
            </Grid.Col>
            {form.values.candidateType === "individual" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Radio.Group
                  label="Gender"
                  withAsterisk
                  {...form.getInputProps("gender")}
                >
                  <Group mt="xs">
                    <Radio value="male" label="Male" />
                    <Radio value="female" label="Female" />
                    <Radio value="other" label="Other" />
                  </Group>
                </Radio.Group>
              </Grid.Col>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                minRows={2}
                maxRows={4}
                label="Description"
                withAsterisk
                {...form.getInputProps("descriptions")}
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

export default ManageCandidate;
