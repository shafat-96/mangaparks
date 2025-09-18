import { Request, Response } from "express";
import { client } from "../utils/client";
import * as cheerio from 'cheerio'

interface ChapterType {
  id: string | null,
  chapter: string | null,
  uploaded: string | null
}

export const chapters = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const response = await client.get(`/title/${id}`)
    const $ = cheerio.load(response.data)
    const data: ChapterType[] = []

    $(".scrollable-panel .group > div").each(function () {
      data.push({
        id: $(this).find("a").attr("href") || null,
        chapter: $(this).find("> div.space-x-1 a").text().trim() || null,
        uploaded: $(this).find("time").attr('data-time') || null,
      })
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}