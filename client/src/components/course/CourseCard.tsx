import { Link } from 'react-router-dom';
import { Card, Badge, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { SingleFractionalStar } from '../review/SingleFractionalStar';
const { Text, Title } = Typography;

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  level: string;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  rating,
  students,
  duration,
  price,
  level,
  category,
}: CourseCardProps) => {
  return (
    <Link to={`/courses/${id}`}>
      <Card
        hoverable
        cover={<img alt={title} src={thumbnail} style={{ height: 192, objectFit: 'cover' }} />}
        style={{ height: '100%' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Badge count={category} style={{ background: 'hsl(215 28% 17%)' }} />
          <Badge
            count={level}
            style={{ background: 'transparent', border: '1px solid hsl(215 28% 17%)', color: 'hsl(215 28% 17%)' }}
          />
        </div>

        <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 4 }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          by {instructor}
        </Text>

        <div className="flex items-center gap-4 text-sm mt-3 mb-3" style={{ color: 'hsl(215 16% 47%)' }}>
          <div className="flex items-center gap-1">
            <SingleFractionalStar value={rating} size={16} />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserOutlined style={{ fontSize: 16 }} />
            <span>{students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockCircleOutlined style={{ fontSize: 16 }} />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Text strong style={{ fontSize: 24, color: 'hsl(221 83% 53%)' }}>
            {price === 0 ? 'Free' : `$${price}`}
          </Text>
        </div>
      </Card>
    </Link>
  );
};
