import { asyncHandler } from "./asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "./model/0authUser.model.js";
import { ApiError } from "./apiError.js";


export const authmiddleware =  asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        console.log("token dal");
      return res.status(401).send("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token: ",decodedToken);

    const user = await User.findOne({OauthId:decodedToken?.id})

    if(!user){
      throw new ApiError(400,"User doesnt exist!")
    }

    req.user = user
    // console.log("Nigger: ",user);
    next();
  } catch (error) {
    throw new ApiError(400,`Something went wrong in the authMiddleware: ${error.message}`);
  }
})
