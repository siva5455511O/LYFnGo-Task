const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const singUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Username already exists" });

    const hasspassword = await bcrypt.hash(password, 7);

    const newUser = await User.create({
      name,
      email,
      password: hasspassword,
    });

    const userdata = await newUser.save();

    res.status(201).json({ msg: "Registered Successfullyy", userdata });
  } catch (error) {
    res.status(500).json({ msg: "Error creating user" });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    // compare password correctly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message); // 👈 shows actual error
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  singUp,
  LoginUser,
};
