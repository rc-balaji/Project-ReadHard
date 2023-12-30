const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT ||  3000;
const cors = require('cors')

var data = {
  dataCM:'',
  dataInch:''
}

app.use(cors())
app.use(bodyParser.json());
app.use(express.json())


app.get('/get', (req, res) => {
  // const receivedData = req.body;
  res.json(data);
  console.log("Logged");
});
app.post('/data', (req, res) => {
  const receivedData = req.body;
  console.log('Raw data:', req.body);   
  console.log('Received data:', receivedData);
  data.dataCM = receivedData.distanceCm
  data.dataInch = receivedData.distanceInch
  
  res.send('Data received successfully');
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
