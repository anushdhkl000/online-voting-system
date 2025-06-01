import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {
  FaVoteYea,
  FaLock,
  FaChartBar,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllLandingPage } from "../actions/userAction";
import { DateFormat } from "../../../../helpers/FormatDate";
import { hasUserAddedSecurityQuestion } from "../../../Admins/auth/actions/authAction";
import SecurityQuestionModal from "../../../Admins/auth/components/SecurityQuestionModal";

const VotingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userLandingPageList } = useSelector((store) => store?.landingPage);
  const { AuthDetails } = useSelector((store) => store?.Auth);

  const [isNewDevice, setIsNewDevice] = useState(false);

  const ongoingElections = userLandingPageList?.response?.ongoingElections;
  const upcomingElections = userLandingPageList?.response?.upcomingElections;
  const hasRole = localStorage.getItem("role");
  useEffect(() => {
    if (!hasRole) return;
    if (hasRole === "admin" || hasRole === "super-admin") {
      navigate("/dashboard");
    }
  }, [hasRole]);

  useEffect(() => {
    dispatch(getAllLandingPage());
    if (hasRole) {
      dispatch(hasUserAddedSecurityQuestion());
    }
  }, [dispatch, hasRole]);

  const handleVoteNow = () => {
    navigate(`/user/election`);
  };

  const hasSecurityAnswer = AuthDetails?.hasSecurityAnswer;

  useEffect(() => {
    if (hasSecurityAnswer !== undefined && hasSecurityAnswer === false) {
      setIsNewDevice(true);
    }
    if (hasSecurityAnswer === true) {
      setIsNewDevice(false);
    }
  }, [AuthDetails?.hasSecurityAnswer]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Voting | Home</title>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-brand text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Make Your Voice Heard
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Participate in secure, transparent online voting for your
            organization
          </p>
          <button
            onClick={() => navigate("/user/election")}
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            View All Elections
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Ongoing Elections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaVoteYea className="mr-2 text-brand" /> Ongoing Elections
          </h2>

          {ongoingElections?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {ongoingElections?.map((election) => (
                <div
                  key={election.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {election.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>Ends on: {DateFormat(election.endedAt)}</span>
                  </div>
                  <button
                    onClick={() => handleVoteNow(election._id)}
                    className="bg-brand text-white px-6 py-2 rounded-md hover:bg-brand transition duration-300 cursor-pointer"
                  >
                    Vote Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              No ongoing elections at this time
            </div>
          )}
        </section>

        {/* Upcoming Elections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaCalendarAlt className="mr-2 text-brand" /> Upcoming Elections
          </h2>

          {upcomingElections?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingElections?.map((election) => (
                <div
                  key={election.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {election.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>Starts on: {DateFormat(election.startedAt)}</span>
                  </div>
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 px-6 py-2 rounded-md cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              No upcoming elections scheduled
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Why Vote With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaLock className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
              <p className="text-gray-600">
                End-to-end encrypted voting process to ensure vote integrity and
                prevent tampering.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaChartBar className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                View live results as votes are cast, with complete transparency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaInfoCircle className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Voter Education</h3>
              <p className="text-gray-600">
                Access candidate information and election details to make
                informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your vote is your voice. Participate in shaping your community's
            future.
          </p>
          <div className="flex justify-center gap-4">
            {!hasRole && (
              <button
                onClick={() => navigate("/register")}
                className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand transition duration-300 cursor-pointer"
              >
                Register to Vote
              </button>
            )}

            <button
              onClick={() => navigate("/about")}
              className="bg-white text-brand px-6 py-3 rounded-lg font-semibold border border-brand hover:bg-blue-50 transition cursor-pointer duration-300"
            >
              Learn More
            </button>
          </div>
        </section>
      </div>

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

export default VotingPage;
