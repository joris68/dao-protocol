import { network } from "hardhat";
import { ZeroHash, Wallet } from "ethers";

const { ethers } = await network.create({ network: "localhost" });

const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const deployer = new Wallet(PRIVATE_KEY, ethers.provider);

// Verifier constants
const imageId = ZeroHash;
const expectedNotaryKeyFingerprint = "0xa7e62d7f17aa7a22c26bdb93b7ce9400e826ffb2c6f54e54d2ded015677499af";
const validUrl = "https://data-api.binance.vision/api/v3/exchangeInfo?symbol=ETHUSDC";

console.log("Deploying with account:", deployer.address);

// deploying the Mockverifier
console.log("No RISC0_VERIFIER_ADDRESS set — deploying RiscZeroMockVerifier...");
const mockFactory = await ethers.getContractFactory("MockRiscZeroVerifier");
const mockVerifier = await mockFactory.deploy();
await mockVerifier.waitForDeployment();
const verifierAddress = await mockVerifier.getAddress();
console.log("RiscZeroMockVerifier deployed to:", verifierAddress);


// deploying our Contribution Verifier
const factory = await ethers.getContractFactory("DataRegistryImpl");
const contract = await factory.deploy(
    verifierAddress,
    imageId,
    expectedNotaryKeyFingerprint,
    validUrl
);

await contract.waitForDeployment();

const address = await contract.getAddress();
console.log("DataRegistry deployed to:", address);
console.log("  RISC0_VERIFIER_ADDRESS:", verifierAddress);
console.log("  IMAGE_ID:              ", imageId);
console.log("  NOTARY_FINGERPRINT:    ", expectedNotaryKeyFingerprint);
console.log("  VALID_URL:             ", validUrl);
