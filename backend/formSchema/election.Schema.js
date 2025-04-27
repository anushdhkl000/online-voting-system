const { customJoi } = require("../utils/customJoi");

const electionSchema = customJoi.object({
    title: customJoi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title is required"
    }),
    startDate: customJoi.date().required().messages({
        "any.required": "Start date is required",
        "string.empty": "Start date is required"
    }),
    endDate: customJoi.date().required().messages({
        "any.required": "End date is required",
        "string.empty": "End date is required"
    }),
    timeZone: customJoi.string().optional()
})

module.exports = {
    electionSchema
}