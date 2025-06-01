const Organisation = require("../../model/authModal/organisationModel")
const User = require("../../model/authModal/auth.model")
const AppError = require("../../utils/AppError")

class OrganisationService {
    async addOrganisation(filters) {

        const hasOrganisation = await Organisation.find({ organisation: filters.organisation })

        if (hasOrganisation.length > 0) {
            throw new AppError("Organisation already added", 400)
        }

        const uniqueNumber = this.generateUniqueNumber("ORG-")

        let organisation = new Organisation({
            organisation: filters.organisation,
            organisationId: uniqueNumber
        })
        organisation = await organisation.save()

        if (!organisation) {
            throw new AppError("Organisation not added", 400)
        }
        return true
    }

    async updateOrganisation(filters) {
        const { organisationId } = filters

        const hasOrganisation = await Organisation.find({ organisation: filters.organisation })

        if (hasOrganisation.length > 0) {
            throw new AppError("Organisation already used", 400)
        }

        const organisation = await Organisation.findOneAndUpdate({ _id: organisationId }, { organisation: filters.organisation }, { new: true })

        if (!organisation) {
            throw new AppError("Organisation not updated", 400)
        }
        return true
    }

    async deleteOrganisation(filters) {
        const { organisationId } = filters

        const isUsed = await User.findOne({ orgId: organisationId })

        if (isUsed) {
            throw new AppError("Organisation is used by user can not be deleted.", 400)
        }

        const organisation = await Organisation.findOneAndDelete({ _id: organisationId })

        if (!organisation) {
            throw new AppError("Organisation not deleted", 400)
        }
        return true
    }

    async getAllOrganisation(filters) {
        const { page = 1, pageSize = 10 } = filters;
        const skip = (page - 1) * pageSize;
        const searchTerm = filters.search || '';
        const query = {};
        if (searchTerm) {
            query.organisation = { $regex: searchTerm, $options: 'i' };
        }

        const results = await Organisation.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ _id: -1 })

        const total = await Organisation.countDocuments(query)
        if (!results) {
            throw new AppError("Organisation not found", 404)
        }
        return {
            results,
            total
        }
    }

    generateUniqueNumber(prefix) {
        const time = Date.now().toString().slice(-2);
        const randomNumber = String(Math.random() * 1000000).slice(0, 1);
        return prefix + time + randomNumber;
    }

    async viewOrganisations() {

        const results = await Organisation.find().select('_id organisation')
            .sort({ _id: -1 })

        if (!results) {
            return []
        }
        return results
    }
}

module.exports = {
    OrganisationService: new OrganisationService()
}