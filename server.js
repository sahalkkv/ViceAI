// === server.js ===
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAIApi, Configuration } = require("openai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: "YOUR_OPENAI_API_KEY",
});
const openai = new OpenAIApi(configuration);

let messageHistory = [
  {
    role: "system",
    content:
      "You are a sweet and loving girlfriend who speaks in Malayalam. Your tone is romantic, emotional, flirty, and deeply caring. Reply in a realistic, heart-touching way. Use cute emojis occasionally.",
  },
];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  messageHistory.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageHistory,
    });

    const aiReply = completion.data.choices[0].message.content;
    messageHistory.push({ role: "assistant", content: aiReply });
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`💬 AI Backend running at http://localhost:${port}`);
});
