import { Router } from 'express';
import UserValidator from '../validator/Usuario'
import jwt from 'jsonwebtoken'
import db from '../database/database'

const routes = new Router();

const bcryptjs = require('bcryptjs')

const path = "/account"

routes.post(path + '/login', async (req, res) => {
    if (await UserValidator.isValid(req.body)) {
        const { username, password } = await req.body;
        db.query("SELECT * FROM usuarios WHERE username=?", [
            username
        ], (error, results) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
            if (results.length <= 0) {
                return res.status(400).send({
                    message: "IDK Account"
                })
            }

            let accountPass = results[0].senha;

            if (!bcryptjs.compareSync(password, accountPass)) {
                return res.status(400).send({
                    message: "Error to trying to connect to that account is that password correct?"
                })
            } else {
                const token = jwt.sign({ loggedUser: `${username}` }, "inshallah_key", { expiresIn: '1h' })
                return res.send({
                    message: "OK",
                    token
                });
            }

        })
    }
})

routes.post(path, async (req, res) => {
    if (await UserValidator.isValid(req.body)) {
        const { username, password } = await req.body;
        let salt = await bcryptjs.genSalt(10);
        let pass = await bcryptjs.hashSync(password, salt);
        db.query("INSERT INTO usuarios(username,senha,grupo) VALUES (?,?,?)", [
            username,
            pass,
            "none"
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            } else { return res.send() }
        })
    } else {
        return res.status(400).send()
    }
})

export default routes;