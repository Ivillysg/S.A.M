const Pacients = require("../models/Pacients");

class ProntuarioController {
  async bindPacient(req, res) {
    let regPacient = await Pacients.findOne({
      numberProtocol: req.params.number
    });
    // console.log(regPacients)
    return res.render("dashboard/pages/pacients/prontuario", {
      regPacient
    });
  }
  async store(req, res) {
    await Pacients.findById({ _id: req.body.id }, (err, doc) => {
      if (err) return console.log(err);
      
      doc.description = req.body.description;

      doc
        .save()
        .then(() => {
          req.flash("success_msg", "O prontuario foi editado com sucesso!");
          return res.redirect("/pacients");
        })
        .catch(err => {
          req.flash("error_msg", "Ocorreu um erro ao editar o prontuario!");
          return res.redirect("back");
        });
    });
  }
}

module.exports = new ProntuarioController();
