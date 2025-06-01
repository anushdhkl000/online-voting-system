import React, { useEffect, useState } from "react";
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
  FileInput,
  Tooltip,
  Select,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, viewOrganisation } from "../actions/authAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppIcons } from "../../../../ui/shared/AppIcons";
import { Country, State } from "country-state-city";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orginationList } = useSelector((store) => store?.Auth);

  const country = Country.getAllCountries();
  const state = State.getStatesOfCountry("AU");

  const [selectedState, setSelectedState] = useState(state);

  useEffect(() => {
    dispatch(viewOrganisation());
  }, [dispatch]);

  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      identityNumber: "",
      identityDocument: "",
      country: "",
      state: "",
      zip: "",
      unitNumber: "",
      street: "",
      suburb: "",
    },

    validate: {
      firstName: (val) => (!val ? "First name should not be empty" : null),
      lastName: (val) => (!val ? "Last name should not be empty" : null),
      phone: (val) => (!val ? "Phone number should not be empty" : null),
      dob: (val) => (!val ? "Date of birth should not be empty" : null),
      email: (val) =>
        /^\S+@\S+$/.test(val)
          ? null
          : "Email field should not be empty or invalid",
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
      identityNumber: (val) =>
        !val ? "Identity number should not be empty" : null,
      identityDocument: (val) =>
        !val ? "Identity document should not be empty" : null,
      country: (val) => (!val ? "Country should not be empty" : null),
      state: (val) => (!val ? "State should not be empty" : null),
      zip: (val) => (!val ? "Zip code should not be empty" : null),
      unitNumber: (val) => (!val ? "Unit number should not be empty" : null),
      street: (val) => (!val ? "Street should not be empty" : null),
      suburb: (val) => (!val ? "Suburb should not be empty" : null),
      age: (val) => (!val ? "Age should not be empty" : null),
    },
  });

  const handleSubmit = (values) => {
    // Here you would typically send the data to your backend
    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }

    const loadingId = toast.loading("Registering...");
    dispatch(
      registerUser(formData, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error("Registration failed. Please try again.");
          return;
        }
        toast.success("Registration successful");
        form.reset();
        navigate("/login");
      })
    );
  };
  useEffect(() => {
    form.setFieldValue("country", "AU");
  }, []);

  const handleStateChange = (countryCode) => {
    const countryState = State.getStatesOfCountry(countryCode);
    setSelectedState(countryState);
  };

  const organisations = orginationList?.response || [];

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
              <Select
                label="Organisation"
                withAsterisk
                searchable
                data={organisations.map((org) => ({
                  label: org.organisation,
                  value: org._id,
                }))}
                radius="md"
                {...form.getInputProps("orgId")}
              />
            </Grid.Col>
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
                label="Age"
                withAsterisk
                type="number"
                radius="md"
                {...form.getInputProps("age")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <Select
                label="Country"
                withAsterisk
                searchable
                data={country.map((country) => ({
                  label: country.name,
                  value: country.isoCode,
                }))}
                radius="md"
                {...form.getInputProps("country")}
                onChange={(_value, option) => {
                  form.setFieldValue("country", _value);
                  form.setFieldValue("state", null);
                  handleStateChange(_value);
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <Select
                label="State"
                withAsterisk
                radius="md"
                data={selectedState.map((state) => ({
                  label: state.name,
                  value: state.isoCode,
                }))}
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
              <TextInput
                label="Identity Number"
                withAsterisk
                radius="md"
                {...form.getInputProps("identityNumber")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4, sm: 12 }}>
              <FileInput
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>
                      Identity Document<span style={{ color: "red" }}>*</span>
                    </span>
                    <Tooltip
                      label="Ensure the document's ID number matches the identity number above."
                      color="brand"
                    >
                      <AppIcons.IconInfoCircle size={16} color="gray" />
                    </Tooltip>
                  </div>
                }
                placeholder="Upload (Driving License, Passport, etc) "
                radius="md"
                accept="image/*"
                {...form.getInputProps("identityDocument")}
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
