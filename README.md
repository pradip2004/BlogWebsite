# 🚀 DevStories

DevStories is a scalable, production-ready blog platform built using a microservices architecture. It allows users to read, write, and manage blogs with features like authentication, AI-powered content generation, real-time notifications, and more.

---
## 🌐 [Live Link](https://dev-stories-three.vercel.app/) 
---


## 📦 Tech Stack

| Layer         | Technologies                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| **Frontend**  | Next.js, TypeScript, Tailwind CSS, shadcn/ui, React, Jodit Editor           |
| **Backend**   | Node.js, Express.js, TypeScript                                              |
| **Databases** | MongoDB (User), PostgreSQL (Blog & Author)                                   |
| **Messaging** | RabbitMQ                                                                     |
| **Caching**   | Redis                                                                         |
| **DevOps**    | Docker, AWS (Cloudinary for image uploads)                                   |
| **Others**    | Axios, js-cookie, React Hot Toast, moment.js, Lucide Icons                   |

---

## 📁 Project Structure

```
DevStories/
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages and routes
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── styles/           # Tailwind / custom styles
│   │   └── utils/            # Utility functions and helpers
│   └── .env                  # Frontend environment variables
│
├── services/
│   ├── user/                 # User microservice (MongoDB)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   └── index.ts
│   │   └── .env
│   │
│   ├── blog/                 # Blog microservice (PostgreSQL)
│   │   ├── src/
│   │   └── .env
│   │
│   └── author/               # Author microservice (PostgreSQL)
│       ├── src/
│       └── .env
│
├── docker-compose.yml       # Optional for service orchestration
├── README.md                 # You’re here!
└── ...
```

---

## 🐇 Running RabbitMQ Locally

```bash
docker run -d \
  --hostname rabbitmq-host \
  --name rabbitmq-container \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin123 \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:management
```

---

## 🧪 Sample `.env` Files

### `frontend/.env`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_USER_SERVICE=http://localhost:5000
NEXT_PUBLIC_AUTHER_SERVICE=http://localhost:5001
NEXT_PUBLIC_BLOG_SERVICE=http://localhost:5002
```

### `services/user/.env`
```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRECT=your-cloudinary-api-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_SECRET=your-google-secret
```

### `services/blog/.env`
```env
PORT=5002
DB_URL=your-postgres-url
USER_SERVICE_URL=http://localhost:5000
REDIS_URL=your-redis-url
RABBITMQ_HOST=localhost
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
JWT_SECRET=your-jwt-secret
```

### `services/author/.env`
```env
PORT=5001
DB_URL=your-postgres-url
RABBITMQ_HOST=localhost
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
JWT_SECRET=your-jwt-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRECT=your-cloudinary-api-secret
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🌐 Core Features

- ✅ JWT-based Authentication + Google OAuth
- ✍️ Blog CRUD operations
- 📌 Save & Unsave blogs
- 💡 AI-generated blog content (title, description, body)
- 💬 Commenting on blogs
- 👤 Author profile management
- 🖼 Image Upload (Cloudinary)
- 🔔 Real-time notifications (RabbitMQ)
- ⚡ Caching with Redis
- 📱 Responsive UI with filtering and search

---

## 🧾 API Routes

### 👤 User Service (`/services/user`)

| Method | Route                   | Description                      |
|--------|-------------------------|----------------------------------|
| POST   | `/api/v1/login`         | Login (email/password or Google)|
| GET    | `/api/v1/me`            | Get current logged-in user      |
| GET    | `/api/v1/user/:id`      | Get user profile by ID          |
| POST   | `/api/v1/user/update`   | Update profile info             |
| POST   | `/api/v1/user/update/pic` | Update profile picture         |

---

### 📝 Blog Service (`/services/blog`)

| Method | Route                    | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/api/v1/blog/all`       | Get all blogs                      |
| GET    | `/api/v1/blog/:id`       | Get single blog                    |
| POST   | `/api/v1/comment/:id`    | Add comment to blog                |
| GET    | `/api/v1/comment/:id`    | Get all comments on blog           |
| DELETE | `/api/v1/comment/:commentid` | Delete comment                 |
| POST   | `/api/v1/save/:blogid`   | Save blog                          |
| DELETE | `/api/v1/unsave/:blogid` | Unsave blog                        |
| GET    | `/api/v1/blog/saved/all` | Get all saved blogs for user       |

---

### 🧠 Author Service (`/services/author`)

| Method | Route                | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | `/api/v1/blog/new`   | Create new blog                      |
| POST   | `/api/v1/blog/:id`   | Update blog                          |
| DELETE | `/api/v1/blog/:id`   | Delete blog                          |
| POST   | `/api/v1/ai/title`   | Generate blog title with AI          |
| POST   | `/api/v1/ai/desc`    | Generate blog description with AI    |
| POST   | `/api/v1/ai/blog`    | Generate full blog with AI           |

---

## 🛠 How to Run the App

1. **Start RabbitMQ:**
   ```bash
   docker run -d --hostname rabbitmq-host --name rabbitmq-container \
     -e RABBITMQ_DEFAULT_USER=admin \
     -e RABBITMQ_DEFAULT_PASS=admin123 \
     -p 5672:5672 -p 15672:15672 rabbitmq:management
   ```

2. **Start Microservices (User, Blog, Author):**
   ```bash
   cd services/user && npm install && npm run dev
   cd ../blog && npm install && npm run dev
   cd ../author && npm install && npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd frontend && npm install && npm run dev
   ```

4. **Visit Frontend:**
   [http://localhost:3000](http://localhost:3000)

---

## 📬 Contributions

Feel free to open issues, fork the repo, and submit PRs. Suggestions and improvements are always welcome!

---

## 📜 License

This project is licensed under the MIT License.
