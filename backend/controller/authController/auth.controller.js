const { AuthService } = require("../../service/authService/auth.service")

class AuthController {

    async signup(req, res) {
        const refreshToken = await AuthService.signup({
            ...req.body
        })

        return res.status(200).json({
            message: "Signup successful",
            success: true,
            error: false,
            RefreshToken: refreshToken
        })
    }

    async verfiyEmail(req, res) {
        await AuthService.verfiyEmail({ ...req.body })

        return res.status(200).json({
            message: "Email verified",
            success: true,
            error: false
        })
    }

    async signIn(req, res) {
        const { accessToken, refreshToken, hasUser } = await AuthService.signIn({ deviceInfo: req.deviceInfo, ...req.body })

        return res.status(200).json({
            message: "Signin successful",
            success: true,
            error: false,
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: hasUser
        })
    }

    async generateRefreshToken(req, res) {
        const { refreshToken } = req.body
        const { accessToken } = await AuthService.generateRefreshToken({ refreshToken })
        return res.status(200).json({
            message: "Refresh token successful",
            success: true,
            error: false,
            accessToken
        })
    }

    async signOut(req, res) {
        await AuthService.signOut({ ...req.body })
        return res.status(200).json({
            message: "Signout successful",
            success: true,
            error: false
        })
    }

    // async forgetPassword(req, res) {
    //     await AuthService.forgetPassword({ ...req.body })
    //     return res.status(200).json({
    //         message: "password reset link has been sent to your email.",
    //         success: true,
    //         error: false
    //     })
    // }

    async securityQuestion(req, res) {
        const response = await AuthService.securityQuestion({ ...req.body })

        return res.status(200).json({
            message: "security question added successfully",
            success: true,
            error: false,
            ...response
        })
    }

    async hasUserSecurityQuestion(req, res) {
        const response = await AuthService.hasUserSecurityQuestion({ userId: req.userId })

        return res.status(200).json({
            message: "success",
            success: true,
            error: false,
            ...response

        })
    }

    async addSecurityQuestion(req, res) {
        await AuthService.addSecurityQuestion({ ...req.body, userId: req.userId })

        return res.status(200).json({
            message: "security question added successfully",
            success: true,
            error: false
        })
    }

    async addFeatures(req, res) {
        await AuthService.addFeatures({ ...req.body })

        return res.status(200).json({
            message: "feature added successfully",
            success: true,
            error: false
        })
    }

    async addPermission(req, res) {
        await AuthService.addPermission({ ...req.body })

        return res.status(200).json({
            message: "user permission added successfully",
            success: true,
            error: false
        })
    }

    async addUserPermission(req, res) {
        const response = await AuthService.addUserPermission({ ...req.body })

        return res.status(200).json({
            message: "user permission added successfully",
            success: true,
            error: false,
            ...response
        })
    }

    async getFetures(req, res) {
        const response = await AuthService.getFetures({ userId: req.query.userId })

        return res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response
        })
    }

    async updateUserRole(req, res) {
        await AuthService.updateUserRole({
            ...req.body,
            userId: req.params.userId
        })
        return res.status(200).json({
            message: "user role updated successfully",
            success: true,
            error: false
        })
    }

    async updateUserStatus(req, res) {
        await AuthService.updateUserStatus({
            ...req.body,
            userId: req.params.userId
        })
        return res.status(200).json({
            message: "user status updated successfully",
            success: true,
            error: false
        })
    }

    async getAllUsers(req, res) {
        const { response, total } = await AuthService.getAllUsers({ userId: req.userId })
        return res.status(200).json({
            message: "success",
            success: true,
            error: false,
            response,
            total
        })
    }

    async uploadOrganisationUsers(req, res) {
        await AuthService.uploadOrganisationUsers({
            ...req.body,
            ...req.files
        })

        return res.status(200).json({
            message: "Organisation users uploaded successfully",
            success: true,
            error: false
        })
    }

}

module.exports = {
    AuthController: new AuthController()
}