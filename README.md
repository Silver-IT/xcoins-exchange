<p align="center">
  <img src="/src/assets/logo_main.png" width="400" alt="XCoins Logo" />
</p>
   

## Description

* Currency Exchange Prototype application built with React-Native

* Test project for the [XCoins](https://xcoins.io/)

## Workflow

* Switch wallets e.g: EUR > GBP., GBP > USD., USD > EUR.

* Enter the desired amount to exchange and has a CTA (call-to-action) to conclude the transaction.

* Use this (https://exchangeratesapi.io/documentation/) or similar API to get the conversion rates.

* Wallet balances are updated correctly.

* Show an error message when the desired exchange amount exceeds the current balance.

## Technical Stacks

* [React Native](https://reactnative.dev/)

* [Redux](https://redux.js.org/)

## Environment

* [Yarn](https://yarnpkg.com/)

* [React-Native-CLI](https://www.npmjs.com/package/react-native-cli)

Can study the environment installation from [here](https://reactnative.dev/docs/environment-setup).


## Development

* Run Android Emulator
Check the running devices by the following command
```bash
$ adb devices
```

* Running application
```bash
# development in android
$ yarn android

# development in iOS
$ yarn ios
```

* Unit Test
```bash
$ yarn test
```
