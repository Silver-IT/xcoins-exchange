import React from 'react';
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

import { EXCHANGE } from '../core/redux/actions-types';

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: 'white',
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
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#15c39a',
        color: '#111111'
    },
    errorMsg: {
        marginTop: 10,
        color: 'red'
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Wallet walletIndex={0} />
            <View style={styles.container}>
                <View style={styles.textWrapper}>
                    <Text style={styles.rateText}>1{mainWallet.display} = {rate === 1 ? 1 : rate.toFixed(4)}{subWallet.display}</Text>
                </View>
                <Button disabled={!!errorMessage} title='Exchange' onPress={onExchangeRequested} />
                {!!errorMessage ? <Text style={styles.errorMsg}>{errorMessage}</Text> : null}
            </View>
            <Wallet walletIndex={1} />
            <Toast />
        </SafeAreaView>
    );
};

export default ExchangeScreen;
