const assignCandidateGroupModel = require("../../model/adminModel/assignCandidateGroup.model")
const Group = require("../../model/adminModel/group.model")
const Candidate = require("../../model/adminModel/candidate.model")
const User = require("../../model/authModal/auth.model")
const AppError = require("../../utils/AppError")

class GroupService {

    async createGroup(filters) {
        if (!filters?.symbol) {
            throw new AppError("Group symbol is required", 400)
        }

        const hasUser = await User.findOne({ _id: filters.userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId

        const hasGroup = await Group.findOne({ name: filters.name, orgId: orgId })

        if (hasGroup) {
            throw new AppError("Group already exists", 400)
        }

        let group = new Group({
            symbol: filters.symbol[0].filename,
            name: filters.name,
            orgId
        })
        group = await group.save()
        if (!group) {
            throw new AppError("Group not created", 400)
        }
    }

    async viewGroup(filters) {
        const { page = 1, pageSize = 10 } = filters;
        const skip = (page - 1) * pageSize;
        const searchTerm = filters.search || '';

        const hasUser = await User.findOne({ _id: filters.userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId


        const query = {};
        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' };
        }

        if (orgId) {
            query.orgId = orgId
        }

        const results = await Group.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1, _id: 1 })

        const total = await Group.countDocuments(query)
        if (!results) {
            throw new AppError("Group not found", 404)
        }
        return {
            results,
            total
        }
    }

    async updateGroup(filters) {
        let data = {}

        if (filters?.symbol) {
            data.symbol = filters?.symbol[0]?.filename
        }

        if (filters.name) {
            data.name = filters.name
        }

        let group = await Group.findOneAndUpdate({ _id: filters.id }, data)

        if (!group) {
            throw new AppError("Group not updated", 400)
        }
        return true
    }

    async deleteGroup(filters) {
        const assignGroup = await assignCandidateGroupModel.findOne({ groupId: filters.id })

        if (assignGroup) {
            // update candidate assign group
            await Candidate.findByIdAndUpdate(assignGroup.candidateId, { assignGroup: false }, { new: true })
        }

        const group = await Group.findOneAndDelete({ _id: filters.id })

        await assignCandidateGroupModel.findOneAndDelete({ groupId: filters.id })
        if (!group) {
            throw new AppError("Group not deleted", 400)
        }
        return true
    }

    async assignGroup(filters) {
        const { candidateId, groupId } = filters
        const hasAssignCandidateGroup = await assignCandidateGroupModel.findOne({ candidateId })
        const hasAssignGroup = await assignCandidateGroupModel.findOne({ groupId })
        if (hasAssignCandidateGroup || hasAssignGroup) {
            throw new AppError("Candidate already assigned to this group", 400)
        }

        /** update candidate assignGroup field */
        await Candidate.updateOne({ _id: candidateId }, { assignGroup: true })
        let assignGroup = new assignCandidateGroupModel({
            candidateId,
            groupId
        })

        assignGroup = await assignGroup.save()

        if (!assignGroup) {
            throw new AppError("Group not assigned", 400)
        }
        return true
    }

    async getAssignCandidateGroup(filters) {
        const { groupId } = filters

        const results = await assignCandidateGroupModel.findOne({ groupId })

        return results
    }

}

module.exports = {
    GroupService: new GroupService()
}