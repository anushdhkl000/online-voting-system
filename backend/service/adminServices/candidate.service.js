const Candidate = require("../../model/adminModel/candidate.model")


class candidateService {
    async createCandidate(filters) {
        const {
            firstName,
            lastName,
            candidateID,
            gender,
            age,
            descriptions,
            candidateProfile,
            document,
            members,
            candidateType,
            groupName
        } = filters

        const data = {

        }
        let candidate
        if (candidateType === "group") {
            const membersArray = members ? JSON.parse(members) : []
            candidate = new Candidate({
                groupName,
                candidateID,
                descriptions,
                members: membersArray,
                candidateProfile: candidateProfile[0].filename,
                document: document[0].filename
            })
        } else {
            candidate = new Candidate({
                firstName,
                lastName,
                candidateID,
                gender,
                age,
                descriptions,
                candidateProfile: candidateProfile[0].filename,
                document: document[0].filename
            })
        }

        candidate = await candidate.save()

        if (!candidate) {
            throw new AppError("Candidate not created", 400)
        }

    }

    async viewCandidate(filters) {
        const { page = 1, pageSize = 10 } = filters;
        const skip = (page - 1) * pageSize;
        const searchTerm = filters.search || '';

        const query = {};
        if (searchTerm) {
            query.$or = [
                { firstName: { $regex: searchTerm, $options: 'i' } },
                { lastName: { $regex: searchTerm, $options: 'i' } },
                { gender: { $regex: searchTerm, $options: 'i' } },
                { candidateID: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const results = await Candidate.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 })
        const total = await Candidate.countDocuments(query)
        if (!results) {
            throw new AppError("Candidate not found", 404)
        }
        const hasNextPage = total > page * pageSize
        return {
            results,
            total,
            hasNextPage,
            currentPage: Number(page)
        }
    }

    async updateCandidate(filters) {
        const {
            firstName,
            lastName,
            gender,
            age,
            descriptions
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