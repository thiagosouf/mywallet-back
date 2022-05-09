import joi from "joi";
import db from "../db/db.js";
import dayjs from 'dayjs';


export async function painel(req, res) {
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
        const movimentacao = await db.collection("movimentacao").insertOne({data: dayjs().format('DD/MM/YYYY'), email, descricao, valor, tipo});
        console.log("Movimentação cadastrada");
        return res.status(201).send("Movimentação cadastrada");
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao cadastrar movimentação");
    }
}


export async function painelGet(req, res) {
    console.log(req.body)
    

    try{
        const extrato = await db.collection("movimentacao").find({email}).toArray();
        console.log("Movimentações");
        return res.status(201).send(extrato);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("Erro ao buscar movimentações");
    }
}