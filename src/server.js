const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const mongoose = require("mongoose");
const databaseConfig = require("./config/database");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require('cors')

class App {
  constructor() {
    this.express = express();
    this.express.disable("x-powered-by");
    this.isDev = process.env.NODE_ENV !== "production";

    this.express.use(
      session({
        secret: "teste",
        resave: false,
        saveUninitialized: false
      })
    );
    this.express.use(flash());
    this.database();
    this.middlewares();
    this.views();
    this.routes();
  }
  database() {
    mongoose
      .connect(databaseConfig.uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => {
        return console.log("Conexão com o banco, realizada com sucesso!");
      })
      .catch(error => {
        console.log(
          `Opss...Ocorreu um erro ao conectar-se com DB, ERROR:${error}`
        );
      });
  }

  middlewares() {
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cors())
  }

  views() {
    nunjucks.configure(path.resolve(__dirname, "app", "views"), {
      autoescape: true,
      watch: this.isDev,
      express: this.express
    });
    this.express.use(express.static(path.resolve(__dirname, "public")));
    this.express.set("view engine", "njk");
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new App().express;
