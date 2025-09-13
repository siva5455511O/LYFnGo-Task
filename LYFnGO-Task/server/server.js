const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/mongodb");
const UserRouter = require("./routes/userRoute");
const Taskrouter = require("./routes/taskRoute");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

const Port = process.env.PORT;

//apiend point

app.use("/userapi", UserRouter);
app.use("/taskapi",Taskrouter)

app.listen(Port, () => {
  console.log(`Server Running on ${Port}`);
});
