import { Request, Response } from "express";
import { client } from "../utils/client";

const query = `
  query get_mylist_yweekList {
    get_mylist_yweekList
  }
`

export const yWeekList = async (req: Request, res: Response) => {
  try {
    const response = await client.post('/apo/', {
      query,
    })
    const data = response.data.data

    res.status(200).json(data.get_mylist_yweekList)
  } catch (error) {
    res.status(500).json(error)
  }
}