// Declare contract address and ABI
const contractAddress = "0xF261E6c9EeE4d88ACed8A74e87C132CEef141b83";  // Replace with your actual contract address
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "TipReceived",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "sendTip",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawContractBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawTips",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

let web3;
let contract;
let account;

// Ensure MetaMask is installed
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);

        try {
            // Request accounts and connect MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = await web3.eth.getAccounts();
            console.log('Connected account:', account[0]);

            // Initialize the contract instance
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Display the connected account
            document.getElementById('checkBalanceBtn').addEventListener('click', checkBalance);
        } catch (error) {
            console.error('User denied MetaMask connection', error);
        }
    } else {
        alert('Please install MetaMask to use this dApp');
    }
});

// Fetch Wallet Balance
async function checkBalance() {
    if (!account) {
        alert('Please connect your MetaMask wallet.');
        return;
    }

    try {
        const balanceWei = await contract.methods.getUserBalance(account[0]).call();  // Call the smart contract to get user balance
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether'); // Convert from Wei to Ether
        document.getElementById('userBalance').innerText = `Your Balance: ${parseFloat(balanceEther).toFixed(4)} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        alert('Error fetching balance');
    }
}

// Send Tip Function
async function sendTip() {
    const recipientAddress = document.getElementById('recipientAddress').value;
    const tipAmount = document.getElementById('tipAmount').value;

    if (recipientAddress && tipAmount) {
        try {
            const tx = await contract.methods.sendTip(recipientAddress).send({
                from: account[0],
                value: web3.utils.toWei(tipAmount, 'ether')
            });
            console.log('Tip Sent:', tx);
            alert('Tip sent successfully!');
        } catch (error) {
            console.error('Error sending tip:', error);
        }
    } else {
        alert('Please fill in both fields');
    }
}

// Withdraw Tips
async function withdrawTips() {
    try {
        const tx = await contract.methods.withdrawTips().send({ from: account[0] });
        console.log('Withdraw successful:', tx);
        alert('Withdrawal successful!');
    } catch (error) {
        console.error('Error withdrawing tips:', error);
    }
}

// Event Listeners for other buttons
document.getElementById('sendTipBtn').addEventListener('click', sendTip);
document.getElementById('withdrawBtn').addEventListener('click', withdrawTips);
