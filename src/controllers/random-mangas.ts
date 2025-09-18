import { Request, Response } from "express";
import { client } from "../utils/client";

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

export const randomMangas = async (req: Request, res: Response) => {
  try {
    const amount = req.query.amount // total of 12
    const response = await client.post('/apo/', {
      query,
      variables: {
        amount: Number(amount)
      }
    })
    const data = response.data.data

    res.status(200).json(data.get_random_comicList)
  } catch (error) {
    res.status(500).json(error)
  }
}