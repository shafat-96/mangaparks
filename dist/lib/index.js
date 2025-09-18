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
exports.getLatestReleases = getLatestReleases;
exports.getMemberUploads = getMemberUploads;
exports.getRandomMangas = getRandomMangas;
exports.getYWeekList = getYWeekList;
exports.getMplistsWeekly = getMplistsWeekly;
exports.getMplistsNewlyAdded = getMplistsNewlyAdded;
exports.getMplistsMostLikes = getMplistsMostLikes;
exports.searchComics = searchComics;
exports.getTitleInfo = getTitleInfo;
exports.getTitleChapters = getTitleChapters;
const cheerio = __importStar(require("cheerio"));
const client_1 = require("./client");
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
async function getLatestReleases(params = {}) {
    const { genre = '', genres_excs = [], genres_incs = [], init = 18, multi = false, page = 1, size = 36, } = params;
    const query = `
  query get_latestReleases($select: LatestReleases_Select) {
    get_latestReleases(select: $select) {
      paging { total pages page init size skip limit prev next }
      items {
        id
        data {
          id dbStatus name origLang tranLang urlPath urlCover600 urlCoverOri genres sfw_result is_hot is_new score_val follows reviews comments_total
          last_chapterNodes(amount: 1) { id data { id dateCreate dbStatus isFinal dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } }
        }
        sser_follow
        sser_lastReadChap { date chapterNode { id data { id dbStatus isFinal dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } } }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', {
        query,
        variables: {
            select: {
                genre,
                genres_excs,
                genres_incs,
                init: Number(init),
                multi: Boolean(multi),
                page: Number(page),
                size: Number(size),
                where: 'release',
            },
        },
    });
    return response.data?.data?.get_latestReleases ?? null;
}
async function getMemberUploads(params = {}) {
    const { init = 6, page = 1, size = 6 } = params;
    const query = `
  query get_latestReleases($select: LatestReleases_Select) {
    get_latestReleases(select: $select) {
      paging { total pages page init size skip limit prev next }
      items {
        id
        data {
          id dbStatus name origLang tranLang urlPath urlCover600 urlCoverOri genres sfw_result is_hot is_new score_val follows reviews comments_total
          last_userChapterNodes(amount: 1) { id data { id dateCreate dbStatus isFinal dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } }
        }
        sser_follow
        sser_lastReadChap { date chapterNode { id data { id dbStatus isFinal dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } } }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', {
        query,
        variables: { select: { init: Number(init), page: Number(page), size: Number(size), where: 'uploads' } },
    });
    return response.data?.data?.get_latestReleases ?? null;
}
// Random Mangas
async function getRandomMangas(amount = 12) {
    const query = `query get_random_comicList($amount: Int) { get_random_comicList(amount: $amount) { id data { id name urlCover600 urlPath sfw_result } } }`;
    const response = await client_1.client.post('/apo/', { query, variables: { amount: Number(amount) } });
    return response.data?.data?.get_random_comicList ?? null;
}
// yweek list
async function getYWeekList() {
    const query = `query get_mylist_yweekList { get_mylist_yweekList }`;
    const response = await client_1.client.post('/apo/', { query });
    return response.data?.data?.get_mylist_yweekList ?? null;
}
// mplists weekly by yweek
async function getMplistsWeekly(yweek, limit = 12) {
    if (yweek == null)
        throw new Error('yweek is required');
    const query = `
  query get_mylist_weeklyLists($select: Mylist_WeeklyLists_Select) {
    get_mylist_weeklyLists(select: $select) {
      start yweek
      items {
        id iid hash
        data {
          id hash name urlPath comics likes comments_total
          userId userNode { id data { id name uniq avatarUrl urlPath } }
          comicNodes(amount: 4) { id data { id name urlPath urlCover600 urlCoverOri } }
        }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', { query, variables: { select: { limit: Number(limit), yweek: Number(yweek) } } });
    return response.data?.data?.get_mylist_weeklyLists ?? null;
}
// mplists newly added
async function getMplistsNewlyAdded(params = {}) {
    const { comicId = null, init = 6, page = 1, size = 12 } = params;
    const query = `
  query get_mylist_SortedList($select: MylistList_Select) {
    get_mylist_SortedList(select: $select) {
      paging { total pages page init size skip limit prev next }
      items {
        id hash
        data {
          id hash name urlPath comics likes comments_total
          userId userNode { id data { id name uniq avatarUrl urlPath } }
          comicNodes(amount: 4) { id data { id name urlPath urlCover600 urlCoverOri } }
        }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', { query, variables: { select: { comicId: comicId == null ? null : Number(comicId), init: Number(init), page: Number(page), size: Number(size), sortby: 'create' } } });
    return response.data?.data?.get_mylist_SortedList ?? null;
}
// mplists most likes
async function getMplistsMostLikes(params = {}) {
    const { comicId = null, init = 6, page = 1, size = 12 } = params;
    const query = `
  query get_mylist_SortedList($select: MylistList_Select) {
    get_mylist_SortedList(select: $select) {
      paging { total pages page init size skip limit prev next }
      items {
        id hash
        data {
          id hash name urlPath comics likes comments_total
          userId userNode { id data { id name uniq avatarUrl urlPath } }
          comicNodes(amount: 4) { id data { id name urlPath urlCover600 urlCoverOri } }
        }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', { query, variables: { select: { comicId: comicId == null ? null : Number(comicId), init: Number(init), page: Number(page), size: Number(size), sortby: 'likes' } } });
    return response.data?.data?.get_mylist_SortedList ?? null;
}
// search
async function searchComics(params = {}) {
    const { page = 1, size = 36, sortby = 'field_score', word = 'one piece' } = params;
    const query = `
  query get_searchComic($select: SearchComic_Select) {
    get_searchComic(select: $select) {
      reqPage reqSize reqSort reqWord newPage
      paging { total pages page init size skip limit prev next }
      items {
        id
        data { id dbStatus name origLang tranLang urlPath urlCover600 urlCoverOri genres altNames authors artists is_hot is_new sfw_result score_val follows reviews comments_total
          max_chapterNode { id data { id dateCreate dbStatus isFinal sfw_result dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } }
        }
        sser_follow
        sser_lastReadChap { date chapterNode { id data { id dbStatus isFinal sfw_result dname urlPath is_new userId userNode { id data { id name uniq avatarUrl urlPath } } } } }
      }
    }
  }`;
    const response = await client_1.client.post('/apo/', { query, variables: { select: { page: Number(page), size: Number(size), sortby, word } } });
    return response.data?.data?.get_searchComic ?? null;
}
async function getTitleInfo(id) {
    if (!id)
        throw new Error('id is required');
    const response = await client_1.client.get(`/title/${id}`);
    const $ = cheerio.load(response.data);
    const data = { img: null, title: null, otherInfo: [], search: [], genres: [], originalPulication: null, mParkUploadStatus: null, description: null };
    const selector = $('main div:nth-child(1)');
    data.img = $(selector).find('.flex img').attr('src') || null;
    data.title = $(selector).find('.flex > div:nth-child(2) > h3 a').text().trim() || null;
    $(selector).find('.flex div:nth-child(2) > .mt-1.text-xs span').each(function () { const text = $(this).text().trim(); if (text !== '/')
        data.otherInfo.push(text); });
    $(selector).find('.flex div:nth-child(2) > .mt-2.text-sm a').each(function () { data.search.push($(this).text().trim()); });
    $(selector).find('.mt-3 > div:nth-child(2) > div.flex.items-center > span').each(function () { data.genres.push($(this).text().trim()); });
    data.originalPulication = $(selector).find('.mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase').text().trim() || null;
    data.mParkUploadStatus = $(selector).find('.mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase').text().trim() || null;
    data.description = $(selector).find('.limit-html-p').text().trim() || null;
    return data;
}
async function getTitleChapters(id) {
    if (!id)
        throw new Error('id is required');
    const response = await client_1.client.get(`/title/${id}`);
    const $ = cheerio.load(response.data);
    const data = [];
    $('.scrollable-panel .group > div').each(function () {
        data.push({ id: $(this).find('a').attr('href') || null, chapter: $(this).find('> div.space-x-1 a').text().trim() || null, uploaded: $(this).find('time').attr('data-time') || null });
    });
    return data;
}
exports.default = {
    getPopularUpdates,
    fetchChapterImages,
    getLatestReleases,
    getMemberUploads,
    getRandomMangas,
    getYWeekList,
    getMplistsWeekly,
    getMplistsNewlyAdded,
    getMplistsMostLikes,
    searchComics,
    getTitleInfo,
    getTitleChapters,
};
