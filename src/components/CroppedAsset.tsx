import React from 'react';

interface CroppedAssetProps {
  x: number;
  y: number;
  width: number;
  height: number;
  renderWidth?: number;
  renderHeight?: number;
  className?: string;
  alt?: string;
  isCircle?: boolean;
}

export const CroppedAsset: React.FC<CroppedAssetProps> = ({
  x,
  y,
  width,
  height,
  renderWidth,
  renderHeight,
  className = '',
  alt = '',
  isCircle = false,
}) => {
  const targetW = renderWidth || width;
  const targetH = renderHeight || height;
  const scaleX = targetW / width;
  const scaleY = targetH / height;

  return (
    <div
      className={`relative overflow-hidden shrink-0 select-none ${isCircle ? 'rounded-full' : ''} ${className}`}
      style={{ width: targetW, height: targetH }}
    >
      <img
        src="/assets/aistudio/1702256135100_cd3aaeaa.png"
        alt={alt}
        className="max-w-none absolute pointer-events-none"
        style={{
          width: `${960 * scaleX}px`,
          height: `${720 * scaleY}px`,
          left: `-${x * scaleX}px`,
          top: `-${y * scaleY}px`,
        }}
      />
    </div>
  );
};
