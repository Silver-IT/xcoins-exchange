import React, { useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { SELECT_CURRENCY, UPDATE_EXCHANGES } from '../core/redux/actions-types';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 36,
        backgroundColor: '#F1F1F1'
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        color: 'green',
    },
    text: {
        marginTop: 8,
        fontSize: 18,
    },
    textExpectation: {
        marginTop: 12,
        fontSize: 14
    },
    currency: {
        padding: 10,
    },
    textInputWrapper: {
        marginTop: 8,
        flex: 1
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 7,
        borderWidth: 1,
        paddingLeft: 10,
        borderStyle: 'solid'
    }
});

const NumbericInputForm = ({ value, label, style, onChange }) => <View style={{ ...styles.textInputWrapper, ...style }}>
    <Text>{label}</Text>
    <TextInput style={styles.textInput} onChangeText={onChange} value={value} keyboardType='numeric' />
</View>;

const Wallet = ({ walletIndex }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const availableCurrencies = useSelector(state => state.walletsReducer.wallets.map(w => w.currency));
    const visibleCurrencies = useSelector(state => state.walletsReducer.visibleCurrencies);
    if (walletIndex >= visibleCurrencies.length) return null;

    const currency = visibleCurrencies[walletIndex];
    const wallet = useSelector(state => state.walletsReducer.wallets.find(w => w.currency === currency));
    const exchanges = useSelector(state => state.walletsReducer.exchanges[walletIndex]);

    const exchange = parseFloat(exchanges[0]) || 0 - parseFloat(exchanges[1]) || 0;

    const dispatch = useDispatch();

    const onSelectCurrency = fnGetCurrency => {
        const newCurrency = fnGetCurrency();
        dispatch({ type: SELECT_CURRENCY, payload: { walletIndex, currency: newCurrency } });
    };

    const onChangeExchanges = (index, text) => {
        dispatch({
            type: UPDATE_EXCHANGES, payload: {
                walletIndex,
                exchanges: exchanges.map((e, i) => i === index ? text : '')
            }
        });
    };

    return (<View style={styles.container}>
        <Text style={styles.title}>Wallet {walletIndex + 1}</Text>
        <DropDownPicker open={dropdownOpen} setOpen={setDropdownOpen} value={currency} setValue={onSelectCurrency}
            items={availableCurrencies.map(c => ({ label: c, value: c }))} style={styles.currency} />
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.text}>Balance: {wallet.display}{wallet.balance.toFixed(2)}</Text>
            {!!exchange ? <Text style={styles.textExpectation}> ( {exchange > 0 ? '+ ' : ''}{exchange} = {(wallet.balance + exchange).toFixed(2)} )</Text> : null }
        </View>
        <View style={{ flexDirection: 'row' }}>
            <NumbericInputForm value={exchanges[0]} label='IN' style={{ marginRight: 5 }} onChange={t => onChangeExchanges(0, t)} />
            <NumbericInputForm value={exchanges[1]} label='OUT' style={{ marginLeft: 5 }} onChange={t => onChangeExchanges(1, t)} />
        </View>
    </View>);
};

export default Wallet;
