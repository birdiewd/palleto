const express = require('express')
const dotenv = require("dotenv")
const axios = require('axios')
const parser = require("fast-xml-parser")
const cors = require("cors")

dotenv.config()

const app = express()

var whitelist = [
	`http://localhost:${process.env.WEB_PORT}`
];
var corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			console.log({ origin, whitelist });
			callback(new Error("Not allowed by CORS"));
		}
	}
};

app.use(cors(corsOptions));

const port = process.env.API_PORT;

app.options("*", cors(corsOptions));

app.get('/', async (req, res) => {
	try {
		const data = await axios({
			method: "get",
			url: "http://colourlovers.com/api/palettes/random",
		}).then(data => data)

		const jsonData = parser.parse(data.data);
		const colors = jsonData.palettes.palette.colors.hex.map(datum => `#${datum}`);
		
		res.json(colors);
	} catch (error) {
		console.log(error);
	}
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))