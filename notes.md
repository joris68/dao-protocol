


Protocol:

1. Request the URl through the vlayer API (docs: https://docs.vlayer.xyz/server-side/rest-api/prove)
2. compress the proof to make it provable on-chain (docs: https://docs.vlayer.xyz/blockchain/rest-api/compress-web-proof)
3. verify the proof on-chain and with this also register the new "Contribution" in the DataRegistry contract
4. store the data (JSON reponse obtained through vLayer) into an IPFS storage and obtain CID
5. register CID and other metaData to the Contribution object in the DataRegistry contract
6. register a data transformation job for file in the IPFS storage (to the TEE network)
7. from the TEE network store the resulting file to the IPFS


- data Lineage hash


Todo:

- decryption hinkriegen direkt im Docker container
- phala network integrieren
