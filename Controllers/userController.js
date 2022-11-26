const User = require("../models/UserModel");
const { use } = require("../Routes/userRoutes");
const { generateToken } = require("../utils/generateToken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

exports.getUser = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password");
        return res.json(users)
    } catch (error) {
        next(error)
    }
}
exports.registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(firstName && lastName && email && password)) { return res.status(500).send("All inputs are required") };
        const userExists = await User.findOne({ email })
        if (userExists) return res.status(400).json({ error: "user already exists" })
        const hashedPassword = hashPassword(password)
        const user = await User.create({ firstName, lastName, email, password: hashedPassword })
        res.cookie("access_token", generateToken(user._id, user.firstName, user.lastName, user.email, user.isAdmin), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }).status(201).json({
            message: "User created successfully", user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                admin: user.isAdmin
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogout } = req.body;
        if (!(email && password)) return res.status(401).send("All inputs are required");
        const user = await User.findOne({ email });
        if (user && comparePassword(password, user.password)) {
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }
            if (doNotLogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }
            }
            return res.cookie("access_token", generateToken(user._id, user.firstName, user.lastName, user.email, user.isAdmin), cookieParams).json({
                success: 'user logged in', userLoggedIn: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    admin: user.isAdmin,
                    doNotLogout

                }

            })
        } else {
            return res.status(401).send("User doesn't exist")
        }


    } catch (error) {
        next(error)
    }
}

exports.userUpdateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).orFail();
        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.email = req.body.email || user.email
        user.phoneNumber = req.body.phoneNumber
        user.address = req.body.address
        user.country = req.body.country
        user.zipCode = req.body.zipCode
        user.city = req.body.city
        user.state = req.body.state
        if (req.body.password !== user.password) {
            user.password = hashPassword(req.body.password)
        }
    } catch (error) {
        next(error)
    }
}