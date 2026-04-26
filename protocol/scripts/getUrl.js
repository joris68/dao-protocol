
import { network } from "hardhat";
const { ethers } = await network.create({ network: "localhost" });
const CONTRIBUTION_VERIFIER_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const GET_URL_ABI = ["function getValidURL() view returns (string)"];

async function getUrl() {
    const contract = new ethers.Contract(CONTRIBUTION_VERIFIER_ADDRESS, GET_URL_ABI, ethers.provider);
    const res = await contract.getValidURL();
    console.log(res);
}

getUrl();