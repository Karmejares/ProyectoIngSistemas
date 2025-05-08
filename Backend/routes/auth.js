const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');  
const router = express.Router();

<<<<<<< Updated upstream
const usersFilePath = path.join(__dirname, '../data/usuarios.json');

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const fileData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(fileData);

    const user = users.find(

      (u) => u.username === username && u.password === password
    );

    if (user) {      
      return res.status(200).json({ success: true, message: "Login successful" });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
      
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
=======
router.post('/login', loginUser);
router.post('/register', registerUser);
>>>>>>> Stashed changes

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const fileData = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(fileData);

    const userExists = users.some((u) => u.username === username);

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    users.push({ username, email, password });

    await fs.writeFile(usersFilePath, JSON.stringify(users));
    res.status(200).json({ success: true, message: "User created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});




module.exports = router;

