const abi = require('./abi.json');
const Web3 = require('web3');

const contractAddress = "Haven't deployed the contract yet";

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
        // displayOutput();

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

    const peopleList = await getPeopleList();

    peopleList.forEach(people => {
        const container = document.createElement('div');
        const addressTitle = document.createElement('h4');
        const nameTitle = document.createElement('h4');
        
        addressTitle.textContent = people.address;
        nameTitle.textContent = people.name;
        container.append(addressTitle, nameTitle);
    });
}

async function getPeopleList() {
    const addressList = await contract.methods.getAllAddress().call();
    const peopleList = await addressList.map(async addr => {
        const name = await contract.method.getPerson(addr).call();

        peopleList.append({
            address: addr,
            name: name,
        });
    });

    return peopleList;
}

async function addPerson(name) {
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.addPerson(name).send({ from: accounts[0] });
        displayOutput(accounts[0]);
    } catch (err) {
        console.log(err);
    }
}

connectWallet();
