import * as cheerio from 'cheerio';
import { client } from './client';

export type PopularUpdatesParams = {
  init?: number;
  page?: number;
  size?: number;
};

// High-level: fetch + return MangaPark popular updates (GraphQL)
export async function getPopularUpdates(params: PopularUpdatesParams = {}) {
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

  const response = await client.post('/apo/', {
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

export type ChapterImagesResult = {
  totalImg: number;
  jpegUrls: string[];
};

// High-level: fetch chapter page and extract image URLs
export async function fetchChapterImages(path: string): Promise<ChapterImagesResult> {
  if (!path || typeof path !== 'string') {
    throw new Error('path must be a non-empty string');
  }
  const sanitizedPath = `/${path.replace(/^\/+/, '')}`;
  const response = await client.get(sanitizedPath);
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

  const object = parsedData.objs as any[];
  const jpegUrls = object.filter(
    (item: any) => typeof item === 'string' && item.match(/\.(jpe?g)(\?.*)?$/i)
  );

  return { totalImg: jpegUrls.length, jpegUrls };
}

export type LatestReleasesParams = {
  genre?: string;
  genres_excs?: string[];
  genres_incs?: string[];
  init?: number; // default 18
  multi?: boolean; // default false
  page?: number; // default 1
  size?: number; // default 36
};

export async function getLatestReleases(params: LatestReleasesParams = {}) {
  const {
    genre = '',
    genres_excs = [],
    genres_incs = [],
    init = 18,
    multi = false,
    page = 1,
    size = 36,
  } = params;

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

  const response = await client.post('/apo/', {
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

// Member Uploads (where: "uploads")
export type MemberUploadsParams = { init?: number; page?: number; size?: number };
export async function getMemberUploads(params: MemberUploadsParams = {}) {
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
  const response = await client.post('/apo/', {
    query,
    variables: { select: { init: Number(init), page: Number(page), size: Number(size), where: 'uploads' } },
  });
  return response.data?.data?.get_latestReleases ?? null;
}

// Random Mangas
export async function getRandomMangas(amount = 12) {
  const query = `query get_random_comicList($amount: Int) { get_random_comicList(amount: $amount) { id data { id name urlCover600 urlPath sfw_result } } }`;
  const response = await client.post('/apo/', { query, variables: { amount: Number(amount) } });
  return response.data?.data?.get_random_comicList ?? null;
}

// yweek list
export async function getYWeekList() {
  const query = `query get_mylist_yweekList { get_mylist_yweekList }`;
  const response = await client.post('/apo/', { query });
  return response.data?.data?.get_mylist_yweekList ?? null;
}

// mplists weekly by yweek
export async function getMplistsWeekly(yweek: number, limit = 12) {
  if (yweek == null) throw new Error('yweek is required');
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
  const response = await client.post('/apo/', { query, variables: { select: { limit: Number(limit), yweek: Number(yweek) } } });
  return response.data?.data?.get_mylist_weeklyLists ?? null;
}

// mplists newly added
export async function getMplistsNewlyAdded(params: { comicId?: number | null; init?: number; page?: number; size?: number } = {}) {
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
  const response = await client.post('/apo/', { query, variables: { select: { comicId: comicId == null ? null : Number(comicId), init: Number(init), page: Number(page), size: Number(size), sortby: 'create' } } });
  return response.data?.data?.get_mylist_SortedList ?? null;
}

// mplists most likes
export async function getMplistsMostLikes(params: { comicId?: number | null; init?: number; page?: number; size?: number } = {}) {
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
  const response = await client.post('/apo/', { query, variables: { select: { comicId: comicId == null ? null : Number(comicId), init: Number(init), page: Number(page), size: Number(size), sortby: 'likes' } } });
  return response.data?.data?.get_mylist_SortedList ?? null;
}

// search
export async function searchComics(params: { page?: number; size?: number; sortby?: string; word?: string } = {}) {
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
  const response = await client.post('/apo/', { query, variables: { select: { page: Number(page), size: Number(size), sortby, word } } });
  return response.data?.data?.get_searchComic ?? null;
}

// Info by title id (HTML parse)
export type InfoType = {
  img: string | null;
  title: string | null;
  otherInfo: string[];
  search: string[];
  genres: string[];
  originalPulication: string | null;
  mParkUploadStatus: string | null;
  description: string | null;
};

export async function getTitleInfo(id: string): Promise<InfoType> {
  if (!id) throw new Error('id is required');
  const response = await client.get(`/title/${id}`);
  const $ = cheerio.load(response.data);
  const data: InfoType = { img: null, title: null, otherInfo: [], search: [], genres: [], originalPulication: null, mParkUploadStatus: null, description: null };
  const selector = $('main div:nth-child(1)');
  data.img = $(selector).find('.flex img').attr('src') || null;
  data.title = $(selector).find('.flex > div:nth-child(2) > h3 a').text().trim() || null;
  $(selector).find('.flex div:nth-child(2) > .mt-1.text-xs span').each(function () { const text = $(this).text().trim(); if (text !== '/') data.otherInfo.push(text); });
  $(selector).find('.flex div:nth-child(2) > .mt-2.text-sm a').each(function () { data.search.push($(this).text().trim()); });
  $(selector).find('.mt-3 > div:nth-child(2) > div.flex.items-center > span').each(function () { data.genres.push($(this).text().trim()); });
  data.originalPulication = $(selector).find('.mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase').text().trim() || null;
  data.mParkUploadStatus = $(selector).find('.mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase').text().trim() || null;
  data.description = $(selector).find('.limit-html-p').text().trim() || null;
  return data;
}

// Chapters list by title id (HTML parse)
export type ChapterType = { id: string | null; chapter: string | null; uploaded: string | null };
export async function getTitleChapters(id: string): Promise<ChapterType[]> {
  if (!id) throw new Error('id is required');
  const response = await client.get(`/title/${id}`);
  const $ = cheerio.load(response.data);
  const data: ChapterType[] = [];
  $('.scrollable-panel .group > div').each(function () {
    data.push({ id: $(this).find('a').attr('href') || null, chapter: $(this).find('> div.space-x-1 a').text().trim() || null, uploaded: $(this).find('time').attr('data-time') || null });
  });
  return data;
}

export default {
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
