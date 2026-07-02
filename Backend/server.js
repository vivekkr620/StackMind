import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = 8080;

/* PARSE incoming Request */
app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
  connectDB();
});

// connection establish
const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database!");
    console.log("Database Name:", conn.connection.name);
    console.log("Host:", conn.connection.host);

  } catch(err) {
    console.log("Failed to connect with DataBase",err);
  }
}





















/* ---------------------------------------- GEMINI API END-POINT ------------------------------- */
// app.post("/test", async (req, res) => {
//   const userPrompt = req.body.prompt || "Hello!";

//   const options = {
//     method: "POST",
//     headers: {
//       "x-goog-api-key": process.env.GEMINI_API_KEY,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: userPrompt,
//             },
//           ],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
//       options,
//     );

//     const data = await response.json();

//     console.log(data.candidates[0].content.parts[0].text);

//     res.json(data.candidates[0].content.parts[0].text);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

/* ------------------------------- OPENAI API END-POINT -------------------- */

// app.post("/test", async (req, res) => {
//   console.log("API KEY", process.env.OPENAI_API_KEY);

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     }),
//   };
//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options,
//     );
//     const data = await response.json();
//     console.log(data.choices[0].message.content);
//     res.send(data.choices[0].messagr.content);
//   } catch (err) {
//     console.log(err);
//   }
// });
