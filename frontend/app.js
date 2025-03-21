// Importing web3.js
window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        const contractAddress = '0xF261E6c9EeE4d88ACed8A74e87C132CEef141b83';
        const abi = [
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

        const contract = new web3.eth.Contract(abi, contractAddress);

        // Event listeners
        const sendTipBtn = document.getElementById('sendTipBtn');
        const withdrawBtn = document.getElementById('withdrawBtn');
        const checkBalanceBtn = document.getElementById('checkBalanceBtn');
        const recipientAddress = document.getElementById('recipientAddress');
        const tipAmount = document.getElementById('tipAmount');
        const userBalance = document.getElementById('userBalance');

        sendTipBtn.addEventListener('click', async () => {
            const amount = web3.utils.toWei(tipAmount.value, 'ether');
            const recipient = recipientAddress.value;

            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const sender = accounts[0];

                await contract.methods.sendTip(recipient).send({
                    from: sender,
                    value: amount
                });

                alert('Tip sent successfully!');
            } catch (error) {
                console.error(error);
                alert('An error occurred while sending the tip.');
            }
        });

        withdrawBtn.addEventListener('click', async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const sender = accounts[0];

                await contract.methods.withdrawTips().send({
                    from: sender
                });

                alert('Tips withdrawn successfully!');
            } catch (error) {
                console.error(error);
                alert('An error occurred while withdrawing the tips.');
            }
        });

        checkBalanceBtn.addEventListener('click', async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const sender = accounts[0];

                const balance = await contract.methods.getUserBalance(sender).call();
                const ethBalance = web3.utils.fromWei(balance, 'ether');
                userBalance.innerHTML = `Your Balance: ${ethBalance} ETH`;
            } catch (error) {
                console.error(error);
                alert('An error occurred while checking the balance.');
            }
        });
    } else {
        alert("Ethereum browser extension not detected!");
    }
});

