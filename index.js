require("dotenv").config();

const axios = require("axios");
const express = require("express");
const utils = require("./utils/data");

const { tokenVerification } = require('./middlewares/authentication')

const app = express();
const FormData = require('form-data')

const PORT = process.env.PORT;
const ENDPOINT_URL = process.env.ENDPOINT_URL;

app.use(express.json());

app.get("/", async (req, res, next) => {
    return res.status(200).json({
        status: "Server Ready!"
    })
})
//
app.post("/api/login", tokenVerification, async (req, res) => {
    const { username, password, services } = req.body;

    try {
        const loginCreds = new FormData();
        loginCreds.append('username', username);
        loginCreds.append('password', password);
        loginCreds.append('act', "login")

        const loginRequest = await axios.post(ENDPOINT_URL, loginCreds, {
            headers: loginCreds.getHeaders()
        })

        const { data } = loginRequest.data;

        const convertData = await utils.convertData(data);

        const REGISTERED_APPS = process.env.REGISTERED_APPLICATION.split(',');

        if (!services || !REGISTERED_APPS.includes(services)) {
            return res.status(400).json({
                message: `Layanan '${services}' tidak terdaftar!`
            });
        }

        if (convertData.status === 'Lulus')
            return res.json({
                messages: "Anda sudah tidak memiliki akses karena sudah LULUS!",
            })

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