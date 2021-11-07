import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import { useSelector } from 'react-redux';
import Wallet from '../components/wallet';

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

    const onExchangeRequested = () => {
        console.log('Exchanged Requested...');
    };

    return (
        <SafeAreaView>
            <Wallet walletIndex={0} />
            <View style={styles.container}>
                <View style={styles.textWrapper}>
                    <Text style={styles.rateText}>1{mainWallet.display} = {rate.toFixed(4)}{subWallet.display}</Text>
                </View>
                <Button disabled={!!errorMessage} title='Exchange' onPress={onExchangeRequested}/>
                {!!errorMessage ? <Text style={styles.errorMsg}>{errorMessage}</Text> : null}
            </View>
            <Wallet walletIndex={1} />
        </SafeAreaView>
    );
};

export default ExchangeScreen;
