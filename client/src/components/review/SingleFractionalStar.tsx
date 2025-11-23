import { StarFilled } from '@ant-design/icons';

interface SingleFractionalStarProps {
  value: number; // e.g., 4.3
  max?: number;  // default 5
  size?: number; // px
}

export const SingleFractionalStar = ({ value, max = 5, size = 16 }: SingleFractionalStarProps) => {
  const fillPercent = Math.min((value / max) * 100, 100);

  return (
    <span style={{ display: 'inline-block', position: 'relative', width: size, height: size }}>
      {/* Empty star */}
      <StarFilled style={{ color: '#e6e6e6', fontSize: size }} />
      {/* Filled portion */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${fillPercent}%`,
          overflow: 'hidden',
          color: '#faad14',
        }}
      >
        <StarFilled style={{ fontSize: size }} />
      </span>
    </span>
  );
};
