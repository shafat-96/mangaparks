import { Request, Response } from "express";
import { client } from "../utils/client";

const query = `
  query get_latestReleases($select: LatestReleases_Select) {
    get_latestReleases(
      select: $select
    ) {
      paging { 
        total pages page init size skip limit prev next
      }
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
              userNode {
                id
                data {
                  id name uniq avatarUrl urlPath
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
              id dbStatus isFinal
              dname urlPath is_new
              userId
              userNode {
                id
                data {
                  id name uniq avatarUrl urlPath
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const latestReleases = async (req: Request, res: Response) => {
  try {
    const {
      genre = "",
      genres_excs = [],
      genres_incs = [],
      init = 18,
      multi = false,
      page = 1,
      size = 36
    } = req.query

    // genre = "", init = 18, multi = null, page = 2, size = 36
    const response = await client.post('/apo/', {
      query,
      variables: {
        select: {
          genre: genre,
          genres_excs: genres_excs,
          genres_incs: genres_incs,
          init: Number(init),
          multi: Boolean(multi),
          page: Number(page),
          size: Number(size),
          where: "release"
        }
      }
    })
    const data = response.data?.data

    res.status(200).json(data?.get_latestReleases)
  } catch (error) {
    res.status(500).json(error)
  }
}