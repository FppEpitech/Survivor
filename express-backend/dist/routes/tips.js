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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prismaClient_1 = __importDefault(require("../prismaClient"));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tips = yield prismaClient_1.default.tip.findMany();
        res.status(200).json(tips);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving tips' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const tip = yield prismaClient_1.default.tip.findUnique({ where: { id } });
        if (tip) {
            res.status(200).json(tip);
        }
        else {
            res.status(404).json({ error: 'Tip not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving tip' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, tip } = req.body;
    try {
        const newTip = yield prismaClient_1.default.tip.create({
            data: { title, tip, old_id: -1 }
        });
        res.status(201).json(newTip);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating tip' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, tip } = req.body;
    try {
        const updatedTip = yield prismaClient_1.default.tip.update({
            where: { id },
            data: { title, tip }
        });
        res.status(200).json(updatedTip);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating tip' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.tip.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting tip' });
    }
}));
exports.default = router;
//# sourceMappingURL=tips.js.map