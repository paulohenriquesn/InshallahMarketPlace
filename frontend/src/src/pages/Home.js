import React, { useEffect, useState } from 'react'
import { Menu, Icon, notification, Layout, List, Typography, Card, Input, Button, Modal, Divider, Timeline, Statistic } from 'antd'
import 'antd/dist/antd.css';

import api from '../services/api'

import '../pages/Home.css'
import Search from 'antd/lib/input/Search';

const { SubMenu } = Menu;
const { Content } = Layout;

const Home = ({ history }) => {

    const [Init, setInit] = useState(true);
    const [btnMenu, setButtonMenu] = useState('lista-pedidos');
    const [SearchText, setSearchText] = useState('')

    const [PedidoModal, setPedidoModal] = useState({});
    const [showModal, setShowModal] = useState(false)

    const [faturamento,setFaturamento] = useState(0.0);

    const [HistoricoLista, setHistoricoLista] = useState([])
    const [PedidosLista, setPedidosLista] = useState([])
    const [ProdutosLista, setProdutosLista] = useState([])


    const FetchProdutos = async () => {
        const response = await api.get('/produtos')
        setProdutosLista(response.data)
        console.log(response.data)
    }
  
    const FetchHistorico = async () => {
        const response = await api.get('/process/history')
        console.log(response.data);
        setHistoricoLista(response.data);

    }
    const FetchPedidos = async () => {
        const response = await api.get('/process/order/')
        console.log(response.data)
        setPedidosLista(response.data)
    }

    const SearchPedido = async () => {
        const response = await api.get('/process/order/' + SearchText)
        console.log(response.data)
        setPedidosLista(response.data)
    }

    const DefinirPago = async (id) => {
        await api.post(`/process/order/pay/${id}`);
        await api.delete("/process/order/" + id)

        FetchPedidos()
        FetchHistorico()
        notification.success({
            message: "Pedido #" + id + " Pago"
        })

    }

    

    const DeletePedidoHistorico = async (id) => {

        await api.delete("/process/history/" + id)

        await FetchHistorico()

        notification.error({
            message: "Historico de Pedido #" + id + " Deletado"
        })
    }

    const DeletePedido = async (id) => {

        await api.delete("/process/order/" + id)

        await FetchPedidos()

        notification.error({
            message: "Pedido #" + id + " Deletado"
        })
    }

    useEffect(() => {
        if (Init)
            notification.info({
                message: "Olá seja bem vindo :)"
            })
        FetchPedidos();
        FetchHistorico();
        FetchProdutos();
    }, [Init])

    return (
        <Content className="index">
            <Menu
                onClick={() => { }}
                style={{ width: 256 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
            >
                <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <Icon type="appstore" />
                            <span>Painel Inshallah</span>
                        </span>
                    }
                >
                    <Menu.ItemGroup key="g1" title="Loja">
                        <Menu.Item key="1" onClick={() => {
                            setButtonMenu('lista-pedidos')
                        }}>Pedidos</Menu.Item>
                        <Menu.Item key="3" onClick={() => {
                            setButtonMenu('historico')
                        }}>Historico</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g2" title="Produtos">
                        <Menu.Item key="4">Cadastrar Produto</Menu.Item>
                        <Menu.Item key="5" onClick={() => {
                            setButtonMenu('lista-produtos')
                        }}>Lista de Produtos</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g3" title="Pedidos">
                        <Menu.Item key="6" onClick={() => {
                            setButtonMenu('cadastrar-pedido')
                        }}>Cadastrar Pedido</Menu.Item>
                    </Menu.ItemGroup>
                </SubMenu>

            </Menu>

            <Content className="content">


                <Modal
                    visible={showModal}
                    title={PedidoModal.NomeCliente + "#" + PedidoModal.id + " " + PedidoModal.Pedido}
                    okText="Fechar"
                    cancelText=" "
                    onCancel={() => {
                        setShowModal(false)
                    }}
                    onOk={() => { setShowModal(false) }}
                >
                    <>
                        <p>{PedidoModal.NomeCliente}</p>
                        <p>{PedidoModal.Pedido}</p>
                        <p>{PedidoModal.CPF}</p>
                        <p>{PedidoModal.Endereco}</p>
                        <p>{PedidoModal.Telefone}</p>
                        <h4>{PedidoModal.FormaDePagamento}</h4>
                        <h2>R$ {PedidoModal.ValorTotal}</h2>
                    </>
                </Modal>


                {btnMenu == "historico" && (
                    <>
                        <Typography style={{ marginBottom: '20px',fontSize: 17 }}>Historico de Pedidos de Clientes</Typography>
                        <div className="status">

                            <Statistic title="Faturamento" className="statusUN" value={0} />
                            <Statistic title="Peças Vendidas" className="statusUN" value={0} />

                        </div>
                        <Divider />
                        <Timeline>
                        
                            {HistoricoLista.map((pedido) => {      
                                       
                                return (
                                    <div className="pedidoHistorico">
                                    <Timeline.Item color="green" style={{
                                    width: '400px'
                                }}>{pedido.NomeCliente} {pedido.Pedido} R$ {pedido.ValorTotal}</Timeline.Item>
                                <Button onClick={() => {
                                    setPedidoModal(pedido)
                                    setShowModal(true)
                                }}>Informações</Button>
                                <Button onClick={() => {
                                    DeletePedidoHistorico(pedido.id)
                                }} style={{color: 'red'}}>Deletar</Button>
                                </div>
                                )
                            })}

                        </Timeline>

                    </>
                )}

                {btnMenu == "lista-pedidos" && PedidosLista.length > 0 && (
                    <>
                        <Input placeholder="Pesquisar" onChange={(e) => {
                            setSearchText(e.target.value)
                        }} style={{
                            marginTop: 15
                        }} />
                        <Button title="Pesquisar" style={{
                            marginTop: 6
                        }} onClick={() => {
                            SearchPedido()
                        }}>Pesquisar</Button>
                    </>
                )}

                {btnMenu == "lista-pedidos" &&
                    PedidosLista.map((pedido) => {
                        console.log(pedido)
                        return (
                            <Card className="pedidoCard" title={pedido.NomeCliente + "#" + pedido.id} extra={<a onClick={() => {
                                //history.push("/pedido/" + pedido.id)
                                setPedidoModal(pedido)
                                setShowModal(true)
                            }}>Ver Pedido</a>} style={{ width: 300 }}>
                                <p>{pedido.Pedido}</p>
                                <p>{pedido.ValorTotal}</p>
                                <p>{pedido.Endereco}</p>
                                <p>Pago: {pedido.Pago}</p>
                                <Divider />
                                <Button style={{ color: 'green' }} onClick={() => {
                                    DefinirPago(pedido.id)
                                }}>Definir como Pago</Button>
                                <Button style={{ color: 'red' }} onClick={() => DeletePedido(pedido.id)}>Deletar</Button>
                            </Card>
                        )
                    })
                }

                {btnMenu == "lista-produtos" && (
                    <>
                    {ProdutosLista.map((produto) => {
                        return(
                            <Card className="produtoCard">
                                <h1>{produto.nome}</h1>
                                <img src={`http://localhost:8000/produtos/img/${produto.codigo}`} className="imagemProduto"></img>
                                <Button>Deletar</Button>
                            </Card>
                        )
                    })}
                    </>
                )}


            </Content>

        </Content>
    )
}

export default Home;