const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema({
	name: { type: String},
	school: { type: String },
});

module.exports = mongoose.model("classe", classeSchema);