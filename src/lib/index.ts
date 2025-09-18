import * as cheerio from 'cheerio';
import { client } from '../utils/client';

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

export default {
  getPopularUpdates,
  fetchChapterImages,
};
