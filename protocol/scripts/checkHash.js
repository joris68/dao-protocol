import { network } from "hardhat";
const { ethers } = await network.create({ network: "localhost" });

const hash = ethers.sha256(ethers.toUtf8Bytes("UTC"));
console.log(hash);