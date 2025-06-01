import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  SimpleGrid,
  Modal,
  Space,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
  castingVoteActions,
  generateVotingTokenActions,
  getAllElectionCandidates,
} from "../actions/userAction";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import base_url from "../../../../helpers/Costant";
import { toast } from "react-toastify";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { TiArrowBackOutline } from "react-icons/ti";

const Candidate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [token, setToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [symbolId, setSymbolId] = useState(null);

  const { userElectionCandidates } = useSelector((state) => state.landingPage);

  const electionId = params.electionId;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const positionId = queryParams.get("positionId");

  const candidates = userElectionCandidates?.response;

  const baseUrl = base_url + "public/uploads/";

  useEffect(() => {
    if (!positionId) return;
    dispatch(getAllElectionCandidates(electionId, positionId));
  }, [positionId, electionId]);

  useEffect(() => {
    if (!isModalOpened) {
      setTimeLeft(60); // Reset timer when modal closes
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Optional: handle timeout action here
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalOpened]);

  const handleVote = () => {
    if (!electionId) return;
    setIsModalOpened(false);
    const loadingId = toast.loading("Casting your vote...");

    dispatch(
      castingVoteActions({ electionId, symbolId, token, positionId }, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error(
            err?.message || "Something went wrong, please try again."
          );
          return;
        }
        toast.success("Your vote has been casted successfully.");
        setSymbolId(null);
      })
    );
  };

  const triggerVote = (symbolId) => {
    if (!electionId) return;
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userId = localStorage.getItem("user_name");

    if (!accessToken && !refreshToken && !userId) {
      navigate("/login");
      return;
    }
    setIsModalOpened(true);
    setSymbolId(symbolId);
    dispatch(
      generateVotingTokenActions({ electionId, symbolId }, (err, data) => {
        if (err) return;
        if (data) {
          setToken(data.token);
        }
      })
    );
  };

  if (candidates?.length === 0) {
    return (
      <div className="flex flex-col text-center ">
        <Text
          size="lg"
          weight={600}
          align="center"
          style={{ marginBottom: "1rem" }}
          fw="bold"
          mt="sm"
        >
          Election Candidate Assign Symbols
        </Text>
        <Text> Candidates are not assigned for this election. </Text>
      </div>
    );
  }
  return (
    <div className="container px-4">
      <div className="flex gap-7">
        <Button
          variant="outline"
          mt={15}
          mb={20}
          leftSection={<TiArrowBackOutline size={20} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Text
          size="lg"
          weight={600}
          align="center"
          style={{ marginBottom: "1rem" }}
          fw="bold"
          mt="sm"
        >
          Election Candidate Assign Symbols
        </Text>
      </div>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
        spacing="md"
      >
        {candidates?.map((candidate) => (
          <Card
            key={candidate._id}
            shadow="xs"
            padding="md"
            radius="md"
            withBorder
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #e0e0e0",
                marginBottom: "12px",
              }}
            >
              <Image
                src={baseUrl + candidate?.groupId?.symbol}
                alt={`${candidate?.groupId?.name}'s profile`}
                width={100}
                height={100}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ textAlign: "center", width: "100%" }}>
              <Text weight={500} size="sm" style={{ marginBottom: "4px" }}>
                Symbol: {candidate?.groupId?.name}
              </Text>
              <Badge
                color="blue"
                variant="light"
                size="sm"
                style={{ marginBottom: "8px" }}
              >
                candidate ID:
                <span className="text-red-500">
                  {" "}
                  {candidate?.candidateId?.candidateID || "No Party"}
                </span>
              </Badge>
              <Text
                size="xs"
                color="dimmed"
                style={{ marginBottom: "12px", lineHeight: 1.2 }}
              >
                Agenda: {candidate?.candidateId?.descriptions || "agenda"}
              </Text>
            </div>
            <Button
              color="brand"
              fullWidth
              size="xs"
              radius="md"
              onClick={() => {
                triggerVote(candidate?.groupId?._id);
              }}
            >
              Cast your votes
            </Button>
          </Card>
        ))}
      </SimpleGrid>
      {isModalOpened && (
        <Modal
          opened={isModalOpened}
          onClose={() => setIsModalOpened(false)}
          withCloseButton={false}
        >
          <div className="flex flex-col justify-center items-center align-middle">
            <Space h={20} />
            <AppIcons.IconAlertTriangle size={50} color="orange" />

            {/* Countdown Timer */}
            <Text size="xl" fw={700} c="orange" mt={10}>
              {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                .toString()
                .padStart(2, "0")}`}
            </Text>

            <Space h={20} />
            <Text
              c="gray.6"
              fw={500}
              fs="20px"
              lh="1.5"
              className="text-center"
            >
              Are you sure you want to cast your vote? You will not be able to
              change your vote afterwards.
            </Text>
            <Text c="grape" mt={10}>
              Note: Please vote within One minutes.
            </Text>
            <Space h={30} />
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setIsModalOpened(false);
                }}
                color="gray"
                variant="light"
                size="md"
                radius="md"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleVote()}
                color="orange"
                variant="light"
                size="md"
                radius="md"
                disabled={timeLeft <= 0}
              >
                Cast Vote
              </Button>
            </div>
            <Space h={20} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Candidate;
