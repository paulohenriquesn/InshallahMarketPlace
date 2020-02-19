import React, { useEffect, useState } from 'react'
import { Menu, Icon, notification, Layout, List, Typography, Card, Input, Button, Modal, Divider, Timeline, Statistic, InputNumber, Upload } from 'antd'
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

    const [ProdutoModal, setProdutoModal] = useState({})
    const [ModalProdutoShow, setShowModalProduto] = useState(false)

    const [PedidoModal, setPedidoModal] = useState({});
    const [showModal, setShowModal] = useState(false)

    const [PedidoProduto, setPedidoProduto] = useState({})

    const [faturamento, setFaturamento] = useState(0.0);

    const [HistoricoLista, setHistoricoLista] = useState([])
    const [PedidosLista, setPedidosLista] = useState([])
    const [ProdutosLista, setProdutosLista] = useState([])

    const [ModalCriarPedidoShow, setModalCriarPedido] = useState(false);
    const [idSel, idSelecionado] = useState(0)

    var ProdutoNovo = {
        Codigo: 0,
        Tipo: "",
        NomeDoProduto: "",
        Preco: 0.0,
        Quantidade: 0
    }

    var PedidoNovo = {
        nomeCliente: "",
        CPF: "",
        Telefone: "",
        "Endereco": "",
        "FormaDePagamento": "",
        "JaPagou": ""
    }

    const CadastrarProduto = async (data) => {
        await api.post('/produtos', {
            "codigo": data.Codigo,
            "tipo": data.Tipo,
            "nome": data.NomeDoProduto,
            "preco": data.Preco,
            "quantidade": data.Quantidade
        });
        notification.success({ message: "Produto Criado com Sucesso!" });

        var ProdutoNovo = {
            Codigo: 0,
            Tipo: "",
            NomeDoProduto: "",
            Preco: 0.0,
            Quantidade: 0
        }
        FetchProdutos()
    }

    const createPedido = async (data) => {
        console.log(data)
        const data_ = {
            nome_cliente: data.nomeCliente,
            pedido: PedidoProduto.nome,
            CPF: data.CPF,
            telefone: data.Telefone,
            endereco: data.Endereco,
            valortotal: PedidoProduto.preco,
            formadePagamento: data.FormaDePagamento,
            Pago: data.JaPagou
        };
        console.log(data_)
        await api.post('/process/order', {
            nome_cliente: data.nomeCliente,
            pedido: PedidoProduto.nome,
            CPF: PedidoNovo.CPF,
            telefone: data.Telefone,
            endereco: data.Endereco,
            valortotal: PedidoProduto.preco,
            formadePagamento: data.FormaDePagamento,
            Pago: data.JaPagou
        })
        FetchPedidos()
        PedidoNovo = {
            nomeCliente: "",
            CPF: "",
            Telefone: "",
            "Endereco": "",
            "FormaDePagamento": "",
            "JaPagou": ""
        }

        notification.success({
            message: "Pedido Criado com Sucesso!"
        })

    }

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

    const DeleteProduto = async (codigo) => {
        await api.delete("/produtos/" + codigo)

        await FetchProdutos()

        notification.error({
            message: "Produto #" + codigo + " Deletado"
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

    const props = {
        name: 'img',
        action: 'http://localhost:8000/produtos/' + idSel,

        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                notification.success({ message: `${info.file.name} Imagem setada com sucesso!` });
            } else if (info.file.status === 'error') {
                notification.error({ message: `${info.file.name} Erro ao tentar upar a imagem!` })
            }
        },
    };

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
                        <Menu.Item key="4" onClick={() => {
                            setButtonMenu('cadastrar-produto')
                        }}>Cadastrar Produto</Menu.Item>
                        <Menu.Item key="5" onClick={() => {
                            setButtonMenu('lista-produtos')
                        }}>Lista de Produtos</Menu.Item>
                    </Menu.ItemGroup>

                </SubMenu>

            </Menu>

            <Content className="content">


                <Modal
                    visible={ModalCriarPedidoShow}
                    title="Novo Pedido"
                    okText="Criar Pedido"
                    cancelText="Cancelar"
                    onCancel={() => {
                        setModalCriarPedido(false)
                    }}
                    onOk={() => {
                        setModalCriarPedido(false)
                        createPedido(PedidoNovo);
                        FetchPedidos()
                    }}
                >
                    <>
                        <Input placeholder="Nome do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            PedidoNovo.nomeCliente = e.target.value;
                        }} />
                        <Input placeholder="CPF do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            try {
                                PedidoNovo.CPF = e.target.value;
                            } catch{ }
                        }} />
                        <Input placeholder="Telefone do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            try {
                                PedidoNovo.Telefone = e.target.value;
                            } catch{ }
                        }} />
                        <Input placeholder="Endereço do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            PedidoNovo.Endereco = e.target.value;
                        }} />
                        <Input placeholder="Forma de Pagamento (Cartão, Boleto, Dinheiro)" className="inputFormCriarPedido" onChange={(e) => {
                            PedidoNovo.FormaDePagamento = e.target.value;
                        }} />
                        <Input placeholder="Já Pagou? (Sim ou Não)" className="inputFormCriarPedido" onChange={(e) => {
                            PedidoNovo.JaPagou = e.target.value;
                        }} />
                    </>
                </Modal>

                <Modal
                    visible={ModalProdutoShow}
                    title={ProdutoModal.nome + " #" + ProdutoModal.codigo}
                    okText="Novo Pedido"
                    cancelText="Fechar"
                    onCancel={() => {
                        setShowModalProduto(false)
                    }}
                    onOk={() => {
                        setShowModalProduto(false)
                        PedidoNovo = {
                            nomeCliente: "",
                            CPF: "",
                            Telefone: "",
                            "Endereco": "",
                            "FormaDePagamento": "",
                            "JaPagou": ""
                        }
                        setModalCriarPedido(true)
                        setPedidoProduto(ProdutoModal)
                    }}
                >
                    <div className="infoProduto">
                        <nav className="_">
                            <h3>Tipo: {ProdutoModal.tipo}</h3>
                            <h3>Tamanho: {ProdutoModal.tamanho}</h3>
                            <h4>Quantidade: {ProdutoModal.quantidade}</h4>
                            <h1>R$ {ProdutoModal.preco}</h1>
                        </nav>
                        <img src={`http://localhost:8000/produtos/img/${ProdutoModal.codigo}`} className="imagemProduto_"></img>
                    </div>
                </Modal>


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



                {btnMenu == "cadastrar-produto" && (
                    <div className="produtoCadastro">
                        <Typography style={{ marginTop: 20 }}>Codigo</Typography>
                        <InputNumber className="produtoCadastroInput" onChange={(e) => {
                            try {
                                ProdutoNovo.Codigo = e
                            } catch{ }
                        }}></InputNumber>
                        <Divider />
                        <Typography>Tipo</Typography>
                        <Input placeholder="Tipo" className="produtoCadastroInput" onChange={(e) => {
                            ProdutoNovo.Tipo = e.target.value;
                        }} />
                        <Divider />
                        <Typography>Nome do Produto</Typography>
                        <Input placeholder="Nome" className="produtoCadastroInput" onChange={(e) => {
                            ProdutoNovo.NomeDoProduto = e.target.value;
                        }} />
                        <Divider />
                        <Typography>Preço</Typography>
                        <InputNumber
                            defaultValue={0}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}

                            className="produtoCadastroInput"
                            placeholder="Preço do Produto"
                            onChange={(e) => {
                                try {

                                    ProdutoNovo.Preco = parseFloat(e);
                                } catch{ }
                            }}
                        />

                        <Divider />
                        <Typography>Quantidade</Typography>
                        <InputNumber placeholder="Quantidade" className="produtoCadastroInput" onChange={(e) => {
                            try {
                                ProdutoNovo.Quantidade = e;
                            } catch{ }
                        }} />
                        <Button style={{ marginTop: 20 }} onClick={() => {
                            CadastrarProduto(ProdutoNovo)
                            setButtonMenu("lista-produtos")
                        }}>Cadastrar</Button>
                    </div>
                )}


                {btnMenu == "historico" && (
                    <>
                        <Typography style={{ marginBottom: '20px', fontSize: 17 }}>Historico de Pedidos de Clientes</Typography>
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
                                        }} style={{ color: 'red' }}>Deletar</Button>
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
                    <div className="ProdutosLista">
                        {ProdutosLista.map((produto) => {
                            return (
                                <Card className="produtoCard">
                                    <h1>{produto.nome}</h1>
                                    <img src={`http://localhost:8000/produtos/img/${produto.codigo}`} className="imagemProduto"></img>
                                    <Button onClick={() => {
                                        DeleteProduto(produto.codigo)
                                    }} style={{ color: 'red' }}>Deletar</Button>
                                    <Button onClick={() => {
                                        setProdutoModal(produto)
                                        setShowModalProduto(true)
                                    }}>Informações</Button>
                                    <Button onClick={() => {
                                        PedidoNovo = {
                                            nomeCliente: "",
                                            CPF: "",
                                            Telefone: "",
                                            "Endereco": "",
                                            "FormaDePagamento": "",
                                            "JaPagou": ""
                                        }
                                        setModalCriarPedido(true)
                                        setPedidoProduto(produto)
                                    }}>Novo Pedido</Button>
                                    <Upload  {...props}>
                                        <Button onClick={() => {
                                            idSelecionado(produto.codigo)
                                        }}>
                                            <Icon type="upload" /> Definir Imagem Produto
                    </Button>
                                    </Upload>
                                </Card>
                            )
                        })}
                    </div>
                )}


            </Content>

        </Content >
    )
}

export default Home;