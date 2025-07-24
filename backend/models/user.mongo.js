const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  _id:            { type: String },
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, unique: true, required: true, lowercase: true },
  password:       { type: String, required: true },
  role:           { type: String, enum: ['ROLE_USER','ROLE_ADMIN','ROLE_MERCHANT'], default: 'ROLE_USER' },
  companyName:    { type: String, required: false },
  kbis:           { type: String, required: false },
  status:         { type: String, enum: ['PENDING','ACTIVE'], default: 'PENDING' },
  refreshTokens:  { type: [String], default: [] },
  app_id:         { type: String, default: null },
  app_secret:     { type: String, default: null }
}, { timestamps: true });

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('User', schema);