import {
    SELECT_CURRENCY, UPDATE_RATES, EXCHANGE, UPDATE_EXCHANGES
} from '../actions-types';
import { getRateByCurrency } from '../../utilties/exchanges';

const initRates = {
    "EUR": 1,
    "USD": 1.155263,
    "GBP": 0.855877,
}; // Based on 'EUR'
const initVisibleCurrencies = ['USD', 'EUR'];

const initWalletReducer = {
    wallets: [
        { currency: 'USD', balance: 200, display: '$' },
        { currency: 'EUR', balance: 150, display: '€' },
        { currency: 'GBP', balance: 50, display: '£' }
    ],
    visibleCurrencies: initVisibleCurrencies,
    focusWalletIndex: 0,
    error: '',
    rates: initRates,
    rate: initRates[initVisibleCurrencies[0]] / initRates[initVisibleCurrencies[1]],
    exchanges: [['', ''], ['', '']],
};

const walletsReducer = (state = initWalletReducer, action) => {
    switch (action.type) {
        case SELECT_CURRENCY:
            const newCurrencies = state.visibleCurrencies.map((c, i) =>
                i === action.payload.walletIndex ? action.payload.currency : c);
            return {
                ...state, visibleCurrencies: newCurrencies, rate: getRateByCurrency(state.rates, newCurrencies[0], newCurrencies[1])
            };
        case UPDATE_EXCHANGES:
            let error = '';
            const selectedWallets = state.wallets.filter(w => state.visibleCurrencies.includes(w.currency));
            const mainWallet = selectedWallets.find(w=>w.currency === state.visibleCurrencies[action.payload.walletIndex]);
            const subWallet = selectedWallets.find(w=>w.currency !== state.visibleCurrencies[action.payload.walletIndex]);
            if (action.payload.exchanges[1] > mainWallet.balance ||
                action.payload.exchanges[0] * state.rate > subWallet.balance) {
                error = 'Exceeds balance';
            }
            return {
                ...state, error,
                focusWalletIndex: action.payload.walletIndex,
                exchanges: state.exchanges.map((e, i) =>
                    i === action.payload.walletIndex ?
                        action.payload.exchanges :
                        action.payload.exchanges.map(e => !e ? '' : `${(parseFloat(e) * state.rate).toFixed(4)}`).reverse())
            };
        case UPDATE_RATES:
            return { ...state, rates: action.payload.rates };
        case EXCHANGE:
            break;
        default:
            return state;
    }
};

export default walletsReducer;
