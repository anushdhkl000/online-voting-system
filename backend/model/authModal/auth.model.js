const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { ObjectId } = mongoose.Schema

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
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    unitNumber: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    suburb: {
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
    identityNumber: {
        type: String,
        required: false
    },
    identityDocument: {
        type: String,
        required: false
    },
    isVerifiedDetails: {
        type: Boolean,
        default: false
    },
    userTokenId: {
        type: String,
        required: false
    },
    orgId: {
        type: ObjectId,
        ref: 'organisation',
        required: false
    }



}, { timestamps: true })

authSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10)
        const hash_password = await bcrypt.hash(this.password, salt)
        this.password = hash_password
        next()
    }
})

module.exports = mongoose.model("User", authSchema)