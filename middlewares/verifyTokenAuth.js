const jwt = require("jsonwebtoken")
exports.verifyIsloggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        if (!token) {
            return res.status(403).send("A token is required for authentication")
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded;
            next()
        } catch (error) {
            return res.status(401).send("Invalid token")
        }
    } catch (error) {
        next(error)
    }
}

exports.verifyAdmin = async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        return res.status(403).send("Unauthorized! Admin is required")
    }
}