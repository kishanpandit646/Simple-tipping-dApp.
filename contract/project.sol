// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleTipping {
    address public owner;

    // Event to notify when a tip has been made
    event TipReceived(address indexed sender, uint256 amount, address indexed recipient);
    
    // Mapping to store the balance of each user
    mapping(address => uint256) public balances;

    // Modifier to restrict functions to only the owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to allow users to send tips to another user
    function sendTip(address payable recipient) public payable {
        require(msg.value > 0, "Tip amount must be greater than zero");
        balances[recipient] += msg.value;
        emit TipReceived(msg.sender, msg.value, recipient);
    }

    // Function for users to withdraw their balance
    function withdrawTips() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }

    // Function for the owner to withdraw contract's balance
    function withdrawContractBalance() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }

    // Function to get the contract's balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the balance of a user
    function getUserBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}
