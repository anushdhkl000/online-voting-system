const { envConfig } = require("../../config/envConfig")
const User = require("../../model/authModal/auth.model")
const Token = require("../../model/authModal/token.model")
const TrackDevice = require("../../model/authModal/device.model")
const SecurityQuestion = require("../../model/authModal/securityQuestionModel")
const ShortUniqueId = require('short-unique-id');


const { signUpToken, verifyToken, accessTokenId, refreshTokenId } = require("../../utils/accessToken")
const AppError = require("../../utils/AppError")
const { sendLiveMail, sendTestEmail } = require("../../utils/sendEmail")
const bcrypt = require("bcrypt")
const featureModel = require("../../model/authModal/feature.model")
const PermissionModel = require("../../model/authModal/Permission.model")
const userPermissionModel = require("../../model/authModal/userPermission.model")
const Group = require("../../model/authModal/group.model")
const GroupPermission = require("../../model/authModal/groupPermission.model")
const config = envConfig()

class AuthService {

    async signup(filters) {
        const {
            email,
            password,
            role = "user",
            firstName,
            lastName,
            dob,
            phone,
            country,
            state,
            zip,
            unitNumber,
            street,
            suburb,
            identityNumber,
            age,
            orgId
        } = filters
        const isUser = await User.findOne({ email })
        if (isUser) {
            throw new AppError("User already exists", 400)
        }

        let user = new User({
            firstName,
            lastName,
            dob,
            phone,
            email,
            country,
            state,
            zip,
            unitNumber,
            street,
            suburb,
            password,
            role,
            identityNumber,
            identityDocument: filters.filename,
            age,
            orgId
        })

        user = await user.save()

        if (!user) {
            throw new AppError("User not created", 400)
        }

        let token = new Token({
            token: await signUpToken(user),
            userId: user.id
        })
        token = await token.save();
        if (!token) {
            throw new AppError("Token not created", 400)
        }

        /** for development testing mail server via mailtrap.io */
        // const info = await sendTestEmail({
        //     from: 'noreply@gmail.com',
        //     to: user.email,
        //     subject: 'Email verification link',
        //     text: `Hello,\n\n Plese confirm your email by copying the bellow acess token : ${token.token}`
        //     // text:`Hello,\n\n Plese confirm your email by copying the bellow link:\n\n
        //     // http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
        // })

        const verificationLink = `${config.FRONTEND_URL}/email/confirmation/${token.token}`
        /** for production testing mail server via google */
        await sendLiveMail({
            from: 'noreply@gmail.com',
            to: user.email,
            subject: 'Email verification link',
            html:
                `
            <div
            style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e1e1e1;
            padding: 20px;
            "
            >
            <h2 style="color: #4a2c82; text-align: center">Welcome to Online Voting!</h2>

            <p style="font-size: 16px; line-height: 1.5">
            Hello ${user.firstName + " " + user.lastName || 'there'},
            </p>

            <p style="font-size: 16px; line-height: 1.5">
            Thank you for creating an account with us. To complete your registration,
            please verify your email address by using the following verification code:
            </p>

            <p style="font-size: 16px; line-height: 1.5">
            This code will expire in 5 minutes. If you didn't request this, please ignore
            this email.
            </p>
            <p style="font-size: 16px; line-height: 1.5">
            Note: Within two or three business days, your account will be authorized. 
            You will receive an email from us verifying your account.
            </p>

            <p style="font-size: 16px; line-height: 1.5">Best regards,<br />The Team</p>

            <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0" />

            <div style="font-size: 12px; color: #777; text-align: center">
            Please click this verification link to verify your email address:
            <a href="${verificationLink}">Verify Email</a>
            </div>
            </div>`
        })

        return token.token
    }

    async verfiyEmail(filters) {
        const { token } = filters
        const key = config.JWT_SECRET

        const decodedToken = await verifyToken({ token, key })
        if (decodedToken.error) {
            throw new AppError("Invalid token or token may be expired", 400)
        }

        const hasToken = await Token.findOne({ token, userId: decodedToken.userId })

        if (!hasToken) {
            throw new AppError("Invalid token", 400)
        }

        const user = await User.findById(decodedToken.userId)

        if (!user) {
            throw new AppError("User not found", 400)
        }

        if (user.isVerified) {
            throw new AppError("User already verified", 400)
        }

        await User.findByIdAndUpdate(decodedToken.userId, {
            isVerified: true,
            isActive: true
        })

        await Token.findByIdAndDelete(hasToken._id)
        return true
    }

