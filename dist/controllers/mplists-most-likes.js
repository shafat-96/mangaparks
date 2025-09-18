"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mplistsMostsLikes = void 0;
const client_1 = require("../utils/client");
const query = `
  query get_mylist_SortedList($select: MylistList_Select) {
    get_mylist_SortedList(select: $select) {
      paging {
        total pages page init size skip limit prev next
      }
      items {
        id
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
              follows
              reviews
              comments_topic
              comments_total
              mylists
              votes
              notes
              emotions { field count }
              statuss { field count }
              views { field count }
              scores { field count }
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
const mplistsMostsLikes = async (req, res) => {
    try {
        const { comicId = null, init = 6, page = 1, size = 12 } = req.query;
        const response = await client_1.client.post('/apo/', {
            query,
            variables: {
                select: {
                    comicId: Number(comicId),
                    init: Number(init),
                    page: Number(page),
                    size: Number(size),
                    sortby: "likes"
                }
            }
        });
        const data = response.data.data;
        res.status(200).json(data.get_mylist_SortedList);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.mplistsMostsLikes = mplistsMostsLikes;
