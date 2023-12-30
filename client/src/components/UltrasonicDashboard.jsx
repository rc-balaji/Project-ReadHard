import React, { useState, useEffect } from 'react';
import ReactGaugeMeter from 'react-gauge-meter/dist/react_gauge_meter';

const Dashboard = () => {
  const [mqttData, setMqttData] = useState({});
  const [objectDetected, setObjectDetected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/get');
        const data = await response.json();

        console.log(data);
        setMqttData(data);
        setObjectDetected(data['dataCM'] < 50); // Check if distance is less than 50
      } catch (error) {
        console.error('Error fetching MQTT data:', error);
      }
    };

    const fetchDataInterval = setInterval(fetchData, 1000);

    return () => clearInterval(fetchDataInterval);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
        {objectDetected && (
            <div
              style={{
                marginTop: '10px',
                padding: '5px',
                background: 'red',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color:'black'
              }}
            >
              Object Detected!
            </div>
          )}
          <h2 style={{textAlign:'center'}} >Distance (cm) : {mqttData['dataCM']}</h2>
          <ReactGaugeMeter
            firstColor="#FF0000"
            secondColor="#FFFF00"
            thirdColor="#00FF00"
            style={{ width: '500px', height: '500px' }}
            value={mqttData['dataCM']/2 || 0}
          />
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
