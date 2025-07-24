const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toHexString()
    },
    seller_id: { type: String, required: true },
    buyer_id:  { type: String, required: true },
    amount:    { type: Number, required: true },
    currency:  { type: String, enum: ['EUR','USD','GBP','JPY'], default: "EUR" },
    status:    { type: String, enum: ["PENDING","SUCCESS","FAILED","REFUNDED"], default: "PENDING" },
    stripe_id: { type: String, unique: true, required: true, match: /^[a-zA-Z0-9_-]+$/ },
}, {
    timestamps: true
});
paymentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      delete ret._id;
    }
});

module.exports = mongoose.model("PaymentMongo", paymentSchema);