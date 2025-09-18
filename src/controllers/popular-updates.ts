import { Request, Response } from "express";
import { client } from "../utils/client";

const query = `
  query get_latestReleases($select: LatestReleases_Select) {
    get_latestReleases(select: $select) {
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

export const popularUpdates = async (req: Request, res: Response) => {
  try {
    const {
      init = 12,
      page = 1,
      size = 24
    } = req.query

    // init = 12, page = 1, size = 24
    const response = await client.post('/apo/', {
      query,
      variables: {
        select: {
          init: Number(init),
          page: Number(page),
          size: Number(size),
          where: "popular"
        }
      }
    })
    const data = response.data?.data

    res.status(200).json(data?.get_latestReleases)
  } catch (error) {
    res.status(500).json(error)
  }
}