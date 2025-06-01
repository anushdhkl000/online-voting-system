const Election = require("../../model/adminModel/election.model")
const Candidate = require("../../model/adminModel/candidate.model")
const AssignCandidateSymbol = require("../../model/adminModel/assignCandidateGroup.model")
const Vote = require("../../model/userModel/vote.model")
const UserVoteElection = require("../../model/userModel/userVoteElection.js")
const { votingTokenId, verifyToken } = require("../../utils/accessToken")
const { envConfig } = require("../../config/envConfig.js")
const User = require("../../model/authModal/auth.model")
const { sendLiveMail } = require("../../utils/sendEmail.js")
const config = envConfig()
const AssignElectionPosition = require("../../model/adminModel/assignElectionPosition.model")
const UserVote = require("../../model/userModel/userVoteSymbol.js")

class UserService {

    async getAll(filters) {
        const { userId } = filters
        let ongoingElections
        let upcomingElections

        if (userId) {
            const hasUser = await User.findOne({ _id: userId })

            const orgId = hasUser?.orgId

            ongoingElections = await this.ongoingElections(orgId)
            upcomingElections = await this.upCommingElections(orgId)

        } else {
            ongoingElections = await this.ongoingElections()
            upcomingElections = await this.upCommingElections()
        }
        return { ongoingElections, upcomingElections }

    }

    async ongoingElections(orgId) {
        const currentDate = new Date();
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }
        query.startedAt = { $lte: currentDate } // Election started before or at current time
        query.endedAt = { $gte: currentDate }
        // const election = await Election.find({
        //     startedAt: { $lte: currentDate }, // Election started before or at current time
        //     endedAt: { $gte: currentDate }
        // })
        const election = await Election.find(query)
            .limit(4)
            .sort({ createdAt: -1 })

