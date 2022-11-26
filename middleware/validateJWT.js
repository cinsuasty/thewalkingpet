const jwt = require('jsonwebtoken');
const User = require('../common/models/user');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify( token,process.env.SECRETORPRIVATEKEY );
        // Obtenter el usuario autenticado
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con existe DB'
            });
        }
        // Validar si el usuario uid tiene estado  true
        if(!user.status){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            });
        }
        req.user = user;
        next();
    }catch(error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validateJWT
}

