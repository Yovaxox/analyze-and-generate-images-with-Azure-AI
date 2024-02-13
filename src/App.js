import React, { useState } from "react";
import analyzeImage from "./azure-image-analysis";
import generateImage from "./azure-image-generation";
import "./index.css";

function App() {
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageAnalysis = async () => {
    setIsGenerating(false);
    try {
      setLoading(true);
      const result = await analyzeImage(imageUrlInput);
      setLoading(false);
      setResult(result);
      setImageUrl(imageUrlInput);
      setImageUrlInput("");
    } catch (error) {
      setLoading(false);
      window.alert(
        `Error analyzing image. Please try again.\n\nError details: ${error.response.data.error.message}`
      );
      console.error("Error analyzing image: ", error);
    }
  };

  const handleImageGeneration = async () => {
    let secretKey = prompt("Please enter the secret key to generate an image:");
    if (secretKey !== process.env.REACT_APP_SECRET_KEY) {
      window.alert("Invalid secret key. Please try again.");
    } else {
      setIsGenerating(true);
      let promptImage = imageUrlInput;
      try {
        setLoading(true);
        const result = await generateImage(promptImage);
        setResult(result);
        setImageUrl(promptImage);
        setImageUrlInput("");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error generating image: ", error);
      }
    }
  };

  const convertToPercent = (number) => {
    // Convert to percentage and round to 0 decimal places
    return (number * 100).toFixed(2);
  };

  const loader = () => {
    return (
      <div className="loaderContainer">
        <div id="loader" className="loader">
          <div id="bar-1" className="bar"></div>
          <div id="bar-2" className="bar"></div>
          <div id="bar-3" className="bar"></div>
        </div>
      </div>
    );
  };

  const displayResults = () => {
    if (!result) return null;
    return (
      <>
        {isGenerating ? (
          <>
            <div className="resultTitleText">
              <h2>
                <span className="boldHighlight">Prompt entered:</span>{" "}
                <span className="caption">{imageUrl}</span>
              </h2>
            </div>
            <div
              className="containerResult"
              style={isGenerating ? { marginTop: "40px" } : { marginTop: "0" }}
            >
              <div className="resultImage">
                <img width={500} src={result} alt="uploaded"></img>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="resultTitleText">
              <h2>
                <span className="boldHighlight">Image results:</span>{" "}
                <span className="caption">{result.captionResult.text}</span>
              </h2>
            </div>
            <div className="resultTitleConfidence">
              <h2>
                <span className="boldHighlight">AI Confidence:</span>{" "}
                <span className="caption">
                  {convertToPercent(
                    parseFloat(result.captionResult.confidence)
                  )}
                  %
                </span>
              </h2>
            </div>
            <div className="containerResult">
              <div className="resultImage">
                <img
                  width={500}
                  src={result?.url ? result.url : imageUrl}
                  alt="uploaded"
                ></img>
              </div>
              <div className="containerJsonContent">
                <div className="jsonTitle">
                  <h2>JSON Content</h2>
                </div>
                <div className="jsonContent">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="mainContainer">
      <div className="headerContainer">
        <h1>
          <span className="firstHeader">Image analyzer</span> &{" "}
          <span className="secondHeader">Image generator</span>
        </h1>
      </div>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Enter URL or textual prompt"
          value={imageUrlInput}
          onChange={(event) => {
            setImageUrlInput(event.target.value);
          }}
        ></input>
      </div>
      <div className="btnContainer">
        <button
          className="btnAnalyzer"
          onClick={handleImageAnalysis}
          disabled={imageUrlInput === "" ? true : false}
        >
          Analyze Image
        </button>
        <button
          className="btnGenerator"
          onClick={handleImageGeneration}
          disabled={imageUrlInput === "" ? true : false}
        >
          Generate Image
        </button>
      </div>
      {loading ? (
        loader()
      ) : imageUrl === "" ? (
        <div className="warningContainer">
          <h2>
            <span className="warningMessage">Warning:</span> Please enter a URL
            or prompt to analyze or generate an image.
          </h2>
        </div>
      ) : (
        displayResults()
      )}
    </div>
  );
}

export default App;
