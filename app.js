require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// Logic goes here
// importing user context
const Classe = require("./model/classe");

// Register
app.post("/classe/register", auth, async (req, res) => {
	// our register logic goes here...
	try {
		// Get classe input
		const { name, school } = req.body;

		// Validate classe input
		if (!(name && school)) {
			res.status(400).send({ message: 'Todos campos devem ser preenchidos!' });
		}

		// check if classe already exist
		// Validate if classe exist in our database
		const oldUser = await Classe.findOne({ name });

		if (oldUser) {
			return res.status(409).send({ message: 'Usuário já registrado. Por favor faça login.' });
		}

		// Create classe in our database
		const classe = await Classe.create({
			name, school
		});

		// return new classe
		return res.status(201).json(classe);
	} catch (err) {
		console.log(err);
		return res.status(500).send({ message: 'Erro ao criar escola.' })
	}
});

app.post("/classe/:id", auth, async (req, res) => {
	const id = req.params.id

	const { name, school } = req.body;

	try {
		classe = await Classe.findOneAndUpdate({ id }, {
			name, school
		});
		return res.status(204).json(classe)
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Erro ao editar escola" })
	}


});

app.get("/classes/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const classe = await Classe.find({school: id})
		if (classe) {
			return res.status(200).send(classe)
		} else {
			return res.status(404).send({ message: 'Nenhuma escola removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

app.get("/classe/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const classe = await Classe.findById(id)
		if (classe) {
			return res.status(200).json(classe)
		} else {
			return res.status(404).send({ message: 'Nenhuma escola removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

app.delete("/classe/:id", auth, async (req, res) => {
	try {
		const { id } = req.params
		const user = await Classe.findByIdAndDelete(id)
		if (user) {
			return res.status(200).send({ message: 'Escola removido com sucesso!' })
		} else {
			return res.status(404).send({ message: 'Nenhuma escola removido!' })
		}
	} catch (error) {
		return res.status(500).send({ message: 'Erro no servidor!' })
	}
})

module.exports = app;