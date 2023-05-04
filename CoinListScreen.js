import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal } from 'react-native';


const COIN_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

const CoinListScreen = ({ navigation }) => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('1D');

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const response = await fetch(COIN_API_URL);
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChartClick = (coin, interval) => {
    setSelectedCoin(coin);
    setSelectedInterval(interval);
    setModalVisible(true);
  };

  const renderChartButton = (symbol, interval) => {
    return (
      <TouchableOpacity
        key={`${symbol}-${interval}`}
        style={{ backgroundColor: 'gray', borderRadius: 5, padding: 10, margin: 5 }}
        onPress={() => handleChartClick(symbol, interval)}
      >
        <Text style={{ color: 'white' }}>{interval}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
      >
        <Image source={{ uri: item.image }} style={{ width: 30, height: 30, marginRight: 16 }} />
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
        <Text style={{ fontSize: 18, marginLeft: 'auto' }}>{item.symbol.toUpperCase()}</Text>
        <View style={{ flexDirection: 'row', marginLeft: 16 }}>
          {renderChartButton(item.symbol, '1D')}
          {renderChartButton(item.symbol, '1W')}
          {renderChartButton(item.symbol, '1M')}
          {renderChartButton(item.symbol, '1Y')}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      {selectedCoin && (
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Chart coin={selectedCoin} interval={selectedInterval} />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, color: 'blue' }}>Close</Text>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default CoinListScreen;
