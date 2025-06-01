const AssignCandidateModel = require("../model/adminModel/assignCandidateGroup.model")
const Symbols = require("../model/userModel/vote.model")
const Candidate = require("../model/adminModel/candidate.model")
const UserVoteElection = require("../model/userModel/userVoteElection")
const Vote = require("../model/userModel/vote.model")
const User = require("../model/authModal/auth.model")
const AssignElectionPosition = require("../model/adminModel/assignElectionPosition.model")
const Election = require("../model/adminModel/election.model")


class DashboardService {

    async getDashboard(filters) {
        const { userId } = filters
        const HasUser = await User.findOne({ _id: userId })

        const orgId = HasUser?.orgId
        const symbolElectionResults = await this.getSymbolElectionResults(orgId)
        const voterDemographics = await this.getDemographicData(orgId)
        const voterPollingData = await this.getPollingData(orgId)
        const keyStatics = await this.keyStatics(orgId)
        const electionResults = await this.getElectionResults(orgId)

        const verticalBarChart = await this.getVerticalBarChart(orgId)

        return {
            electionData: symbolElectionResults,
            demographicData: voterDemographics,
            pollingData: voterPollingData,
            keyStatics,
            electionResults,
            verticalBarChart
        }
    }

    async getSymbolElectionResults(orgId) {
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }

        const now = new Date();
        const election = await Election.find({
            endedAt: { $lt: now },
            orgId: orgId
        });

        if (election?.length > 0) {
            const electionIds = election?.map(election => election._id)
            query.electionId = { $in: electionIds }
        }

        const votes = await Symbols.find(query)
            .populate('electionId', 'title -_id');

        // Group votes by election title and count them
        const electionCounts = votes.reduce((acc, vote) => {
            const electionTitle = vote?.electionId?.title || ""
            acc[electionTitle] = (acc[electionTitle] || 0) + 1;
            return acc;
        }, {});

        // Calculate total votes
        const totalVotes = Object.values(electionCounts).reduce((sum, count) => sum + count, 0);

        // Convert counts to percentages
        const electionPercentages = Object.entries(electionCounts).reduce((acc, [election, count]) => {
            acc[election] = ((count / totalVotes) * 100).toFixed(2)
            return acc;
        }, {});

