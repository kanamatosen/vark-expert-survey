
import React from 'react';
import { LearningStyle } from '@/types/survey';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ResultsChartProps {
  results: Record<LearningStyle, number>;
}

const ResultsChart: React.FC<ResultsChartProps> = ({ results }) => {
  const data = [
    { 
      name: 'Visual', 
      value: results.visual,
      color: '#6366f1'
    },
    { 
      name: 'Auditori', 
      value: results.auditory,
      color: '#8b5cf6'
    },
    { 
      name: 'Kinestetik', 
      value: results.kinesthetic,
      color: '#d946ef'
    }
  ];
  
  return (
    <div className="w-full h-80 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="value" name="Skor">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
