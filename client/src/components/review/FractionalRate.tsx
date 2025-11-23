import { StarFilled } from '@ant-design/icons';

interface FractionalRateProps {
  value: number;      // e.g., 4.3
  max?: number;       // default 5
  size?: number;      // star size in px
}

export const FractionalRate = ({ value, max = 5, size = 16 }: FractionalRateProps) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    let fillPercent = 0;
    if (i <= Math.floor(value)) fillPercent = 100;
    else if (i === Math.ceil(value)) fillPercent = (value % 1) * 100;

    stars.push(
      <span
        key={i}
        style={{ display: 'inline-block', position: 'relative', width: size, height: size, marginRight: 2 }}
      >
        <StarFilled style={{ color: '#e6e6e6', fontSize: size }} />
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
  }

  return <span>{stars}</span>;
};
