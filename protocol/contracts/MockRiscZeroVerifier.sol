// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

struct Receipt {
    bytes seal;
    bytes32 claimDigest;
}

contract MockRiscZeroVerifier {
    function verify(bytes calldata seal, bytes32 imageId, bytes32 journalDigest) public view {

    }
    function verifyIntegrity(Receipt calldata) external pure {}
}
