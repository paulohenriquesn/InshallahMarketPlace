import jwt from 'jsonwebtoken'

module.exports = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        //return res.status(400).send({ message: "IDK Token" })
    }

    jwt.verify(token, "inshallah_key", (err, decoded) => {
        if (err) {
           // return res.status(400).send({ message: "IDK Token" })
        } else {
            //return next();
        }
    })
    return next();
}