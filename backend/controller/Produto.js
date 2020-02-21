import { Router } from 'express';
import db from '../database/database'

import { resolve } from 'path'

import axios from 'axios'

import multer from 'multer'
import multerCfg from '../multer'


import Auth from '../middlewares/Auth'

import ProdutoValidator from '../validator/Produto'

const uploadMulterImg = multer(multerCfg)

const bodyParser = require('body-parser');
const routes = new Router();
const path = '/produtos';


routes.get(path + '/img/:id', async (req, res) => {
    const { id } = req.params;
    const response = await axios.get('http://localhost:8000/produtos/' + id);
    console.log(response.data)
    return res.sendfile(resolve(__dirname, '..', 'uploads', response.data[0].imagem))
})



routes.post(path + '/adicionar/:id/:qtd', Auth, async (req, res) => {
    const { id,qtd } = req.params;
    db.query("SELECT * FROM produtos WHERE nome=?", [id], (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })

        }
        let dataAtualizar = result[0].quantidade;
            dataAtualizar = parseInt(dataAtualizar) + parseInt(qtd);
            db.query("UPDATE produtos SET quantidade=? WHERE nome=?", [
                dataAtualizar,
                id
            ], (error) => {
                if (error) {
                    return res.status(400).send({
                        error
                    })
                }
            })
    });
    return res.send()
})


routes.post(path + '/remover/:id/:qtd', Auth, async (req, res) => {
    const { id,qtd } = req.params;
    db.query("SELECT * FROM produtos WHERE nome=?", [id], (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })

        }
        let dataAtualizar = result[0].quantidade;
        if (dataAtualizar > 0) {
            dataAtualizar -= qtd;
            db.query("UPDATE produtos SET quantidade=? WHERE nome=?", [
                dataAtualizar,
                id
            ], (error) => {
                if (error) {
                    return res.status(400).send({
                        error
                    })
                }
            })
        }
    });
    return res.send()
})


routes.post(path + '/preco/:nome', Auth, async (req, res) => {
    const {nome} = req.params;
    const { valor } = req.body;
    db.query("SELECT * FROM produtos WHERE nome=?",[nome], (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
        let resultado = result[0].preco;
        console.log(resultado)
        resultado = valor
        db.query("UPDATE produtos SET preco=? WHERE nome=?", [
            resultado,
            nome
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
        })
    })
    return res.send()
})

routes.post(path + '/remover/:id', Auth, async (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM produtos WHERE nome=?", [id], (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })

        }
        let dataAtualizar = result[0].quantidade;
        if (dataAtualizar > 0) {
            dataAtualizar -= 1;
            db.query("UPDATE produtos SET quantidade=? WHERE nome=?", [
                dataAtualizar,
                id
            ], (error) => {
                if (error) {
                    return res.status(400).send({
                        error
                    })
                }
            })
        }
    });
    return res.send()
})


routes.get(path + '/faturamento/', Auth, async (req, res) => {
    db.query("SELECT * FROM infos", (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
        let resultado = {
            faturamento: result[0].faturamento,
            pecasVendidas: result[0].pecasVendidas
        }
        return res.json(resultado)
    })
})

routes.post(path + '/zerarfaturamento/', Auth, async (req, res) => {
    db.query("DROP TABLE infos");
    db.query("create table infos (faturamento double,pecasVendidas int)");
    db.query("INSERT INTO infos(faturamento,pecasVendidas) VALUES (0,0);");
    res.send()
});

routes.post(path + '/faturamento/', Auth, async (req, res) => {
    const { valor } = req.body;
    db.query("SELECT * FROM infos", (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
        let resultado = {
            faturamento: result[0].faturamento,
            pecasVendidas: result[0].pecasVendidas
        }
        console.log(resultado)
        resultado.faturamento += valor
        db.query("UPDATE infos SET faturamento=?", [
            resultado.faturamento
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
        })
    })
    return res.send()
})

routes.post(path + '/faturar', Auth, async (req, res) => {
    db.query("SELECT * FROM infos", (error, result) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
        let resultado = {
            faturamento: result[0].faturamento,
            pecasVendidas: result[0].pecasVendidas
        }
        console.log(resultado)
        resultado.pecasVendidas += 1
        db.query("UPDATE infos SET pecasVendidas=?", [
            resultado.pecasVendidas
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
        })
    })
    return res.send()
})

routes.post(path + '/:id', uploadMulterImg.single('img'), async (req, res) => {
    const { id } = req.params;
    db.query("UPDATE produtos SET imagem=? WHERE codigo=? ", [req.file.filename, id], (error) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
    })
    return res.send()
})

routes.get(path, async (req, res) => {
    db.query("SELECT * FROM produtos", (error, results) => {
        return res.json(results)
    })
})

routes.get(path + '/:codigo', async (req, res) => {
    const { codigo } = req.params;
    db.query(`SELECT * FROM produtos WHERE codigo=?`, [codigo], (error, results) => {
        if (results.length == 0) {
            return res.status(404).send()
        }
        return res.json(results)
    })
})

routes.post(path, Auth, async (req, res) => {

    if (await ProdutoValidator.isValid(req.body)) {
        const { codigo, tipo, nome, preco, tamanho, imagem, quantidade } = req.body;

        db.query("INSERT INTO produtos(codigo,tipo,nome,preco,tamanho,imagem,quantidade) VALUES (?,?,?,?,?,?,?)", [
            codigo,
            tipo,
            nome,
            preco,
            tamanho,
            imagem,
            quantidade
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            } else {
                return res.send()
            }
        })
    } else {
        return res.status(400).send()
    }
})

routes.delete(path + '/:codigo', Auth, async (req, res) => {
    const { codigo } = req.params;
    db.query("DELETE FROM produtos WHERE codigo=?", [codigo], (error) => {
        if (error) {
            return res.status(400).send({
                error
            })
        }
    })
    return res.send();
})



export default routes;