        // Static color palette (10 colors)
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
            "#20B2AA"  // Light Sea Green
        ];

        // Dynamic color generator (fallback)
        const generateColorFromString = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return `hsl(${Math.abs(hash % 360)}, 40%, 60%)`;
        };

        // Assign colors: static first, then dynamic
        const electionColors = {};
        const electionLabels = Object.keys(electionPercentages);

        electionLabels.forEach((election, index) => {
            electionColors[election] = index < staticColors.length
                ? staticColors[index]
                : generateColorFromString(election);
        });

        const electionData = {
            labels: Object.keys(electionPercentages),
            datasets: [
                {
                    data: Object.values(electionPercentages),
                    backgroundColor: electionLabels.map(election => electionColors[election]),
                    hoverBackgroundColor: electionLabels.map(election => electionColors[election]),
                },
            ],
        };

        return electionData;
    }


    async getDemographicData(orgId) {
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }
        const votes = await UserVoteElection.find(query).populate('userId', "age -_id")

        // Define our age groups
        const ageGroups = [
            { label: "18-25 years", min: 18, max: 25 },
            { label: "26-35 years", min: 26, max: 35 },
            { label: "36-45 years", min: 36, max: 45 },
            { label: "46-55 years", min: 46, max: 55 },
            { label: "56+ years", min: 56, max: Infinity }
        ];

        // Initialize counts for each age group
        const ageCounts = ageGroups.map(group => ({
            label: group.label,
            count: 0
        }));

        // Count users in each age group
        votes.forEach(vote => {
            const age = vote.userId.age;
            for (let i = 0; i < ageGroups.length; i++) {
                if (age >= ageGroups[i].min && age <= ageGroups[i].max) {
                    ageCounts[i].count++;
                    break;
                }
            }
        });

        // Calculate total votes
        const totalVotes = votes.length;

        // Convert counts to percentages
        const agePercentages = ageCounts.map(group => ({
            label: group.label,
            percentage: totalVotes > 0
                ? parseFloat(((group.count / totalVotes) * 100)).toFixed(2)
                : 0
        }));

        // Prepare the demographic data
        const demographicData = {
            labels: ageGroups.map(group => group.label),
            datasets: [
                {
                    data: agePercentages.map(group => group.percentage),
                    backgroundColor: [
                        "#FF9F40",
                        "#2ecc71",
                        "#4BC0C0",
                        "#2e4053",
                        "#9966FF"
                    ],
                    borderColor: ["#FFFFFF"],
                    borderWidth: 2
                }
            ]
        };

        return demographicData;
    }

    async getPollingData(orgId) {
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }
        const votes = await Vote.find(query)
            .populate('electionId', "title -_id")
            .select('-_id -__v -token -symbolId');
        // Extract unique parties/elections
        const parties = [...new Set(votes.map(vote => vote?.electionId?.title || ""))];

        // Group data by month
        const monthlyData = votes.reduce((acc, vote) => {
            const date = new Date(vote.createdAt);
            const month = date.toLocaleString('default', { month: 'short' });

            if (!acc[month]) {
                acc[month] = {};
                parties.forEach(party => {
                    acc[month][party] = 0;
                });
            }

            acc[month][vote?.electionId?.title]++;
            return acc;
        }, {});

        // Get sorted months (Jan-Dec)
        const months = Object.keys(monthlyData).sort((a, b) => {
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthOrder.indexOf(a) - monthOrder.indexOf(b);
        });

        // Prepare datasets for each party
        const datasets = parties.map((party, index) => {
            const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
            return {
                label: party,
                data: months.map(month => monthlyData[month][party]),
                borderColor: colors[index % colors.length],
                tension: 0.1,
                fill: false
            };
        });

        const pollingData = {
            labels: months,
            datasets: datasets
        };

        // Calculate dynamic Y-axis values
        const allValues = pollingData.datasets.flatMap(dataset => dataset.data);
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);

        // Add 10% padding and round to nearest whole number
        const yMax = Math.ceil(maxValue * 1.1);
        const yMin = Math.floor(Math.max(0, minValue * 0.9));

        return {
            chartData: pollingData,
            yAxis: {
                max: yMax,
                min: yMin,
                stepSize: this.calculateStepSize(yMax) // Helper function below
            }
        };
    }

    calculateStepSize(maxValue) {
        if (maxValue <= 10) return 1;
        if (maxValue <= 20) return 2;
        if (maxValue <= 50) return 5;
        return Math.ceil(maxValue / 10);
    }

    async keyStatics(orgId) {
        let query = {}
        let votesQuery = {}
        if (orgId) {
            query.orgId = orgId
            votesQuery.orgId = orgId
        }
        query.isVerified = true
        query.isActive = true
        query.isVerifiedDetails = true
        query.role = "user"

        const registerVoters = await User.find(query).countDocuments()

        const totalVotes = await Vote.find(votesQuery).countDocuments()
        const leadingParty = await this.getLeadingParties(orgId)

        return {
            registerVoters,
            totalVotes,
            leadingParty
        }
    }

    async getLeadingParties(orgId) {
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }
        // const results = await Vote.aggregate([
        //     {
        //         $match: query
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 electionId: "$electionId",
        //                 symbolId: "$symbolId",
        //                 positionId: "$positionId"
        //             },
        //             voteCount: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $sort: { voteCount: -1 }
        //     },
        //     {
        //         $group: {
        //             _id: "$_id.electionId",
        //             leadingParty: { $first: "$_id.symbolId" },
        //             position: { $first: "$_id.positionId" },
        //             voteCount: { $first: "$voteCount" }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "elections",
        //             localField: "_id",
        //             foreignField: "_id",
        //             as: "election"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "symbols",
        //             localField: "leadingParty",
        //             foreignField: "_id",
        //             as: "party"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "assign_election_position",
        //             localField: "position",
        //             foreignField: "_id",
        //             as: "position"
        //         }
        //     },
        //     {
        //         $project: {
        //             electionName: { $arrayElemAt: ["$election.title", 0] },
        //             partyName: { $arrayElemAt: ["$party.name", 0] },
        //             positionName: { $arrayElemAt: ["$position.position", 0] },
        //             voteCount: 1,
        //             _id: 0
        //         }
        //     }
        // ]);


        const results = await Vote.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "assign_election_positions",
                    localField: "positionId",
                    foreignField: "_id",
                    as: "position"
                }
            },
            {
                $unwind: "$position"
            },
            {
                $group: {
                    _id: {
                        electionId: "$electionId",
                        positionId: "$positionId",
                        positionName: "$position.position",
                        symbolId: "$symbolId"
                    },
                    voteCount: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.electionId": 1,
                    "_id.positionId": 1,
                    voteCount: -1
                }
            },
            {
                $group: {
                    _id: {
                        electionId: "$_id.electionId",
                        positionId: "$_id.positionId",
                        positionName: "$_id.positionName"
                    },
                    leadingParty: { $first: "$_id.symbolId" },
                    voteCount: { $first: "$voteCount" }
                }
            },
            {
                $lookup: {
                    from: "elections",
                    localField: "_id.electionId",
                    foreignField: "_id",
                    as: "election"
                }
            },
            {
                $lookup: {
                    from: "symbols",
                    localField: "leadingParty",
                    foreignField: "_id",
                    as: "party"
                }
            },
            {
                $project: {
                    electionName: { $arrayElemAt: ["$election.title", 0] },
                    positionName: "$_id.positionName",
                    partyName: { $arrayElemAt: ["$party.name", 0] },
                    voteCount: 1,
                    _id: 0
                }
            }
        ]);

        return results;
    }

    async getElectionResults(orgId) {
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }

        const now = new Date();
        const election = await Election.find({
            endedAt: { $lt: now },
            orgId: orgId
        });

        if (election?.length > 0) {
            const electionIds = election?.map(election => election._id)
            query.electionId = { $in: electionIds }
        }

        const results = await Vote.aggregate([
            { $match: query },
            // Lookup election details
            {
                $lookup: {
                    from: "elections",
                    localField: "electionId",
                    foreignField: "_id",
                    as: "election"
                }
            },
            // Lookup party/symbol details
            {
                $lookup: {
                    from: "symbols",
                    localField: "symbolId",
                    foreignField: "_id",
                    as: "party"
                }
            },
            // Lookup position details
            {
                $lookup: {
                    from: "assign_election_positions",
                    localField: "positionId",
                    foreignField: "_id",
                    as: "position"
                }
            },
            // Lookup candidate assignments
            {
                $lookup: {
                    from: "assign_candidate_groups",
                    localField: "symbolId",
                    foreignField: "groupId",
                    as: "candidateAssignment"
                }
            },
            // Lookup candidate details
            {
                $lookup: {
                    from: "candidates",
                    localField: "candidateAssignment.candidateId",
                    foreignField: "_id",
                    as: "candidate"
                }
            },
            // Group by election, position, and symbol
            {
                $group: {
                    _id: {
                        electionId: "$electionId",
                        positionId: "$positionId",
                        symbolId: "$symbolId"
                    },
                    electionName: { $first: { $arrayElemAt: ["$election.title", 0] } },
                    positionName: { $first: { $arrayElemAt: ["$position.position", 0] } },
                    partyName: { $first: { $arrayElemAt: ["$party.name", 0] } },
                    candidate: { $first: { $arrayElemAt: ["$candidate", 0] } },
                    voteCount: { $sum: 1 }
                }
            },
            // Sort by election, then position, then vote count (descending)
            {
                $sort: {
                    "_id.electionId": 1,
                    "_id.positionId": 1,
                    "voteCount": -1
                }
            },
            // Group by election and position to add ranking
            {
                $group: {
                    _id: {
                        electionId: "$_id.electionId",
                        positionId: "$_id.positionId"
                    },
                    electionName: { $first: "$electionName" },
                    positionName: { $first: "$positionName" },
                    candidates: {
                        $push: {
                            symbolId: "$_id.symbolId",
                            partyName: "$partyName",
                            candidate: "$candidate",
                            voteCount: "$voteCount"
                        }
                    }
                }
            },
            // Add ranking to each candidate within the position group
            {
                $addFields: {
                    rankedCandidates: {
                        $map: {
                            input: "$candidates",
                            as: "cand",
                            in: {
                                $mergeObjects: [
                                    "$$cand",
                                    {
                                        rank: {
                                            $add: [
                                                { $indexOfArray: ["$candidates.voteCount", "$$cand.voteCount"] },
                                                1
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            // Unwind and reshape the output
            { $unwind: "$rankedCandidates" },
            // Final projection
            {
                $project: {
                    _id: 0,
                    electionId: "$_id.electionId",
                    electionName: 1,
                    positionId: "$_id.positionId",
                    positionName: 1,
                    symbolId: "$rankedCandidates.symbolId",
                    partyName: "$rankedCandidates.partyName",
                    candidate: "$rankedCandidates.candidate",
                    voteCount: "$rankedCandidates.voteCount",
                    rank: "$rankedCandidates.rank",
                    rankLabel: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$rankedCandidates.rank", 1] }, then: "1st" },
                                { case: { $eq: ["$rankedCandidates.rank", 2] }, then: "2nd" },
                                { case: { $eq: ["$rankedCandidates.rank", 3] }, then: "3rd" }
                            ],
                            default: { $concat: [{ $toString: "$rankedCandidates.rank" }, "th"] }
                        }
                    }
                }
            },
            // Final sort
            {
                $sort: {
                    "electionId": 1,
                    "positionId": 1,
                    "rank": 1
                }
            }
        ]);

        const totalVotes = results.reduce((sum, party) => sum + party.voteCount, 0);

        // 3. Format the data as required
        const electionResults = results.map((party, index) => {

            const candidateName = party.candidate
                ? `${party.candidate.firstName} ${party.candidate.lastName}`
                : "Unknown Candidate";

            return {
                id: index + 1,
                party: party.partyName,
                election: party.electionName,
                candidate: candidateName,
                position: party.positionName,
                Rank: party.rankLabel,
                votes: party.voteCount.toLocaleString(),
                percentage: totalVotes > 0
                    ? `${Math.round((party.voteCount / totalVotes) * 100)}%`
                    : "0%"
            };
        });

        return electionResults;
    }


    async getVerticalBarChart(orgId) {
        const currentDate = new Date();
        let query = {};
        let electionQuery = {}
        if (orgId) {
            query.orgId = orgId;
            electionQuery.orgId = orgId;
        }

        electionQuery.endedAt = { $lt: currentDate }

        const positions = await AssignElectionPosition.find(query).lean()
        const elections = await Election.find(electionQuery).lean()
        const votes = await Vote.find(query).lean()

        const chartData = this.generateChartData(elections, positions, votes);
        return chartData
    }

    // generateChartData(elections, positions, votes) {
    //     // Get all unique position names across all elections
    //     const allPositionNames = [...new Set(positions.map(pos => pos.position))];
    //     console.log(allPositionNames)
    //     // Create datasets for each election
    //     const datasets = elections.map(election => {
    //         // Initialize vote counts with zeros for all positions
    //         const voteCounts = new Array(allPositionNames.length).fill(0);

    //         // Count votes for each position in this election
    //         votes.forEach(vote => {
    //             if (String(vote.electionId) === String(election._id)) {
    //                 const position = positions.find(p =>
    //                     String(p._id) === String(vote.positionId) || // if vote has direct position reference
    //                     String(p.electionId) === String(vote.electionId) // or other linking logic
    //                 );
    //                 if (position) {
    //                     const positionIndex = allPositionNames.indexOf(position.position);
    //                     if (positionIndex !== -1) {
    //                         voteCounts[positionIndex] += 1;
    //                     }
    //                 }
    //             }
    //         });

    //         return {
    //             label: election.title,
    //             data: voteCounts,
    //             backgroundColor: this.getRandomColor(),
    //         };
    //     });

    //     return {
    //         labels: allPositionNames,
    //         datasets: datasets,
    //     };
    // }

    // Helper function to generate random colors


    generateChartData(elections, positions, votes) {
        // Get all unique position names across all elections
        const allPositionNames = [...new Set(positions.map(pos => pos.position))];

        // Create datasets for each election
        const datasets = elections.map(election => {
            // Initialize vote counts with zeros for all positions
            const voteCounts = new Array(allPositionNames.length).fill(0);

            // Count votes for each position in this election
            votes.forEach(vote => {
                if (String(vote.electionId) === String(election._id)) {
                    const position = positions.find(p =>
                        String(p._id) === String(vote.positionId)
                    );
                    if (position) {
                        const positionIndex = allPositionNames.indexOf(position.position);
                        if (positionIndex !== -1) {
                            voteCounts[positionIndex] += 1;
                        }
                    }
                }
            });
            return {
                label: election.title,
                data: voteCounts,
                backgroundColor: this.getRandomColor(),
            };
        });

        return {
            labels: allPositionNames,
            datasets: datasets,
        };
    }

    getRandomColor() {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        return colors[Math.floor(Math.random() * colors.length)];
    }


}

module.exports = {
    DashboardService: new DashboardService()
}


