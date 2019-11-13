const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  creatdAt: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});
UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  }
};
module.exports = mongoose.model("user", UserSchema);
