import React, { useState } from "react";
import { Image, Modal, SimpleGrid, Text, Tooltip } from "@mantine/core";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { useSelector } from "react-redux";
import base_url from "../../../../helpers/Costant";
import { IconAlertCircle, IconPlus, IconStackPop } from "@tabler/icons-react";
import checkPermission from "../../../../helpers/checkPermission";
import { PERMISSION_FEATURE_COSNTANTS } from "../../../../constants/permissionConstant";

const CandidateList = ({
  triggerEdit,
  triggerDelete,
  triggerNextPage,
  type,
  electionId,
}) => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  const { candidateList } = useSelector((store) => store?.candidate);
  const candidateData = candidateList?.data;
  const hasNextPage = candidateList?.hasNextPage;
  const baseUrl = base_url + "public/uploads/";

  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [description, setDescription] = useState("");

  const store = useSelector((store) => store);
  const { userPermission } = store.Auth;
  const permission = userPermission?.response || [];

  const hasCandidateEdit = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.EDIT_CANDIDATE,
    permission
  );

  const hasDeleteCandidate = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.DELETE_CANDIDATE,
    permission
  );

  const hasCandidateViewdescription = checkPermission(
    PERMISSION_FEATURE_COSNTANTS.VIEW_DESCRIPTION,
    permission
  );

  return (
    <div>
      <div className="flex justify-center w-full">
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 4, lg: 5 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
          className="w-full"
        >
          {candidateData?.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-gradient-to-b shadow-lg rounded-xl overflow-hidden h-full flex flex-col"
            >
              {/* Gradient Background with Profile Image */}
              <div className="bg-gradient-to-b from-red-500 to-red-700 p-5 rounded-t-xl flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden">
                  <Image
                    src={baseUrl + candidate?.candidateProfile}
                    alt={candidate?.firstName || "Candidate"}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 text-center flex-grow flex flex-col">
                <div size="sm" className="flex justify-center gap-2">
                  <Text fw={700} size="lg" className="text-black">
                    {candidate.groupName
                      ? candidate.groupName
                      : candidate?.firstName + " " + candidate?.lastName}
                  </Text>
                  {type === "group" && (
                    <Tooltip
                      label="View group members"
                      color="brand"
                      position="top"
                    >
                      <IconAlertCircle
                        size={20}
                        color="gray"
                        className="text-gray-400 cursor-pointer  mt-1"
                        onClick={() => {
                          setOpen(true);
                          setMembers(candidate?.members || []);
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                <Text c="gray" size="sm">
                  {"Candidate ID : " + (candidate?.candidateID || "N/A")}
                </Text>
                <div className="w-full border-b-2 my-2 border-red-500"></div>
                {type === "individual" && (
                  <>
                    <Text c="dimmed" size="sm" mb={2}>
                      {"Gender : " + (candidate?.gender || "N/A")}
                    </Text>
                    {!electionId && (
                      <Text c="gray" fw="bold" size="sm">
                        {"Election : " +
                          (candidate?.electionId?.title || "N/A")}
                      </Text>
                    )}
                    <Text c="indigo.5" fw="bold" size="sm">
                      {"Position : " +
                        (candidate?.positionId?.position || "N/A")}
                    </Text>
                  </>
                )}

                {/* {candidate?.descriptions || "Product Design"} */}
              </div>
              <div className="flex justify-end gap-3 m-5 cursor-pointer">
                <div className="border opacity-30"> </div>
                {hasCandidateViewdescription && (
                  <Tooltip
                    label="View description"
                    position="top"
                    color="#2cd3b5"
                    withArrow
                    transitionProps={{ duration: 10 }}
                  >
                    <IconStackPop
                      color="gray"
                      size={20}
                      onClick={() => {
                        setDescriptionOpen(true);
                        setDescription(candidate?.descriptions || "test");
                      }}
                    />
                  </Tooltip>
                )}
                {hasCandidateEdit && (
                  <Tooltip
                    label={electionId ? "Edit candidate" : "Edit not allowed"}
                    position="top"
                    color="#2cd3b5"
                    withArrow
                    transitionProps={{ duration: 10 }}
                  >
                    <div style={{ display: "inline-block" }}>
                      {" "}
                      <AppIcons.IconEdit
                        color="orange"
                        size={20}
                        onClick={
                          electionId ? () => triggerEdit(candidate) : undefined
                        }
                        style={{
                          cursor: electionId ? "pointer" : "not-allowed",
                          opacity: electionId ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </Tooltip>
                )}
                {hasDeleteCandidate && (
                  <Tooltip
                    label={
                      electionId ? "Delete candidate" : "Deletion not allowed"
                    }
                    position="top"
                    color="#2cd3b5"
                    withArrow
                    transitionProps={{ duration: 10 }}
                  >
                    <div style={{ display: "inline-block" }}>
                      {" "}
                      <AppIcons.IconTrash
                        color={electionId ? "red" : "gray"}
                        size={20}
                        onClick={
                          electionId
                            ? () => triggerDelete(candidate?._id)
                            : undefined
                        }
                        style={{
                          cursor: electionId ? "pointer" : "not-allowed",
                          opacity: electionId ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}

          {/* See More Button Card */}
          {hasNextPage && (
            <div
              className="bg-white shadow-lg rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-full"
              onClick={() => triggerNextPage()}
            >
              <div className="p-6 text-center">
                <div className="w-15 h-15 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto mb-4">
                  <IconPlus size={32} className="text-red-500" />
                </div>
                <Text fw={700} size="md" className="text-black">
                  See More
                </Text>
                <Text c="dimmed" size="sm" className="mt-2">
                  Load more candidates
                </Text>
              </div>
            </div>
          )}
        </SimpleGrid>
      </div>
      {descriptionOpen && (
        <Modal
          withCloseButton={false}
          opened={descriptionOpen}
          onClose={() => setDescriptionOpen(false)}
        >
          <Text className="text-justify ">{description || ""}</Text>
        </Modal>
      )}

      {open && (
        <Modal
          title={<h5 className="font-bold text-md">Group Members</h5>}
          withCloseButton={false}
          opened={open}
          onClose={() => setOpen(false)}
          size="lg"
        >
          <div id="app">
            <div className="flex justify-around p-4">
              {members?.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-blue-100 to-blue-200 shadow-lg rounded-xl w-1/2 m-1 p-4"
                >
                  <h5 className="font-bold text-md">
                    Name : {member.firstName}
                  </h5>
                  <p className="text-gray-600">Age: {member.age}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CandidateList;
