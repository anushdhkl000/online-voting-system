const Joi = require("joi")

const customJoi = Joi.defaults((schema) =>
    schema.options({
        abortEarly: false,
        stripUnknown: true,
    })
)

module.exports = { customJoi }

