import express from "express";
import dotenv from "dotenv";
import path from "path";
import passport from "passport";
import connectDB from "./config/db.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import notePadRoutes from "./routes/notePadRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";
import trashRoutes from "./routes/trashRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

connectDB();

import passportConfig from "./config/passport.js";
passportConfig(passport);

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const currentSubject = req.user.currentSubject;

    if (currentSubject) {
      res.redirect(
        `https://autodidactica.app/dashboard/days/${req.user.token}`
      );
    } else {
      res.redirect(`https://autodidactica.app/subject/${req.user.token}`);
    }
  }
);

app.use("/api/dashboard", timelineRoutes);
app.use("/api/users/", userRoutes); //  /?
app.use("/api/resources", resourceRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", notePadRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/transcript", transcriptRoutes);
app.use("/api/trash", trashRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/message", messageRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
