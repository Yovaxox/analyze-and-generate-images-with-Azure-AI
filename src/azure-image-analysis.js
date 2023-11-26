import axios from "axios";

async function analyzeImage(imageUrl) {
  const endpoint = process.env.REACT_APP_ENDPOINT_COMPUTER_VISION.toString() + process.env.REACT_APP_ENDPOINT_ROUTE_COMPUTER_VISION.toString();
  const apiKey = process.env.REACT_APP_API_KEY_COMPUTER_VISION.toString();
  const url = endpoint;
  try {
    const response = await axios.post(
      url,
      { url: imageUrl },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/json",
        },
        params: {
            features: "caption,read", 
            "model-version": "latest", 
            language: "en",
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing image: ", error);
    throw error;
  }
}

export default analyzeImage;
