require('dotenv').config();
const abi = require('./abi.json');
const Web3 = require('web3');


const contractAddress = process.env.CONTRACT;

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);

async function connectWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum
            .request({ method: "eth_requestAccounts" })
            .catch((err) => {
                if (err.code === 4001) {
                    console.log("Please connect to MetaMask.");
                } else {
                    console.error(err);
                }
            });

        displayWallet(accounts[0]);
        displayOutput();

        if (accounts[0])
            console.log("We have an account");

    } else {
        console.error("No web3 provider detected");
    }
}

function displayWallet(addr) {
    const addrTitle = document.querySelector('.actual-address');
    addrTitle.textContent = addr;
}

async function displayOutput() {
    const outputArea = document.querySelector('.output-area');
    outputArea.replaceChildren();

    const addressList = await contract.methods.getAllAddress().call();
    const peopleList = await Promise.all(addressList.map(async addr => {
        const name = await contract.methods.getPerson(addr).call();

        return {
            address: addr,
            name: name,
        };
    }));

    peopleList.forEach(people => {
        const container = document.createElement('div');
        const addressTitle = document.createElement('h4');
        const nameTitle = document.createElement('h4');
        
        addressTitle.textContent = people.address;
        nameTitle.textContent = people.name;
        container.classList.add('person-container');
        container.append(addressTitle, nameTitle);
        outputArea.appendChild(container);

    });
}

async function addPerson(name) {
    const accounts = await web3.eth.getAccounts();
    const addressList = await contract.methods.getAllAddress().call();

    try {
        let response;
        if (addressList.includes(accounts[0])) {
            response = await contract.methods.setPerson(name).send({ from: accounts[0] });
        } else {
            response = await contract.methods.addPerson(name).send({ from: accounts[0] });
        }
    } catch (err) {
        console.log(err);
    } finally {
        displayOutput();
    }
}

connectWallet();
const nameInput = document.querySelector('input[name=name]');
const addBtn = document.querySelector('button.submit');
addBtn.addEventListener('click', async () => {
    if (!nameInput.value) {
        console.log("nameInput is empty");
        return;
    }

    console.log(nameInput.value);
    addPerson(nameInput.value);
});
