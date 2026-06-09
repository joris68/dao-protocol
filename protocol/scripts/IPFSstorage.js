import { PinataSDK } from "pinata";
import 'dotenv/config';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.IPFS_GATEWAY,
});

export async function uploadFile(content) {
    const json = typeof content === "string" ? content : JSON.stringify(content);
    const file = new File([json], "data.json", { type: "application/json" });
    const upload = await pinata.upload.public.file(file);
    console.log("file uploaded successfully");
    return upload.cid;
}

export async function downloadFile(CID) {
    const { data } = await pinata.gateways.public.get(CID);
    console.log("file downloaded successfully");
    return data;
}