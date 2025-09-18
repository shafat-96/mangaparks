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
exports.images = void 0;
const client_1 = require("../utils/client");
const cheerio = __importStar(require("cheerio"));
const images = async (req, res) => {
    try {
        // The fix is to get the path from req.params[0], which corresponds to the regex capture group.
        const id = req.params[0];
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid "id" in the URL path' });
        }
        // Sanitize to avoid protocol-relative URLs like `//title/...` which break URL resolution.
        const sanitizedPath = `/${id.replace(/^\/+/, '')}`;
        const response = await client_1.client.get(sanitizedPath);
        const $ = cheerio.load(response.data);
        const scriptElement = $("script[type='qwik/json']");
        if (scriptElement.length === 0) {
            console.error("Error: Could not find script tag with type 'qwik/json'.");
            return res.status(500).json({ error: "Failed to parse external page: script tag not found." });
        }
        const scriptContent = scriptElement.text();
        if (!scriptContent) {
            console.error("Error: Script tag with type 'qwik/json' was empty.");
            return res.status(500).json({ error: "Failed to parse external page: script tag is empty." });
        }
        const parsedData = JSON.parse(scriptContent);
        if (!parsedData || !parsedData.objs) {
            console.error("Error: Parsed JSON does not contain 'objs' property.");
            return res.status(500).json({ error: "Failed to parse external page: 'objs' property not found in JSON." });
        }
        const object = parsedData.objs;
        const jpegUrls = object.filter((item) => typeof item === 'string' && item.match(/\.(jpe?g)(\?.*)?$/i));
        res.status(200).json({ totalImg: jpegUrls.length, jpegUrls });
    }
    catch (error) {
        console.error("An unexpected error occurred in the images handler:", error);
        res.status(500).json({
            error: "An internal server error occurred.",
            details: error.message
        });
    }
};
exports.images = images;
