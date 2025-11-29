exports.handler = async (event) => {
    const request = event.body ? JSON.parse(event.body) : event;
    
    const { 
        mode, 
        type, 
        customer_tenant_system_name, 
        chunk_size, 
        items, 
        output_files,
        uds_long_token,
        execution_identification,
        tenant_identification,
        requested_by
    } = request;

    const MODES = {
        PREPARE: 'prepare',
        PROCESS: 'process',
        AGGREGATE: 'aggregate'
    };

    try {
        switch (mode) {
            case MODES.PREPARE:
                return await handlePrepare(customer_tenant_system_name, chunk_size, execution_identification, tenant_identification, requested_by);
            
            case MODES.PROCESS:
                return await handleProcess(type, items, customer_tenant_system_name, uds_long_token, execution_identification, tenant_identification, requested_by);
            
            case MODES.AGGREGATE:
                return await handleAggregate(output_files, customer_tenant_system_name, uds_long_token, execution_identification, tenant_identification, requested_by);
            
            default:
                throw new Error(`Invalid mode: ${mode}`);
        }
    } catch (error) {
        throw error; 
    }
};

async function handlePrepare(tenantName, chunkSize, execId, tenantId, reqBy) {
    if (!chunkSize) throw new Error("Chunk size is required for prepare mode");
    
    const mockChunks = [
        {
            type: "user",
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
        chunks: mockChunks,
        uds_long_token: `token_${tenantId}_${execId}`
    };
}

async function handleProcess(type, items, tenantName, token, execId, tenantId, reqBy) {
    if (!type) throw new Error("Type is required for process mode");
    if (!items || items.length === 0) throw new Error("Items are required for process mode");

    const filename = `s3://bucket/output/${tenantName}/${type}_${Date.now()}_${Math.random().toString(36).substring(7)}.json`;

    return {
        output_file: filename
    };
}

async function handleAggregate(outputFiles, tenantName, token, execId, tenantId, reqBy) {
    if (!outputFiles) throw new Error("Output files required for aggregate");
    
    return {
        output_file: `s3://bucket/final/${tenantName}/FULL_SYNC.json`
    };
}