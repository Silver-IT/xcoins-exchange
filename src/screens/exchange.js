import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import Wallet from '../components/wallet';

import ExchangeAPI from '../core/services/exchange';
import { EXCHANGE, UPDATE_RATES } from '../core/redux/actions-types';

const styles = StyleSheet.create({
    container: {
        padding: 24,
        borderColor: '#D1D1D1',
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    textWrapper: {
        alignItems: 'center',
    },
    rateText: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#15c39a',
        color: '#111111'
    },
    errorMsg: {
        marginBottom: 10,
        color: 'red',
    },
    exchangeButtonWrapper: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderColor: '#D1D1D1',
        borderTopWidth: 1
    }
});

const ExchangeScreen = () => {
    const visibleCurrencies = useSelector(state => state.walletsReducer.visibleCurrencies);
    if (!visibleCurrencies.length) return null;
    const mainWallet = useSelector(state => state.walletsReducer.wallets.find(w => w.currency === visibleCurrencies[0]));
    const subWallet = useSelector(state => state.walletsReducer.wallets.find(w => w.currency === visibleCurrencies[1]));
    const rate = useSelector(state => state.walletsReducer.rate);
    const errorMessage = useSelector(state => state.walletsReducer.error);
    const exchanges = useSelector(state => state.walletsReducer.exchanges);

    const dispath = useDispatch();

    const onExchangeRequested = () => {
        const exchangeSum = exchanges[0].map(a => parseFloat(a) || 0).reduce((a, b) => a + b);
        if (exchangeSum <= 0) return void Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Nothing to exchange. Please add amount. 😉'
        });
        if (mainWallet.currency === subWallet.currency) return void Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Please check currencies. 😉'
        });
        dispath({ type: EXCHANGE });
    };

    useEffect(() => {
        let updateRatesInterval = setInterval(() => {
            ExchangeAPI.getLatestRates().then(rates => {
                dispath({ type: UPDATE_RATES, payload: { rates } });
            }, err => console.log(err));
        }, 1000 * 5);
        return () => {
            clearInterval(updateRatesInterval);
        };
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Wallet walletIndex={0} />
            <View style={styles.container}>
                <View style={styles.textWrapper}>
                    <Text style={styles.rateText}>1{mainWallet.display} = {rate === 1 ? 1 : rate.toFixed(4)}{subWallet.display}</Text>
                </View>

            </View>
            <Wallet walletIndex={1} />
            <View style={styles.exchangeButtonWrapper}>
                {!!errorMessage ? <View style={styles.textWrapper}>
                    <Text style={styles.errorMsg}>{errorMessage}</Text>
                </View> : null}
                <Button disabled={!!errorMessage} title='Exchange' onPress={onExchangeRequested} />
            </View>
            <Toast />
        </SafeAreaView>
    );
};

export default ExchangeScreen;
