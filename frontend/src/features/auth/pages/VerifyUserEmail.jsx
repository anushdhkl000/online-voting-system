import React, { useEffect, useState } from "react";
import "../../../assets/css/verifyEmail.css";
import { AppIcons } from "../../../ui/shared/AppIcons";
import { Button } from "@mantine/core";
import { useDispatch } from "react-redux";
import { verifyUserEmail } from "../actions/authAction";
import { useNavigate, useParams } from "react-router-dom";

const VerifyUserEmail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { token } = params;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    dispatch(
      verifyUserEmail({ token }, (err, response) => {
        if (err) {
          setError(true);
          return;
        }
        if (response) {
          setSuccess(true);
          return;
        }
      })
    );
  }, [dispatch, token]);

  return (
    <div>
      <div className="verification-container">
        {success && (
          <div className="verification-card">
            <div className="flex justify-center items-center mb-4">
              <AppIcons.IconShieldCheckFilled size={40} color="green" />
            </div>
            <p className="welcome-title">Congratulations 🎉</p>
            <div className="verification-message">
              <p>Your account has been verified</p>
            </div>

            <Button
              className="dashboard-button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go to Login
            </Button>
          </div>
        )}

        {error && (
          <div className="verification-card">
            <div className="flex justify-center items-center mb-4">
              <AppIcons.IconExclamationCircle size={40} color="red" />
            </div>
            <p className="welcome-title">Oops 😔</p>
            <div className=" text-gray-500">
              <p>Your account has not been verified</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUserEmail;
