import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Badge,
  Group,
  Stack,
  Skeleton,
  Divider,
  Button,
} from "@mantine/core";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllElections } from "../actions/userAction";
import { DateFormat } from "../../../../helpers/FormatDate";

const Election = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userElections } = useSelector((state) => state.landingPage);

  const ongoingElections = userElections?.responses?.ongoingElections;
  const upcomingElections = userElections?.responses?.upcomingElections;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllElections());
  }, [dispatch]);

  useEffect(() => {
    if (!upcomingElections && !ongoingElections) return;
    setLoading(false);
  }, [ongoingElections, upcomingElections]);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={50} circle mb="xl" />
        <Grid>
          {[...Array(4)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6 }}>
              <Card withBorder padding="lg" radius="md">
                <Skeleton height={20} width="60%" mb="sm" />
                <Skeleton height={16} width="90%" mb="sm" />
                <Group justify="space-between">
                  <Skeleton height={14} width="30%" />
                  <Skeleton height={14} width="30%" />
                </Group>
                <Skeleton height={24} width={80} mt="sm" />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Elections
      </Title>

      {/* Ongoing Elections Section */}
      <Stack gap="md" mb="xl">
        <Title order={2} c="green.6" size="lg">
          Ongoing Elections
        </Title>
        <Divider />
        {ongoingElections?.length > 0 ? (
          <Grid>
            {ongoingElections?.map((election) => (
              <Grid.Col key={election.id} span={{ base: 12, md: 4 }}>
                <ElectionCard key={election._id} election={election} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Text c="dimmed">No ongoing elections at this time.</Text>
        )}
      </Stack>
      <Button
        variant="outline"
        mb={15}
        onClick={() => navigate("/user/results")}
      >
        View Election Results
      </Button>
      {/* Upcoming Elections Section */}
      <Stack gap="md">
        <Title order={2} c="blue.6" size="lg">
          Upcoming Elections
        </Title>
        <Divider />
        {upcomingElections?.length > 0 ? (
          <Grid>
            {upcomingElections?.map((election) => (
              <Grid.Col key={election.id} span={{ base: 12, md: 4 }}>
                <ElectionCard election={election} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Text c="dimmed">No upcoming elections scheduled.</Text>
        )}
      </Stack>
    </Container>
  );
};

// Reusable Election Card Component with Mantine
const ElectionCard = ({ election }) => {
  const navigate = useNavigate();
  return (
    <Card withBorder padding="md" radius="md" shadow="md">
      <Stack gap="sm">
        <div
          className="flex justify-between"
          style={{
            width: "100%",
            marginBottom: "8px", // optional spacing
          }}
        >
          <Title order={3} size="md">
            {election.title}
          </Title>
          {election.hasVote && (
            <Badge color="red.6" size="sm">
              Voted
            </Badge>
          )}
        </div>

        <Group justify="space-between">
          <div className="flex items-center text-gray-600 ">
            <FaCalendarAlt className="mr-2" />
            <span>Start At: {DateFormat(election.startedAt)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2" />
            <span>Ends on: {DateFormat(election.endedAt)}</span>
          </div>
        </Group>
        <Badge
          color={election.status === "ongoing" ? "green" : "blue"}
          variant="light"
          mt="sm"
          size="lg"
        >
          {election.status === "ongoing" ? "Ongoing" : "Upcoming"}
        </Badge>
        {election.status === "ongoing" && (
          <Button
            onClick={() =>
              // navigate(`/user/candidate/${election._id}`
              navigate(`/user/election/${election._id}`)
            }
          >
            Vote Now
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default Election;
