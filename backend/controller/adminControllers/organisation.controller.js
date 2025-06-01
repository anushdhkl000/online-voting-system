const { OrganisationService } = require("../../service/adminServices/organisation.service")

class OrganisationController {
    async addOrganisation(req, res) {
        await OrganisationService.addOrganisation({ ...req.body })

        return res.status(200).json({
            message: "Organisation added successfully",
            success: true,
            error: false
        })
    }

    async updateOrganisation(req, res) {
        await OrganisationService.updateOrganisation({ ...req.body, organisationId: req.params.organisationId })

        return res.status(200).json({
            message: "Organisation updated successfully",
            success: true,
            error: false
        })
    }

    async deleteOrganisation(req, res) {
        await OrganisationService.deleteOrganisation({ ...req.body, organisationId: req.params.organisationId })

        return res.status(200).json({
            message: "Organisation deleted successfully",
            success: true,
            error: false
        })
    }

    async getAllOrganisation(req, res) {
        const response = await OrganisationService.getAllOrganisation({ ...req.query })

        return res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async viewOrganisation(req, res) {
        const response = await OrganisationService.viewOrganisations()

        return res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }
}

module.exports = {
    OrganisationController: new OrganisationController()
}