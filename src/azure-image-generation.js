import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_APIKEY_OPENAI.toString(),
  dangerouslyAllowBrowser: true,
});

const generateImage = async (prompt) => {
  try {
    const image = await openai.images.generate({
      prompt: prompt.toString(),
      model: "dall-e-2",
      n: 1,
    });
    return image.data[0].url;
  } catch (error) {
    console.error("Error generating image: ", error);
    throw error;
  }
};

export default generateImage;
