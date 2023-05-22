"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const zod_1 = require("zod");
const signUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    username: zod_1.z.string().min(3)
});
const signUp = (req, res) => {
    try {
        const { email, password, username } = signUpSchema.parse(req.body);
        if (!email || !username || !password) {
            res.status(400).json({ message: 'please enter all details' });
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.signUp = signUp;
//# sourceMappingURL=auth.js.map