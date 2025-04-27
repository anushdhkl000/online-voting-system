import { customJoi } from "../../../helpers/joi";

export const addSecurityQuestionSchema = customJoi.object({
    title: customJoi.string().required().messages({
        "any.required": "Title is required.",
        "string.empty": "Title can not be empty.",
    }),
    startDate: customJoi.date().required().messages({
        "any.required": "Start date is required.",
        "date.base": "Start date must be a valid date.",
    }),
    endDate: customJoi.date().required().messages({
        "any.required": "End date is required.",
        "date.base": "End date must be a valid date.",
    }),
    timeZone: customJoi.string().required().messages({
        "any.required": "TimeZone is required.",
        "string.empty": "TimeZone can not be empty.",
    }),

})