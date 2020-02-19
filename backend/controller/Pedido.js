import { Router } from 'express';
import db from '../database/database'

import axios from 'axios'

import Auth from '../middlewares/Auth'
const routes = new Router();

import Validator from '../validator/Pedido'

const path = '/process/order'
const pathHistory = '/process/history'

routes.get(pathHistory, Auth, async (req, res) => {
    db.query("SELECT * FROM historicoPedidos", (error, results) => {
        return res.json(results)
    })
})

routes.get(pathHistory + '/:pessoa', async(req,res) => {
    const { pessoa } = req.params;
    console.log(pessoa)
        db.query(`SELECT * FROM historicoPedidos WHERE NomeCliente LIKE ?`, '%' + pessoa + '%', (error, results) => {
            if (results.length == 0) {
                return res.status(404).send()
            }
            return res.json(results)
        })
})

routes.get(pathHistory + '/id/:pessoa', async(req,res) => {
    const { pessoa } = req.params;
    console.log(pessoa)
        db.query(`SELECT * FROM historicoPedidos WHERE id=?`,[pessoa], (error, results) => {
            if (results.length == 0) {
                return res.status(404).send()
            }
            return res.json(results)
        })
})


    routes.post(path + "/pay/:id", Auth, async (req, res) => {
        const { id } = req.params;
        console.log(id)
        const ped_response = await axios.get('http://localhost:8000/process/order/id/' + id);
        const Pedido_Data = ped_response.data[0]
        db.query("INSERT INTO historicoPedidos(NomeCliente,Pedido,CPF,Telefone,Endereco,ValorTotal,FormaDePagamento) VALUES (?,?,?,?,?,?,?)", [
            Pedido_Data.NomeCliente,
            Pedido_Data.Pedido,
            Pedido_Data.CPF,
            Pedido_Data.Telefone,
            Pedido_Data.Endereco,
            Pedido_Data.ValorTotal,
            Pedido_Data.FormadePagamento
        ], (error) => {
            if (error)
                return res.status(400).send({
                    error
                })
        })

        db.query("UPDATE pedidos SET Pago=? WHERE id=?", ["Sim", id]);

        return res.send()
    })

    routes.post(path, Auth, async (req, res) => {
        const { nome_cliente, pedido, CPF, telefone, endereco, valortotal, formadePagamento, Pago } = req.body;
        if (await Validator.isValid(req.body)) {
            db.query("INSERT INTO pedidos(NomeCliente,Pedido,CPF,Telefone,Endereco,ValorTotal,FormaDePagamento,Pago) VALUES (?,?,?,?,?,?,?,?)", [
                nome_cliente,
                pedido,
                CPF,
                telefone,
                endereco,
                valortotal,
                formadePagamento,
                Pago
            ], (error) => {
                if (error) {
                    res.status(400).send({ error })
                } else {
                    res.send()
                }
            })

        } else {
            res.status(400).send()
        }
    })

    routes.get(path, Auth, async (req, res) => {
        db.query("SELECT * FROM pedidos", (error, results) => {
            return res.json(results)
        })
    })

    routes.get(path + '/:pessoa', Auth, async (req, res) => {
        const { pessoa } = req.params;
        db.query(`SELECT * FROM pedidos WHERE NomeCliente LIKE ?`, '%' + pessoa + '%', (error, results) => {
            if (results.length == 0) {
                return res.status(404).send()
            }
            return res.json(results)
        })
    })

    routes.get(path + '/id/:pessoa', Auth, async (req, res) => {
        const { pessoa } = req.params;
        db.query(`SELECT * FROM pedidos WHERE id=?`, [pessoa], (error, results) => {
            if (results.length == 0) {
                return res.status(404).send()
            }
            return res.json(results)
        })
    })


    routes.delete(pathHistory + '/:id', Auth, async (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM historicoPedidos WHERE id=?", [id], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
        })
        return res.send();
    })


    routes.delete(path + '/:id', Auth, async (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM pedidos WHERE id=?", [id], (error) => {
            if (error) {
                return res.status(400).send({
                    error
                })
            }
        })
        return res.send();
    })

    export default routes;