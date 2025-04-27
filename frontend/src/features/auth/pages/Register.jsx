import React from "react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Container,
  Grid,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { registerUser } from "../actions/authAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      firstName: (val) => (!val ? "First name should not be empty" : null),
      lastName: (val) => (!val ? "Last name should not be empty" : null),
      phone: (val) => (!val ? "Phone number should not be empty" : null),
      dob: (val) => (!val ? "Date of birth should not be empty" : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
      confirmPassword: (val, values) =>
        !val
          ? "Confirm password cannot be empty"
          : val !== values.password
          ? "Passwords do not match"
          : null,
    },
  });

  const handleSubmit = (values) => {
    // Here you would typically send the data to your backend
    console.log(values);
    const loadingId = toast.loading("Registering...");
    dispatch(
      registerUser(values, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Registration failed. Please try again.");
          return;
        }
        toast.success("Registration successful");
        navigate("/login");
      })
    );
  };

  return (
    <Container size="md" my={40}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Online Voting | Register</title>
      </Helmet>
      <Text ta="center" size="lg" fw={500} mb="md">
        Create your account
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid span={{ base: 12, md: 4 }}>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="First Name"
                withAsterisk
                radius="md"
                {...form.getInputProps("firstName")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Last Name"
                withAsterisk
                radius="md"
                {...form.getInputProps("lastName")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Phone"
                withAsterisk
                type="number"
                radius="md"
                {...form.getInputProps("phone")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <DateInput
                withAsterisk
                valueFormat="DD/MM/YYYY"
                label="Date of Birth"
                {...form.getInputProps("dob")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Email"
                withAsterisk
                radius="md"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Country"
                withAsterisk
                type="number"
                radius="md"
                {...form.getInputProps("country")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="State"
                withAsterisk
                radius="md"
                {...form.getInputProps("state")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Zip Code"
                withAsterisk
                type="number"
                radius="md"
                {...form.getInputProps("zip")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Unit Number"
                withAsterisk
                type="number"
                radius="md"
                {...form.getInputProps("unitNumber")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Street Address"
                withAsterisk
                radius="md"
                {...form.getInputProps("street")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <TextInput
                label="Suburb"
                withAsterisk
                radius="md"
                {...form.getInputProps("suburb")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <PasswordInput
                withAsterisk
                label="Password"
                radius="md"
                {...form.getInputProps("password")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <PasswordInput
                onWaiting={true}
                withAsterisk
                label="Confirm password"
                radius="md"
                {...form.getInputProps("confirmPassword")}
              />
            </Grid.Col>
          </Grid>

          <Group justify="space-between" mt="xl">
            <Anchor c="dimmed" size="xs" href="/login">
              Already have an account? Login
            </Anchor>
            <Button type="submit" radius="xl">
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
