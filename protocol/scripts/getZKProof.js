
import { network } from "hardhat";
import { ZeroHash, Wallet } from "ethers";
const { ethers } = await network.create({ network: "localhost" });

import DataRegistryImpl from "../artifacts/contracts/DataRegistryImpl.sol/DataRegistryImpl.json" with { type: "json" };
const DATAREGISTRY_ABI = DataRegistryImpl.abi;

const PRIVATE_KEY_CONTRIBUTOR = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const ADDRESS_CONTRIBUTOR = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

const CLIENT_ID = "4f028e97-b7c7-4a81-ade2-6b1a2917380c";
const BEARER_TOKEN = "jUWXi1pVUoTHgc7MOgh5X0zMR12MHtAhtjVgMc2DM3B3Uc8WEGQAEix83VwZ";

const WEB_PROVER_URL = "https://web-prover.vlayer.xyz/api/v1/prove";
const ZK_PROVER_URL = "https://zk-prover.vlayer.xyz/api/v0/compress-web-proof";

const CONTRIBUTION_VERIFIER_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const contributor = new Wallet(PRIVATE_KEY_CONTRIBUTOR, ethers.provider);
const dataRegistry = new ethers.Contract(CONTRIBUTION_VERIFIER_ADDRESS, DATAREGISTRY_ABI, contributor);

dataRegistry.on("ContributionSubmitted", () => console.log("Contribution submitted"));
dataRegistry.on("ContributionVerified", () => console.log("Contribution verified"));

function vlayerHeaders() {
  return {
    "Content-Type": "application/json",
    "x-client-id": CLIENT_ID,
    "Authorization": `Bearer ${BEARER_TOKEN}`,
  };
}

async function getWebProof(url, headers = []) {
  const res = await fetch(WEB_PROVER_URL, {
    method: "POST",
    headers: vlayerHeaders(),
    body: JSON.stringify({ url, headers }),
  });

  if (!res.ok) {
    throw new Error(`Web proof request failed: ${res.status} ${await res.text()}`);
  }

  const { data, version, meta } = await res.json();
  return { data, version, meta };
}

async function compressWebProof(presentation, jmespathQueries) {
  const res = await fetch(ZK_PROVER_URL, {
    method: "POST",
    headers: vlayerHeaders(),
    body: JSON.stringify({
      presentation,
      extraction: {
        "response.body": {
          jmespath: jmespathQueries,
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Compress request failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

//const SUBMIT_ABI = ["function processNewDataSubmission(bytes32 journalHash, (bytes32 notaryKeyFingerprint, string method, string url, uint256 tlsTimestamp, bytes32 extractionHash) journal, bytes calldata seal, bytes32 fileCID)"];
//const GET_FILE_ABI = ["function getFilesForAddres(address owner)"]

async function sumbitContribution(compressedWebProof) {
  const { zkProof, journalDataAbi } = compressedWebProof.data;

  console.log("  zkProof:       ", zkProof);
  console.log("  journalDataAbi:", journalDataAbi);

  if (!zkProof || !journalDataAbi) {
    throw new Error(`Missing proof data. Full response: ${JSON.stringify(compressedWebProof, null, 2)}`);
  }

  const abiCoder = new ethers.AbiCoder();
  const [notaryKeyFingerprint, method, url, tlsTimestamp, extractionHash] =
    abiCoder.decode(
      ["bytes32", "string", "string", "uint256", "bytes32"],
      journalDataAbi
    );
  console.log("  Decoded journal:");
  console.log("    notaryKeyFingerprint:", notaryKeyFingerprint);
  console.log("    method:              ", method);
  console.log("    url:                 ", url);
  console.log("    tlsTimestamp:        ", tlsTimestamp.toString());
  console.log("    extractionHash:      ", extractionHash);

  const journalHash = ethers.sha256(journalDataAbi);
  console.log("  journalHash:         ", journalHash);

  const journal = { notaryKeyFingerprint, method, url, tlsTimestamp, extractionHash };
  const tx = await dataRegistry.processNewDataSubmission(journalHash, journal, zkProof, ZeroHash);
  const receipt = await tx.wait();
  console.log("Contribution submitted! tx:", receipt.hash);
  console.log(receipt.logs);
  console.log(receipt.events);
  return receipt;
}

async function queryContribution() {
  const files = await dataRegistry.getFilesForAddres(ADDRESS_CONTRIBUTOR);
  console.log("Files from the Read API: ", files);
}

async function main() {
  const targetUrl = "https://data-api.binance.vision/api/v3/exchangeInfo?symbol=ETHUSDC";
  const extractFields = ["timezone"];

  console.log("Step 1: Fetching web proof...");
  const presentation = await getWebProof(targetUrl);
  console.log(`  version: ${presentation.version}`);
  console.log(`  notary:  ${presentation.meta.notaryUrl}`);

  console.log("\nStep 2: Compressing web proof...");
  const resCompresed = await compressWebProof(presentation, extractFields);

  console.log("\nStep 3: Submitting contribution...");
  await sumbitContribution(resCompresed);

  console.log("Read the registered data");
  await queryContribution();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
