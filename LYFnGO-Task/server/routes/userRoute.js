const express = require("express");
const { singUp, LoginUser } = require("../controllers/userControl");
const UserRouter = express.Router();

UserRouter.post("/RigesterUser", singUp);
UserRouter.post("/loginUser", LoginUser);

module.exports = UserRouter;
