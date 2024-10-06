import React from 'react';
import './Loading.css';  // Import the CSS file for styling

interface LoadingProps {
  spinnerSize?: number;  // Width and height of the spinner in pixels
  textSize?: number;     // Font size for the loading text in pixels
  showText?: boolean;    // Whether to display the loading text or not
  screenCenter?: boolean;    // Whether to display the loading text or not
}

const Loading: React.FC<LoadingProps> = ({ spinnerSize = 50, textSize = 18, showText = true, screenCenter= true }) => {
  return (
    <div className="loading-container"  style={screenCenter ? {height: '100vh'} : {}}>
      <div
        className="spinner"
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          borderWidth: `${spinnerSize / 6}px`, // Adjust the border thickness relative to size

        }}
      ></div>
      {showText && (
        <div
          className="loading-text"
          style={{
            fontSize: `${textSize}px`,
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

export default Loading;
