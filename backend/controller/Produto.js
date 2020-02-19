import { Router } from 'express';
import db from '../database/database'

import {resolve} from 'path'

import axios from 'axios'

import multer from 'multer'
import multerCfg from '../multer'


import Auth from '../middlewares/Auth'

import ProdutoValidator from '../validator/Produto'

const uploadMulterImg = multer(multerCfg)

const bodyParser = require('body-parser');
const routes = new Router();
const path = '/produtos';


routes.get(path + '/img/:id',async (req,res) => {
    const {id} = req.params;
    const response = await axios.get('http://localhost:8000/produtos/' + id);
    console.log(response.data)
    return res.sendfile(resolve(__dirname,'..','uploads',response.data[0].imagem))
})

routes.post(path + '/:id',uploadMulterImg.single('img'), async (req, res) => {
   const {id} = req.params;
   db.query("UPDATE produtos SET imagem=? WHERE codigo=? ",[req.file.filename,id],(error) => {
       if(error){
        return res.status(400).send({
            error
        })
       }
   })
   res.send()
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

routes.post(path, Auth ,async (req, res) => {

    if (await ProdutoValidator.isValid(req.body)) {
        const { codigo, tipo, nome, preco, tamanho, imagem } = req.body;

        db.query("INSERT INTO produtos(codigo,tipo,nome,preco,tamanho,imagem) VALUES (?,?,?,?,?,?)", [
            codigo,
            tipo,
            nome,
            preco,
            tamanho,
            imagem
        ], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            } else {
                return res.send()
            }
        })
    }else{
        return res.status(400).send()
    }
})

routes.delete(path + '/:codigo', Auth , async (req, res) => {
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