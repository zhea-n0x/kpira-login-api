const crypto = require('../utils/simpleCrypto');

const tokenVerification = (req, res, next) => {
    const token = req.headers['x-myapikey'];

    if(!token){
        return res.status(403).json({
            message: "Please provide a token!"
        });
    }

    const decryptedToken = crypto.decrypt(token);

    if(decryptedToken !== process.env.API_KEY){
        return res.status(403).json({
            message: "Your given token is invalid!"
        });
    }

    next();
}

module.exports = {
    tokenVerification
}