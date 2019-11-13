const User = require("../models/Users");

class UserController {
  async create(req, res) {
    const user = {
      username: "admin",
      password: "admin"
    };
    await User.create(user).then(() => console.log("criado!"));
  }
  async store(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error_msg", "Usuario nao encontrado!");
      return res.redirect("/login");
    }
    if (!(await user.compareHash(password))) {
      req.flash("error_msg", "Senha errada!");
      return res.redirect("/login");
    }
    req.session.user = user;
    req.flash("success_msg", "Logado com sucesso, seja bem vindo!");
    return res.redirect("/");
  }
  destroy(req, res) {
    req.session.destroy(() => {
      return res.redirect("/login");
    });
  }
}

module.exports = new UserController();
