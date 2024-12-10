import React from "react";
import "./animated-toggle.css";

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  checked,
  onChange,
}) => {
  return (
    <label className="animated-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="toggle-track">
        <div className="toggle-scene">
          <div className="celestial-body" />
          <div className="stars">
            <div className="star" style={{ top: "20%", left: "20%" }} />
            <div className="star" style={{ top: "10%", left: "35%" }} />
            <div className="star" style={{ top: "30%", left: "50%" }} />
            <div className="star" style={{ top: "15%", left: "65%" }} />
            <div className="star" style={{ top: "25%", left: "80%" }} />
          </div>
          <div className="clouds">
            <div className="cloud" style={{ bottom: "10%", left: "60%" }} />
            <div className="cloud" style={{ bottom: "15%", left: "80%" }} />
          </div>
        </div>
      </div>
    </label>
  );
};

export default AnimatedToggle;
