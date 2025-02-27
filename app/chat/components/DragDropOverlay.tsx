import { Upload } from "lucide-react";
import { FC, DragEvent } from "react";

interface DragDropOverlayProps {
  isDragging: boolean;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

const DragDropOverlay: FC<DragDropOverlayProps> = ({
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
}) => {
  if (!isDragging) return null;

  return (
    <div
      className="fixed inset-0 bg-purple-600/20 z-50 backdrop-blur-sm"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="h-full flex flex-col items-center justify-center text-white">
        <div className="p-6 bg-white/10 rounded-full mb-6 backdrop-blur-md">
          <Upload size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Drop your file here</h2>
        <p className="text-white/80">We'll analyze it for you</p>
      </div>
    </div>
  );
};

export default DragDropOverlay;
