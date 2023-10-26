import express from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";
import Joi from "joi";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import { db } from "./database/database.connection.js";

const app = express(); 
app.use(cors());
app.use(express.json());



const createUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const loginUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const createService = Joi.object({
    creator: Joi.string().required(),
    serviceName: Joi.string().required(),
    serviceDescription: Joi.string().required(),
    serviceCategory: Joi.string().required(),
    servicePrice: Joi.string().required(),
    serviceDeadline: Joi.string().required(),
    creatorEmail: Joi.string().email().required(),
});


const buyService = Joi.object({
    buyer: Joi.string().required(),
    seller: Joi.string().required(),
    serviceId: Joi.number().integer().required(),
    serviceQtd: Joi.number().integer().required(),
    transactionPrice: Joi.number().required(),
});



/// adicionar para o usuario uma coluna de avaliação

let token;

const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const lowerCaseemail = email.toLowerCase();

    console.log('SUCCESS ON ENTERING')

    try {

        const validation = createUser.validate({ name, email, password }, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            return res.status(422).json(errors);
        }

        if (password !== confirmPassword) {
            return res.status(422).send('Password and confirmPassword must match.');
        }

        // Encriptação da senha
        const passCrypt = bcrypt.hashSync(password, 10);

        const userVerify = await db.query('SELECT * FROM USERS where email = $1', [email]);
        if (userVerify.rows.length > 0) {
            return res.status(409).send('There is an user already with this email!');
        } else {
            const user = await db.query('INSERT INTO USERS (name, email, password, "createdat") values ($1, $2, $3, $4);', [name, lowerCaseemail, passCrypt, createdAt]);
            console.log('USER CREATED!')
            return res.status(201).send('User created!');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }

})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})