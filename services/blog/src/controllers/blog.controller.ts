import { Request, Response } from "express";
import { sql } from "../config/db.js";
import axios from "axios";
import { redisClient } from "../utils/redisConfig.js";

export const getAllBlogs = async (req: Request, res: Response) => {
      try {
            const { searchQuery="", category="" } = req.query;
            //@Redis implementation
            const cacheKey = `blogs:${searchQuery}:${category}`;
            const cached = await redisClient.get(cacheKey);
            if(cached) {
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
            if(blogs.length > 0) {
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

export const getBlogById = async (req: Request, res: Response) => {
      try {
            const { id } = req.params;
            const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

            const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${blog[0].author}`)
            res.json({blog: blog[0], author: data});
      } catch (error) {
            res.status(500).json({ message: "Internal server error" });
            console.log("error in getBlogById", error);
      }
}