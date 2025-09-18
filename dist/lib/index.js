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
exports.getPopularUpdates = getPopularUpdates;
exports.fetchChapterImages = fetchChapterImages;
const cheerio = __importStar(require("cheerio"));
const client_1 = require("../utils/client");
// High-level: fetch + return MangaPark popular updates (GraphQL)
async function getPopularUpdates(params = {}) {
    const { init = 12, page = 1, size = 24 } = params;
    const query = `
  query get_latestReleases($select: LatestReleases_Select) {
    get_latestReleases(select: $select) {
      paging { total pages page init size skip limit prev next }
      items {
        id
        data {
          id dbStatus name
          origLang tranLang
          urlPath urlCover600 urlCoverOri
          genres sfw_result
          is_hot is_new
          score_val follows reviews comments_total
          last_chapterNodes(amount: 1) {
            id
            data {
              id dateCreate
              dbStatus isFinal
              dname urlPath is_new
              userId
              userNode { id data { id name uniq avatarUrl urlPath } }
            }
          }
        }
        sser_follow
        sser_lastReadChap {
          date
          chapterNode {
            id
            data {
              id dbStatus isFinal
              dname urlPath is_new
              userId
              userNode { id data { id name uniq avatarUrl urlPath } }
            }
          }
        }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', {
        query,
        variables: {
            select: {
                init: Number(init),
                page: Number(page),
                size: Number(size),
                where: 'popular',
            },
        },
    });
    return response.data?.data?.get_latestReleases ?? null;
}
// High-level: fetch chapter page and extract image URLs
async function fetchChapterImages(path) {
    if (!path || typeof path !== 'string') {
        throw new Error('path must be a non-empty string');
    }
    const sanitizedPath = `/${path.replace(/^\/+/, '')}`;
    const response = await client_1.client.get(sanitizedPath);
    const $ = cheerio.load(response.data);
    const scriptElement = $("script[type='qwik/json']");
    if (scriptElement.length === 0) {
        throw new Error("Failed to parse external page: script tag not found.");
    }
    const scriptContent = scriptElement.text();
    if (!scriptContent) {
        throw new Error('Failed to parse external page: script tag is empty.');
    }
    const parsedData = JSON.parse(scriptContent);
    if (!parsedData || !parsedData.objs) {
        throw new Error("Failed to parse external page: 'objs' property not found in JSON.");
    }
    const object = parsedData.objs;
    const jpegUrls = object.filter((item) => typeof item === 'string' && item.match(/\.(jpe?g)(\?.*)?$/i));
    return { totalImg: jpegUrls.length, jpegUrls };
}
exports.default = {
    getPopularUpdates,
    fetchChapterImages,
};
