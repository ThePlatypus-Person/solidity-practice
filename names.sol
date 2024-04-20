// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Testing {
    mapping(address => string) public people;
    address[] public addressList;

    function addPerson(string memory name) public {
        bool exist = false;
        for (uint i = 0; i < addressList.length; i++) {
            if (addressList[i] == msg.sender) {
                exist = true;
                break;
            }
        }

        require(exist == false, "Address already existed in the list");

        addressList.push(msg.sender);
        people[msg.sender] = name;
    }

    function setPerson(string memory name) public {
        bool exist = false;
        for (uint i = 0; i < addressList.length; i++) {
            if (addressList[i] == msg.sender) {
                exist = true;
                break;
            }
        }

        require(exist == true, "Address doesn't exist in the list");

        people[msg.sender] = name;
    }

    function getPerson(address _addr) public view returns (string memory) {
        return people[_addr];
    }

    function getAllAddress() public view returns (address[] memory) {
        return addressList;
    }
}
