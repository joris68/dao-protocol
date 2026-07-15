import { PinataSDK } from "pinata";

async function main({ jsonData }) {
    const cipherPinataAPIKey = "jjajaaajja";
    const pinataSecretPkpId = "0xjajjaja";

    const cipherEncrpytionKey = "jjajaaajja";
    const pinataEncrpytionPkpid = "0xjajjaja";

    let plaintextEncrytionSecret;
    let pinataApiKey;

    try {
        [plaintextEncrytionSecret, pinataApiKey] = await Promise.all([
            Lit.Actions.Decrypt({
                pkpId: pinataSecretPkpId,
                ciphertext: cipherPinataAPIKey,
            }),
            Lit.Actions.Decrypt({
                pkpId: pinataEncrpytionPkpid,
                ciphertext: cipherEncrpytionKey,
            }),
        ]);
    } catch (error) {
        return {
            error: "Failed to decrypt secrets",
            details: error.message,
        };
    }

    const wallet = new ethers.Wallet(
        await Lit.Actions.getPrivateKey({ pkpId: pinataSecretPkpId })
    );

    const encryptedJson = await wallet.encrypt(JSON.stringify(jsonData));

    const pinata = new PinataSDK({
        pinataJwt: plaintextEncrytionSecret,
        pinataGateway: "amaranth-given-cow-739.mypinata.cloud",
    });

    try {
        const file = new File(
            [encryptedJson],
            "data.json",
            { type: "application/json" }
        );

        const upload = await pinata.upload.public.file(file);

        console.log("File uploaded successfully");

        return {
            cid: upload.cid,
        };
    } catch (error) {
        return {
            error: "Operation did not finish successfully",
            details: error.message,
        };
    }
}