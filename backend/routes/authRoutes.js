import { Router } from "express";
import {
  login,
  signUp,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({
  dest: "uploads/profiles/"
});

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  (req, res, next) => {
    console.log("File received:", req.file); // Add this line to debug
    next();
  },
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout",logout)
export default authRoutes;
