const Appointment = require("../models/Appointment");
const Pacients = require("../models/Pacients");

class AppointmentController {
  async show(req, res) {
    await Appointment.find()
      .populate("pacient")
      .then(appoint => {
        return res.render("dashboard/pages/appointments/index.njk", {
          appoint
        });
      });
  }
  async create(req, res) {
    let dados = {
      date: req.body.date,
      title: req.body.title,
      url: req.body.url,
      dateformat: req.body.dateformat,
      pacient: req.body.pacient
    };
    if (
      !req.body.pacient ||
      typeof req.body.pacient === undefined ||
      typeof req.body.pacient === null
    ) {
      req.flash("error_msg", "Paciente inexistente!");
      res.redirect("back");
    } else {
      await Appointment.create(dados)
        .then(() => {
          req.flash("success_msg", "Consulta cadastrada com sucesso!");
        })
        .catch(err => {
          req.flash("error_msg", "Ocorreu um erro ao cadastra a consulta!");
        });
      // return res.redirect("/");
    }
  }
  async index(req, res) {
    const ap = await Appointment.find().populate("pacient");
    return res.json(ap);
  }
  async bindPacient(req, res) {
    let regPacient = await Pacients.findOne({
      numberProtocol: req.params.numberProtcol
    });
    return res.render("dashboard/pages/pacients/prontuario", {
      regPacient
    });
  }
  async delete(req, res) {
    await Appointment.deleteOne({ _id: req.body.id_pacient });
    req.flash("success_msg", "Deletado com sucesso!");
    return res.redirect("/agenda/list");
  }
}

module.exports = new AppointmentController();
