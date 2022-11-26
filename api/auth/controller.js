const bcryptjs = require('bcryptjs');
const { generateJWT, googleVerify } = require('./helpers');
const User = require('../../common/models/user');


const createUser = async (req, res = response) => {
    const role = 'USER_ROLE';
    const {name, email, password} = req.body;
    const validateEmail = await User.findOne({email});
    if(validateEmail) return res.status(400).json({message: 'The email is already registered'});
    const user = new User({name, email, password, role});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en DB
    await user.save();
    res.status(200).json({ status: 'success', data: user });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el correo existe en
        const user =  await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                message: 'User or password incorrect'
            });
        }
        if(user.google) return res.status(400).json({message: 'Use google sing in', googleSingInstance: true});
        // Verificar si el usuario esta activo
        if(!user.status) {
            return res.status(404).json({
                message: 'User blocked'
            });
        }
        // Verificar la contraseña de la
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(404).json({
                message: 'User or password incorrect'
            });
        }
        // Generar el JWT
        const token = await generateJWT(user.id);
        res.json({
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Talk to the administrator'
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

const getUserIfo = async (req, res) => {
    try {
        user = req.user;
        res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            img: user.img,
            status: user.status
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Talk to the administrator'
        })
    }
}


module.exports = {
    createUser,
    login,
    googleSingIn,
    getUserIfo
}