        return election
    }

    async upCommingElections(orgId) {
        const currentDate = new Date();
        let query = {}
        if (orgId) {
            query.orgId = orgId
        }
        query.startedAt = { $gte: currentDate } // Election started after current time

        // const election = await Election.find({
        //     startedAt: { $gte: currentDate }, // Election started after current time
        // })
        const election = await Election.find(query)
            .limit(4)
            .sort({ createdAt: -1 })

        return election
    }

    async getAllElection({ userId }) {
        let ongoingElections
        let upcomingElections
        if (userId) {
            const hasUser = await User.findOne({ _id: userId })

            const orgId = hasUser?.orgId

            ongoingElections = await this.ongoingElectionsWithoutlimit({ orgId })
            upcomingElections = await this.upCommingElectionsWithoutlimit({ orgId })

        } else {
            ongoingElections = await this.ongoingElectionsWithoutlimit()
            upcomingElections = await this.upCommingElectionsWithoutlimit()
        }

        ongoingElections = ongoingElections.map((election) => {
            const electionObj = election.toObject(); // Convert Mongoose doc to plain object
            return {
                ...electionObj,
                status: "ongoing",
                hasVote: false
            };
        });


        if (userId) {
            const hasVote = await UserVoteElection.find({ userId })

            if (hasVote.length > 0 && hasVote) {
                // Create a Set of electionIds that have votes for faster lookup
                const votedElectionIds = new Set(hasVote.map(vote => vote?.electionId.toString()));
                // Add hasVote field to each election
                ongoingElections = ongoingElections.map(election => ({
                    ...election,
                    hasVote: votedElectionIds.has(election._id.toString())
                }));
            }
        }



        upcomingElections = upcomingElections.map((election) => {
            const electionObj = election.toObject();
            return {
                ...electionObj,
                status: "upcoming"
            };
        });

        return { ongoingElections, upcomingElections }

    }

    async ongoingElectionsWithoutlimit(filters) {
        const currentDate = new Date();
        let query = {}
        if (filters?.orgId) {
            query.orgId = filters?.orgId
        }
        query.startedAt = { $lte: currentDate }
        query.endedAt = { $gte: currentDate }

        // const election = await Election.find({
        //     startedAt: { $lte: currentDate },
        //     endedAt: { $gte: currentDate },

        // })
        const election = await Election.find(query)
            .sort({ createdAt: -1 })

        // const hasVote = await UserVoteElection.find({ userId })

        return election
    }

    async upCommingElectionsWithoutlimit(filters) {
        const currentDate = new Date();
        let query = {}
        if (filters?.orgId) {
            query.orgId = filters?.orgId
        }
        query.startedAt = { $gte: currentDate } // Election started after current time

        // const election = await Election.find({
        //     startedAt: { $gte: currentDate }, // Election started after current time
        // })
        const election = await Election.find(query)
            .sort({ createdAt: -1 })

        return election
    }

    async getCandidateByElectionId({ electionId, positionId }) {
        const election = await Election.findOne({ _id: electionId })

        if (!election) {
            return []
        }
        const candidate = await Candidate.find({ electionId, positionId })
        const candidateIds = candidate.map((candidate) => candidate._id)

        const Symbols = await AssignCandidateSymbol.find({
            candidateId: { $in: candidateIds }
        }).populate('groupId', 'symbol name _id')
            .populate('candidateId', 'descriptions candidateID _id')

        return Symbols

    }

    async generateVotingToken(filters) {
        const { electionId, symbolId } = filters
        // generatting voting token
        const token = await votingTokenId({ electionId, symbolId })

        return token

    }

    async castingVote(data) {
        const { electionId, symbolId, userId, token, positionId } = data
        const currentDate = new Date();

        const hasUser = await User.findOne({ _id: userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId

        const hasVotedSyambol = await Vote.find({ electionId, symbolId, positionId })

        // check if user already voted
        const hasVoted = await UserVoteElection.find({ electionId, positionId, userId })

        // check wheather user already voted for this symbol
        const hasVotedUser = await UserVote.find({ symbolId, userId })

        if (hasVotedSyambol.length > 0 && hasVotedUser.length > 0) {
            throw new Error("You already voted for this Candidate")
        }

        // check contender for voting 
        const hasPositionContenders = await AssignElectionPosition.findOne({ electionId, _id: positionId }).select('elected -_id').lean()

        if (hasPositionContenders.elected <= hasVoted.length) {
            throw new Error("You already voted for this election")
        }

        const election = await Election.findOne({
            _id: electionId,
            startedAt: { $lte: currentDate },
            endedAt: { $gte: currentDate }
        })

        if (!election) {
            throw new Error("Election was either already ended or not found")
        }
        // checking if voting token is valid
        const key = config.VOTING_TOKEN_SECRET
        const decodedToken = await verifyToken({ token, key })

        if (decodedToken.error) {
            throw new Error("Voting token is already expired you can not vote for this election")
        }

        const hasPosition = await AssignCandidateSymbol.findOne({ groupId: symbolId }).populate('candidateId', 'positionId')

        let vote = new Vote({
            electionId,
            symbolId,
            token,
            orgId,
            positionId: hasPosition.candidateId.positionId
        })
        vote = await vote.save()
        if (!vote) {
            throw new Error("Vote not created")
        }

        // after vote casting user will be added to user_vote_election table
        let userVoteElection = new UserVoteElection({
            electionId,
            positionId,
            userId,
            orgId
        })

        userVoteElection = await userVoteElection.save()

        if (!userVoteElection) {
            // delete vote 
            await Vote.deleteOne({ _id: vote._id })
            throw new Error("User vote election not created")
        }

        // after that add user vote 
        let userVote = new UserVote({
            symbolId: symbolId,
            userId: userId
        })
        userVote = await userVote.save()
        if (!userVote) {
            // delete vote 
            await Vote.deleteOne({ _id: vote._id })
            throw new Error("User vote not created")
        }

        // send notification to user
        await sendLiveMail({
            from: 'noreply@gmail.com',
            to: hasUser.email,
            subject: 'Thank you for voting',
            html:
                `
            <html>
                    <head>
                        <style>
                            body {
                                width: 50%;
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .header {
                                background-color: #1a5a99;
                                color: white;
                                padding: 20px;
                                text-align: center;
                                border-radius: 5px 5px 0 0;
                            }
                            .content {
                                padding: 20px;
                                background-color: #f9f9f9;
                                border-left: 1px solid #dddddd;
                                border-right: 1px solid #dddddd;
                            }
                            .footer {
                                padding: 15px;
                                text-align: center;
                                font-size: 12px;
                                color: #777777;
                                background-color: #eeeeee;
                                border-radius: 0 0 5px 5px;
                                border-left: 1px solid #dddddd;
                                border-right: 1px solid #dddddd;
                                border-bottom: 1px solid #dddddd;
                            }
                            .highlight {
                                background-color: #fffacd;
                                padding: 10px;
                                border-left: 3px solid #ffeb3b;
                                margin: 15px 0;
                                font-weight: bold;
                            }
                            .token {
                                font-family: monospace;
                                font-size: 18px;
                                letter-spacing: 1px;
                                color: #1a5a99;
                                font-weight: bold;
                            }
                            .button {
                                background-color: #1a5a99;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin: 10px 0;
                            }
                        </style>
                    </head>
                <body>
                    <div class="header">
                        <h1>Thank You for Voting!</h1>
                    </div>

                    <div class="content">
                    <p>Dear Voter,</p>

                    <p>
                        We sincerely appreciate your participation in the election process. This
                        email serves as confirmation that your vote has been successfully
                        recorded.
                    </p>

                    <div class="highlight">
                        <p>
                        Election: <strong style="color: #1a5a99">${election?.title || "Election"}</strong>
                        </p>
                        <p> Position: <strong style="color: #1a5a99">${election?.position || "Position"}</strong></p>
                        <p>
                        Your unique voting token: <span class="token">${token}</span>
                        </p>
                    </div>

                    <p>
                        Please keep this token for your records as it serves as proof of your
                        participation. This token can be used to verify your vote while
                        maintaining your anonymity in the process.
                    </p>

                    <p>
                        If you have any questions or concerns about the voting process, please
                        don't hesitate to contact our support team.
                    </p>

                    <p>Best regards,</p>
                    <p><strong>The Online Voting Election Committee</strong></p>
                    </div>

                    <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>&copy; 2025 Online Voting System. All rights reserved.</p>
                    </div>
                </body>
            </html>
        `
        })


        return true
    }

    async getAllElectionResults(filters) {
        const { userId } = filters
        const hasUser = await User.findOne({ _id: userId })
        const orgId = hasUser?.orgId
        if (orgId) {
            return await this.getElectionResults(orgId)
        } else {
            return []
        }

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

    async trackVote(filters) {
        const { token } = filters

        const results = await Vote.findOne({ token }).select('-_id symbolId')
        if (results) {
            const candidateResults = await AssignCandidateSymbol.findOne({ groupId: results?.symbolId }).select('-_id candidateId')
            if (candidateResults) {
                const candidate = await Candidate.findOne({ _id: candidateResults?.candidateId }).select('firstName lastName')
                return candidate
            } else {
                return null
            }
        } else {
            return null
        }
    }
}

module.exports = {
    UserService: new UserService()
}