import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./constants";
import LanguageSelector from "./LanguageSelector";
import "./CodeEditor.css";

// Default judge URL if environment variable is not set
const DEFAULT_JUDGE_URL = "https://emkc.org/api/v2/piston/execute";
const APP_NAME = "ZCoder IDE";

export default function CodeEditor({
  value,
  onChange,
  inputValue,
  onInputChange,
  language,
  onLanguageChange
}) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  // Get judge URL from environment or use default
  const getJudgeUrl = () => {
    const envUrl = import.meta.env.VITE_JUDGE;
    console.log("Environment Judge URL:", envUrl); // Debug log
    return envUrl || DEFAULT_JUDGE_URL;
  };

  useEffect(() => {
    // Always set the snippet when the language changes (now controlled by prop)
    // Only update if a snippet exists for the new language
    if (CODE_SNIPPETS[language] !== undefined) {
        onChange(CODE_SNIPPETS[language]);
    }
    
    // eslint-disable-next-line
  }, [language]); // Depend on language prop

  const runCode = async () => {
    if (!value || value.trim() === "") {
      setError("Please write some code first!");
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput("Running...");

    try {
      const judgeUrl = getJudgeUrl();
      console.log("Using Judge URL:", judgeUrl); 
      if (!LANGUAGE_VERSIONS[language]) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Make the API request
      const response = await axios.post(judgeUrl, {
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: value }],
        stdin: inputValue || "",
      }, {
        timeout: 10000, 
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Validate response
      if (!response.data) {
        throw new Error("No response from judge service");
      }

      const { run } = response.data;
      
      if (!run) {
        throw new Error("Invalid response format from judge service");
      }

      if (run.stderr) {
        setOutput(`Error:\n${run.stderr}`);
      } else if (run.error) {
        setOutput(`Error:\n${run.error}`);
      } else if (run.output) {
        setOutput(run.output);
      } else {
        setOutput("No output");
      }

      // Check for execution time
      if (run.time) {
        setOutput(prev => `${prev}\n\nExecution time: ${run.time}ms`);
      }

    } catch (err) {
      console.error("Code execution error:", err);
      
      // Handle specific error cases
      if (err.code === 'ECONNABORTED') {
        setError("Request timed out. Please try again.");
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data?.error || 'Unknown error'}`);
      } else if (err.request) {
        
        setError("No response from server. Please check your internet connection.");
      } else {
        setError(err.message || "Failed to run code. Please try again.");
      }
      
      setOutput("Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setError(null);
  };

  return (
    <div className="editor-container">
      <h1 className="editor-heading">{APP_NAME}</h1>

      <LanguageSelector language={language} setLanguage={onLanguageChange} />

      <div className="editor-wrapper">
        <Editor
          height='500px'
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 20,
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </div>

      <div className="input-section">
        <textarea
          className="input-box"
          rows="4"
          placeholder="Enter input here..."
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button 
          onClick={runCode} 
          className="run-button"
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>
        <button 
          onClick={clearOutput} 
          className="clear-button"
          disabled={!output && !error}
        >
          Clear Output
        </button>
      </div>

      <div className="output-section">
        <h2 className="output-heading">Output:</h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <pre className="output-box">
          {output}
        </pre>
      </div>
    </div>
  );
}
