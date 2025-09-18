import { Request, Response } from "express";
import { client } from "../utils/client";
import * as cheerio from 'cheerio';

export const images = async (req: Request, res: Response) => {
  try {
    // The fix is to get the path from req.params[0], which corresponds to the regex capture group.
    const id = req.params[0]; 

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "id" in the URL path' });
    }

    // Sanitize to avoid protocol-relative URLs like `//title/...` which break URL resolution.
    const sanitizedPath = `/${id.replace(/^\/+/, '')}`;

    const response = await client.get(sanitizedPath);
    const $ = cheerio.load(response.data);
    
    const scriptElement = $("script[type='qwik/json']");

    if (scriptElement.length === 0) {
      console.error("Error: Could not find script tag with type 'qwik/json'.");
      return res.status(500).json({ error: "Failed to parse external page: script tag not found." });
    }

    const scriptContent = scriptElement.text();
    if (!scriptContent) {
        console.error("Error: Script tag with type 'qwik/json' was empty.");
        return res.status(500).json({ error: "Failed to parse external page: script tag is empty." });
    }

    const parsedData = JSON.parse(scriptContent);
    if (!parsedData || !parsedData.objs) {
        console.error("Error: Parsed JSON does not contain 'objs' property.");
        return res.status(500).json({ error: "Failed to parse external page: 'objs' property not found in JSON." });
    }

    const object = parsedData.objs;
    const jpegUrls = object.filter(
      (item: any) => typeof item === 'string' && item.match(/\.(jpe?g)(\?.*)?$/i)
    );

    res.status(200).json({ totalImg: jpegUrls.length, jpegUrls });
  } catch (error: any) {
    console.error("An unexpected error occurred in the images handler:", error);
    res.status(500).json({ 
        error: "An internal server error occurred.",
        details: error.message 
    });
  }
};
