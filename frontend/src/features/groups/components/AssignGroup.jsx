import {
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Radio,
  rem,
  SimpleGrid,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import base_url from "../../../helpers/Costant";
import { getAssignGroupCandidates } from "../../candidates/actions/candidateAction";
import { useForm } from "@mantine/form";
import debounce from "lodash.debounce";
import { DEBOUNCE_TIME } from "../../../constants/Pagination";
import { addAssignGroupCandidate } from "../actions/groupAction";
import { toast } from "react-toastify";

const AssignGroup = ({
  opened,
  close,
  assignDetails,
  setSearchCandidate,
  filters,
}) => {
  const dispatch = useDispatch();
  const baseUrl = base_url + "public/uploads/";
  const { candidateList } = useSelector((store) => store?.candidate);
  const { assignGroupCandidateList } = useSelector((store) => store?.group);
  const candidateData = candidateList?.data || [];

  const assignGroupCandidateData = assignGroupCandidateList?.data || null;

  const assignGroupCandidateId =
    assignGroupCandidateData?.data?.candidateId || false;

  // const updatedCandidateData = candidateData?.filter((candidate) => {
  //   if (!candidate.assignGroup) {
  //     return {
  //       ...candidate,
  //       groupId: assignDetails?._id,
  //     };
  //   }
  // });

  const form = useForm({
    initialValues: {
      candidateId: "",
    },
  });

  const handleSearch = (val) => {
    setSearchCandidate(val);
  };
  const debounceSearch = useCallback(debounce(handleSearch, DEBOUNCE_TIME), []);

  useEffect(() => {
    dispatch(getAssignGroupCandidates(assignDetails?._id));
  }, [assignDetails?._id]);

  useEffect(() => {
    if (assignGroupCandidateData) {
      form.setValues({
        groupId: assignDetails?._id,
        candidateId: assignGroupCandidateData?.data?.candidateId,
      });
    }
  }, [assignGroupCandidateData?.data]);

  const handleSubmit = (values) => {
    const loadingId = toast.loading("Assigning group to candidate...");
    dispatch(
      addAssignGroupCandidate(values, filters, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Something went wrong, please try again later.");
          return;
        }
        toast.success("Group assigned successfully.");
        close();
      })
    );
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        size="lg"
        title={
          <div>
            <div className="font-bold">Assign Candidate Groups</div>
            <div className="text-sm text-gray-400">
              assign group to candidate
            </div>
          </div>
        }
      >
        <TextInput
          placeholder="Search candidate"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          onChange={(e) => {
            debounceSearch(e.target.value);
          }}
        />
        <Space h={20} />
        <div className="w-15 h-15 rounded-full overflow-hidden mr-2">
          <Image
            src={baseUrl + assignDetails?.symbol}
            alt={assignDetails?.name || "symbol"}
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
        <Text color="cyan" fw={600}>
          Group Name: {assignDetails?.name}
        </Text>
        <Space h={10} />
        <Text className="text-center" color="gray" fw={500}>
          ------------------ Candidate List ------------------
        </Text>
        <Space h={10} />
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <div className="flex flex-wrap w-full">
            <Radio.Group
              name="candidateSelection"
              {...form.getInputProps("candidateId")}
            >
              <SimpleGrid
                cols={{ base: 1, sm: 1, md: 3, lg: 3 }}
                spacing={{ base: 10, sm: "sm", md: "md", lg: "lg" }}
                verticalSpacing={{ base: "sm", sm: "xl", md: "md", lg: "lg" }}
                className="gap-5"
              >
                {candidateData?.map((candidate) => (
                  <Radio
                    disabled={
                      assignGroupCandidateId
                        ? assignGroupCandidateId !== candidate._id
                        : candidate.assignGroup
                    }
                    key={candidate._id}
                    value={candidate._id}
                    label={` ${
                      candidate?.groupName
                        ? candidate?.groupName
                        : candidate.firstName + " " + candidate.lastName
                    }`}
                  />
                ))}
              </SimpleGrid>
            </Radio.Group>
          </div>

          <Space h={10} />
          <div className="flex justify-end m-5 gap-5">
            <Button onClick={() => close()}>Cancel</Button>
            <Button variant="outline" type="submit">
              Assign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignGroup;
