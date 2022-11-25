const jwt = require("jsonwebtoken");
exports.generateToken = (_id, firstName, lastName, email, isAdmin) => {
    return jwt.sign({ _id, firstName, lastName, email, isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: "7h" })
}