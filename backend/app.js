require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const SSE     = require('./middleware/sse')
const sequelize = require('./sequelize');
const allRoutes = require('./routes')
const sseRouter= require('./routes/sse');

const User = require("./models/user");
const UserMongo = require("./models/user.mongo");
const Payment = require("./models/payment.mongo");
const PaymentMongo = require("./models/payment.mongo");


const app = express();

app.use(cors());
app.use(express.json());
app.set('sse', SSE);

app.use('/sse/payments', sseRouter);
app.use('/', allRoutes)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

sequelize.authenticate()
  .then(() => console.log("✅ Connexion PostgreSQL réussie"))
  .catch((err) => console.error("❌ Erreur PostgreSQL :", err));

sequelize
  .showAllSchemas()
  .then(schemas => console.log("Schemas:", schemas))
  .catch(console.error);

sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tables créées ou mises à jour"))  
  .catch(err => console.error("❌ Erreur sync:", err));

// app.get("/", (req, res) => {
//   res.json({ message: "🚀 API Paiement prête à fonctionner !" });
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
});