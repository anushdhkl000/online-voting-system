import React, { useEffect } from "react";
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
import { getAllElectionPositions } from "../actions/userAction";
import { useNavigate, useParams } from "react-router-dom";

import { AppIcons } from "../../../../ui/shared/AppIcons";
import { TiArrowBackOutline } from "react-icons/ti";
const PositionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { positions } = useSelector((state) => state.landingPage);

  const electionId = params.electionId;

  const positionData = positions?.data;

  useEffect(() => {
    dispatch(getAllElectionPositions(electionId));
  }, []);

  if (positionData?.length === 0) {
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
          Election Positions
        </Text>
        <Text> Positions are not assigned for this election. </Text>
      </div>
    );
  }

  if (positionData?.length === undefined) {
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
          Election Positions
        </Text>
        <Text c="red.7" fw="bold">
          {" "}
          Access Denied{" "}
        </Text>
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
          style={{ marginBottom: "1.5rem" }}
          fw="bold"
          mt="md"
        >
          Choose Election Positions
        </Text>
      </div>

      <SimpleGrid
        cols={5}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
        ]}
        spacing="md"
      >
        {positionData?.map((position) => (
          <Card
            key={position._id}
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
            <div style={{ textAlign: "center", width: "80%" }}>
              <Text weight={500} size="md" style={{ marginBottom: "4px" }}>
                <p className="text-cyan-600 font-bold uppercase">
                  {position?.position}
                </p>
              </Text>
            </div>
            <Button
              color="brand"
              fullWidth
              size="xs"
              radius="md"
              mt={10}
              onClick={() => {
                navigate(
                  `/user/candidate/${position?.electionId}?positionId=${position?._id}`
                );
              }}
            >
              Vote
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default PositionPage;
