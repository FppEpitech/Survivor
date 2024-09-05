"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const tips_1 = __importDefault(require("./routes/tips"));
const login_1 = __importDefault(require("./routes/login"));
const customers_1 = __importDefault(require("./routes/customers"));
const employees_1 = __importDefault(require("./routes/employees"));
const encounters_1 = __importDefault(require("./routes/encounters"));
const events_1 = __importDefault(require("./routes/events"));
const clothes_1 = __importDefault(require("./routes/clothes"));
const paymentHistory_1 = __importDefault(require("./routes/paymentHistory"));
const isLoggedIn_1 = __importDefault(require("./middlewares/isLoggedIn"));
const compatibility_1 = __importDefault(require("./routes/compatibility"));
require('dotenv').config();
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use(login_1.default);
app.use(require('cors')());
app.use(require('helmet')());
app.use(isLoggedIn_1.default); //now all routes are protected, user need to have a valid acc_token.
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'assets')));
app.use('/tips', tips_1.default);
app.use('/customers', customers_1.default);
app.use('/employees', employees_1.default);
app.use('/encounters', encounters_1.default);
app.use('/events', events_1.default);
app.use('/clothes', clothes_1.default);
app.use('/paymenthistory', paymentHistory_1.default);
app.use('/compatibility', compatibility_1.default);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map