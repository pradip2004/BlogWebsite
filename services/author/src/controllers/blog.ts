import { Request, Response } from "express";
import { AuthReq } from "../types/AuthReq.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../config/db.js";
import { invalidateCache } from "../utils/rabbitmq.js";
import { geminiConfig, oldGeminiConfig } from "../utils/geminiConfig.js";


export const createBlog = async (req: AuthReq, res: Response) => {
      try {
            const { title, description, blogcontent, category } = req.body;

            const file = req.file;

            if (!file) {
                  res.status(400).json({
                        success: false,
                        message: "Please upload a file"
                  })
                  return
            }

            const fileBuffer = getBuffer(file);
            if (!fileBuffer || !fileBuffer.content) {
                  res.status(400).json({
                        message: "Failed to generate buffer"
                  })
                  return;
            }

            const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
                  folder: "blogs"
            })

            if (!req.user || !req.user._id) {
                  res.status(401).json({
                        message: "Unauthorized: User not found"
                  });
                  return;
            }

            const result = await sql`
            INSERT INTO blogs (title, description, image, blogcontent, category, author) VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user._id})
            RETURNING *`;

            await invalidateCache(["blogs:*"])

            res.json({
                  message: "Blog created successfully",
                  blog: result[0]
            })
      } catch (error: any) {
            console.log("Error in creating blog", error)
            res.status(500).json({
                  message: "Internal server error"
            })
      }
}

export const updateBlog = async (req: AuthReq, res: Response) => {
      try {
            const { id } = req.params;
            const { title, description, blogcontent, category } = req.body;

            const file = req.file;

            const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

            if (!blog.length) {
                  res.status(404).json({
                        message: "Blog not found"
                  })
                  return;
            }

            if (blog[0].author !== req.user?._id) {
                  res.status(401).json({
                        message: "Unauthorized: You are not the author of this blog"
                  })
                  return;
            }

            let imageUrl = blog[0].image;

            if (file) {
                  const fileBuffer = getBuffer(file);

                  if (!fileBuffer || !fileBuffer.content) {
                        res.status(400).json({
                              message: "Failed to generate buffer",
                        });
                        return;
                  }

                  const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
                        folder: "blogs",
                  });

                  imageUrl = cloud.secure_url;
            }

            const updateBlog = await sql`
            UPDATE blogs SET 
            title = ${title || blog[0].title},
            description = ${title || blog[0].description},
            image= ${imageUrl},
            blogcontent = ${title || blog[0].blogcontent},
            category = ${title || blog[0].category}

            WHERE id = ${id}
            RETURNING * `;

            await invalidateCache(["blogs:*", `blogs:${id}`])

            res.json({
                  message: "Blog Updated",
                  blog: updateBlog[0],
            });

      } catch (error: any) {
            console.log("Error in updating blog", error)
            res.status(500).json({
                  message: "Internal server error"
            })

      }
}

export const deleteBlog = async (req: AuthReq, res: Response) => {
      try {
            const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

            if (!blog.length) {
                  res.status(404).json({
                        message: "No blog with this id",
                  });
                  return;
            }

            if (blog[0].author !== req.user?._id) {
                  res.status(401).json({
                        message: "You are not author of this blog",
                  });
                  return;
            }

            await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
            await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
            await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

            await invalidateCache(["blogs:*", `blogs:${req.params.id}`])
            res.json({
                  message: "Blog deleted successfully",
            });
      } catch (error: any) {
            console.log("Error in deleting blog", error)
            res.status(500).json({
                  message: "Internal server error"
            })

      }
}

export const aiTitleResponse = async (req: Request, res: Response) => {
      try {
            const { text } = req.body;

            const prompt = `Correct the grammar of the following blog title and return only the corrected title without any additional text, formatting, or symbols: "${text}"`;

            let result;

            async function main() {
                  const response = await geminiConfig.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: prompt
                  });

                  let rawText = response.text

                  if (!rawText) {
                        res.status(400).json({
                              message: "Something went wrong in GenAI"
                        })
                  }

                  result = rawText?.replace(/\*\*/g, "").replace(/[\r\n]+/g, "").replace(/[*_`~]/g, "").trim();
            }

            await main();

            res.json(result)


      } catch (error) {

      }

}

export const aiDescResponse = async (req: Request, res: Response) => {
      try {
            const { title, description } = req.body;

            const prompt = description === "" ? `Generate only one short blog description based on this title: "${title}". Your response must be only one sentence, strictly under 30 words, with no options, no greetings, and no extra text. Do not explain. Do not say 'here is'. Just return the description only.` : `Fix the grammar in the following blog description and return only the corrected sentence. Do not add anything else: "${description}"`;

            let result;

            async function main() {
                  const response = await geminiConfig.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: prompt
                  });

                  let rawText = response.text

                  if (!rawText) {
                        res.status(400).json({
                              message: "Something went wrong in GenAI"
                        })
                  }

                  result = rawText?.replace(/\*\*/g, "").replace(/[\r\n]+/g, "").replace(/[*_`~]/g, "").trim();
            }

            await main();

            res.json(result)


      } catch (error) {
            console.log("erron in genAI", error)
      }

}

export const aiBlogResponse = async (req: Request, res: Response) => {
      try {
            const prompt = ` You will act as a grammar correction engine. I will provide you with blog content in rich HTML format (from Jodit Editor). Do not generate or rewrite the content with new ideas. Only correct grammatical, punctuation, and spelling errors while preserving all HTML tags and formatting. Maintain inline styles, image tags, line breaks, and structural tags exactly as they are. Return the full corrected HTML string as output. `;

            const { blog } = req.body;
            if (!blog) {
                  res.status(400).json({
                        message: "Please provide blog"
                  })
                  return;
            }

            const fullMessage = `${prompt} \n\n ${blog}`



            const model = oldGeminiConfig.getGenerativeModel({ model: "gemini-1.5-pro" });

            const result = await model.generateContent({
                  contents: [
                        {
                              role: "user",
                              parts: [
                                    {
                                          text: fullMessage,
                                    },
                              ],
                        },
                  ],
            });

            const responseText = await result.response.text();

            const cleanedHtml = responseText
                  .replace(/^(html|```html|```)\n?/i, "")
                  .replace(/```$/i, "")
                  .replace(/\*\*/g, "")
                  .replace(/[\r\n]+/g, "")
                  .replace(/[*_`~]/g, "")
                  .trim();

            res.status(200).json({ html: cleanedHtml });


      } catch (error) {
            console.log("error in genai", error)
      }
}