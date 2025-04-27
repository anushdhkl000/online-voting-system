const validateFormSchema = function (schema, payloadPathKey = "body") {
    return async function (req, res, next) {
        const payload = payloadPathKey === "body" ? req.body : payloadPathKey === "params" ? req.params : req.query
        try {
            const validated = await schema.validateAsync(payload)
            req.body = validated
            next()
        } catch (error) {
            /** pass error to next */
            /** if validation error occur call the next with HTTP 422. Otherwise HTTP 500 */
            if (error.isJoi) {
                return res.status(400).json({
                    errors: error.details,
                    isFormValidationError: true,
                    message: "Invalid form data"
                })
            }
            throw error
        }
    }
}

module.exports = { validateFormSchema }