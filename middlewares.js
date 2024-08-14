// if bcrypt is not working type bcrypt js
const bcrypt = require('bcrypt');

const hashPassword = (req, res, next) => {
    const { password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    req.body.password = hash;
    console.log(hash);
    // next()
};


module.exports = { hashPassword }