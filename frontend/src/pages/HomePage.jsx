import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Space,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import election from "../assets/imgs/election.jpg";
import candidate from "../assets/imgs/candidate.jpg";
import group from "../assets/imgs/group.jpg";
import user from "../assets/imgs/users.png";
import { useDispatch, useSelector } from "react-redux";
import { hasUserAddedSecurityQuestion } from "../features/auth/actions/authAction";
import SecurityQuestionModal from "../features/auth/components/SecurityQuestionModal";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { AuthDetails } = useSelector((store) => store?.Auth);

  const [isNewDevice, setIsNewDevice] = useState(false);
  const hasAccessToken = localStorage.getItem("online_voting_access_token");
  const hasRefreshToken = localStorage.getItem("online_voting_refresh_token");

  useEffect(() => {
    if (!hasAccessToken && !hasRefreshToken) {
      navigate("/login");
    }
    dispatch(hasUserAddedSecurityQuestion());
  }, [dispatch, hasAccessToken, hasRefreshToken]);

  const hasSecurityAnswer = AuthDetails?.hasSecurityAnswer;

  useEffect(() => {
    if (hasSecurityAnswer !== undefined && hasSecurityAnswer === false) {
      setIsNewDevice(true);
    }
    if (hasSecurityAnswer === true) {
      setIsNewDevice(false);
    }
  }, [AuthDetails?.hasSecurityAnswer]);

  const data = [
    {
      key: "user",
      title: "Users",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: user,
      action: "Manage User Roles",
      path: "/user",
    },
    {
      key: "election",
      title: "Elections",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: election,
      action: "Create Election",
      path: "/election",
    },
    {
      key: "candidate",
      title: "Candidates",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: candidate,
      action: "Create Candidate",
      path: "/candidate",
    },
    {
      key: "group",
      title: "Groups",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: group,
      action: "Create Group",
      path: "/group",
    },
  ];

  return (
    <div className="p-0 m-0" key={hasSecurityAnswer}>
      <Space h={20} />
      <Grid gutter="md">
        {data.map((_, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section component={_.key}>
                <Image
                  src={_.image}
                  alt={_.title}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </Card.Section>
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={800}>{_.title}</Text>
                <Badge color="green">Active</Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {_.description}
              </Text>
              <Button
                fullWidth
                mt="md"
                radius="md"
                onClick={() => navigate(_.path)}
              >
                {_.action}
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      {isNewDevice && (
        <SecurityQuestionModal
          blocked={false}
          opened={isNewDevice}
          close={() => setIsNewDevice(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
