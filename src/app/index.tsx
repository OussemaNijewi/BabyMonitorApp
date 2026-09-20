import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';

// Define the shape of incoming sensor data matching all shared global variables
interface SensorData {
  heartRate?: number;
  bodyTemp?: number;
  movement?: number;
  soundLevel?: number;
  airQuality?: number;
}

export default function Index() {
  const [socketStatus, setSocketStatus] = useState<string>('Connecting...');
  const [sensorData, setSensorData] = useState<SensorData>({});

  useEffect(() => {
    // Connect to your ESP32 WebSocket server
    const ws = new WebSocket('ws://10.0.0.211/ws');

    ws.onopen = () => {
      setSocketStatus('Connected');
      console.log('[WebSocket] Connected to ESP32 Baby Monitor');
    };

    ws.onmessage = (event) => {
      try {
        const parsedData: SensorData = JSON.parse(event.data);
        setSensorData(parsedData);
      } catch (error) {
        console.error('[WebSocket] Failed to parse JSON:', error);
      }
    };

    ws.onerror = (error) => {
      setSocketStatus('Error');
      console.error('[WebSocket] Error:', error);
    };

    ws.onclose = () => {
      setSocketStatus('Disconnected');
      console.log('[WebSocket] Connection closed');
    };

    // Cleanup connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Baby Monitor</Text>
        <View style={styles.statusBadge}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: socketStatus === 'Connected' ? '#4CD964' : '#FF3B30' }
          ]} />
          <Text style={styles.statusText}>{socketStatus}</Text>
        </View>
      </View>

      {/* Sensor Dashboard Grid inside a ScrollView for neat scrolling */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        
        {/* Heart Rate Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Heart Rate</Text>
          <Text style={styles.cardValue}>
            {sensorData.heartRate !== undefined ? sensorData.heartRate.toFixed(1) : '--'}
            <Text style={styles.unit}> BPM</Text>
          </Text>
        </View>

        {/* Body Temperature Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Body Temperature</Text>
          <Text style={styles.cardValue}>
            {sensorData.bodyTemp !== undefined ? sensorData.bodyTemp.toFixed(1) : '--'}
            <Text style={styles.unit}> °C</Text>
          </Text>
        </View>

        {/* Movement Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movement Level</Text>
          <Text style={styles.cardValue}>
            {sensorData.movement !== undefined ? sensorData.movement.toFixed(1) : '--'}
          </Text>
        </View>

        {/* Sound Level Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sound Level</Text>
          <Text style={styles.cardValue}>
            {sensorData.soundLevel !== undefined ? sensorData.soundLevel.toFixed(1) : '--'}
            <Text style={styles.unit}> dB</Text>
          </Text>
        </View>

        {/* Air Quality Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Air Quality (MQ135)</Text>
          <Text style={styles.cardValue}>
            {sensorData.airQuality !== undefined ? sensorData.airQuality.toFixed(1) : '--'}
            <Text style={styles.unit}> PPM</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  grid: {
    gap: 14,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
    unit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
});