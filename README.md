# Pose-To-Earn

Welcome to the Pose-To-Earn application, an innovative web platform where fitness meets the blockchain. Engage in various physical quests, achieve exercise targets, and earn rewards in the form of Non-Fungible Tokens (NFTs).

![Screenshot 2024-06-30 082737](https://github.com/Mochoye/Pose-to-Earn/assets/95351969/eecc56cd-9d5f-4b2e-86f5-94e4e270b405)

## Overview

Pose-To-Earn offers a unique approach to staying fit and motivated by integrating exercise with blockchain technology. Users enroll in quests consisting of specific exercises. Achieving the targets for these exercises allows users to complete tasks and earn points. Accumulated points can be redeemed for NFTs minted on the Avalanche blockchain on the Fuji testnet.

**_Note_** :-

Contract Address of Avlanche - 0xB9bE3C9C0869c0b9C084eA6e33FBBAe599F820e6




If the version [Router Cross-Chain-wallet V1.0](https://github.com/Mochoye/Pose-to-Earn/tree/main/extension)  do not work please try out the  [Router Cross-Chain-wallet V2.0](https://github.com/Mochoye/Pose-to-Earn/tree/main/router-extensions)
.

## Features

- **Exercise Quests**: Engage in diverse quests, each containing a series of target-based exercises.
- **Pose Detection**: Utilize Mediapipe's advanced Pose detection technology to accurately track and validate exercise performance.
- **NFT Rewards**: Complete quests to earn points that can be redeemed for unique NFTs.
- **Cross-Chain Wallet**: Seamless integration with a custom-built cross-chain wallet extension powered by Router Nitro, facilitating transactions across different blockchain networks.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- A modern web browser with support for WebAssembly

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/Pose-To-Earn.git
cd Pose-To-Earn
```

Install the necessary dependencies:

```
npm install
```


## Running the Application


To run the application locally:

```
npm run dev
```

This will launch the Pose-To-Earn platform on http://localhost:5713.

To run the Computer Vision Pose Detection model (In Backend/AI):

```
python3 <FileName>
```


## Demonstration

**Pose Detection - Push Up**


https://github.com/Mochoye/AI-Fitness-Trainer/assets/95351969/6b6363e2-64c6-4571-a6b2-b71722345bcb

**Pose Detection - Situps**


https://github.com/Mochoye/AI-Fitness-Trainer/assets/95351969/cb06cd31-384b-4bc5-9035-8e9e3f636f1b

**Pose Detection - Pull Ups**


https://github.com/Mochoye/AI-Fitness-Trainer/assets/95351969/6c7563db-a04a-4920-9cf3-f2b7e7a50eaa

**Avalanche Contract Address**

![contract address](https://github.com/Mochoye/AI-Fitness-Trainer/assets/95351969/521e45fa-9c3d-4706-a8af-71d40a58544d)

**Cross Chain Wallet Using Router Nitro**

![Capture](https://github.com/Mochoye/Pose-to-Earn/assets/95351969/dedab2fb-82d4-4e19-9827-567ebd8ca328)





## Contributing

Contributions to the Pose-To-Earn project are welcome! We encourage community involvement and contribution to our repository. Please refer to the CONTRIBUTING.md file for more detailed instructions on how you can submit pull requests or report issues.

To get started:
1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your modifications (`git checkout -b new-feature`).
4. Make your changes.
5. Commit your changes (`git commit -am 'Add some feature'`).
6. Push to the branch (`git push origin new-feature`).
7. Create a new Pull Request from your fork on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Acknowledgments

- **Mediapipe**: For the pose detection technology that enables our exercise tracking.
- **Avalanche**: For providing the blockchain infrastructure on the Fuji testnet where our NFTs are minted.
- **Router Nitro**: For the cross-chain wallet extension that enhances our platform's functionality.
- **https://github.com/Haripandey21/Nfts-Minting_Dapp**: Took reference from this repo for building the smart contract.

Thank you for visiting the Pose-To-Earn repository. Dive in and start earning while you exercise!

