import {
    exahgneRatesAPIKey as APIKey,
    exchangeRatesBaseURL as BaseURL
} from '../../../app.json';

const ExchangeAPI = {
    getLatestRates: () => {
        return new Promise((resolve, reject) => {
            fetch(`${BaseURL}/latest?access_key=${APIKey}`)
                .then(res=>res.json())
                .then(json=>{
                    resolve({
                        'USD': json.rates['USD'],
                        'GBP': json.rates['GBP'],
                        'EUR': json.rates['EUR']
                    });
                })
                .catch(err=>reject(err));
        });
    }
};

export default ExchangeAPI;