import amqp from "amqplib";
import { CacheInvalidationMessage } from "../types/cacheInvalidation.js";
import { redisClient } from "./redisConfig.js";
import { sql } from "../config/db.js";

export const startCacheConsumer = async () => {
      try {
            const connection = await amqp.connect({
                  protocol: "amqp",
                  hostname: process.env.RABBITMQ_HOST,
                  port: 5672,
                  username: process.env.RABBITMQ_USER,
                  password: process.env.RABBITMQ_PASSWORD,
            });

            const channel = await connection.createChannel();

            const queueName = "cache-invalidation";

            await channel.assertQueue(queueName, { durable: true });
            console.log("✅ Connected to Rabbitmq");

            channel.consume(queueName, async (msg)=>{
                  if(msg) {
                        try {
                              const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;

                              console.log("✅ Cache invalidation message received", content);

                              if(content.action === "invalidateCache") {
                                    console.log("I'm in the if check")
                                    for(const pattern of content.keys) {
                                          const keys = await redisClient.keys(pattern);

                                          if(keys.length > 0) {
                                                await redisClient.del(keys)

                                                console.log(`✅ Cache invalidated for keys: ${keys}`);
                                          }

                                          const searchQuery = ""
                                          const category = "" 
                                          const cacheKey = `blogs:${searchQuery}:${category}`

                                          const blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;

                                          await redisClient.set(cacheKey, JSON.stringify(blogs), {
                                                EX: 3600,
                                          });
                                          console.log(`✅ Cache revalidated for key: ${cacheKey}`);
                                    }
                              }

                              channel.ack(msg)
                        } catch (error) {
                              console.log("❌ Failed to process message in consumer", error);

                              channel.nack(msg, false, true);
                        }
                  }
            })
      } catch (error) {
            console.error("❌ Failed to connect to Rabbitmq", error);
      }
}