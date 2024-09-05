"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountExistsLegacy = accountExistsLegacy;
exports.getLegacyProfile = getLegacyProfile;
let fs = require('fs');
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
function accountExistsLegacy(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Group-Authorization': process.env.GROUP_AUTHO,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (response.ok) {
                const data = yield response.json();
                return data.access_token;
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            return undefined;
        }
    });
}
function getLegacyProfile(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/me`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Group-Authorization': process.env.GROUP_AUTHO,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (response.ok) {
                const data = yield response.json();
                const legacyImage = yield getMyLegacyImage(access_token, data.id);
                data.image_url = legacyImage;
                return data;
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
function getMyLegacyImage(access_token, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${process.env.SOULCONNECTION_PROD_API_URL}/api/employees/${id}/image`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Group-Authorization': process.env.GROUP_AUTHO,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
            if (response.ok) {
                const arrayBuffer = yield response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const fileName = `${yield (0, uuid_1.v4)()}.png`;
                const filePath = yield path_1.default.join(__dirname, "..", 'assets', fileName);
                fs.writeFileSync(filePath, buffer);
                return `assets/${fileName}`;
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
//# sourceMappingURL=accountsLegacy.js.map