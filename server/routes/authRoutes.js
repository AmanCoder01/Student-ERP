const express = require('express');

const User = require('../models/User');

const { login, logout, updatePassword, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const Admin = require('../models/Admin');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const userId = "68d5860b282f63777b2612f0";

        const admin = await Admin.create({
            user: userId, // or new mongoose.Types.ObjectId(userId)
            contact: "809377783",
            name: "Mr. Head"
        });

        const user = await User.findById(userId);
        user.profileId = admin._id;
        await user.save();


        res.status(201).json({
            admin
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/login', login);
router.get('/logout', logout);

router.put('/update-password', protect, updatePassword);

router.get('/get-profile', protect, getProfile);
module.exports = router;