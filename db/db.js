import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db = null;

try{
    await mongoClient.connect();
    db = mongoClient.db(process.env.BANCO);
    console.log("Conexão com o banco dados MongoDB estabelecida!");
    }
catch(err){
    console.log("Erro ao conectar com o banco de dados: " + err);
}

export default db;