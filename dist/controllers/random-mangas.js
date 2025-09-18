"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomMangas = void 0;
const client_1 = require("../utils/client");
const query = `
  query get_random_comicList($amount: Int) {
    get_random_comicList(amount: $amount) {
      id
      data {
        id
        name
        urlCover600
        urlPath
        sfw_result
      }
    }
  }
`;
const randomMangas = async (req, res) => {
    try {
        const amount = req.query.amount; // total of 12
        const response = await client_1.client.post('/apo/', {
            query,
            variables: {
                amount: Number(amount)
            }
        });
        const data = response.data.data;
        res.status(200).json(data.get_random_comicList);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.randomMangas = randomMangas;
