import type { PCPart } from "../types";

interface PCPartCardProps {
  part: PCPart;
  onClick?: () => void;
  isActive?: boolean;
}

export function PCPartCard({ part, onClick, isActive = false }: PCPartCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6 transition-all duration-300
        ${isActive ? "scale-105 shadow-2xl" : "hover:scale-102 hover:shadow-lg"}
        ${isActive ? "bg-gradient-to-br from-yellow-100 to-orange-100" : "bg-white"}
        border-4 ${isActive ? "border-orange-400" : "border-gray-200"}
      `}
    >
      <div className="text-center">
        {part.imageUrl && (
          <div className="mb-4 h-32 w-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🖥️</span>
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{part.name}</h3>
        <p className="text-lg text-gray-600">{part.description}</p>
      </div>
    </button>
  );
}
