const config = require('config');


module.exports = function () {

    // export aiculus_jwtPrivateKey=mySecureKey
    if(!config.get('jwtPrivateKey')){

        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');

    }
};
