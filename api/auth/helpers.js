
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Failed to generate token');
            } else {
                resolve(token);
            }
        })
    });

}

async function googleVerify(token = '') {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, picture, email } = ticket.getPayload();
    return {
        name,
        img: picture,
        email
    }
}

module.exports = {
    generateJWT,
    googleVerify
}



