const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');

const UserController = {
    createAccount: async function (req, res) {
        try {
            const userData = req.body;
            const newUser = new UserModel(userData);
            await newUser.save();

            return res.json({ success: true, data: newUser, message: "User created!" });
        }
        catch (ex) {
            return res.json({ success: false, message: ex });
        }
    },

    signIn: async function (req, res) {
        try {
            const { email, password } = req.body;
            const findUser = await UserModel.findOne({ email: email });
            if (!findUser) {
                return res.status(404).json({ success: false, message: "User not found!" });
            }
            const isPasswordMatch = bcrypt.compareSync(password, findUser.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ success: false, message: "Invalid password!" });
            }
            return res.json({ success: true, data: findUser, message: "Sign-in successful!" });


        }
        catch (ex) {
            return res.json({ success: false, message: ex });
        }
    }
};

module.exports = UserController;
