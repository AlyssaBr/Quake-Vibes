
import { ProcessedEarthquake } from '../types/earthquake';

interface EarthquakeTableProps {
  earthquakes: ProcessedEarthquake[];
}

function getMagnitudeClass(magnitude: number): string {
  if (magnitude >= 6) return 'high';
  if (magnitude >= 4) return 'medium';
  return 'low';
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

export default function EarthquakeTable({ earthquakes }: EarthquakeTableProps) {
  const sortedEarthquakes = [...earthquakes].sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Earthquake Data</h2>
        <div className="earthquake-count">
          {earthquakes.length} earthquake{earthquakes.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      {earthquakes.length === 0 ? (
        <div className="no-data">
          No earthquakes found for the selected time period.
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time (Local)</th>
                <th>Place</th>
                <th>Magnitude</th>
                <th>Depth (km)</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {sortedEarthquakes.map((earthquake) => (
                <tr key={earthquake.id}>
                  <td>{formatDateTime(earthquake.time)}</td>
                  <td>{earthquake.place}</td>
                  <td>
                    <span className={`magnitude ${getMagnitudeClass(earthquake.magnitude)}`}>
                      {earthquake.magnitude.toFixed(1)}
                    </span>
                  </td>
                  <td>{earthquake.depth.toFixed(1)}</td>
                  <td>{earthquake.latitude.toFixed(4)}°</td>
                  <td>{earthquake.longitude.toFixed(4)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}