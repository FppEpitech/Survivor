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
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prismaClient_1.default.event.findMany();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving events' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const event = yield prismaClient_1.default.event.findUnique({ where: { id } });
        if (event) {
            res.status(200).json(event);
        }
        else {
            res.status(404).json({ error: 'Event not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving event' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, date, max_participants, location_x, location_y, type, employee_id, location_name } = req.body;
    try {
        const newEvent = yield prismaClient_1.default.event.create({
            data: {
                name,
                date,
                max_participants,
                location_x,
                location_y,
                type,
                employee_id,
                location_name,
                old_id: -1
            },
        });
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, date, max_participants, location_x, location_y, type, employee_id, location_name } = req.body;
    try {
        const updatedEvent = yield prismaClient_1.default.event.update({
            where: { id },
            data: {
                name,
                date,
                max_participants,
                location_x,
                location_y,
                type,
                employee_id,
                location_name,
            },
        });
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating event' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.event.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting event' });
    }
}));
exports.default = router;
//# sourceMappingURL=events.js.map