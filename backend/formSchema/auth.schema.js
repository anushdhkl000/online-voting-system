const { customJoi } = require("../utils/customJoi");

const signUpSchema = customJoi.object({
    firstName: customJoi.string().required().messages({
        "any.required": "First name is required",
        "string.empty": "First name can not be empty"
    }),
    lastName: customJoi.string().required().messages({
        "any.required": "Last name is required",
        "string.empty": "Last name can not be empty"
    }),
    dob: customJoi.string().required().messages({
        "any.required": "Date of birth is required",
        "string.empty": "Date of birth can not be empty"
    }),
    phone: customJoi.string().required().messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number can not be empty"
    }),
    email: customJoi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email can not be empty",
        "string.email": "Invalid email"
    }),
    password: customJoi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password can not be empty"
    }),
    country: customJoi.string().required().messages({
        "any.required": "Country is required",
        "string.empty": "Country can not be empty"
    }),
    state: customJoi.string().required().messages({
        "any.required": "State is required",
        "string.empty": "State can not be empty"
    }),
    zip: customJoi.string().required().messages({
        "any.required": "Zip code is required",
        "string.empty": "Zip code can not be empty"
    }),
    unitNumber: customJoi.string().required().messages({
        "any.required": "Unit number is required",
        "string.empty": "Unit number can not be empty"
    }),
    street: customJoi.string().required().messages({
        "any.required": "Street address is required",
        "string.empty": "Street address can not be empty"
    }),
    suburb: customJoi.string().required().messages({
        "any.required": "Suburb is required",
        "string.empty": "Suburb can not be empty"
    }),
    confirmPassword: customJoi
        .string()
        .required()
        .valid(customJoi.ref('password'))
        .messages({
            "any.required": "Confirm password is required",
            "string.empty": "Confirm password can not be empty",
            "any.only": "Password and confirm password must match"
        })
})

const verifyEmailSchema = customJoi.object({
    token: customJoi.string().required().messages({
        "any.required": "Token is required",
        "string.empty": "Token can not be empty"
    })
})

const signInSchema = customJoi.object({
    email: customJoi.string().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email can not be empty"
    }),
    password: customJoi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password can not be empty"
    })
})

const voterSchema = customJoi.object({
    firstName: customJoi.string().required().messages({
        "any.required": "First name is required",
        "string.empty": "First name can not be empty"
    }),
    lastName: customJoi.string().required().messages({
        "any.required": "Last name is required",
        "string.empty": "Last name can not be empty"
    }),
    dob: customJoi.string().required().messages({
        "any.required": "Date of birth is required",
        "string.empty": "Date of birth can not be empty"
    }),
    phone: customJoi.string().required().messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number can not be empty"
    }),
    email: customJoi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email can not be empty",
        "string.email": "Invalid email"
    }),
    address: customJoi.string().required().messages({
        "any.required": "Address is required",
        "string.empty": "Address can not be empty"
    }),
    city: customJoi.string().required().messages({
        "any.required": "City is required",
        "string.empty": "City can not be empty"
    }),
    country: customJoi.string().required().messages({
        "any.required": "Country is required",
        "string.empty": "Country can not be empty"
    }),
    apartment_suite: customJoi.string().required().messages({
        "any.required": "Apartment or suite is required",
        "string.empty": "Apartment or suite can not be empty"
    }),
    Zip: customJoi.string().required().messages({
        "any.required": "Zip code is required",
        "string.empty": "Zip code can not be empty"
    }),
    Nationality: customJoi.string().required().messages({
        "any.required": "Nationality is required",
        "string.empty": "Nationality can not be empty"
    }),
    Gender: customJoi.string().required().messages({
        "any.required": "Gender is required",
        "string.empty": "Gender can not be empty"
    }),
    National_ID_Number: customJoi.string().required().messages({
        "any.required": "National ID number is required",
        "string.empty": "National ID number can not be empty"
    }),
    password: customJoi.string().required().messages({
        "any.required": "Password is required",
        "string.empty": "Password can not be empty"
    }),
    role: customJoi.string().required().messages({
        "any.required": "Role is required",
        "string.empty": "Role can not be empty"
    }),
    confirmPassword: customJoi
        .string()
        .required()
        .valid(customJoi.ref('password'))
        .messages({
            "any.required": "Confirm password is required",
            "string.empty": "Confirm password can not be empty",
            "any.only": "Password and confirm password must match"
        })
})

module.exports = {
    signUpSchema,
    verifyEmailSchema,
    signInSchema
}