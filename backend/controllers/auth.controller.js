const AuthService = require('../services/auth.service');
const service = new AuthService();

const signup = async (req, res) => {
    try {
        const response = await service.signup(req.body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const user = await service.login(req.body.email, req.body.password);
        res.json(user);
    } catch (error) {
        res.status(401).send({ success: false, message: error.message });
    }
}

const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const verifactionCode = await service.sendPasswordRecovery(email);
        res.status(200).json(verifactionCode);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { recoverPassword, signup, login };
