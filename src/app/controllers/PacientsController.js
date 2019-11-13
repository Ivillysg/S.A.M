const Pacients = require("../models/Pacients");
const Appointment = require('../models/Appointment')
class PacientsController {
  async count(req, res) {
    let count_pacients = await Pacients.countDocuments();
    let count_appoint = await Appointment.countDocuments();
    return res.render("dashboard/home.njk", {  count_pacients, count_appoint });
  }
  async dados(req, res) {
    let pacients = await Pacients.find();
    return res.json({
      pacients
    });
  }

  async search(req, res) {
    // var searchParams = req.query.name;
    // await Pacients.find({ tag: { $all: searchParams } }, function(e, docs) {
    //   return res.json(docs);
    // });
    let pacients = await Pacients.find().sort({name: 1});
    return res.json(pacients);
  }
  async index(req, res, next) {
    let count_pacients = await Pacients.countDocuments();
    let perPage = 5;
    let page = req.params.page || 1;

    await Pacients.find().sort({name: 1})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, pacients) => {
        Pacients.countDocuments((err, count) => {
          if (err) return next(err);
          res.render("dashboard/pages/pacients/list", {
            pacients,
            current: parseInt(page),
            pages: Math.ceil(count / perPage),
            count_pacients
          });
        });
      });
  }
  async store(req, res) {
    const data_nasc = req.body.age;
    const data_array = data_nasc.split("-");

    function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
      var d = new Date(),
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),
        ano_aniversario = +ano_aniversario,
        mes_aniversario = +mes_aniversario,
        dia_aniversario = +dia_aniversario,
        quantos_anos = ano_atual - ano_aniversario;

      if (
        mes_atual < mes_aniversario ||
        (mes_atual == mes_aniversario && dia_atual < dia_aniversario)
      ) {
        quantos_anos--;
      }
      return quantos_anos < 0 ? 0 : quantos_anos;
    }
    const age = idade(data_array[0], data_array[1], data_array[2]);
    const pacient = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      sex: req.body.sex,
      city: req.body.city,
      state: req.body.state,
      age: age,
      birthday: req.body.age,
      conv: req.body.conv,
      numberProtocol:
        Math.floor(Math.random() * (99999999 - 11111111)) + 11111111
    };
    if (!req.body.name || req.body.name == undefined || req.body.name == null) {
      req.flash("error_msg", "Por favor, preencher o campo nome!");
      return res.redirect("/pacient/register");
    }
    // if (
    //   !req.body.address ||
    //   req.body.address == undefined ||
    //   req.body.address == null
    // ) {
    //   req.flash("error_msg", "Por favor, preencher o campo endereço!");
    //   return res.redirect("/pacient/register");
    // }
    // if (!req.body.sex || req.body.sex == undefined || req.body.sex == null) {
    //   req.flash("error_msg", "Por favor, preencher o campo sexo!");
    //   return res.redirect("/pacient/register");
    // }
    // if (!req.body.city || req.body.city == undefined || req.body.city == null) {
    //   req.flash("error_msg", "Por favor, preencher o campo cidade!");
    //   return res.redirect("/pacient/register");
    // }
    // if (
    //   !req.body.state ||
    //   req.body.state == undefined ||
    //   req.body.state == null
    // ) {
    //   req.flash("error_msg", "Por favor, preencher o campo estado!");
    //   return res.redirect("/pacient/register");
    // }
    if (
      !req.body.age ||
      req.body.age == undefined ||
      req.body.age == null ||
      age === 2019
    ) {
      req.flash("error_msg", "Por favor, preencher o campo nascimento!");
      return res.redirect("/pacient/register");
    } else {
      await Pacients.create(pacient)
        .then(() => {
          req.flash("success_msg", "O paciente foi cadastrado com sucesso!");
          return res.redirect("/pacients");
        })
        .catch(err => {
          console.log(err);
          req.flash("error_msg", "Ocorreu algum erro ao tentar cadastrar!");
          return res.redirect("/pacient/register");
        });
    }
  }
  async bindPacient(req, res) {
    let regPacient = await Pacients.findOne({
      numberProtocol: req.params.number
    });

    return res.render("dashboard/pages/pacients/edit", {
      regPacient
    });
  }
  async edit(req, res) {
    const data_nasc = req.body.age;
    const data_array = data_nasc.split("-");

    function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
      var d = new Date(),
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),
        ano_aniversario = +ano_aniversario,
        mes_aniversario = +mes_aniversario,
        dia_aniversario = +dia_aniversario,
        quantos_anos = ano_atual - ano_aniversario;

      if (
        mes_atual < mes_aniversario ||
        (mes_atual == mes_aniversario && dia_atual < dia_aniversario)
      ) {
        quantos_anos--;
      }
      return quantos_anos < 0 ? 0 : quantos_anos;
    }
    const age = idade(data_array[0], data_array[1], data_array[2]);
    
    await Pacients.findById({ _id: req.body.id }, (err, doc) => {
      if (err) return console.log(err);
      doc.name = req.body.name;
      doc.address = req.body.address;
      doc.phone = req.body.phone;
      doc.sex = req.body.sex;
      doc.city = req.body.city;
      doc.state = req.body.state;
      doc.age = age;
      doc.birthday = req.body.age;
      doc.conv = req.body.conv;
      doc
        .save()
        .then(() => {
          req.flash("success_msg", "O cadastro foi editado com sucesso!");
          return res.redirect("/pacients");
        })
        .catch(err => {
          req.flash("error_msg", `Erro ao editar o cadastro!!: ${err}`);
          return res.redirect("/pacients");
        });
    });

    // }
  }
  async delete(req, res) {
    await Pacients.deleteOne({_id:req.body.id});
    req.flash("success_msg", "Foi deletado com sucesso!");
    return res.redirect("/pacients");
  }
  async storePront(req, res) {}
}

module.exports = new PacientsController();
