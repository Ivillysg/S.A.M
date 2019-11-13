const mongoose = require("mongoose");
const PacientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: 'Nenhum endereço cadastrado!'
  },
  phone: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Nenhuma cidade cadastrada!'
  },
  state: {
    type: String,
    default: 'Nenhum estado cadastrado!'
  },
  age: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  numberProtocol: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "Não foi cadastrado!"
  },
  conv: {
    type: String,
    required: true
  },
  createdAT: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("pacients", PacientSchema);
