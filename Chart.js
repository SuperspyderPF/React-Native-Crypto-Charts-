import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const CHART_API_URL = 'https://min-api.cryptocompare.com/data/v2/histoday';

const Chart = ({ coin, interval }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch(`${CHART_API_URL}?fsym=${coin}&tsym=USD&limit=${getLimitForInterval(interval)}&api_key=YOUR_API_KEY_HERE`);
      const data = await response.json();
      const processedData = data.Data.Data.map((item) => item.close);
      setChartData(processedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getLimitForInterval = (interval) => {
    switch (interval) {
      case '1D':
        return 1;
      case '1W':
        return 7;
      case '1M':
        return 30;
      case '1Y':
        return 365;
      default:
        return 1;
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {chartData ? (
        <LineChart
          data={{
            labels: [...Array(chartData.length).keys()].map((item) => item.toString()),
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={Dimensions.get('window').width - 32}
          height={300}
          chartConfig={chartConfig}
        />
      ) : (
        <Text>Loading chart data...</Text>
      )}
    </View>
  );
};

export default Chart;
