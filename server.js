require("dotenv").config();

const axios = require("axios");
const express = require("express");
const utils = require("./utils/data");

const {tokenVerification} = require('./middlewares/authentication')

const app = express();
const FormData = require('form-data')

const crypto = require('./utils/simpleCrypto');

const PORT = process.env.PORT;
const ENDPOINT_URL = process.env.ENDPOINT_URL;

app.use(express.json());

app.post("/api/login", tokenVerification,async (req, res) => {
    const {username, password, services} = req.body;

    try {
        const loginCreds = new FormData();
        loginCreds.append('username', username);
        loginCreds.append('password', password);
        loginCreds.append('act', "login")

        const loginRequest = await axios.post(ENDPOINT_URL, loginCreds, {
            headers: loginCreds.getHeaders()
        })

        const {data} = loginRequest.data;

        const convertData = await utils.convertData(data);

        if(services === 'kpira'){
            if(convertData.status === 'Lulus')
                return res.json({
                  messages: "Anda sudah tidak memiliki akses karena sudah LULUS!",  
                })
        }

        return res.json({
            messages: "success",
            data: convertData
        })
    } catch (error) {
        res.status(500)
    }
    
})


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})