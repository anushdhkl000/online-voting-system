import Joi from "joi";

export const customJoi = Joi.defaults((schema) =>
    schema.options({
        abortEarly: false,
        stripUnknown: true,
    })
)

export const makeRuleRequired = (x) => x.required();
export const makeRuleOptional = (x) => x.optional();