    async signIn(filters) {
        const { email, password, deviceInfo, updatedDevice = false } = filters

        const hasUser = await User.findOne({ email })

        if (!hasUser) {
            throw new AppError("User not found", 400)
        }

        const isPasswordCorrect = await bcrypt.compare(password, hasUser.password)

        if (!isPasswordCorrect) {
            throw new AppError("Invalid password", 400)
        }

        if (!hasUser.isVerified) {
            throw new AppError("User not verified", 400)
        }

        if (!hasUser.isActive) {
            throw new AppError("User not active", 400)
        }

        if (!hasUser.isVerifiedDetails) {
            throw new AppError("The information provided by the user is not verified.", 400)
        }

        const hasTrackDevice = await TrackDevice.findOne({ userId: hasUser._id });
        if (!updatedDevice) {
            const deviceCheck = await this.checkDeviceMatch(hasUser._id, deviceInfo);
            if (deviceCheck.isNewDevice) {
                const data = {
                    isNewDevice: deviceCheck.isNewDevice,
                    isSecurityQuestion: deviceCheck.isSecurityQuestion
                }
                throw new AppError(deviceCheck.message, 403, data)
            } else {
                if (hasTrackDevice === null) {
                    /** tracking device */
                    let deviceTrack = new TrackDevice({
                        userAgent: deviceInfo.userAgent,
                        device: deviceInfo.device.type,
                        client: {
                            clientType: deviceInfo.client.type,
                            name: deviceInfo.client.name,
                            version: deviceInfo.client.version,
                            engine: deviceInfo.client.engine
                        },
                        os: {
                            name: deviceInfo.os.name,
                            version: deviceInfo.os.version,
                            platform: deviceInfo.os.platform
                        },
                        lastLogin: deviceInfo.loginTime,
                        isActive: true,
                        userId: hasUser._id
                    })

                    await deviceTrack.save()
                }
            }
        } else {
            /** delete previous device tracking */
            if (hasTrackDevice !== null) {
                await TrackDevice.deleteOne({ userId: hasUser._id, _id: hasTrackDevice._id })
            }
            /** tracking device */
            let deviceTrack = new TrackDevice({
                userAgent: deviceInfo.userAgent,
                device: deviceInfo.device.type,
                client: {
                    clientType: deviceInfo.client.type,
                    name: deviceInfo.client.name,
                    version: deviceInfo.client.version,
                    engine: deviceInfo.client.engine
                },
                os: {
                    name: deviceInfo.os.name,
                    version: deviceInfo.os.version,
                    platform: deviceInfo.os.platform
                },
                lastLogin: deviceInfo.loginTime,
                isActive: true,
                userId: hasUser._id
            })

            await deviceTrack.save()
        }

        const accessToken = await accessTokenId({ id: hasUser._id })
        const refreshToken = await refreshTokenId({ id: hasUser._id })

        hasUser.refreshToken = refreshToken

        await hasUser.save()

        return {
            hasUser,
            accessToken,
            refreshToken
        }

    }

    async generateRefreshToken(filters) {
        const { refreshToken } = filters
        if (!refreshToken) {
            throw new AppError("Refresh token is required", 403)
        }
        const user = await User.findOne({ refreshToken })

        if (!user) {
            throw new AppError("Invalid refresh token", 403)
        }
        const key = config.REFRESH_TOKEN_SECRET

        await verifyToken({ token: refreshToken, key })

        const newAccessToken = await accessTokenId({ id: user.id })

        return {
            accessToken: newAccessToken,
            userId: user.id
        }
    }

    async signOut(filters) {
        const { refreshToken, userId } = filters
        if (!refreshToken) {
            throw new AppError("Refresh token is required", 403)
        }

        const user = await User.findOne({ refreshToken, _id: userId })
        if (!user) {
            throw new AppError("Invalid refresh token", 403)
        }
        user.refreshToken = null
        await user.save()
    }

