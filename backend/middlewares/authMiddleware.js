import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    jwt.verify(token,process.env.JWT_KEY, async (err,payload)=>{
        if(err){
            return res.status(403).json({msg: 'Token is not valid'});
        }
        req.userId = payload.userId;
        next();
    })
}