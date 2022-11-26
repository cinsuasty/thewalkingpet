const bcryptjs = require('bcryptjs');
const { generateJWT, googleVerify } = require('./helpers');
const User = require('../../common/models/user');


const login = async (req, res) => {
    const { email, password } = req.body;
    res.send("login");
    try {
    } catch (error) {
        return res.status(500).json({
            msg: 'Talk to the administrator'
        })
    }
}

const googleSingIn = async (req, res = response) => {
    const { id_token } = req.body;

    try{
        const { name, img, email } = await googleVerify( id_token );
        let user = await User.findOne({email});

        if (!user) {
            // Create user
            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true
            };
            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Talk to admin, user blocked'
            })
        }
        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'The token could not be verified',error
        })
    }
}


module.exports = {
    login,
    googleSingIn
}