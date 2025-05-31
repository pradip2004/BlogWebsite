import { Request, Response } from "express";
import { sql } from "../config/db.js";
import axios from "axios";
import { redisClient } from "../utils/redisConfig.js";
import { AuthReq } from "../types/AuthReq.js";

export const getAllBlogs = async (req: Request, res: Response): Promise<any> => {
      try {
            const { searchQuery = "", category = "" } = req.query;
            //@Redis implementation
            const cacheKey = `blogs:${searchQuery}:${category}`;
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                  console.log("Cache hit");
                  return res.json(JSON.parse(cached));
            }

            let blogs;
            if (searchQuery && category) {
                  blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND category = ${category} ORDER BY create_at DESC`;
            } else if (searchQuery) {
                  blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
            } else if (category) {
                  blogs = await sql`SELECT * FROM blogs WHERE category = ${category} ORDER BY create_at DESC`;
            } else {
                  blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
            }

            // @Redis implementation
            if (blogs.length > 0) {
                  await redisClient.set(cacheKey, JSON.stringify(blogs), {
                        EX: 60 * 60 * 24,
                  });
            }
            console.log("serving from db");

            res.json(blogs)
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in getAllBlogs", error);
      }
}

export const getBlogById = async (req: Request, res: Response): Promise<any> => {
      try {
            const { id } = req.params;
            const cacheKey = `blog:${id}`;
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                  console.log("Cache hit");
                  return res.json(JSON.parse(cached));
            }
            const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

            if (blog.length === 0) {
                  return res.status(404).json({ message: "Blog not found" });
            }


            const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`)

            // @Redis implementation
            await redisClient.set(cacheKey, JSON.stringify({ blog: blog[0], author: data }), {
                  EX: 60 * 60 * 24,
            });


            res.json({ blog: blog[0], author: data });
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in getBlogById", error);
      }
}

export const addComment = async (req: AuthReq, res: Response) => {
      try {
            const { id: blogid } = req.params;
            const { comment } = req.body;

            await sql`INSERT INTO comments (comment, blogid, userid, username) vALUES (${comment}, ${blogid}, ${req.user?._id}, ${req.user?.name}) RETURNING *`;

            res.json({
                  message: "Comment added successfully"
            })
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in addComment", error);

      }
}

export const getAllComments = async (req: Request, res: Response) => {
      try {
            const { id } = req.params;

            const comments = await sql`SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC`;

            res.json(comments);
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in getAllComments", error);

      }
}


export const deleteComment =
      async (req: AuthReq, res: Response) => {
            try {
                  const { commentid } = req.params;

                  const comment = await sql`SELECT * FROM comments WHERE id = ${commentid}`;

                  console.log(comment);

                  if (comment[0].userid !== req.user?._id) {
                        res.status(401).json({
                              message: "You are not owner of this comment",
                        });
                        return;
                  }

                  await sql`DELETE FROM comments WHERE id = ${commentid}`;

                  res.json({
                        message: "Comment Deleted",
                  });
            }
            catch (error) {
                  res.status(500).json({ message: "Internal server error" });
                  console.log("error in deleteComment", error);
            }
      }


export const saveBlog = async (req: AuthReq, res: Response) => {
      try {
            const { blogid } = req.params;
            const userid = req.user?._id;

            if (!blogid || !userid) {
                  res.status(400).json({
                        message: "Missing blog id or userid",
                  });
                  return;
            }

            const existing =
                  await sql`SELECT * FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

            if (existing.length === 0) {
                  await sql`INSERT INTO savedblogs (blogid, userid) VALUES (${blogid}, ${userid})`;

                  res.json({
                        message: "Blog Saved",
                  });
                  return;
            } else {
                  await sql`DELETE FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

                  res.json({
                        message: "Blog Unsaved",
                  });
                  return;
            }

      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in saveBlog", error);

      }
}

export const getSavedBlog = async (req: AuthReq, res: Response) => {
      try {
            const blogs =
                  await sql`SELECT * FROM savedblogs WHERE userid = ${req.user?._id}`;

            res.json(blogs);
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in getSavedBlog", error);

      }
}

export const unsaveBlog = async (req: AuthReq, res: Response): Promise<void> => {
      try {
            const { blogid } = req.params;
            const userid = req.user?._id;

            if (!blogid || !userid) {
                  res.status(400).json({ message: "Missing blog id or userid" });
                  return;
            }

            const existing =
                  await sql`SELECT * FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

            if (existing.length === 0) {
                  res.status(404).json({ message: "Blog is not saved" });
                  return
            }

            await sql`DELETE FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;

            res.json({ message: "Blog Unsaved" });
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in unsaveBlog", error);
      }
};