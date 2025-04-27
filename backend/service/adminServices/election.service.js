const moment = require("moment-timezone")
const AppError = require("../../utils/AppError")
const Election = require("../../model/adminModel/election.model")

class ElectionService {
    async createElection(filters) {
        const { title, startDate, endDate, timeZone } = filters

        const startedAt = moment(startDate).utc().format()
        const endedAt = moment(endDate).utc().format()
        const processedTitle = title.trim()

        let election = new Election({
            title: processedTitle,
            startedAt,
            endedAt,
            timeZone
        })

        election = await election.save()

        if (!election) {
            throw new AppError("Election not created", 400)
        }
    }

    async viewElection(filters) {

        const { page = 1, pageSize = 10 } = filters;
        const searchTerm = filters.search || '';

        // Calculate the number of documents to skip
        const skip = (page - 1) * pageSize;

        const query = {};
        if (searchTerm) {
            query.title = { $regex: searchTerm, $options: 'i' };
        }

        // Fetch elections with pagination
        const elections = await Election.find(query)
            .skip(skip)
            .limit(pageSize);

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
}
module.exports = {
    ElectionService: new ElectionService()
}