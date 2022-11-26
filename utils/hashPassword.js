const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
exports.hashPassword = (password) => bcrypt.hashSync(password, salt);
exports.comparePassword = (inputPassword, hashedPassword) => bcrypt.compareSync(inputPassword, hashedPassword)