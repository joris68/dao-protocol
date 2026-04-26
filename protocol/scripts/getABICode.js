
const CLIENT_ID = "4f028e97-b7c7-4a81-ade2-6b1a2917380c";
const BEARER_TOKEN = "jUWXi1pVUoTHgc7MOgh5X0zMR12MHtAhtjVgMc2DM3B3Uc8WEGQAEix83VwZ";

const WEB_PROVER_URL = "https://web-prover.vlayer.xyz/api/v1/prove";
const DEBUG_URL = "https://zk-prover.vlayer.xyz/api/v0/debug/journal-decode-helper";

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

async function getAbiCode(presentation, jmespathQueries) {
    const res = await fetch(DEBUG_URL, {
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
        throw new Error(`Debug request failed: ${res.status} ${await res.text()}`);
    }

    return res.json();
}

async function main() {
    const targetUrl = "https://data-api.binance.vision/api/v3/exchangeInfo?symbol=ETHUSDC";
    const extractFields = ["timezone"];

    console.log("Step 1: Fetching web proof...");
    const presentation = await getWebProof(targetUrl);
    console.log(`  version: ${presentation.version}`);
    console.log(`  notary:  ${presentation.meta?.notaryUrl}`);

    console.log("\nStep 2: Calling debug/journal-decode-helper...");
    const result = await getAbiCode(presentation, extractFields);

    console.log(result);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});