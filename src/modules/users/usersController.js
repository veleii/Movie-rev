import jwt from "jsonwebtoken";
import User from "./usersModel.js";

const createToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3h" });

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Kolla om e-post redan finns
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: "E-postadressen eller användarnamnet är redan registrerad",
      });
    }

    // Skapa ny användare
    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: "Användare skapad", userId: user._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fel vid registrering", error: err.message });
  }
};

// POST /login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hämta användare med e-post
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "bajs" });
    }

    // Jämför lösenord via model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Fel e-post eller lösenord" });
    }

    const token = createToken(user._id, user.role);

    res.status(200).json({ message: "Inloggad", token });
  } catch (err) {
    res.status(500).json({ message: "Fel vid inloggning", error: err.message });
  }
};
