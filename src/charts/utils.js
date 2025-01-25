export const formatStockData = (stockData) => {
    const formattedData = [];
  
    if (stockData['Weekly Adjusted Time Series']) {
      Object.entries(stockData['Weekly Adjusted Time Series']).forEach(
        ([key, value]) => {
          formattedData.push({
            x: key, // Date
            y: [
              parseFloat(value['1. open']),
              parseFloat(value['2. high']),
              parseFloat(value['3. low']),
              parseFloat(value['4. close']),
            ],
          });
        }
      );
    }
    return formattedData;
  };
  