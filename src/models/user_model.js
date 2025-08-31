const { Schema, model } = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    profileProgress: { type: Number, default: 0 }, // e.g., 0 ->account created
    updatedon: { type: Date },
    createdAt: { type: Date }
});

userSchema.pre('save', function (next) {
    this.id = uuid.v1();
    this.updatedon = new Date();
    this.createdAt = new Date();

    // Hash the password before saving
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();

});
userSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
    const uodate = this.getUpdate();
    delete upadate._id;
    delete upadate.id;

    this.updatedon = new Date();
    next();

});

const UserModel = model('User', userSchema);

module.exports = UserModel;
