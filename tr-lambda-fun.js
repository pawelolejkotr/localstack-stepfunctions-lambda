exports.handler = async (event) => {
    const request = event.body ? JSON.parse(event.body) : event;
    
    console.log("Received request:", JSON.stringify(request, null, 2));

    const { mode, type, customer_tenant_system_name, chunk_size, items, output_files } = request;

    const MODES = {
        PREPARE: 'prepare',
        PROCESS: 'process',
        AGGREGATE: 'aggregate'
    };

    try {
        switch (mode) {
            case MODES.PREPARE:
                return await handlePrepare(customer_tenant_system_name, chunk_size);
            
            case MODES.PROCESS:
                return await handleProcess(type, items, customer_tenant_system_name);
            
            case MODES.AGGREGATE:
                return await handleAggregate(output_files, customer_tenant_system_name);
            
            default:
                throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (error) {
        console.error("Error:", error);
        throw error; 
    }
};


async function handlePrepare(tenantName, chunkSize) {
    if (!chunkSize) throw new Error("Chunk size is required for prepare mode");
    
    console.log(`[PREPARE] Preparing data for tenant: ${tenantName} with chunk size: ${chunkSize}`);

    // Symulujemy, że znaleźliśmy dane i dzielimy je na chunki
    // Generujemy 2 chunki dla typu 'user' i 1 dla 'group' (żeby było co filtrować)
    
    const mockChunks = [
        {
            type: "user", // GTO.Contracts.GTO.ChunksWithType
            items: [
                { id: "u1", region: "US", name: "John Doe", comments: "Active" },
                { id: "u2", region: "EU", name: "Jan Kowalski", comments: "Pending" }
            ]
        },
        {
            type: "user",
            items: [
                { id: "u3", region: "US", name: "Alice Smith", comments: "Active" }
            ]
        },
        {
            type: "group",
            items: [
                { id: "g1", region: "US", name: "Admins", comments: "System Group" }
            ]
        }
    ];

    return {
        chunks: mockChunks
    };
}

async function handleProcess(type, items, tenantName) {
    if (!type) throw new Error("Type is required for process mode");
    if (!items || items.length === 0) throw new Error("Items are required for process mode");

    console.log(`[PROCESS] Processing ${items.length} items of type '${type}' for ${tenantName}`);

       const filename = `s3://bucket/output/${tenantName}/${type}_${Date.now()}.json`;


    return {
        output_file: filename
    };
}

async function handleAggregate(outputFiles, tenantName) {
    if (!outputFiles) throw new Error("Output files required for aggregate");
    
    console.log(`[AGGREGATE] Merging ${outputFiles.length} files for ${tenantName}`);
    
    return {
        output_file: `s3://bucket/final/${tenantName}/FULL_SYNC.json`
    };
}