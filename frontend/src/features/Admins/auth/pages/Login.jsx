import React, { useEffect, useState } from "react";
import bg_graphics from "../../../../assets/imgs/bg_vector.jpg";
import { useForm } from "@mantine/form";
import useDebounceCallback from "../../../../Hook/useDebounceCallback";
import { Helmet } from "react-helmet";
import { Anchor, Button, Checkbox, Divider } from "@mantine/core";
import FloatingLabelInput from "../components/FloatingLabelInput";
import logo from "../../../../assets/imgs/logo.png";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/authAction";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import SecurityQuestionModal from "../components/SecurityQuestionModal";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasAccessToken = localStorage.getItem("online_voting_access_token");
  const hasRefreshToken = localStorage.getItem("online_voting_refresh_token");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [updatedDevice, setUpdatedDevice] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      updatedDevice,
    },
  });
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (hasAccessToken && hasRefreshToken) {
      if (role === "admin" || role === "super-admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [hasAccessToken, hasRefreshToken]);

  const debounceSubmit = useDebounceCallback((values) => {
    onFinish(values);
  }, 200);

  const onFinish = async (values) => {
    values.updatedDevice = updatedDevice;
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingId = toast.loading("Logging in...");
    dispatch(
      loginUser(values, (err, response) => {
        toast.dismiss(loadingId);
        if (err) {
          const isNewDevice = err?.data?.data?.isNewDevice || false;
          const isSecurityQuestion =
            err?.data?.data?.isSecurityQuestion || false;
          setIsSubmitting(false);
          if (isNewDevice && !updatedDevice && isSecurityQuestion) {
            setIsNewDevice(true);
          }
          if (err.status === 400) {
            toast.error(
              err?.data?.message || "Something went wrong failed to login"
            );
          }
          return;
        }
        setIsSubmitting(false);
        toast.success("Login Successful");
        const now = new Date();
        const expiryTime = 8 * 60 * 60 * 1000;
        localStorage.setItem(
          "online_voting_expiry_time",
          now.getTime() + expiryTime
        );

        const name =
          response?.userId?.firstName + " " + response?.userId?.lastName;

        localStorage.setItem("user_name", name);
        localStorage.setItem(
          "online_voting_access_token",
          response?.accessToken
        );
        localStorage.setItem(
          "online_voting_refresh_token",
          response?.refreshToken
        );
        localStorage.setItem("role", response?.userId?.role);

        if (redirect) {
          navigate(`/${redirect}`);
        } else {
          const role = localStorage.getItem("role");
          if (role === "admin" || role === "super-admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }
      })
    );
  };

  return (
    <div
      className="w-full bg-red-500 grid grid-cols-2 gap-4 nunito_fonts"
      style={{
        height: "100vh",
        background: "white",
        maxWidth: "1920px",
        margin: "auto",
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Online Voting | Login</title>
      </Helmet>
      <div
        className=" hidden md:block md:col-span-1 w-full pt-8 pl-8 pb-8"
        style={{ height: "100vh" }}
      >
        <img
          className="h-full w-full shadow-lg"
          src={bg_graphics}
          style={{
            background: "rgba(0, 110, 196, 0.05)",
            borderRadius: "30px",
          }}
        />
      </div>
      <div
        className="col-span-2 md:col-span-1 w-full p-4  md:pt-8 md:pr-8 md:pb-8 flex items-center bg-gradient-to-b from-blue-100 to-blue-200 md:from-white md:to-white"
        style={{ height: "100vh" }}
      >
        <form
          className="flex flex-col justify-center p-4 h-fit items-center md:items-start w-full lg:w-4/5 gap-6 shadow-lg md:shadow-none bg-white"
          onSubmit={form.onSubmit((values) => {
            debounceSubmit(values);
          })}
        >
          <div className="flex flex-col items-center md:items-start md:justify-start">
            <img className="mb-6" src={logo} style={{ width: "70px" }} />
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold tracking-wide font-sans text-center md:text-left libre-baskerville-regular">
                Welcome to Online Voting
                {/* Welcome 👋 */}
              </h2>
              <p className="text-gray-500 text-center md:text-left libre-baskerville-regular">
                Please login here
              </p>
            </div>
          </div>

          <Divider classNames={{ root: "w-full" }} />

          <div className="w-full flex gap-4 flex-col">
            <FloatingLabelInput
              label="Email"
              radius="md"
              {...form.getInputProps("email")}
              isFocusTrap={true}
            />

            <FloatingLabelInput
              type="password"
              label="Password"
              size="sm"
              radius="md"
              mb="md"
              {...form.getInputProps("password")}
            />
          </div>

          <Button
            type="submit"
            classNames={{ root: "!w-full" }}
            styles={{ root: { height: "45px" } }}
            // disabled={isSubmitting}
          >
            Login
          </Button>

          <Anchor c="dimmed" size="xs" href="/register">
            Don't have an account? Register
          </Anchor>
        </form>
      </div>
      {isNewDevice && (
        <SecurityQuestionModal
          setUpdatedDevice={setUpdatedDevice}
          emails={form.getInputProps("email").value}
          opened={isNewDevice}
          close={() => setIsNewDevice(false)}
        />
      )}
    </div>
  );
};

export default Login;
