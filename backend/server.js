import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import GoogleStratergy from "passport-google-oauth20";
import GithubStratergy from "passport-github2";
import cookieParser from "cookie-parser";
import { authmiddleware } from "./authmiddleware.js";
import { handleOAuth } from "./util/oAuthCallback.js";
import { ApiResponse } from "./apiResponse.js";
import cors from "cors";

passport.use(
  new GoogleStratergy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/auth/google",
      passReqToCallback: true,
    },
    function (req, token, refreshToken, profile, cb) {
      handleOAuth(req, profile, cb);
    }
  )
);

passport.use(
  new GithubStratergy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:3000/auth/github",
      passReqToCallback: true,
    },
    function (req, token, refreshToken, profile, cb) {
      handleOAuth(req, profile, cb);
    }
  )
);

const app = express();

dotenv.config({
  path: "./env",
});

app.use(cookieParser());
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

async function connectDB() {
  try {
    const connectionString = await mongoose.connect(
      `${process.env.MONGODB_URL}/Test`
    );
    console.log(
      `\n MongoDb Connected DB Host: ${connectionString.connection.host}`
    );
    // const db = mongoose.connection
    // console.log("Db:", db);
    
//   await db.collection('users').dropIndex('fullName_1')
//   db.collection('users').indexes((err, indexes) => {
//     if (err) throw err;
//     console.log('Current indexes:', indexes);
// });
  } catch (error) {
    console.log("CONNECTION ERROR: ", error);
    process.exit(1);
  }
}

connectDB();


app.use(passport.initialize());

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is serving on http://localhost:${port}`);
});
app.get("/", (req, res) => {
  res.send(`<a href="/auth/google"> Authenticate with google </a>`);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
  (req, res) => {
    // delete req.user
    // console.log("user: ",req.user);
    // console.log("User: ", req.google);

    res
      .cookie("accessToken", req.auth, { httpOnly: true, secure: true })
      .redirect("http://localhost:5173/set-accessToken");
    // console.log("Cokies set!");
  }
);

app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["profile","email"],
    session: false,
  }),
  (req, res) => {
    // console.log("Entered!");
    res
    .cookie("accessToken", req.auth, { httpOnly: true, secure: true })
    .redirect("http://localhost:5173/set-accessToken");
  }
);

app.get("/set-accessToken", (req, res) => {
  // console.log("cookies: ",req.cookies);
  const token = req.cookies.accessToken;

  // console.log("Token: ", token);

  // console.log("Google: ",req.google)

  res.status(200).json(new ApiResponse(200, token, "Token sent successfully!"));
});



app.get("/auth/profile", authmiddleware ,(req, res) => {
  const user = req.user;

  // res.json({user:user,message:"user fetched successfully!"})

  res.json(new ApiResponse(200, user, "")).status(200);

  console.log("User:", user);
});

app.get("/auth/logout", authmiddleware,(req, res) => {
  const user = req.user;

  res.clearCookie("accessToken");

  res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

app.use((err, req, res, next) => {
    console.error('Error encountered:', err);
    res.status(500).send('Internal Server Error');
  });


