const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// CORS Fix ✅
app.use(
  cors({
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// OpenAI config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // You must add your API key to .env
});
const openai = new OpenAIApi(configuration);

// POST endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content:
            "You are a cute, sweet Malayalam-speaking girlfriend. Be flirty, caring, and loving while chatting with the user.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong with AI response." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`💬 AI Backend running at http://localhost:${port}`);
});
