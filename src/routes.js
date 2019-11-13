const express = require("express");

const routes = express.Router();

const PacientsController = require("./app/controllers/PacientsController");
const ProntuarioController = require("./app/controllers/ProntuarioController");
const AppointmentController = require("./app/controllers/AppointmentController");
const UserController = require("./app/controllers/UserController");

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash("success_msg");
  res.locals.flashError = req.flash("error_msg");

  return next();
});
const authCheck = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    return next();
  }
  return res.redirect("/login");
};
const guest = (req, res, next) => {
  if (req.session && !req.session.user) {
    return next();
  }
  return res.redirect("/");
};
routes.get("/", authCheck, PacientsController.count);

routes.get("/login", guest, (req, res) => {
  return res.render("auth/login");
});
routes.get("/logout", UserController.destroy);
routes.post("/auth", UserController.store);
routes.post("/user/create", UserController.create);

routes.get("/agenda/list", authCheck, AppointmentController.show);
routes.get("/agenda/register", authCheck, (req, res) => {
  return res.render("dashboard/pages/appointments/register");
});
routes.post("/agenda/register", AppointmentController.create);
routes.get(
  "/agenda/prontuario/:numberProtcol",
  authCheck,
  AppointmentController.bindPacient
);
routes.post("/agenda/delete", AppointmentController.delete);

routes.get("/search", PacientsController.search);
routes.get("/searchScheduler", authCheck, AppointmentController.index);

routes.get("/pacients", authCheck, PacientsController.index);
routes.get("/pacients/:page", authCheck, PacientsController.index);

routes.get("/pacient/register", authCheck, (req, res) => {
  return res.render("dashboard/pages/pacients/register");
});
routes.post("/pacients/register", PacientsController.store);

routes.post("/pacient/edit", PacientsController.edit);
routes.get("/pacient/edit/:number", authCheck, PacientsController.bindPacient);

routes.post("/delete", PacientsController.delete);

routes.post("/pacient/prontuario", ProntuarioController.store);
routes.get(
  "/pacient/prontuario/:number",
  authCheck,
  ProntuarioController.bindPacient
);

module.exports = routes;
