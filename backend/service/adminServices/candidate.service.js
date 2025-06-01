const Candidate = require("../../model/adminModel/candidate.model")
const User = require("../../model/authModal/auth.model")
const ElectionPosition = require("../../model/adminModel/assignElectionPosition.model")
const AppError = require("../../utils/AppError")


class candidateService {
    async createCandidate(filters) {
        const {
            userId,
            electionId,
            candidateID,
            gender,
            descriptions,
            candidateProfile,
            document,
            members,
            candidateType,
            groupName,
            group = false,
            userIds,
            positionId,
        } = filters

        const hasUser = await User.findOne({ _id: userIds })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId

        let candidate
        if (candidateType === "group") {

            const membersArray = members ? JSON.parse(members) : []

            const usersMap = []
            for (const row of membersArray) {
                const users = await User.findOne({ userTokenId: row.userId }).select('firstName lastName age')
                usersMap.push(users)
            }
            if (usersMap.includes(null)) {
                throw new AppError("All members must be valid", 400)
            }

            candidate = new Candidate({
                groupName,
                electionId,
                candidateID,
                descriptions,
                members: usersMap,
                candidateProfile: candidateProfile[0].filename,
                document: document[0].filename,
                group,
                userId,
                orgId,
                positionId
            })
        } else {
            const user = await User.findOne({ userTokenId: userId }).select('firstName lastName age')

            if (!user) {
                throw new AppError("User not found", 400)
            }

            candidate = new Candidate({
                firstName: user.firstName,
                lastName: user.lastName,
                electionId,
                candidateID,
                gender,
                age: user.age,
                descriptions,
                candidateProfile: candidateProfile[0].filename,
                document: document[0].filename,
                userId,
                orgId,
                positionId
            })
        }

        candidate = await candidate.save()

        if (!candidate) {
            throw new AppError("Candidate not created", 400)
        }

    }

    async viewCandidate(filters) {
        const { page = 1, pageSize = 10, type, electionId } = filters;
        const skip = (page - 1) * pageSize;
        const searchTerm = filters.search || '';

        const hasUser = await User.findOne({ _id: filters.userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId


        let query = {}

        if (type) {
            query.group = type === "group";
        }

        if (electionId) {
            query.electionId = electionId;
        }

        if (searchTerm) {
            query.$or = [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { gender: { $regex: searchTerm, $options: 'i' } },
                {
                    candidateID: { $regex: searchTerm, $options: 'i' }
                },
                { groupName: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        if (hasUser.orgId) {
            query.$and = [
                orgId ? { orgId: orgId } : {}
            ]
        }

        const results = await Candidate.find(query).populate('positionId', 'position -_id').populate('electionId', "title")
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })

        const total = await Candidate.countDocuments(query)
        if (!results) {
            throw new AppError("Candidate not found", 404)
        }
        const hasNextPage = total > page * pageSize
        // getting election position

        const electionPosition = await ElectionPosition.find({ electionId }).lean()
        const candidates = await Candidate.find({ electionId }).lean()

        // Add isBlocked to each position
        const positionsWithBlockedStatus = electionPosition.map(position => {
            // Count candidates for this position
            const candidateCount = candidates.filter(candidate =>
                candidate.electionId.equals(position.electionId) &&
                candidate.positionId.equals(position._id)
            ).length;

            // Determine if blocked
            const isBlocked = candidateCount >= position.contenders;

            // Return new position object with isBlocked field
            return {
                ...position,
                isBlocked
            }
        })

        return {
            results,
            total,
            hasNextPage,
            currentPage: Number(page),
            electionPosition: positionsWithBlockedStatus
        }
    }

    async updateCandidate(filters) {
        const {
            firstName,
            lastName,
            gender,
            age,
            descriptions,
            groupName,
            members

        } = filters
        const data = {
            firstName,
            lastName,
            gender,
            age,
            descriptions,
        }

        if (filters?.candidateProfile) {
            data.candidateProfile = filters?.candidateProfile[0].filename
        }

        if (filters?.document) {
            data.document = filters?.document[0].filename
        }
        if (groupName) {
            data.groupName = groupName
        }

        if (members) {
            const membersArray = members ? JSON.parse(members) : []
            data.members = membersArray
        }

        let candidate = await Candidate.findOneAndUpdate({ _id: filters.id }, data)

        if (!candidate) {
            throw new AppError("Candidate not updated", 400)
        }
        return true
    }

    async deleteCandidate(filters) {
        const candidate = await Candidate.findOneAndDelete({ _id: filters.id })
        if (!candidate) {
            throw new AppError("Candidate not deleted", 400)
        }
        return true
    }
}

module.exports = {
    CandidateService: new candidateService()
}