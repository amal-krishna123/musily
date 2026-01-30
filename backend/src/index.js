import express from 'express';
import dotenv from 'dotenv';
import {clerkMiddleware} from '@clerk/express';
import fileupload from 'express-fileupload';
import path from 'path';
import cors from 'cors';

import {connectDB} from "./lib/db.js";
import { initializeSocket } from './lib/socket.js';

import useRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import songsRoutes from './routes/songs.route.js';
import albumsRoutes from './routes/albums.route.js';
import statsRoutes from './routes/stats.route.js';
import { createServer } from 'http';
import cron from 'node-cron';
import fs from "fs";

dotenv.config();

const app = express();
const _dirname = path.resolve();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
  }
));

app.use(express.json());//to parse json req.body
app.use(clerkMiddleware()); // this will add auth to req object
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: path.join(_dirname, 'tmp'),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  })
);

// cron jobs
const tempDir = path.join(process.cwd(),"tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});


app.use("/api/users",useRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songsRoutes);
app.use("/api/albums",albumsRoutes);
app.use("/api/stats",statsRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"../frontend","dist","index.html"));
  })
}

//error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message });
});

httpServer.listen(PORT, () => {
  console.log('Server is running on port '+ PORT);
  connectDB();
});
