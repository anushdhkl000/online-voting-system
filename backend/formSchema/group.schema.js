const { customJoi } = require("../utils/customJoi");

const assignCandidateGroupSchema = customJoi.object({
    candidateId: customJoi.string().required().messages({
        "any.required": "Candidate is required",
        "string.empty": "Candidate is required"
    }),
    groupId: customJoi.string().required().messages({
        "any.required": "Group is required",
        "string.empty": "Group is required"
    })
})

module.exports = {
    assignCandidateGroupSchema
}