import {Router} from 'express'
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getUserProfile,
    changeCurrentPassword,
    updateAccountDetails,
    refreshAccessToken,
    updateUserAvatar,
} from '../controllers/user.controller.js'
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
//secured routes:

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/user-profile/:username").get(verifyJWT, getUserProfile)
router.route("/update-account-details").post(verifyJWT, updateAccountDetails)
router.route("/update-user-avatar").patch(verifyJWT,
upload.single("avatar"), updateUserAvatar)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)