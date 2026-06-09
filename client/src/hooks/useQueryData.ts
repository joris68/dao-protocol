import { useState } from "react"

const WEB_PROVER_URL = "https://web-prover.vlayer.xyz/api/v1/prove";
const ZK_PROVER_URL = "https://zk-prover.vlayer.xyz/api/v0/compress-web-proof";



export const useQueryData = () => {
    const [queryInProgress, setQueryInProgress] = useState(false);

    function vlayerHeaders() {
        return {
            "Content-Type": "application/json",
           // "x-client-id": CLIENT_ID,
           // "Authorization": `Bearer ${BEARER_TOKEN}`,
        };
    }


    


    
}

