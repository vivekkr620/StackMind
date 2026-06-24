import dotenv from "dotenv";
dotenv.config();

const getGeminiAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      options,
    );

    const data = await response.json();

    // console.log(data.candidates[0].content.parts[0].text);

    // console.log("Gemini Response:");
    // console.log("Status:", response.status);
    // console.log(JSON.stringify(data, null, 2));

    // res.json(data.candidates[0].content.parts[0].text);
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.log(err);
  }
};

export default getGeminiAIAPIResponse;