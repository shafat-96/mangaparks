import { Request, Response } from "express";
import { client } from "../utils/client";

const query = `
  query get_mylist_weeklyLists($select: Mylist_WeeklyLists_Select) {
    get_mylist_weeklyLists(select: $select) {
      start
      yweek
      items {
        id
        iid
        hash
        data {
          id
          hash
          dateCreate
          dateModify
          name
          isPublic
          urlPath
          comics
          likes
          comments_total
          userId
          userNode {
            id
            data {
              id
              name
              uniq
              avatarUrl
              urlPath
              dateCreate
              dateOnline
              gender
              birth { y m d }
              is_adm
              is_mod
              is_vip
              is_upr
              is_verified
              is_banned
              is_deleted
              in_deletion
            }
          }
          comicNodes(amount: 4) {
            id
            data {
              id
              editId
              name
              dbStatus
              sfw_result
              origLang
              tranLang
              urlPath
              urlEdit
              urlCover600
              urlCoverOri
              dateCreate
              datePublic
              dateModify
              dateUpload
              dateUpdate
              altNames
              authors
              artists
              publishers
              genres
              sfw_result
              is_hot
              is_new
              uploadStatus
              originalStatus
              userId
              userNode {
                id
                data {
                  id
                  name
                  uniq
                  avatarUrl
                  urlPath
                  dateCreate
                  dateOnline
                  gender
                  birth { y m d }
                  is_adm
                  is_mod
                  is_vip
                  is_upr
                  is_verified
                  is_banned
                  is_deleted
                  in_deletion
                }
              }
              is_hot
              is_new
              follows
              reviews
              comments_topic
              comments_total
              mylists
              votes
              notes
              emotions {
                field
                count
              }
              statuss {
                field
                count
              }
              views {
                field
                count
              }
              scores {
                field
                count
              }
              score_avg
              score_bay
              score_val
              files_normal
              files_others
              chaps_normal
              chaps_others
            }
          }
        }
      }
    }
  }
`;

export const mplistsWeekly = async (req: Request, res: Response) => {
  try {
    const { limit = 12 } = req.query
    const yweek = req.params.yweek

    if (!yweek) {
      res.status(500).json({ error: "yweek is required" })
      return
    }

    const response = await
      client.post('/apo/', {
        query,
        variables: {
          select: {
            limit: Number(limit),
            yweek: Number(yweek)
          }
        }
      })
    const data = response.data.data

    res.status(200).send({ data: data.get_mylist_weeklyLists })
  } catch (error) {
    res.status(500).json(error)
  }
}