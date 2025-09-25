import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105 hover:shadow-xl border-t-4 border-orange-700">
      <div className="flex flex-col items-center text-center">
        <div className="bg-orange-100 p-4 rounded-full mb-4 text-orange-700">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
