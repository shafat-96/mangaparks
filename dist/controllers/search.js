"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("../utils/client");
const query = `
  query get_searchComic($select: SearchComic_Select) {
  get_searchComic(select: $select) {
    reqPage
    reqSize
    reqSort
    reqWord
    newPage
    paging {
      total
      pages
      page
      init
      size
      skip
      limit
      prev
      next
    }
    items {
      id
      data {
        id
        dbStatus
        name
        origLang
        tranLang
        urlPath
        urlCover600
        urlCoverOri
        genres
        altNames
        authors
        artists
        is_hot
        is_new
        sfw_result
        score_val
        follows
        reviews
        comments_total
        max_chapterNode {
          id
          data {
            id
            dateCreate
            dbStatus
            isFinal
            sfw_result
            dname
            urlPath
            is_new
            userId
            userNode {
              id
              data {
                id
                name
                uniq
                avatarUrl
                urlPath
              }
            }
          }
        }
      }
      sser_follow
      sser_lastReadChap {
        date
        chapterNode {
          id
          data {
            id
            dbStatus
            isFinal
            sfw_result
            dname
            urlPath
            is_new
            userId
            userNode {
              id
              data {
                id
                name
                uniq
                avatarUrl
                urlPath
              }
            }
          }
        }
      }
    }
  }
}`;
const search = async (req, res) => {
    try {
        const { page = 1, size = 36, sortby = "field_score", word = "one piece" } = req.query;
        const response = await client_1.client.post('/apo/', {
            query,
            variables: {
                select: {
                    page: Number(page),
                    size: Number(size),
                    sortby,
                    word
                }
            }
        });
        const data = response.data.data;
        res.status(200).json(data.get_searchComic);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.search = search;
