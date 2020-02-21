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

    const [faturamento, setFaturamento] = useState({});

    const [SearchProdutoText, setSearchProdutoText] = useState('')

    const [ProdutoModal, setProdutoModal] = useState({})
    const [ModalProdutoShow, setShowModalProduto] = useState(false)

    const [PedidoModal, setPedidoModal] = useState({});
    const [showModal, setShowModal] = useState(false)

    const [PedidoProduto, setPedidoProduto] = useState({})
    const [HistoricoLista, setHistoricoLista] = useState([])
    const [PedidosLista, setPedidosLista] = useState([])
    const [ProdutosLista, setProdutosLista] = useState([])

    const [ModalCriarPedidoShow, setModalCriarPedido] = useState(false);
    const [idSel, idSelecionado] = useState(0)

    const [codigoProdutoNovo, setCodigoProdutoNovo] = useState(0);
    const [tipoProdutoNovo, setTipoProdutoNovo] = useState("");
    const [NomeDoProdutoProdutoNovo, setNomeDoProdutoProdutoNovo] = useState("");
    const [PrecoProdutoNovo, setPrecoProdutoNovo] = useState(0.0);
    const [QuantidadeProdutoNovo, setQuantidadeProdutoNovo] = useState(0);

    const [nomePedidoNovo, setNomePedidoNovo] = useState("");
    const [CPFPedidoNovo, setCPFPedidoNovo] = useState("");
    const [TelefonePedidoNovo, setTelefonePedidoNovo] = useState("");
    const [EnderecoPedidoNovo, setEnderecoPedidoNovo] = useState("");
    const [FormaDePagamentoPedidoNovo, setFormaDePagamentoPedidoNovo] = useState("");
    const [JaPagouPedidoNovo, setJaPagouPedidoNovo] = useState("Não");

    const [Quantidade, setQuantidade] = useState(0)
    const [EscolhaAlterar,setEscolhaAlterar] = useState("");

    const [RemoverQuantidadeModalShow, setRemoverQuantidadeModalShow] = useState(false)

    const CadastrarProduto = async (data) => {
        await api.post('/produtos', {
            "codigo": codigoProdutoNovo,
            "tipo": tipoProdutoNovo,
            "nome": NomeDoProdutoProdutoNovo,
            "preco": PrecoProdutoNovo,
            "quantidade": QuantidadeProdutoNovo
        });
        notification.success({ message: "Produto Criado com Sucesso!" });
        FetchProdutos()
    }

    const createPedido = async () => {

        await api.post('/process/order', {
            nome_cliente: nomePedidoNovo,
            pedido: PedidoProduto.nome,
            CPF: CPFPedidoNovo,
            telefone: TelefonePedidoNovo,
            endereco: EnderecoPedidoNovo,
            valortotal: PedidoProduto.preco,
            formadePagamento: FormaDePagamentoPedidoNovo,
            Pago: JaPagouPedidoNovo
        })
        FetchPedidos()

        notification.success({
            message: "Pedido Criado com Sucesso!"
        })

    }

    const fetchFaturamento = async () => {
        const response = await api.get('/produtos/faturamento')
        setFaturamento(response.data)
        console.log(response.data)
    }

    const ZerarFaturamento = async () => {
        await api.post('/produtos/zerarfaturamento')
        fetchFaturamento()
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


    const SearchProduto = async () => {
        const response = await api.get('/produtos/' + SearchProdutoText)
        console.log(response.data)
        setProdutosLista(response.data)
    }

    const SearchPedido = async () => {
        const response = await api.get('/process/order/' + SearchText)
        console.log(response.data)
        setPedidosLista(response.data)
    }

    const AtualizarFaturamento = async (data) => {

        await api.post('/produtos/faturar')
        await api.post('/produtos/faturamento', {
            valor: data.ValorTotal
        })
        fetchFaturamento()
    }

    const DefinirPago = async (id, pedido) => {
        await api.post(`/process/order/pay/${id}`);
        await api.delete("/process/order/" + id)
        await api.post('/produtos/remover/' + pedido);


        FetchPedidos()
        FetchHistorico()
        FetchProdutos()
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

    const AdicionarQuantidade = async () => {
        await api.post(`/produtos/adicionar/${ProdutoModal.nome}/${Quantidade}`);
        notification.success({ message: "Quantidade Adicionada!" })
        setShowModalProduto(false)
        FetchProdutos()
    }

    const RemoverQuantidade = async () => {
        await api.post(`/produtos/remover/${ProdutoModal.nome}/${Quantidade}`);
        notification.success({ message: "Quantidade Removida!" })
        setShowModalProduto(false)
        FetchProdutos()
    }

    const AlterarPreco = async () => {
        await api.post(`/produtos/preco/${ProdutoModal.nome}`,{
            valor: Quantidade
        });
        notification.success({ message: "Preço Alterado!" })
        setShowModalProduto(false)
        FetchProdutos()
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
        fetchFaturamento();
    }, [Init])

    return (
        <Content className="index">
            <Menu
                theme="dark"
                onClick={() => { }}
                style={{ width: 256, marginTop: '5%', marginLeft: '30px' }}
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
                    visible={RemoverQuantidadeModalShow}
                    title={"Editando Produto " + ProdutoModal.nome}
                    okText="Alterar"
                    cancelText="Cancelar"
                    onCancel={() => {
                        setRemoverQuantidadeModalShow(false)
                    }}
                    onOk={() => {
                        setRemoverQuantidadeModalShow(false)
                        switch(EscolhaAlterar){
                            case "RemoverQuantidade":
                                RemoverQuantidade()
                            break;
                            case "AdicionarQuantidade":
                                AdicionarQuantidade()
                            break;
                            case "AlterarPreço":
                                AlterarPreco()
                            break;
                        }
                        
                    }}
                >
                    <InputNumber placeholder="Valor" style={{ width: '100%' }} onChange={(e) => {
                        setQuantidade(e)
                    }} />
                </Modal>

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
                        createPedido();
                        FetchPedidos()
                    }}
                >
                    <>
                        <Input placeholder="Nome do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            setNomePedidoNovo(e.target.value);
                        }} />
                        <Input placeholder="CPF do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            try {
                                setCPFPedidoNovo(e.target.value);
                            } catch{ }
                        }} />
                        <Input placeholder="Telefone do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            try {
                                setTelefonePedidoNovo(e.target.value);
                            } catch{ }
                        }} />
                        <Input placeholder="Endereço do Cliente" className="inputFormCriarPedido" onChange={(e) => {
                            setEnderecoPedidoNovo(e.target.value);
                        }} />
                        <Input placeholder="Forma de Pagamento (Cartão, Boleto, Dinheiro)" className="inputFormCriarPedido" onChange={(e) => {
                            setFormaDePagamentoPedidoNovo(e.target.value);
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
                        setModalCriarPedido(true)
                        setPedidoProduto(ProdutoModal)
                    }}
                >
                    <div className="infoProduto">
                        <nav className="_">
                            <h3>Tipo: {ProdutoModal.tipo}</h3>

                            <h4>Quantidade: {ProdutoModal.quantidade}</h4>
                            <h1>R$ {ProdutoModal.preco}</h1>
                            <Button onClick={() => {
                                setEscolhaAlterar("RemoverQuantidade")
                                setRemoverQuantidadeModalShow(true)
                            }}>Remover Quantidade</Button>
                            <Button onClick={() => {
                                setEscolhaAlterar("AdicionarQuantidade")
                                setRemoverQuantidadeModalShow(true)
                            }}>Adicionar Quantidade</Button>
                            <Button onClick={() => {
                                setEscolhaAlterar("AlterarPreço")
                                setRemoverQuantidadeModalShow(true)
                            }}>Alterar Preço</Button>
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
                                setCodigoProdutoNovo(e)
                            } catch{ }
                        }}></InputNumber>
                        <Divider />
                        <Typography>Tipo</Typography>
                        <Input placeholder="Tipo" className="produtoCadastroInput" onChange={(e) => {
                            setTipoProdutoNovo(e.target.value);
                        }} />
                        <Divider />
                        <Typography>Nome do Produto</Typography>
                        <Input placeholder="Nome" className="produtoCadastroInput" onChange={(e) => {
                            setNomeDoProdutoProdutoNovo(e.target.value);
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

                                    setPrecoProdutoNovo(parseFloat(e));
                                } catch{ }
                            }}
                        />

                        <Divider />
                        <Typography>Quantidade</Typography>
                        <InputNumber placeholder="Quantidade" className="produtoCadastroInput" onChange={(e) => {
                            try {
                                setQuantidadeProdutoNovo(e);
                            } catch{ }
                        }} />
                        <Button style={{ marginTop: 20 }} onClick={() => {
                            CadastrarProduto()
                            setButtonMenu("lista-produtos")
                        }}>Cadastrar</Button>
                    </div>
                )}


                {btnMenu == "historico" && (
                    <>
                        <Typography style={{ marginBottom: '20px', fontSize: 17 }}>Historico de Pedidos de Clientes</Typography>
                        <div className="status">

                            <Statistic title="Faturamento" className="statusUN" value={faturamento.faturamento} />
                            <Statistic title="Peças Vendidas" className="statusUN" value={faturamento.pecasVendidas} />
                        </div>
                        <Button onClick={() => {
                            ZerarFaturamento()
                        }} >Zerar</Button>
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
                                    DefinirPago(pedido.id, pedido.Pedido)
                                    AtualizarFaturamento(pedido)
                                }}>Definir como Pago</Button>
                                <Button style={{ color: 'red' }} onClick={() => DeletePedido(pedido.id)}>Deletar</Button>
                            </Card>
                        )
                    })
                }


                {btnMenu == "lista-produtos" && ProdutosLista.length > 0 && (
                    <>
                        <Input placeholder="Pesquisar (Codigo)" onChange={(e) => {
                            setSearchProdutoText(e.target.value)
                        }} style={{
                            marginTop: 15,
                            width: '300px'
                        }} />
                        <Button title="Pesquisar" style={{
                            marginTop: 6
                        }} onClick={() => {
                            SearchProduto()
                        }}>Pesquisar</Button>
                    </>
                )}

                {btnMenu == "lista-produtos" && (
                    <>


                        <div className="ProdutosLista">

                            {ProdutosLista.map((produto) => {
                                console.log(produto.quantidade)
                                if (produto.quantidade > 0) {
                                    return (
                                        <Card className="produtoCard">
                                            <h1>{produto.nome} <font color="green">R$ {produto.preco}</font> <p style={{fontSize:12}}>{produto.quantidade}qtd</p></h1>
                                            <img src={`http://localhost:8000/produtos/img/${produto.codigo}`} className="imagemProduto"></img>
                                            <Button onClick={() => {
                                                DeleteProduto(produto.codigo)
                                            }} style={{ color: 'red' }}>Deletar</Button>
                                            <Button onClick={() => {
                                                setProdutoModal(produto)
                                                setShowModalProduto(true)
                                            }}>Informações</Button>
                                            <Button onClick={() => {
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
                                } else {
                                    return (
                                        <Card className="produtoCard">
                                            <h1>{produto.nome}</h1>
                                            <h4 style={{ color: 'red' }}>Esgotado!</h4>
                                            <img src={`http://localhost:8000/produtos/img/${produto.codigo}`} className="imagemProduto"></img>
                                            <Button onClick={() => {
                                                DeleteProduto(produto.codigo)
                                            }} style={{ color: 'red' }}>Deletar</Button>
                                            <Button onClick={() => {
                                                setProdutoModal(produto)
                                                setShowModalProduto(true)
                                            }}>Informações</Button>
                                            <Button onClick={() => {

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
                                }
                            })}
                        </div>
                    </>
                )}


            </Content>

        </Content >
    )
}

export default Home;