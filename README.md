# KalaMitra

![KalaMitra](/kalamitra.png)

[KalaMitra](https://kalamitra-mint-your-nft-with-ai.vercel.app/) is a dapp (decentralized application) that allows users to create and mint NFTs with AI on the Ethereum blockchain. The project is built using the [Hardhat](https://hardhat.org/) development environment and the [Solidity](https://docs.soliditylang.org/en/v0.8.17/) programming language.

## Smart Contracts

The smart contracts are written in Solidity and can be found in the `smart contract` folder.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

```bash
git clone git@github.com:Iamsidar07/kalamitra-mint-your-nft-with-AI.git
```

2. Change the directory to the backend folder:

```bash
cd backend
```

3. Install the required dependencies:

```bash
npm install
```

4. Compile the smart contracts:

```bash
npx hardhat compile
```

5. Run the tests:

```bash
npx hardhat test
```

6. Deploy the smart contracts to a local development network:

```bash
npx hardhat ignition deploy ignition/modules/AssassinNFT.ts --network sepolia --verify
```

7. Interact with the smart contracts:

```bash
npx hardhat console --network localhost
```

## Frontend

The frontend is built using [Next.js](https://nextjs.org/) and can be found in the `frontend` folder.

## Getting Started

To get started with the project, follow these steps:

1. Change the directory to the frontend folder:

```bash
cd frontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the frontend.

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
