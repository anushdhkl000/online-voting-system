import React, { useState } from "react";
import { DateFormat } from "../../../helpers/FormatDate";
import { PAGINATION } from "../../../constants/Pagination";
import DataTable from "react-data-table-component";
import {
  Badge,
  Image,
  Modal,
  SimpleGrid,
  Space,
  Text,
  Tooltip,
} from "@mantine/core";
import { AppIcons } from "../../../ui/shared/AppIcons";
import { useSelector } from "react-redux";
import base_url from "../../../helpers/Costant";
import { IconPlus, IconStackPop } from "@tabler/icons-react";

const CandidateList = ({ triggerEdit, triggerDelete, triggerNextPage }) => {
  const { candidateList } = useSelector((store) => store?.candidate);
  const candidateData = candidateList?.data;
  const hasNextPage = candidateList?.hasNextPage;
  const baseUrl = base_url + "public/uploads/";

  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [description, setDescription] = useState("");
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
                <Text fw={700} size="lg" className="text-black">
                  {candidate.groupName
                    ? candidate.groupName
                    : candidate?.firstName + " " + candidate?.lastName}
                </Text>
                <Text c="cyan" size="sm">
                  {"Candidate ID : " + (candidate?.candidateID || "N/A")}
                </Text>
                <div className="w-full border-b-2 my-2 border-red-500"></div>
                <Text c="dimmed" size="sm">
                  {"Gender : " + (candidate?.gender || "N/A")}
                </Text>

                {/* {candidate?.descriptions || "Product Design"} */}
              </div>
              <div className="flex justify-end gap-3 m-5 cursor-pointer">
                <div className="border opacity-30"> </div>
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
                <Tooltip
                  label="Edit candidate"
                  position="top"
                  color="#2cd3b5"
                  withArrow
                  transitionProps={{ duration: 10 }}
                >
                  <AppIcons.IconEdit
                    color="orange"
                    size={20}
                    onClick={() => triggerEdit(candidate)}
                  />
                </Tooltip>
                <Tooltip
                  label="Delete candidate"
                  position="top"
                  color="#2cd3b5"
                  withArrow
                  transitionProps={{ duration: 10 }}
                >
                  <AppIcons.IconTrash
                    color="red"
                    size={20}
                    onClick={() => triggerDelete(candidate?._id)}
                  />
                </Tooltip>
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
    </div>
  );
};

export default CandidateList;
