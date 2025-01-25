import { formatStockData } from './utils';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// Fetch both weekly data and current price
export const fetchStockData = async (symbol) => {
  try {
    // Fetch real-time intraday data for the current price
    const intradayResponse = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${VITE_API_KEY}`
    );
    const intradayData = await intradayResponse.json();

    // Get the latest timestamp and its corresponding data
    const timeSeriesIntraday = intradayData['Time Series (1min)'];
    const latestIntradayTimestamp = Object.keys(timeSeriesIntraday || {})[0];
    const latestIntradayData = timeSeriesIntraday?.[latestIntradayTimestamp] || {};

    // Fetch weekly adjusted data for candlestick chart
    const weeklyResponse = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${symbol}&apikey=${VITE_API_KEY}`
    );
    const weeklyData = await weeklyResponse.json();

    if (weeklyData['Weekly Adjusted Time Series']) {
      const timeSeriesWeekly = weeklyData['Weekly Adjusted Time Series'];
      const mostRecentWeeklyDate = Object.keys(timeSeriesWeekly)[0];
      const mostRecentWeeklyData = timeSeriesWeekly[mostRecentWeeklyDate];

      return {
        candlestickData: formatStockData(weeklyData), // Process candlestick data
        currentValue: parseFloat(latestIntradayData['4. close']), // Real-time current value
        openValue: parseFloat(mostRecentWeeklyData['1. open']), // Weekly opening price
        closeValue: parseFloat(mostRecentWeeklyData['4. close']), // Weekly closing price
      };
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};
