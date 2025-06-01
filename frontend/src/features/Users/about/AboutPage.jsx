import React from "react";
import {
  Container,
  Title,
  Card,
  SimpleGrid,
  List,
  ThemeIcon,
  rem,
  Group,
  Paper,
  Text,
  Stack,
  Center,
} from "@mantine/core";
import {
  IconShieldLock,
  IconUserCheck,
  IconListCheck,
  IconChartBar,
  IconCircleCheck,
  IconArrowRight,
} from "@tabler/icons-react";

const AboutPage = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xl">
        About Online Voting System
      </Title>

      <Card shadow="sm" padding="lg" radius="md" mb="xl" withBorder>
        <Title order={3} ta="center" mb="md">
          Our Mission
        </Title>
        <Text ta="center" size="lg">
          To provide a secure, transparent, and accessible digital voting
          platform that enhances democratic participation while maintaining the
          integrity of the electoral process.
        </Text>
      </Card>

      <Title order={2} ta="center" mb="xl">
        Key Features
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="xs">
            <ThemeIcon variant="light" color="blue" size="lg">
              <IconListCheck style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Title order={4}>Election Management</Title>
          </Group>
          <Text size="sm">
            Administrators can create and manage elections with customizable
            parameters including dates, positions, and candidates.
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="xs">
            <ThemeIcon variant="light" color="teal" size="lg">
              <IconUserCheck style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Title order={4}>Candidate Registration</Title>
          </Group>
          <Text size="sm">
            Verified candidates can register for elections with proper
            documentation and approval processes.
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="xs">
            <ThemeIcon variant="light" color="red" size="lg">
              <IconShieldLock style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Title order={4}>Secure Voting</Title>
          </Group>
          <Text size="sm">
            End-to-end encrypted voting process to ensure vote integrity and
            prevent tampering.
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group mb="xs">
            <ThemeIcon variant="light" color="violet" size="lg">
              <IconChartBar style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Title order={4}>Real-time Results</Title>
          </Group>
          <Text size="sm">
            Instant vote counting and transparent result display after election
            closure with detailed analytics.
          </Text>
        </Card>
      </SimpleGrid>

      <Title order={2} ta="center" mt="xl" mb="lg">
        System Objectives
      </Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="green" size={24} radius="xl">
              <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
            </ThemeIcon>
          }
        >
          <List.Item>
            <Text fw={500}>Accessibility:</Text> Enable voters to participate
            from anywhere using secure authentication
          </List.Item>
          <List.Item>
            <Text fw={500}>Security:</Text> Implement robust encryption and
            verification to prevent fraud
          </List.Item>
          <List.Item>
            <Text fw={500}>Transparency:</Text> Provide verifiable audit trails
            for all voting activities
          </List.Item>
          <List.Item>
            <Text fw={500}>Efficiency:</Text> Reduce administrative overhead and
            speed up election processes
          </List.Item>
          <List.Item>
            <Text fw={500}>User Empowerment:</Text> Allow voters to select their
            preferred representatives with confidence
          </List.Item>
        </List>
      </Card>

      <Title order={2} ta="center" mt="xl" mb="lg">
        How It Works
      </Title>
      <Center>
        <Group gap="xl" justify="center">
          {[
            { number: 1, label: "Register/Login" },
            { number: 2, label: "Verify Identity" },
            { number: 3, label: "View Candidates" },
            { number: 4, label: "Cast Your Vote" },
            { number: 5, label: "View Results" },
          ].map((step, index) => (
            <Stack key={step.number} align="center" gap="xs">
              <Paper
                radius="xl"
                p="md"
                // withBorder
                className="border border-cyan-500 shadow-lg"
                style={{ width: rem(100), height: rem(100) }}
              >
                <Center h="100%">
                  <Title order={3}>{step.number}</Title>
                </Center>
              </Paper>
              <Text size="sm" fw={500}>
                {step.label}
              </Text>
              {index < 4 && (
                <ThemeIcon variant="transparent" color="gray">
                  <IconArrowRight style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
              )}
            </Stack>
          ))}
        </Group>
      </Center>
    </Container>
  );
};

export default AboutPage;
