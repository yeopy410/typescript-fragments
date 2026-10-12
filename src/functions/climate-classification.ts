type MonthlyNumberData = [
  number, number, number, 
  number, number, number,
  number, number, number,
  number, number, number
];
type HalfYearMonthlyNumberData = [
  number, number, number,
  number, number, number,
];



/**
 * Calculate climate classification.
 * This implementation defines summer as the 6 months when the sun's altitude is high and winter as the 6 months when the sun's altitude is low.
 * This version uses -3 degrees Celsius as the classification standard for subarctic climates.
 */
export default function calcClimateClassification(
  monthlyTemp: MonthlyNumberData,
  monthlyPrecip: MonthlyNumberData,
  monthlySunAlt: MonthlyNumberData
): string {
  const annualTemp = sum(monthlyTemp) / monthlyTemp.length;
  const annualPrecip = sum(monthlyPrecip);
  const {
    highSolarAltitudeSeasonMonthlyPrecip,
    lowSolarAltitudeSeasonMonthlyPrecip
  } = splitSolarAltitudeSeasonPrecip(monthlyPrecip, monthlySunAlt);

  const drynessThreshold = calcDrynessThreshold(
    annualTemp,
    annualPrecip,
    highSolarAltitudeSeasonMonthlyPrecip,
    lowSolarAltitudeSeasonMonthlyPrecip
  );
  if (annualPrecip < drynessThreshold) {
    return aridClimate(annualTemp, annualPrecip, drynessThreshold);
  }

  const warmestMonTemp = Math.max(...monthlyTemp);
  if (warmestMonTemp < 10) {
    return polarClimate(warmestMonTemp);
  }
  
  const coldestMonTemp = Math.min(...monthlyTemp);
  const summerMin = Math.min(...highSolarAltitudeSeasonMonthlyPrecip);
  const winterMin = Math.min(...lowSolarAltitudeSeasonMonthlyPrecip);
  if (coldestMonTemp >= 18) {
    const precipMin = Math.min(...monthlyPrecip);
    return tropicalClimate(
      annualPrecip,
      summerMin,
      winterMin,
      precipMin
    );
  }

  const summerMax = Math.max(...highSolarAltitudeSeasonMonthlyPrecip);
  const winterMax = Math.max(...lowSolarAltitudeSeasonMonthlyPrecip);
  const warmMonthCount = countWarmMonths(monthlyTemp);
  return temperateAndSubarcticClimate(
    warmestMonTemp,
    coldestMonTemp,
    summerMin,
    winterMin,
    summerMax,
    winterMax,
    warmMonthCount
  );
}



function aridClimate(
  annualTemp: number,
  annualPrecip: number,
  drynessThreshold: number
): string {
  let climateStr = 'B';

  climateStr += annualPrecip < drynessThreshold / 2 ? 'W' : 'S';
  climateStr += annualTemp >= 18 ? 'h' : 'k';

  return climateStr;
}

function tropicalClimate(
  annualPrecip: number,
  summerMin: number,
  winterMin: number,
  precipMin: number
): string {
  let climateStr = 'A';

  climateStr += (
    precipMin >= 60 ? 'f' :
    precipMin >= 100 - (annualPrecip / 25) ? 'm' :
    summerMin >= winterMin ? 'w' : 's'
  );

  return climateStr;
}

function polarClimate(warmestMonTemp: number): string {
  let climateStr = 'E';

  climateStr += warmestMonTemp < 0 ? 'F' : 'T';

  return climateStr;
}

function temperateAndSubarcticClimate(
  warmestMonTemp: number,
  coldestMonTemp: number,
  summerMin: number,
  winterMin: number,
  summerMax: number,
  winterMax: number,
  warmMonthCount: number
): string {
  let climateStr = coldestMonTemp >= -3 ? 'C' : 'D';

  climateStr += (
    winterMin < summerMax / 10 ? 'w' :
    summerMin < winterMax / 3 && summerMin < 30 ? 's' :
    'f'
  );

  climateStr += warmMonthCount >= 4 ? (
    warmestMonTemp >= 22 ? 'a' : 'b'
  ) : (
    coldestMonTemp > -38 ? 'c' : 'd'
  );

  return climateStr;
}



function splitSolarAltitudeSeasonPrecip(
  monthlyPrecip: MonthlyNumberData,
  monthlySunAlt: MonthlyNumberData
): {
  highSolarAltitudeSeasonMonthlyPrecip: HalfYearMonthlyNumberData;
  lowSolarAltitudeSeasonMonthlyPrecip: HalfYearMonthlyNumberData;
} {
  const sortedMonthlyPrecip = Array
    .from(monthlySunAlt.keys())
    .sort((a, b) => monthlySunAlt[b] - monthlySunAlt[a])
    .map(index => monthlyPrecip[index]);

  return {
    highSolarAltitudeSeasonMonthlyPrecip: sortedMonthlyPrecip.slice(0, 6) as HalfYearMonthlyNumberData,
    lowSolarAltitudeSeasonMonthlyPrecip: sortedMonthlyPrecip.slice(6, 12) as HalfYearMonthlyNumberData,
  };
}

function calcDrynessThreshold(
  annualTemp: number,
  annualPrecip: number,
  highSolarAltitudeSeasonMonthlyPrecip: HalfYearMonthlyNumberData,
  lowSolarAltitudeSeasonMonthlyPrecip: HalfYearMonthlyNumberData
): number {
  const summerRatio = calcRatioSafely(
    sum(highSolarAltitudeSeasonMonthlyPrecip),
    annualPrecip
  );

  const winterRatio = calcRatioSafely(
    sum(lowSolarAltitudeSeasonMonthlyPrecip),
    annualPrecip
  );

  const adjustment = (
    summerRatio >= 0.7 ? 14 :
    winterRatio >= 0.7 ? 0 :
    7
  );

  return 20 * (annualTemp + adjustment);
}

function countWarmMonths(monthlyTemp: MonthlyNumberData): number {
  let warmMonthCount = 0;
  for (const temp of monthlyTemp) {
    if (temp >= 10) {
      warmMonthCount += 1;
    }
  }
  return warmMonthCount;
}



function sum(numberList: number[]): number {
  let acc = 0;
  for (const val of numberList) {
    acc += val;
  }
  return acc;
}

function calcRatioSafely(
  val: number,
  base: number
): number {
  return base > 0 ? val / base : 0;
}