const yup = require('yup');

export default yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required()
})