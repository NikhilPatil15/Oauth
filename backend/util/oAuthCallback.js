import { ApiError } from "../apiError.js";
import { User } from "../model/0authUser.model.js";
import jwt from "jsonwebtoken";
import { generateFromEmail } from "unique-username-generator";

export const handleOAuth = async (req, profile, callback) => {
  try {
    console.log("Profile: ", profile);
    const jwtSecret = process.env.JWT_SECRET;

    const id = profile?.id;

    const userExits = await User.findOne({ OauthId: id });

    if (userExits) {
      const payload = {
        id: userExits.OauthId,
        userName: userExits.userName,
        email: userExits.email,
      };
      // Sign JWT
      const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
      req.auth = accessToken;

      // console.log("Registered!");
      return callback(null, accessToken);
    }

    const userWithSameEmail = await User.findOne({
      email: profile?.emails[0].value,
    });

    console.log("User with same email: ", userWithSameEmail);

    if (userWithSameEmail) {
      userWithSameEmail.OauthId = profile?.id;
      let userName;
      //   if(!userWithSameEmail.userName === profile?.name.givenName || profile?.name){
      //         userName = profile?.name?.givenName || profile?.name
      //   }

      if (!profile?.name?.givenName) {
        userName = profile?.username;
      } else {
        if (!(userWithSameEmail.userName === profile?.name?.givenName)) {
          userName = profile?.name?.givenName;
        }
      }
      userWithSameEmail.userName = userName;

      await userWithSameEmail.save();

      const payload = {
        id: userWithSameEmail.OauthId,
        userName: userWithSameEmail.userName,
        email: userWithSameEmail.email,
      };

      // Sign JWT
      const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
      req.auth = accessToken;

      // console.log("Registered!");
      return callback(null, accessToken);
    }

    let userWithSameUserName;

    if (profile?.name?.givenName) {
      userWithSameUserName = await User.findOne({
        userName: profile?.name?.givenName,
      });
    } else {
        userWithSameUserName = await User.findOne({userName: profile?.username})
    }

    console.log("user with Same user name: ", userWithSameUserName);

    let userName;

    if (userWithSameUserName) {
      userName = generateFromEmail(profile?.emails[0].value, 1);
    } else {
      if (profile?.username) {
        userName = profile?.username;
      } else if (profile?.name?.givenName) {
        userName = profile?.name?.givenName;
      } else {
        userName = (profile?.displayName).replace(" ", "");
      }
    }

    const user = await User.create({
      userName: userName,
      fullName: profile?.displayName,
      email: profile.emails[0].value,
      OauthId: profile.id,
    });

    if (!user) {
      throw new ApiError(401, "Error while creating user!");
    }

    const payload = {
      id: user.OauthId,
      displayName: user.userName,
      emails: user.email,
    };
    // Sign JWT
    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    req.auth = accessToken;

    return callback(null, accessToken);
  } catch (error) {
    throw new ApiError(
      400,
      error.message || "something went wrong in AuthCallback function"
    );
  }
};
