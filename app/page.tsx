'use client';

import { useState, useEffect } from 'react';
import EarthquakeMap from '../components/EarthquakeMap';
import EarthquakeTable from '../components/EarthquakeTable';
import { EarthquakeResponse, ProcessedEarthquake } from '../types/earthquake';

type TimeRange = '7' | '14' | '30' | '90' | '365';

const TIME_RANGES = {
  '7': 'Past 7 days',
  '14': 'Past 14 days',
  '30': 'Past 30 days',
  '90': 'Past 90 days',
  '365': 'Past year'
} as const;

function getDateRange(days: number): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

function processEarthquakeData(response: EarthquakeResponse): ProcessedEarthquake[] {
  return response.features.map(feature => ({
    id: feature.id,
    magnitude: feature.properties.mag || 0,
    place: feature.properties.place || 'Unknown location',
    time: new Date(feature.properties.time),
    depth: Math.abs(feature.geometry.coordinates[2]) || 0, // Depth is usually negative, make it positive
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    url: feature.properties.url || ''
  }));
}

export default function Home() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [earthquakes, setEarthquakes] = useState<ProcessedEarthquake[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEarthquakes = async (days: number) => {
    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(days);
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch earthquake data: ${response.statusText}`);
      }

      const data: EarthquakeResponse = await response.json();
      const processedData = processEarthquakeData(data);
      
      setEarthquakes(processedData);
    } catch (err) {
      console.error('Error fetching earthquake data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setEarthquakes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes(parseInt(timeRange));
  }, [timeRange]);

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(event.target.value as TimeRange);
  };

  return (
    <div className="container">
      <h1>Quake Vibes 🌍</h1>
      
      <div className="controls">
        <label htmlFor="timeRange">Time Range:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
          disabled={loading}
        >
          {Object.entries(TIME_RANGES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading earthquake data...
        </div>
      ) : (
        <>
          <EarthquakeMap earthquakes={earthquakes} />
          <EarthquakeTable earthquakes={earthquakes} />
        </>
      )}
    </div>
  );
}