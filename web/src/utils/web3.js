import { ethers } from 'ethers';

const getWeb3 = async () => {
    let web3Instance;
    if (window.ethereum) {
        // eslint-disable-next-line
        web3Instance = new Web3(ethereum);
        try {
            // eslint-disable-next-line
            await ethereum.enable();
        } catch (error) {
            console.log('User rejected dApp connection');
        }
    }

    if (!web3Instance && window.web3) {
        // eslint-disable-next-line
        web3Instance = new Web3(web3.currentProvider);
    }

    if (!web3Instance) {
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        return null;
    }
    return web3Instance;
};

const getProvider = async () => {
  const web3 = await getWeb3();
  if (web3) {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner(0);
    return { provider, signer };
  }
  return {};
}

export {
  getWeb3,
  getProvider,
}
