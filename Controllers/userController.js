const User = require("../models/UserModel");
const { use } = require("../Routes/userRoutes");
const { generateToken } = require("../utils/generateToken");
const { hashPassword } = require("../utils/hashPassword");

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