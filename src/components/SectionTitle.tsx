import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  light = false,
}) => {
  return (
    <div className="text-center mb-12">
      <h2
        className={`text-3xl md:text-4xl font-bold mb-4 ${
          light ? "text-gray-800" : "text-gray-800"
        }`}
      >
        {title}
      </h2>
      <div className="w-24 h-1.5 bg-orange-700 mx-auto mb-6 rounded-full"></div>
      {subtitle && (
        <p
          className={`max-w-2xl mx-auto text-lg ${
            light ? "text-gray-700" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
