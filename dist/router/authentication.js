"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controller/auth");
exports.default = (router) => {
    router.post('/auth/signup', auth_1.signUp);
    //   router.post('/auth/signin', signIn)
};
//# sourceMappingURL=authentication.js.map