import { customJoi } from "../../../../helpers/joi";

export const candidateSchema = customJoi.object({
    userId: customJoi.string().required().messages({
        "any.required": "Title is required.",
        "string.empty": "Title can not be empty.",
    }),
    description: customJoi.date().required().messages({
        "any.required": "Start date is required.",
        "date.base": "Start date must be a valid date.",
    })

})