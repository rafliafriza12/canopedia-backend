import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";
import { verifyToken } from "../middleware/auth.js";

export const register = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Silakan isi semua kolom yang diperlukan." });
    } else {
      const isAlreadyRegistered = await Auth.findOne({ userName });
      if (isAlreadyRegistered) {
        return res
          .status(400)
          .json({ message: "Pengguna dengan email ini sudah terdaftar." });
      } else {
        const newUser = new Auth({
          userName,
        });

        // Menggunakan promise untuk menangani hash password
        bcryptjs.hash(password, 10, async (err, hash) => {
          if (err) {
            return res.status(500).json(err);
          }

          newUser.set("password", hash);
          await newUser.save(); // Tunggu sampai user disimpan ke DB

          return res
            .status(200)
            .json({ data: newUser, message: "Pengguna berhasil terdaftar." });
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        status: 400,
        message: "Silakan isi semua kolom yang diperlukan.",
      });
    } else {
      const user = await Auth.findOne({ userName });
      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: "Username atau kata sandi salah." });
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res
            .status(400)
            .json({ status: 400, message: "Email atau kata sandi salah." });
        } else {
          const payload = {
            userId: user._id,
            email: user.userName,
          };
          const JWT_SECRET = process.env.JWT_SECRET;

          jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "1d" },
            async (err, token) => {
              if (err) {
                return res.status(500).json(err);
              }
              user.set("token", token);
              await user.save();

              return res.status(200).json({
                status: 200,
                data: user,
                message: "Login berhasil",
              });
            }
          );
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export const logout = [
  verifyToken,
  async (req, res) => {
    try {
      const { userId } = req.user; // Assuming userId is sent from the client during logout

      if (!userId) {
        return res.status(400).json({
          status: 400,
          message: "ID Pengguna diperlukan untuk keluar.",
        });
      }

      const user = await Auth.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ status: 404, message: "Pengguna tidak ditemukan." });
      }

      // Remove or set token to null
      user.set("token", null);
      await user.save();

      return res
        .status(200)
        .json({ status: 200, message: "Pengguna berhasil keluar." });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Terjadi kesalahan saat keluar." });
    }
  },
];
