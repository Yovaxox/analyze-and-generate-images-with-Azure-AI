import React, { useState } from "react";
import analyzeImage from "./azure-image-analysis";
import generateImage from "./azure-image-generation";
import "./index.css";

function App() {
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageAnalysis = async () => {
    try {
      setLoading(true);
      const result = await analyzeImage(imageUrlInput);
      setLoading(false);
      setResult(result);
      setImageUrl(imageUrlInput);
      setImageUrlInput("");
    } catch (error) {
      setLoading(false);
      console.error("Error analyzing image: ", error);
    }
  };

  const handleImageGeneration = async () => {
    //let prompt = imageUrlInput;
    try {
      const result = await generateImage("");
      console.log(result);
      /*
      const generationResult = await generateImage(prompt);
      setResult(generationResult[0]);
      */
    } catch (error) {
      console.error("Error generating image: ", error);
    }
  };

  const convertToPercent = (number) => {
    // Convert to percentage and round to 0 decimal places
    return (number * 100).toFixed(2);
  }

  const loader = () => {
    return (
    <div className="loaderContainer">
        <div id="loader" class="loader">
          <div id="bar-1" class="bar"></div>
          <div id="bar-2" class="bar"></div>
          <div id="bar-3" class="bar"></div>
      </div>
    </div>
    )
  }

  const displayResults = () => {
    if (!result) return null;
    return (
      loading ? loader() :
      <>
        <hr className="separator" />
        <div className="resultTitleText">
          <h2>
            <span className="boldHighlight">Image results:</span>{" "}
            <span className="caption">{result.captionResult.text}</span>
          </h2>
        </div>
        <div className="resultTitleConfidence">
          <h2>
            <span className="boldHighlight">AI Confidence:</span>{" "}
            <span className="caption">{convertToPercent(parseFloat(result.captionResult.confidence))}%</span>
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
    );
  };

  return (
    <div className="mainContainer">
      <div className="headerContainer">
        <h1><span className="firstHeader">Image analyzer</span> & <span className="secondHeader">Image generator</span></h1>
      </div>
      <div className="inputContainer">
        <label>URL or Prompt:</label>
        <input
          type="text"
          placeholder="Enter URL or textual prompt"
          value={imageUrlInput}
          onChange={(event) => {setImageUrlInput(event.target.value)}}
        ></input>
      </div>
      <div className="btnContainer">
        <button onClick={handleImageAnalysis}>Analyze Image</button>
        <button onClick={handleImageGeneration}>Generate Image</button>
      </div>
      {imageUrl === "" ? <h2 className="warningMessage">Please enter a URL or prompt to analyze or generate an image.</h2> : displayResults()}
    </div>
  );
}

export default App;
