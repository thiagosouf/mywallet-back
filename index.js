import express, {json} from "express";
import cors from "cors";
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(json());

const users = [
    {name: 'João', email: "teste@teste.com", senha: 1234}, 
    {name: 'João1', email: "teste@teste1.com", senha: 1234},
    {name: 'João2', email: "teste@teste2.com", senha: 1234},
    {name: 'João3', email: "teste@teste3.com", senha: 1234},
]

const movimentacao =[
    {data: '01/01',name: 'João', descricao: 'Venda do carro', valor: 6000, tipo: 'entrada'},
    {data: '02/01',name: 'João', descricao: 'salario', valor: 5000, tipo: 'entrada'},
    {data: '03/01',name: 'João', descricao: 'Aluguel', valor: 3000, tipo: 'saida'},
    {data: '04/01',name: 'João', descricao: 'pró-labore', valor: 2000, tipo: 'entrada'},
    {data: '05/01',name: 'João1', descricao: 'Venda do carro', valor: 16000, tipo: 'entrada'},
    {data: '06/01',name: 'João1', descricao: 'salario', valor: 4000, tipo: 'entrada'},
    {data: '07/01',name: 'João1', descricao: 'Aluguel', valor: 5000, tipo: 'saida'},
]

app.post ("/cadastro", (req, res) => {
    const {name, email, senha} = req.body;
    if (name === "" || email === "" || senha === "") {
        console.log("Dados incompletos");
        return res.status(422).send("Dados incompletos");
    }
    users.push({name, email, senha});
    console.log(`Usuário ${name} cadastrado com sucesso`);
    res.status(201).send(users);
})

app.post ("/login", (req, res) => {
    const {email, senha} = req.body;
    const user = users.find(usuario => usuario.email === email && usuario.senha === senha);
    if (!user) {
        console.log("Usuário ou senha inválidos");
        return res.status(422).send("Usuário ou senha inválidos");
    }
    console.log(`Usuário ${user.name} logado com sucesso`);
    res.status(201).send(user)
})

app.post ("/painel", (req, res) => {
    const {valor, descricao, tipo} = req.body;
    if (valor === "" || descricao === "" || tipo === "") {
        console.log("Dados incompletos");
        return res.status(422).send("Dados incompletos");
    }
    movimentacao.push({data: dayjs().format('DD/MM'), name: req.body.name, descricao, valor, tipo});
    console.log(`Movimentação cadastrada com sucesso`);
    res.status(201).send("Movimentação cadastrada com sucesso");
})
app.get ("/painel", (req, res) => {
    const {name} = req.body;
    const extrato = movimentacao.filter(usuario => usuario.name === name);
    console.log(extrato);
    res.status(201).send(extrato)
})

app.listen(5000, console.log("Server ligado na porta 5000"));
