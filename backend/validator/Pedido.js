const yup = require('yup');

export default yup.object().shape({
    nome_cliente: yup.string().required(),
    pedido: yup.string().required(),
    telefone: yup.string().required(),
    endereco: yup.string().required(),
    valortotal: yup.number().round().required(),
    formadePagamento: yup.string().required(),
    Pago: yup.string().required()
})