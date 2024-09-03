import jwt from 'jsonwebtoken';


module.exports = (req : any, res, next) => {
    if (req.headers.authorization == null) {
        return res.status(500).json({ "msg": "No token, authorization denied"});
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
        return res.status(500).json({ "msg": "Token is not valid" });
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ "msg": "Token is not valid" });
        const id = decoded.id;
        user_id_exist(id, (exists) => {
            if (!exists) return res.status(500).json({ "msg": "Token is not valid" });
            req.middlewareId = id;
            next();
        });
    })
}
