const { customJoi } = require("../utils/customJoi");

const candidateSchema = customJoi.object({
    firstName: customJoi.string().required().messages({
        "any.required": "First name is required",
        "string.empty": "First name can not be empty"
    }),
    lastName: customJoi.string().required().messages({
        "any.required": "Last name is required",
        "string.empty": "Last name can not be empty"
    }),
    candidateID: customJoi.string().required().messages({
        "any.required": "Candidate ID is required",
        "string.empty": "Candidate ID can not be empty"
    }),
    gender: customJoi.string().allow("male", "female", "other").required().messages({
        "any.required": "Gender is required",
        "string.empty": "Gender can not be empty"
    }),
    age: customJoi.string().required().messages({
        "any.required": "Age is required",
        "string.empty": "Age can not be empty"
    }),
    descriptions: customJoi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description can not be empty"
    }),
    candidateType: customJoi.string()
})

const groupCandidateSchema = customJoi.object({
    groupName: customJoi.string().required().messages({
        "any.required": "Group name is required",
        "string.empty": "Group name can not be empty"
    }),
    members: customJoi.string().required().custom((value, helpers) => {
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
                return helpers.error('any.invalid');
            }

            // Validate each member object
            const memberSchema = customJoi.object({
                firstName: customJoi.string().required(),
                age: customJoi.string().required()
            });

            for (const member of parsed) {
                const { error } = memberSchema.validate(member);
                if (error) {
                    return helpers.error('any.invalid');
                }
            }

            return value;
        } catch (e) {
            return helpers.error('any.invalid');
        }
    }).messages({
        "any.required": "Members are required",
        "string.empty": "Members can not be empty",
        "any.invalid": "Members must be a valid JSON array of objects with firstName and age"
    }),
    descriptions: customJoi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description can not be empty"
    }),
    candidateID: customJoi.string().required().messages({
        "any.required": "Candidate ID is required",
        "string.empty": "Candidate ID can not be empty"
    }),
    candidateType: customJoi.string().valid('group').required().messages({
        "any.required": "Candidate type is required",
        "string.empty": "Candidate type can not be empty",
        "any.only": "Candidate type must be 'group'"
    }),
    candidateType: customJoi.string()
});


module.exports = {
    candidateSchema,
    groupCandidateSchema
}