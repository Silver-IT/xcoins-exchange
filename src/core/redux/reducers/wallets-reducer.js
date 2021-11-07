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

const initWallets = [
    { currency: 'USD', balance: 200, display: '$' },
    { currency: 'EUR', balance: 150, display: '€' },
    { currency: 'GBP', balance: 50, display: '£' }
];

const initExchanges = [['', ''], ['', '']];

const initWalletReducer = {
    wallets: initWallets,
    visibleCurrencies: initVisibleCurrencies,
    focusWalletIndex: initWallets.findIndex(w => w.currency === initVisibleCurrencies[0]),
    targetWalletIndex: initWallets.findIndex(w => w.currency === initVisibleCurrencies[1]),
    error: '',
    rates: initRates,
    rate: initRates[initVisibleCurrencies[1]] / initRates[initVisibleCurrencies[0]],
    exchanges: initExchanges
};

const walletsReducer = (state = initWalletReducer, action) => {
    switch (action.type) {
        case SELECT_CURRENCY:
            const newCurrencies = state.visibleCurrencies.map((c, i) =>
                i === action.payload.walletIndex ? action.payload.currency : c);
            return {
                ...state,
                visibleCurrencies: newCurrencies,
                rate: getRateByCurrency(state.rates, newCurrencies[0], newCurrencies[1]),
                exchanges: initExchanges,
                focusWalletIndex: state.wallets.findIndex(w => w.currency === newCurrencies[0]),
                targetWalletIndex: state.wallets.findIndex(w => w.currency === newCurrencies[1])
            };
        case UPDATE_EXCHANGES:
            let error = '';
            const selectedWallets = state.wallets.filter(w => state.visibleCurrencies.includes(w.currency));
            const mainWallet = selectedWallets.find(w => w.currency === state.visibleCurrencies[action.payload.walletIndex]);
            const subWallet = selectedWallets.find(w => w.currency !== state.visibleCurrencies[action.payload.walletIndex]) || mainWallet;
            if (action.payload.exchanges[1] > mainWallet.balance ||
                action.payload.exchanges[0] * state.rate > subWallet.balance) {
                error = 'Exceeds balance';
            }
            return {
                ...state, error,
                focusWalletIndex: state.wallets.findIndex(w => w.currency === mainWallet.currency),
                targetWalletIndex: state.wallets.findIndex(w => w.currency === subWallet.currency),
                exchanges: state.exchanges.map((e, i) =>
                    i === action.payload.walletIndex ?
                        action.payload.exchanges :
                        action.payload.exchanges.map(e => !e ? '' : `${(parseFloat(e) * state.rate).toFixed(4)}`).reverse())
            };
        case UPDATE_RATES:
            console.log(action.payload.rates,
                state.wallets[state.focusWalletIndex].currency,
                state.wallets[state.targetWalletIndex].currency);
            return {
                ...state,
                rates: action.payload.rates,
                rate: getRateByCurrency(
                    action.payload.rates,
                    state.wallets[state.focusWalletIndex].currency,
                    state.wallets[state.targetWalletIndex].currency
                ),
            };
        case EXCHANGE:
            const wallets = Object.assign([], state.wallets);
            const focusWallet = Object.assign({}, wallets[state.focusWalletIndex]);
            const targetWallet = Object.assign({}, wallets[state.targetWalletIndex]);
            const focusExchangeIndex = state.visibleCurrencies.findIndex(c => c === focusWallet.currency);
            const targetExchangeIndex = state.visibleCurrencies.findIndex(c => c === targetWallet.currency);
            const rate = getRateByCurrency(state.rates, state.visibleCurrencies[focusExchangeIndex], state.visibleCurrencies[targetExchangeIndex]);
            focusWallet.balance = focusWallet.balance +
                parseFloat(state.exchanges[focusExchangeIndex][0] || 0) -
                parseFloat(state.exchanges[focusExchangeIndex][1] || 0);
            wallets.splice(state.focusWalletIndex, 1, focusWallet);
            targetWallet.balance = targetWallet.balance -
                parseFloat(state.exchanges[focusExchangeIndex][0] * rate || 0) +
                parseFloat(state.exchanges[focusExchangeIndex][1] * rate || 0);
            wallets.splice(state.targetWalletIndex, 1, targetWallet);
            return { ...state, wallets, exchanges: initExchanges };
        default:
            return state;
    }
};

export default walletsReducer;
