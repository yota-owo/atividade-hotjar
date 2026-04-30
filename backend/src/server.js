require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 A Forja está acesa na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
