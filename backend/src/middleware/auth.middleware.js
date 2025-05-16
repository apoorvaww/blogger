import { User } from "../models/user.model";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(async(req, res) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(401, "Unauthorized reques")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user) {
            throw new ApiError(401, "invalid access token");
        }

        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})
