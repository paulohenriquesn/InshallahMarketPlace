const yup = require('yup');

export default yup.object().shape({
    codigo: yup.number().integer().required(),
    tipo: yup.string().required(),
    nome: yup.string().required(),
    preco: yup.number().round().required(),
    tamanho: yup.number().round(),
    imagem: yup.string(),
    quantidade: yup.number().required()
})