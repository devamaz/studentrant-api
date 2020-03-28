const { users } = require("../../models/dbmodels/");

class RegisterDbUtils {
    static async SaveNewUser(data) {
	const result = await (new users(data).save());
	return await users.findOne( { email: data.email } , {
	    password: false ,
	    _id: false,
	    __v: false,
	    dateOfReg: false
	}).lean();
    }
    static async UpdateNewUserDetails({ criteria , data, options}) {
	return await users.findOneAndUpdate(criteria, data, options);
    }
    static async VerifyUserRegTokenAndGetData(token) {
	return await users.findOneAndUpdate(
	    { verificationLink: token },
	    { $unset: { verificationLink: 1 } },
	    { new: false, fields: { password: false, _id: false, __v: false , dateOfReg: false} }
	).lean();
    }
}

module.exports = RegisterDbUtils;