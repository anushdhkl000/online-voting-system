const { GroupService } = require("../../service/adminServices/group.service")

class GroupController {
    async createGroup(req, res) {
        await GroupService.createGroup({
            ...req.body,
            ...req.files,
            userId: req.userId
        })
        return res.status(200).json({
            message: "Group created successfully",
            success: true,
            error: false
        })
    }

    async viewGroup(req, res) {
        const { results, total } = await GroupService.viewGroup({
            ...req.query,
            userId: req.userId
        })
        return res.status(200).json({
            message: "Group List",
            success: true,
            error: false,
            data: results,
            total
        })
    }

    async updateGroup(req, res) {
        await GroupService.updateGroup({
            ...req.body,
            ...req.params,
            ...req.files
        })
        return res.status(200).json({
            message: "Group updated successfully",
            success: true,
            error: false
        })
    }

    async deleteGroup(req, res) {
        await GroupService.deleteGroup({
            ...req.params
        })
        return res.status(200).json({
            message: "Group deleted successfully",
            success: true,
            error: false
        })
    }

    async assignGroup(req, res) {
        await GroupService.assignGroup({
            ...req.body
        })
        return res.status(200).json({
            message: "Group assigned successfully",
            success: true,
            error: false
        })
    }

    async getAssignCandidateGroup(req, res) {
        const results = await GroupService.getAssignCandidateGroup({
            ...req.params
        })

        return res.status(200).json({
            message: "Group List",
            success: true,
            error: false,
            data: results
        })
    }
}

module.exports = {
    GroupController: new GroupController()
}