    async forgetPawword(filters) {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ error: 'sorry the email you have provied not found in our system.' })
        }
        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            userId: user._id
        })
        token = await token.save()
        if (!token) {
            return res.status(400).json({ error: 'something went wrong' })
        }
    }

    async checkDeviceMatch(userId, currentDeviceInfo) {
        // Find all tracked devices for this user
        const trackedDevices = await TrackDevice.find({ userId, isActive: true });

        // If no devices found, this is the first login - consider it a match
        if (trackedDevices.length === 0) {
            return { isNewDevice: false };
        }

        // Check if current device matches any tracked device
        const isMatch = trackedDevices.some(device => {
            return (
                device.userAgent === currentDeviceInfo.userAgent &&
                device.device === currentDeviceInfo.device.type &&
                device.client.clientType === currentDeviceInfo.client.type &&
                device.client.name === currentDeviceInfo.client.name &&
                device.client.version === currentDeviceInfo.client.version &&
                device.client.engine === currentDeviceInfo.client.engine &&
                device.os.name === currentDeviceInfo.os.name &&
                device.os.version === currentDeviceInfo.os.version &&
                device.os.platform === currentDeviceInfo.os.platform
            );
        });

        if (isMatch) {
            // Device matches - update last login time
            await TrackDevice.updateOne(
                { userId, userAgent: currentDeviceInfo.userAgent },
                { $set: { lastLogin: currentDeviceInfo.loginTime } }
            );
            return { isNewDevice: false };
        } else {
            const hasSecurityQuestion = await SecurityQuestion.find({ userId });
            if (hasSecurityQuestion.length > 0) {
                return {
                    isNewDevice: true,
                    isSecurityQuestion: true,
                    message: "Login attempt from new device detected"
                };
            } else {
                // New device detected
                return {
                    isNewDevice: true,
                    isSecurityQuestion: false,
                    message: "New device detected , your account security questions have not yet been set up. You are not allowed to login."
                };
            }
        }
    }

    async securityQuestion(filters) {
        const { securityQuestion, emails } = filters
        const user = await User.findOne({ email: emails })
        if (!user) {
            throw new AppError("User not found", 400)
        }

        const notMatchAnswer = [];
        const hasSecurityQuestion = await SecurityQuestion.find({ userId: user._id });

        for (const key of securityQuestion) {
            const question = key.question;
            const answer = key.answer;

            // Find the corresponding question in the database
            const dbQuestion = hasSecurityQuestion.find(q => q.question === question);

            if (!dbQuestion) {
                notMatchAnswer.push(question);
                continue;
            }

            // Compare the hashed answers
            const isAnswerCorrect = await bcrypt.compare(answer, dbQuestion.answer);

            if (!isAnswerCorrect) {
                notMatchAnswer.push(question);
            }

        }

        if (notMatchAnswer.length > 0) {
            throw new AppError("Security question not matched", 400);
        }
        return {
            updatedDevice: true
        }

    }

    async hasUserSecurityQuestion({ userId }) {
        const hasSecurityQuestion = await SecurityQuestion.find({ userId });
        if (hasSecurityQuestion.length > 0) {
            return {
                hasSecurityAnswer: true
            }
        } else {
            return {
                hasSecurityAnswer: false
            }
        }

    }

    async addSecurityQuestion(filters) {
        const { securityQuestion, userId } = filters

        for (const key of securityQuestion) {
            const question = key.question;
            const answer = key.answer;

            const salt = await bcrypt.genSalt(8)
            const hasAnswer = await bcrypt.hash(answer, salt)

            let SecurityQuestions = new SecurityQuestion({
                question: question,
                answer: hasAnswer,
                userId
            })

            await SecurityQuestions.save()
        }
    }

    async addFeatures({ parent }) {
        const hasFeatureParent = await featureModel.findOne({ parent })
        if (hasFeatureParent) {
            throw new AppError("Feature already added", 400)
        }
        let featureParent = new featureModel({
            parent
        })
        await featureParent.save()
        if (!featureParent) {
            throw new AppError("Feature not added", 400)
        }
        return true
    }

    async addPermission(filters) {
        const { permission, parentId } = filters
        const hasPermission = await PermissionModel.findOne({ permission, parentId })
        if (hasPermission) {
            throw new AppError("Permission already added", 400)
        }
        let userPermission = new PermissionModel({
            permission,
            parentId
        })

        await userPermission.save()
        if (!userPermission) {
            throw new AppError("Permission not added", 400)
        }
        return true
    }

    async addUserPermission(filters) {
        const { features, userId, groupId } = filters

        if (groupId) {
            await GroupPermission.deleteMany({
                groupId: userId
            });

            for (const feature of features) {
                let GroupPermission = new GroupPermission({
                    permissionId: feature,
                    userId
                })
                await GroupPermission.save()
            }
        } else {
            await userPermissionModel.deleteMany({
                userId: userId
            });

            for (const feature of features) {
                let userPermission = new userPermissionModel({
                    permissionId: feature,
                    userId
                })
                await userPermission.save()
            }
        }


        return true
    }

    async getFetures(filters) {
        const { userId } = filters
        const permissions = await PermissionModel.find().populate('parentId').exec();
        const userPermissions = await userPermissionModel.find({ userId }).populate('permissionId').exec();
        if (permissions.length > 0) {
            const grouped = permissions.reduce((acc, permission) => {
                const parentName = permission.parentId.parent;
                if (!acc[parentName]) {
                    acc[parentName] = {
                        parent: parentName,
                        Child: []
                    };
                }
                acc[parentName].Child.push({
                    label: permission.permission,
                    checked: false,
                    key: permission._id
                });
                return acc;
            }, {});

            const parentResponse = Object.values(grouped);
            const childResponse = userPermissions

            // Create a Set of permission IDs from childResponse for quick lookup
            const permissionIds = new Set(
                childResponse.map(child => child.permissionId._id.toString())
            );

            // Update parentResponse
            const updatedParentResponse = parentResponse.map(parentItem => {
                const updatedChild = parentItem.Child.map(childItem => {
                    // Compare string representations of ObjectIds
                    if (permissionIds.has(childItem.key.toString())) {
                        return { ...childItem, checked: true };
                    }
                    return childItem;
                });
                return { ...parentItem, Child: updatedChild };
            });

            return updatedParentResponse
        } else {
            return {
                permissions: false
            }
        }
    }

    async updateUserRole({ userId, role }) {
        const user = await User.findById({ _id: userId })
        if (!user) {
            throw new AppError("User not found", 400)
        }
        user.role = role
        await user.save()
        return true
    }

    async updateUserStatus({ userId, status }) {
        const user = await User.findById(userId)
        if (!user) {
            throw new AppError("User not found", 400)
        }
        const booleanStatus = status === "true" ? true : false

        user.isActive = booleanStatus
        user.isVerified = booleanStatus
        await user.save()
        return true
    }

    async getAllUsers(filters) {
        const { search } = filters
        const { page = 1, pageSize = 10 } = filters;
        const skip = (page - 1) * pageSize;

        const hasUser = await User.findOne({ _id: filters.userId })

        if (!hasUser?.orgId && hasUser?.role !== "super-admin") {
            throw new AppError("User does not belong to any organisation", 400)
        }
        const orgId = hasUser?.orgId


        let query = {}
        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                ]
            }
        }

        if (orgId) {
            query.orgId = orgId
        }

        /** exclude password and refreshToken */
        const response = await User.find(query)
            .select('-password -refreshToken')
            .skip(skip)
            .limit(pageSize)
            .exec();
        const total = await User.countDocuments({ orgId })
        return {
            response,
            total
        }
    }

    async getUserPermissionFeatures({ userId }) {

        const userPermissions = await userPermissionModel.find({ userId }).populate('permissionId').exec();

        const permissionMap = userPermissions?.map((data) => data.permissionId.permission)

        return permissionMap

    }

    async verifyUserDetails(filters) {
        const { userId, verify } = filters
        let isVerifiedDetails = false
        if (verify) {
            isVerifiedDetails = verify === "true" ? true : false
        }

        const randomNumber = await this.generateRandomNumber()

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isVerifiedDetails,
                userTokenId: randomNumber
            },
            { new: true }
        );

        if (!updatedUser) {
            throw new AppError("User not found", 400)
        }

        await sendLiveMail({
            from: 'noreply@gmail.com',
            to: updatedUser.email,
            subject: 'User Verification',
            html:
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin:  auto; border: 1px solid #e1e1e1; padding: 20px;">
            <h2 style="color: #4a2c82; text-align: center;">Your Account Has Been Verified</h2>

            <p style="font-size: 16px; line-height: 1.5;">
            Dear ${updatedUser.firstName + " " + updatedUser.lastName || 'Valued Customer'},
            </p>

            <p style="font-size: 16px; line-height: 1.5;">
            Thank you for registering with us! We're pleased to inform you that after careful review, your account has been successfully verified.
            </p>

            <p style="font-size: 16px; line-height: 1.5;">
            You now have full access to all our services and features. We appreciate your patience during our verification process, which typically takes 2-3 business days to ensure the security of all our users.
            </p>

            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #4a2c82; margin: 20px 0;">
            <p style="font-size: 16px; line-height: 1.5; margin: 0;">
            <strong>Important:</strong> Please save your registered userID for future reference:
            </p>
            <p style="font-size: 18px; font-weight: bold; color: #4a2c82; text-align: center; margin: 10px 0;">
            ${randomNumber}
            </p>
            <p style="font-size: 14px; line-height: 1.5; margin: 0;">
            You may need this token for future purposes. Please keep it safe and secure.
            </p>
            </div>

            <p style="font-size: 16px; line-height: 1.5;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>

            <p style="font-size: 16px; line-height: 1.5;">
            The Team
            </p>
            </div>
            `
        })

        return true
    }


    async generateRandomNumber() {
        const uid = new ShortUniqueId({ length: 6 });
        const uniqueId = uid.rnd()
        return uniqueId;
    }

    async addGroup({ name }) {
        const group = new Group({
            name
        })
        await group.save()
        return group
    }

    async addGroupPermission({ permissionId, groupId }) {
        const groupPermission = new GroupPermission({
            permissionId,
            groupId
        })
        await groupPermission.save()
        return groupPermission
    }

    async getAllGroups({ page = 1, pageSize = 10 }) {
        const skip = (page - 1) * pageSize;
        const response = await Group.find()
            .skip(skip)
            .limit(pageSize)
            .exec();
        const total = await Group.countDocuments()
        return {
            response,
            total
        }
    }


}

module.exports = {
    AuthService: new AuthService()
}