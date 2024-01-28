"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const startServer = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.static("dist-web"));
    app.get("/api", function (req, res) {
        res.send({ api: true, strength: "strong" });
    });
    app.listen(8134);
};
exports.startServer = startServer;
