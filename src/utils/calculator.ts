import { DayRecord, CalculationSummary } from '../types';

export const DAYS_COUNT = 30;

export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0,00%';
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value) + '%'
  );
}

export function calculateCompoundDays(
  initialAmount: number,
  dailyRates: number[]
): DayRecord[] {
  const records: DayRecord[] = [];
  let currentBalance = Math.max(0, initialAmount || 0);

  for (let i = 0; i < DAYS_COUNT; i++) {
    const day = i + 1;
    const ratePercent = dailyRates[i] !== undefined ? dailyRates[i] : 1;
    const rateDecimal = ratePercent / 100;
    
    const startBalance = currentBalance;
    const interestEarned = startBalance * rateDecimal;
    const endBalance = startBalance + interestEarned;
    const cumulativeProfit = endBalance - initialAmount;
    const growthPercentFromStart = initialAmount > 0 
      ? (cumulativeProfit / initialAmount) * 100 
      : 0;

    records.push({
      day,
      initialBalance: startBalance,
      ratePercent,
      interestEarned,
      finalBalance: endBalance,
      cumulativeProfit,
      growthPercentFromStart,
    });

    currentBalance = endBalance;
  }

  return records;
}

export function calculateSummary(
  records: DayRecord[],
  initialAmount: number
): CalculationSummary {
  if (records.length === 0) {
    return {
      initialAmount: 0,
      finalAmount: 0,
      totalProfit: 0,
      totalGrowthPercent: 0,
      averageDailyRate: 0,
      bestDayProfit: { day: 1, profit: 0 },
      capitalMultiplier: 1,
    };
  }

  const finalRecord = records[records.length - 1];
  const finalAmount = finalRecord.finalBalance;
  const totalProfit = finalAmount - initialAmount;
  const totalGrowthPercent = initialAmount > 0 ? (totalProfit / initialAmount) * 100 : 0;
  
  const sumRates = records.reduce((acc, curr) => acc + curr.ratePercent, 0);
  const averageDailyRate = sumRates / records.length;

  let bestDayProfit = { day: 1, profit: records[0].interestEarned };
  for (const rec of records) {
    if (rec.interestEarned > bestDayProfit.profit) {
      bestDayProfit = { day: rec.day, profit: rec.interestEarned };
    }
  }

  const capitalMultiplier = initialAmount > 0 ? finalAmount / initialAmount : 0;

  return {
    initialAmount,
    finalAmount,
    totalProfit,
    totalGrowthPercent,
    averageDailyRate,
    bestDayProfit,
    capitalMultiplier,
  };
}

export function generateWhatsAppSummary(
  initialAmount: number,
  records: DayRecord[],
  summary: CalculationSummary
): string {
  const final = records[records.length - 1];
  let text = `📊 *Calculadora do Alexandre Penante*\n`;
  text += `_Simulação de Juros Compostos em 30 Dias_\n\n`;
  text += `💰 *Valor Inicial:* ${formatCurrency(initialAmount)}\n`;
  text += `📈 *Valor Final (Dia 30):* ${formatCurrency(final.finalBalance)}\n`;
  text += `✨ *Rendimento Líquido:* ${formatCurrency(summary.totalProfit)} (+${formatPercent(summary.totalGrowthPercent)})\n`;
  text += `🎯 *Média Diária:* ${formatPercent(summary.averageDailyRate)}\n`;
  text += `🚀 *Multiplicador:* ${summary.capitalMultiplier.toFixed(2)}x\n\n`;
  text += `📅 *Evolução por semanas:*\n`;
  
  const checkDays = [5, 10, 15, 20, 25, 30];
  checkDays.forEach((d) => {
    const rec = records.find((r) => r.day === d);
    if (rec) {
      text += `• Dia ${d}: ${formatCurrency(rec.finalBalance)} (+${formatCurrency(rec.cumulativeProfit)})\n`;
    }
  });

  text += `\nGerado com a Calculadora do Alexandre Penante.`;
  return text;
}

export function exportToCSV(records: DayRecord[], initialAmount: number): void {
  let csvContent = 'Dia;Saldo Inicial (R$);Taxa Diaria (%);Rendimento do Dia (R$);Saldo Final (R$);Lucro Acumulado (R$)\n';
  
  records.forEach((r) => {
    const line = [
      r.day,
      r.initialBalance.toFixed(2).replace('.', ','),
      r.ratePercent.toFixed(2).replace('.', ','),
      r.interestEarned.toFixed(2).replace('.', ','),
      r.finalBalance.toFixed(2).replace('.', ','),
      r.cumulativeProfit.toFixed(2).replace('.', ','),
    ].join(';');
    csvContent += line + '\n';
  });

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `calculadora_alexandre_penante_30dias.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
