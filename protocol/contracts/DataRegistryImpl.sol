// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IDataRegistry} from "./IDataRegistry.sol";
import {IRiscZeroVerifier} from "risc0-ethereum/contracts/src/IRiscZeroVerifier.sol";

contract DataRegistryImpl is IDataRegistry {

    mapping (address => File []) public fileAssets;
    mapping (address => bool) public hasContributed;

    /// @notice RISC Zero verifier contract
    IRiscZeroVerifier public immutable VERIFIER;

    /// @notice ZK proof program identifier
    /// @dev This should match the IMAGE_ID from your ZK proof program
    bytes32 public immutable IMAGE_ID;

    /// @notice Expected notary key fingerprint from vlayer
    bytes32 public immutable EXPECTED_NOTARY_KEY_FINGERPRINT;

    /// @notice URL from which data contributions are valid
    bytes32 public validUrlHash;

    /// @notice Custom errors
    error InvalidNotaryKeyFingerprint();
    error InvalidUrl();
    error ZKProofVerificationFailed();
    error InvalidContributions();
    error NotOwner();


    /// @notice Contract constructor
    /// @param _verifier Address of the RISC Zero verifier contract
    /// @param _imageId ZK proof program identifier (IMAGE_ID)
    /// @param _expectedNotaryKeyFingerprint Expected notary key fingerprint from vlayer
    /// @param _validUrl Expected GitHub API URL pattern
    constructor(
        address _verifier,
        bytes32 _imageId,
        bytes32 _expectedNotaryKeyFingerprint,
        string memory _validUrl
    ) {
        VERIFIER = IRiscZeroVerifier(_verifier);
        IMAGE_ID = _imageId;
        EXPECTED_NOTARY_KEY_FINGERPRINT = _expectedNotaryKeyFingerprint;
        validUrlHash = keccak256(bytes(_validUrl));
    }

    function getFilesForAddres(address owner) public view returns (File[] memory) {
        return fileAssets[owner];
    }


    function getValidUrlHash() public view returns (bytes32) {
        return validUrlHash;
    }

    function processNewDataSubmission(bytes32 journalHash, JournalData calldata journal, bytes calldata seal, bytes32 fileCID) external {
        verifyDataContribution(journalHash, journal, seal);
        registerDataAsset(journal, fileCID);
        emit ContributionSubmitted(msg.sender, block.timestamp, block.number);
    }

    function verifyDataContribution(
        bytes32 journalHash,
        JournalData calldata journal,
        bytes calldata seal
    ) internal {
        if (journal.notaryKeyFingerprint != EXPECTED_NOTARY_KEY_FINGERPRINT) {
            revert InvalidNotaryKeyFingerprint();
        }

        if (keccak256(bytes(journal.url)) != validUrlHash) {
            revert InvalidUrl();
        }

        try VERIFIER.verify(seal, IMAGE_ID, journalHash) {
            emit ContributionVerified(msg.sender, block.timestamp, block.number);
        } catch {
            revert ZKProofVerificationFailed();
        }
    }

    function registerDataAsset(JournalData calldata journal, bytes32 fileCID) internal {
        address newOwner = msg.sender;
        File memory f = File(newOwner, journal.extractionHash, fileCID, FileStatus.proven, journal.url, journal.tlsTimestamp);
        if (!hasContributed[newOwner]) {
            hasContributed[newOwner] = true;
        }
        fileAssets[newOwner].push(f);
    }
}