create database ish_system;
use ish_system;

create table usuarios(
    id int primary key auto_increment,
    username varchar(124) unique,
    senha varchar(124),
    grupo varchar(124)
);

create table produtos (
    codigo int unique,
    tipo varchar(364) ,
    nome varchar(364),
    preco double,
    tamanho double,
    imagem varchar(724)
);

create table pedidos (
    id int primary key auto_increment unique,
    NomeCliente varchar(364),
    Pedido varchar(364),
    CPF varchar(14),
    Telefone varchar(20),
    Endereco varchar(364),
    ValorTotal double,
    FormaDePagamento varchar(364),
    Pago varchar(320)
);

create table historicoPedidos (
    id int primary key auto_increment unique,
    NomeCliente varchar(364),
    Pedido varchar(364),
    CPF varchar(14),
    Telefone varchar(20),
    Endereco varchar(364),
    ValorTotal double,
    FormaDePagamento varchar(364)
);
