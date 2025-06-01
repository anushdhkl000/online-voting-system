import React, { useEffect } from "react";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
} from "chart.js";
import { Helmet } from "react-helmet";
import { Space } from "@mantine/core";
import PageHeader from "../../../../components/PageHeader";
import { IconSquaresSelected } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { dashboardActions } from "../actions/dashboardAction";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardList } = useSelector((store) => store.dashboard);

  const electionData = dashboardList?.data?.electionData;
  const demographicData = dashboardList?.data?.demographicData;
  const pollingData = dashboardList?.data?.pollingData;
  const keyStatics = dashboardList?.data?.keyStatics;
  const electionResults = dashboardList?.data?.electionResults || [];
  const verticalBarChart = dashboardList?.data?.verticalBarChart || [];

  useEffect(() => {
    dispatch(dashboardActions());
  }, [dispatch]);

  function generateColor(index) {
    const staticColors = [
      "#FF6384", // Red
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FF9F40", // Orange
      "#8AC24A", // Green
      "#FF6B6B", // Coral
      "#6A5ACD", // Slate Blue
      "#20B2AA", // Light Sea Green
    ];

    if (index < staticColors.length) return staticColors[index];

    // More vibrant dynamic colors
    const hue = Math.floor(Math.random() * 360);
    const saturation = 75 + Math.floor(Math.random() * 25);
    const lightness = 50 + Math.floor(Math.random() * 10);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const data = {
    labels: ["president", "vice president", "secretary"],
    datasets: [
      {
        label: "MIT CEO",
        data: [12, 3, 0],
        backgroundColor: "red",
      },
      {
        label: "Administration Head",
        data: [0, 1, 5],
        backgroundColor: "pink",
      },
    ],
  };

  const options = {
    indexAxis: "y", // This makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of votes per election",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      <Helmet>
        <title>Voting | Dashboard</title>
      </Helmet>
      <Space h={10} />

      <PageHeader>
        <PageHeader.Left
          icon={
            <PageHeader.IconWrapper className="bg-[#2cd3b5] w-[3.125rem] h-[3.125rem] flex justify-center items-center">
              <IconSquaresSelected
                style={{ height: "24px", width: "24px" }}
                color="white"
              />
            </PageHeader.IconWrapper>
          }
          title="Election Analytics Dashboard"
          subtitle="track all elections"
        />
      </PageHeader>
      <Space h={30} />
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Election Results</h2>
          <div className="chart-container">
            {electionData && (
              // <Pie
              //   data={electionData}
              //   options={{
              //     responsive: true,
              //     plugins: {
              //       legend: {
              //         position: "right",
              //       },
              //       tooltip: {
              //         callbacks: {
              //           label: function (context) {
              //             return `${context?.label}: ${context?.raw}%`;
              //           },
              //         },
              //       },
              //     },
              //   }}
              // />
              <Bar data={verticalBarChart || data} options={options} />
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Voter Demographics</h2>
          <div className="chart-container">
            {demographicData && (
              <Doughnut
                data={demographicData}
                options={{
                  responsive: true,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${context.raw}%`;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* <div className="dashboard-card stats-card">
          <h2>Key Statistics</h2>
          <div className="">
            <div className="stat-item">
              <h3>
                Total Votes:{" "}
                <span className="text-pink-600 font-bold text-xl">
                  {keyStatics?.totalVotes}
                </span>
              </h3>
            </div>
            <div className="stat-item">
              <h3>
                Registered Voters :{" "}
                <span className="text-pink-600 font-bold text-xl">
                  {keyStatics?.registerVoters}
                </span>
              </h3>
            </div>
          </div>
        </div> */}
        <div className="dashboard-card full-width">
          <h2 className="text-xl font-bold mb-4">Leading Parties</h2>
          <div className="flex flex-wrap gap-4">
            {keyStatics?.leadingParty?.map((row, index) => (
              <div
                key={index}
                className="flex-1 min-w-[250px] max-w-[300px] bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Election:{" "}
                    <span className="text-blue-600">{row.electionName}</span>
                  </h3>
                  <p className="text-yellow-600">
                    Position: {row.positionName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"][
                          index % 3
                        ],
                      }}
                    />

                    <p className="text-gray-700 font-medium">
                      Symbol: {row.partyName}
                    </p>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Votes:{" "}
                    <span className="font-bold text-gray-900">
                      {row.voteCount}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card full-width">
          <h2>Election Results Details</h2>
          <div className="table-container">
            <table className="election-table">
              <thead>
                <tr>
                  <th>Election</th>
                  <th>Position</th>
                  <th>Symbols</th>
                  <th>Candidates</th>
                  <th>Votes</th>
                  {/* <th>Percentage</th> */}
                  <th>Ranked</th>
                </tr>
              </thead>
              <tbody>
                {electionResults.map((result, index) => (
                  <tr key={result.id}>
                    <td>{result.election}</td>
                    <td>
                      <p className="text-cyan-600 font-bold">
                        {result.position}
                      </p>
                    </td>
                    <td>
                      <span
                        className="party-color"
                        style={{
                          backgroundColor: electionData
                            ? generateColor(index)
                            : "",
                        }}
                      ></span>
                      {result.party}
                    </td>
                    <td>{result.candidate}</td>
                    <td>{result.votes.toLocaleString()}</td>
                    {/* <td>{result.percentage}</td> */}
                    <td>
                      <p className="text-orange-500 font-bold">{result.Rank}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
