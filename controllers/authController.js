import joi from "joi";
import db from "../db/db.js";


export async function cadastro(req, res) {
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
}


export async function login(req, res) {
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
        let usuario = user[0];
        console.log("Usuário logado");
        console.log(usuario);
        return res.status(201).send(usuario);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao Fazer Login");
    }
}
