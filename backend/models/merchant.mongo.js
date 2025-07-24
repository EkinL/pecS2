const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id:          { type: String, required: true,  },
  companyName:  { type: String, required: true },
  kbis:         { type: String, required: true },
  email:        { type: String, unique: true, required: true, lowercase: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['ROLE_MERCHANT'], default: 'ROLE_MERCHANT' },
  status:         { type: String, enum: ['PENDING','ACTIVE'], default: 'PENDING' },
  refreshTokens:{ type: [String], default: [] },
  app_id:       { type: String, default: null },
  app_secret:   { type: String, default: null }
}, { timestamps: true, _id: false });

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Merchant', schema);