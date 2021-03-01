import axios from 'axios'

// Grab API UI from env variables
const { FPL_API_URI } = process.env

var config = {
  method: 'get',
  url: `${FPL_API_URI}`,
  headers: { 
    'User-Agent': 'FPL-Dev-Test-Please'
  }
};

// Run Axios to go out and fetch out data, and return a subset of it
export async function getLivePlayerPrices() {
    try {
        const players = await axios(config).then(function (rsp) {
          return rsp.data.elements
        })
        .catch(function (error) {
          console.log(error);
        }); 
        return players    
    } catch (error) {
        console.log('Something went wrong: ' + error)
    }
}