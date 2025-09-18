"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const axios_1 = __importDefault(require("axios"));
// For library usage, avoid auto-loading env vars. Consumers can set process.env.BASE_URL themselves.
const baseURL = process.env.BASE_URL || 'https://mangapark.to';
exports.client = axios_1.default.create({
    baseURL,
    headers: {
        Origin: 'https://mangapark.to',
        Referer: 'https://mangapark.to/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    },
});
