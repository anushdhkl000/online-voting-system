const moment = require("moment-timezone")
const AppError = require("../../utils/AppError")
const Election = require("../../model/adminModel/election.model")
const User = require("../../model/authModal/auth.model")
const AssignElectionPosition = require("../../model/adminModel/assignElectionPosition.model")

class ElectionService {
    async createElection(filters) {
        try {
            const { title, startDate, endDate, timeZone } = filters

            const startedAt = moment(startDate).utc().format()
            const endedAt = moment(endDate).utc().format()
            const processedTitle = title.trim()

            const hasUser = await User.findOne({ _id: filters.userId })

            if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
                throw new AppError("User does not belong to any organisation", 400)
            }

            let election = new Election({
                title: processedTitle,
                startedAt,
                endedAt,
                timeZone,
                orgId: hasUser.orgId || null
            })

            election = await election.save()

            if (!election) {
                throw new AppError("Election not created", 400)
            }
        } catch (error) {
            console.log(error)
        }

    }

    async viewElection(filters) {

        const { page = 1, pageSize = 10 } = filters;
        const searchTerm = filters.search || '';

        const hasUser = await User.findOne({ _id: filters.userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId
        // Calculate the number of documents to skip
        const skip = (page - 1) * pageSize;

        const query = {};
        if (searchTerm) {
            query.title = { $regex: searchTerm, $options: 'i' };
        }

        if (orgId) {
            query.orgId = orgId
        }

        const elections = await Election.aggregate([
            { $match: query },
            { $skip: skip },
            { $limit: Number(pageSize) },

            // Lookup all candidates in each election
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "electionId",
                    as: "candidates"
                }
            },
            {
                $addFields: {
                    candidateCount: { $size: "$candidates" } // Count candidates
                }
            },

            {
                $project: {
                    candidates: 0
                }
            }
        ]);

        if (!elections || elections.length === 0) {
            return {
                results: [],
                total: 0
            }
        }

        // Get the total number of elections (for pagination metadata)
        const totalElections = await Election.countDocuments(query);

        return {
            results: elections,
            total: totalElections
        }
    }

    async updateElection(filters) {
        const { title, startDate, endDate, timeZone } = filters

        const startedAt = moment(startDate).utc().format()
        const endedAt = moment(endDate).utc().format()
        const processedTitle = title.trim()

        let election = await Election.findOneAndUpdate({ _id: filters.id }, {
            title: processedTitle,
            startedAt,
            endedAt,
            timeZone
        })

        if (!election) {
            throw new AppError("Election not updated", 400)
        }
        return true
    }

    async deleteElection(filters) {
        const { id } = filters
        const election = await Election.findOneAndDelete({ _id: id })
        if (!election) {
            throw new AppError("Election not deleted", 400)
        }
        return true
    }

    async assignPosition(filters) {
        const { electionId, positions, action = "add" } = filters
        if (action === "update") {
            await this.updateAssignPosition(filters)
        } else {
            const election = await Election.findOne({ _id: electionId })

            if (!election) {
                throw new AppError("Election not found", 400)
            }

            for (const position of positions) {
                const hasAssignElectionPosition = await AssignElectionPosition.findOne({ electionId, position: position.title })

                if (!hasAssignElectionPosition) {
                    let assignElectionPosition = new AssignElectionPosition({
                        electionId,
                        position: position.title,
                        contenders: position.contenders,
                        elected: position.elected,
                        orgId: election?.orgId
                    })

                    assignElectionPosition = await assignElectionPosition.save()
                } else {
                    throw new AppError("Position already assigned", 400)
                }
            }
            return true
        }
    }

    async updateAssignPosition(filters) {
        const { electionId, positions } = filters;

        const election = await Election.findOne({ _id: electionId });
        if (!election) {
            throw new AppError("Election not found", 400);
        }

        // Get all existing positions for this election
        const existingPositions = await AssignElectionPosition.find({ electionId });

        // Extract IDs from the incoming positions (if they exist)
        const incomingPositionIds = positions
            .map(pos => pos.id)
            .filter(id => id); // Remove undefined/null

        // Find positions that exist in DB but are not in the incoming request (to delete them)
        const positionsToDelete = existingPositions.filter(
            pos => !incomingPositionIds.includes(pos._id.toString())
        );

        // Delete obsolete positions
        if (positionsToDelete.length > 0) {
            await AssignElectionPosition.deleteMany({
                _id: { $in: positionsToDelete.map(pos => pos._id) }
            });
        }

        // Update or create positions
        for (const position of positions) {
            if (typeof position.id === 'string') {
                if (position.id) {
                    const existingPosition = await AssignElectionPosition.findOne({
                        electionId,
                        _id: position.id
                    });

                    // Update existing position
                    existingPosition.contenders = position.contenders;
                    existingPosition.elected = position.elected;
                    await existingPosition.save();
                }
            } else {
                if (typeof position.id === 'number') {
                    let assignElectionPosition = new AssignElectionPosition({
                        electionId,
                        position: position.title,
                        contenders: position.contenders,
                        elected: position.elected,
                        orgId: election?.orgId
                    });

                    assignElectionPosition = await assignElectionPosition.save();
                }
            }
        }

        return true;
    }

    async getElectionPositions(filters) {
        const { electionId, userId } = filters
        const election = await Election.findOne({ _id: electionId })

        if (!election) {
            throw new AppError("Election not found", 400)
        }

        const assignElectionPosition = await AssignElectionPosition.find({ electionId })

        return assignElectionPosition
    }
}
module.exports = {
    ElectionService: new ElectionService()
}