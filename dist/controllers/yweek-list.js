"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yWeekList = void 0;
const client_1 = require("../utils/client");
const query = `
  query get_mylist_yweekList {
    get_mylist_yweekList
  }
`;
const yWeekList = async (req, res) => {
    try {
        const response = await client_1.client.post('/apo/', {
            query,
        });
        const data = response.data.data;
        res.status(200).json(data.get_mylist_yweekList);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.yWeekList = yWeekList;
