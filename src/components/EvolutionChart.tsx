import React, { useState } from 'react';
import { DayRecord } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { LineChart as ChartIcon, Info } from 'lucide-react';

interface EvolutionChartProps {
  records: DayRecord[];
  initialAmount: number;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ records, initialAmount }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!records || records.length === 0) return null;

  // Day 0 + 30 days
  const dataPoints = [
    { day: 0, balance: initialAmount, earned: 0, profit: 0, rate: 0 },
    ...records.map((r) => ({
      day: r.day,
      balance: r.finalBalance,
      earned: r.interestEarned,
      profit: r.cumulativeProfit,
      rate: r.ratePercent,
    })),
  ];

  const minVal = Math.min(initialAmount, ...dataPoints.map((d) => d.balance));
  const maxVal = Math.max(initialAmount * 1.05, ...dataPoints.map((d) => d.balance));
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 260;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (dataPoints.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;

  // Build SVG path
  const points = dataPoints.map((d, i) => `${getX(i)},${getY(d.balance)}`);
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  
  // Area fill path
  const areaD = points.length > 0
    ? `M ${getX(0)},${paddingTop + chartHeight} L ${points.join(' L ')} L ${getX(dataPoints.length - 1)},${paddingTop + chartHeight} Z`
    : '';

  // Y-axis grid marks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount + 1 }).map((_, i) => {
    const val = minVal + (range / yTicksCount) * i;
    return { val, y: getY(val) };
  });

  const activeData = hoveredIndex !== null ? dataPoints[hoveredIndex] : dataPoints[dataPoints.length - 1];

  return (
    <section id="evolution-chart-card" className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              Curva de Evolução dos Juros Compostos (30 Dias)
            </h2>
            <p className="text-xs text-stone-500">
              Crescimento exponencial dia após dia
            </p>
          </div>
        </div>

        {activeData && (
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs self-start sm:self-auto">
            <span className="font-semibold text-stone-800">
              {activeData.day === 0 ? 'Início (Dia 0)' : `Dia ${activeData.day}`}
            </span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-600">
              Saldo: <strong className="text-emerald-700">{formatCurrency(activeData.balance)}</strong>
            </span>
            {activeData.day > 0 && (
              <>
                <span className="text-stone-400 hidden sm:inline">|</span>
                <span className="text-stone-600 hidden sm:inline">
                  Rendimento: <strong className="text-stone-900">+{formatCurrency(activeData.earned)}</strong> ({formatPercent(activeData.rate)})
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* SVG Chart Container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={tick.y}
                  x2={width - paddingRight}
                  y2={tick.y}
                  stroke="#e7e5e4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#78716c"
                  className="font-mono"
                >
                  {formatCurrency(tick.val)}
                </text>
              </g>
            ))}

            {/* Baseline for initial amount */}
            <line
              x1={paddingLeft}
              y1={getY(initialAmount)}
              x2={width - paddingRight}
              y2={getY(initialAmount)}
              stroke="#a8a29e"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
            <text
              x={width - paddingRight}
              y={getY(initialAmount) - 6}
              textAnchor="end"
              fontSize="10"
              fill="#78716c"
              className="font-medium"
            >
              Capital Inicial
            </text>

            {/* Shaded Area under curve */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Main Exponential Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-axis Day labels */}
            {[0, 5, 10, 15, 20, 25, 30].map((dayNum) => {
              const xPos = getX(dayNum);
              return (
                <g key={dayNum}>
                  <line
                    x1={xPos}
                    y1={paddingTop + chartHeight}
                    x2={xPos}
                    y2={paddingTop + chartHeight + 6}
                    stroke="#a8a29e"
                  />
                  <text
                    x={xPos}
                    y={paddingTop + chartHeight + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#57534e"
                    fontWeight={dayNum === 30 || dayNum === 0 ? '600' : '400'}
                  >
                    {dayNum === 0 ? 'Início' : `Dia ${dayNum}`}
                  </text>
                </g>
              );
            })}

            {/* Interactive Data Points and Hover Zones */}
            {dataPoints.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.balance);
              const isHovered = hoveredIndex === i;
              const isKeyMilestone = d.day === 0 || d.day === 10 || d.day === 20 || d.day === 30;

              return (
                <g key={i}>
                  {/* Invisible wide hit area for easy hover */}
                  <rect
                    x={cx - chartWidth / (dataPoints.length * 2)}
                    y={paddingTop}
                    width={chartWidth / dataPoints.length}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Circle indicator */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : isKeyMilestone ? 4 : 2.5}
                    fill={isHovered ? '#047857' : isKeyMilestone ? '#059669' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-150 pointer-events-none"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span>Passe o cursor sobre os pontos para conferir o saldo exato de cada dia.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-stone-400 inline-block border-t border-dashed border-stone-400"></span>
            Capital Inicial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span>
            Evolução do Saldo
          </span>
        </div>
      </div>
    </section>
  );
};
