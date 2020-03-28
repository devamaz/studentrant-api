const UIDGenerator = require("uid-generator");
const uuid         = new UIDGenerator(512, UIDGenerator.BASE62);

class Utils {
    static ExtractSessionObjectData(req,type) {
	if ( ! (type in req.session.user) )
	    throw new Error(`${type} does not exists on session object`);
	return req.session.user[type];
    }
    static SetSessionObject(req,data) {
	req.session.user = data;
    }
    static UpdateSessionObject(req,data) {
	Object.assign(req.session.user, ...data);
    }
    static async UniqueCodeGenerator(req,email) {
	return await uuid.generate();
    }
}

module.exports = Utils;
