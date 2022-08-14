//Importing required dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import { createServer } from "http";
import connectDB from "./utils/connectDB.js";
import registerSocketServer from "./utils/registerSocketServer.js";
import { sessionMiddleware, store } from "./utils/SessionMiddleware.js";
import User from "./models/user_model.js";
import asyncHandler from "express-async-handler";

//configuring dotenv
dotenv.config();

//connecting to MongoDB database
connectDB();

//creating express app
const app = express();

//creating http server using express app
const server = createServer(app);

//using 'CORS middleware
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

//using bodyparser middleware
app.use(bodyparser.json());

//using express session middleware
app.use(sessionMiddleware);
app.get(
  "/",
  asyncHandler(async (req, res, next) => {
    var cookies = req.headers.cookie;
    let cookie_obj = {};
    cookies?.split(";").map((data) => {
      cookie_obj[data.trim().split("=")[0]] = data.trim().split("=")[1];
    });
    if (cookie_obj["new2"] !== null && cookie_obj["new2"] !== undefined) {
      let session_id = cookie_obj["new2"].split(".")[0].substring(4);
      store.get(session_id, async (err, data) => {
        if (data !== null && data !== undefined) {
          if (req.session.cookie.expires.getTime() < new Date().getTime()) {
            req.session.user = null;
            return res.status(440).json({
              message: "Session Expired. Please Login Again.",
            });
          } else {
            return res.send("");
          }
        } else {
          req.session.user = null;
          return res.status(404).json({
            message: "Session not Found..!",
          });
        }
      });
    } else {
      req.session.user = null;
      return res.status(404).json({
        message: "Session not Found..!",
      });
    }
  })
);

registerSocketServer(server);

server.listen(5001, console.log("Server connected...!"));
