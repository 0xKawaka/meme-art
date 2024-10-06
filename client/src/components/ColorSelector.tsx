// ColorSelector.tsx
import './ColorSelector.css';
import React from 'react';

interface ColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

// const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
// hex code for colors
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080'];

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <div className="color-selector">
      <div className="color-options">
        {colors.map((color) => (
          <div
            key={color}
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
