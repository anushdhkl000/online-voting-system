const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const authSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    apartment_suite: {
        type: String,
        required: true
    },
    Zip: {
        type: String,
        required: true,
    },
    Nationality: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    National_ID_Number: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    salt: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null,
    },

}, { timestamps: true })

authSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(8)
        const hash_password = await bcrypt.hash(this.password, salt)
        this.password = hash_password
        next()
    }
})

module.exports = mongoose.model("User", authSchema)