import express, {json} from "express";
import cors from "cors";
import dayjs from 'dayjs';
import dotenv from "dotenv";
import {MongoClient} from "mongodb";
import joi from "joi";

// import { cadastro, login } from "./controllers/authController.js";
// import { painel, painelGet } from "./controllers/displayController.js";
import db from "./db/db.js";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

let usuario


app.post ("/cadastro", async (req, res) => {
    const {name, email, senha} = req.body;
    const schemaUsers = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required() 
    })
    const result = schemaUsers.validate({name, email, senha});

    if (result.error) {
        return res.status(422).send(result.error.details[0].message);
    }

    try{
        const user = await db.collection("users").find({email}).toArray();
        if (user.length > 0) {
            console.log("Usuário já existe");
            return res.status(422).send("Usuário já existe");
        }
        await db.collection("users").insertOne({name, email, senha});
        console.log("Usuário cadastrado");
        return res.status(201).send("Usuário cadastrado");
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao cadastrar");
    }
})

app.post ("/login", async (req, res) => {
    const {email, senha} = req.body;
    const schemaUsers = joi.object({
        email: joi.string().email().required(),
        senha: joi.string().required()
    })
    const result = schemaUsers.validate({email, senha});

    if (result.error) {
        return res.status(422).send(result.error.details[0].message);
    }

    try{
        const user = await db.collection("users").find({email, senha}).toArray();
        // if (!user)
        if (user.length === 0) {
            console.log("Usuário ou senha não conferem");
            return res.status(422).send("Usuário ou senha não conferem");
        }
        usuario = user[0];
        console.log("Usuário logado");
        console.log(usuario);
        return res.status(201).send(usuario);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao Fazer Login");
    }
})

// app.post("/painel", painel)
// app.get("/painel", painelGet)

app.post ("/painel", async (req, res) => {
    const {valor, descricao, tipo} = req.body;
    const schemaMovimentacao = joi.object({
        tipo: joi.string().required(),
        descricao: joi.string().required(),
        valor: joi.number().required()
    })
    const result = schemaMovimentacao.validate({valor, descricao, tipo});

    if (result.error) {
        return res.status(422).send(result.error.details[0].message);
    }

    try{
        const movimentacao = await db.collection("movimentacao").insertOne({data: dayjs().format('DD/MM'), email: usuario.email, descricao, valor, tipo});
        console.log("Movimentação inserida");
        return res.status(201).send("Movimentação inserida");
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao cadastrar movimentação");
    }
})
app.get ("/painel", async (req, res) => {
    const email = usuario.email;

    try{
        const extrato = await db.collection("movimentacao").find({email}).toArray();
        console.log("Movimentações");
        return res.status(201).send(extrato);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao buscar movimentações");
    }
})

app.listen((process.env.PORTA), console.log(`Server ligado na porta ${process.env.PORTA}`));    
