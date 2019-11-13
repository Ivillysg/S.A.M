const server = require("./server");
const port = process.env.PORT || 3000;

server.listen(port, (req, res) => {
  console.log(`Conectado a porta: ${port}...`);
});
