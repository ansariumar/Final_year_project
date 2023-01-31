



// const passwordComplexity = require("joi-password-complexity");
// const res = passwordComplexity().validate("aPassword123");
// console.log(res.error.details[0].message)

const bcrypt = require('bcrypt');

const hashedpass = bcrypt.hashSync("MeABhoot", 10)


// console.log(hashedpass);

const res = bcrypt.compareSync("MeABhoot", "$2b$10$BbRxu3rAAPVcMye6NUus9.PXFZ6ENfOcjzvAdne4XP4Mnkoq2eXYq")

console.log(res)