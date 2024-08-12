const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction";
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    console.log(txDataUrl);

    try {
        const response = await fetch(txDataUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...quoteData,
                flowType: quoteData.flowType || "defaultFlowType", // Ensure flowType is provided
                senderAddress: '0xD8985d6EA06cAcB139C21CD4a58835f30647c4Ad',
                receiverAddress: '0xD8985d6EA06cAcB139C21CD4a58835f30647c4Ad',
                refundAddress: params.refundAddress || params.senderAddress,
            }),
        });
        console.log('The response is ', response)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`);
    }
};
