"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
const client_1 = require("../utils/client");
const cheerio = __importStar(require("cheerio"));
const info = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await client_1.client.get(`/title/${id}`);
        const $ = cheerio.load(response.data);
        const data = {
            img: null,
            title: null,
            otherInfo: [],
            search: [],
            genres: [],
            originalPulication: null,
            mParkUploadStatus: null,
            description: null
        };
        const selector = $("main div:nth-child(1)");
        data.img = $(selector).find(".flex img").attr("src") || null;
        data.title = $(selector).find(".flex > div:nth-child(2) > h3 a").text().trim() || null;
        $(selector).find(".flex div:nth-child(2) > .mt-1.text-xs span").each(function () {
            const text = $(this).text().trim();
            if (text !== '/') {
                data.otherInfo.push($(this).text().trim());
            }
        });
        $(selector).find(".flex div:nth-child(2) > .mt-2.text-sm a").each(function () {
            data.search.push($(this).text().trim());
        });
        $(selector).find(".mt-3 > div:nth-child(2) > div.flex.items-center > span").each(function () {
            data.genres.push($(this).text().trim());
        });
        data.originalPulication = $(selector).find(".mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase").text().trim();
        data.mParkUploadStatus = $(selector).find(".mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase").text().trim();
        data.description = $(selector).find(".limit-html-p").text().trim();
        res.status(200).send(data);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.info = info;
