import { Response } from "express";
import { AuthReq } from "../types/AuthReq.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../config/db.js";
import { invalidateCache } from "../utils/rabbitmq.js";

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