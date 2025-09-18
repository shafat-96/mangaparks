"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT;
const MY_API_URL = process.env.MY_API_URL;
console.log({ PORT, MY_API_URL });
exports.corsConfig = (0, cors_1.default)({ origin: MY_API_URL ? [MY_API_URL, `http://localhost:${PORT}`] : "*" });
