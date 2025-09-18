import { Request, Response } from "express";
import { client } from "../utils/client";
import * as cheerio from 'cheerio'

interface InfoType {
  img: string | null,
  title: string | null,
  otherInfo: string[],
  search: string[],
  genres: string[],
  originalPulication: string | null,
  mParkUploadStatus: string | null,
  description: string | null
}

export const info = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const response = await client.get(`/title/${id}`)
    const $ = cheerio.load(response.data)
    const data: InfoType = {
      img: null,
      title: null,
      otherInfo: [],
      search: [],
      genres: [],
      originalPulication: null,
      mParkUploadStatus: null,
      description: null
    }

    const selector = $("main div:nth-child(1)")

    data.img = $(selector).find(".flex img").attr("src") || null
    data.title = $(selector).find(".flex > div:nth-child(2) > h3 a").text().trim() || null

    $(selector).find(".flex div:nth-child(2) > .mt-1.text-xs span").each(function () {
      const text = $(this).text().trim()
      if (text !== '/') {
        data.otherInfo.push($(this).text().trim())
      }
    })

    $(selector).find(".flex div:nth-child(2) > .mt-2.text-sm a").each(function () {
      data.search.push($(this).text().trim())
    })

    $(selector).find(".mt-3 > div:nth-child(2) > div.flex.items-center > span").each(function () {
      data.genres.push($(this).text().trim())
    })

    data.originalPulication = $(selector).find(".mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase").text().trim()
    data.mParkUploadStatus = $(selector).find(".mt-3 > div:nth-child(2) > div:nth-child(3) span.font-bold.uppercase").text().trim()

    data.description = $(selector).find(".limit-html-p").text().trim()

    res.status(200).send(data)
  } catch (error) {
    res.status(500).json(error)
  }
}