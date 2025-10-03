const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token and send as cookie
        const token = generateToken(user._id);

        // res.cookie('token', token, {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        // });

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            profileId: user.profileId,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ success: true, data: {} });
};


// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    // Logic to find user by req.user.id, verify old password, and save new one
    // ...

    try {
        const user = req.user;

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password' });
        }

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};