exports.handler = async (event) => {
    const request = event.body ? JSON.parse(event.body) : event;
    
    const { 
        mode, 
        type, 
        customer_tenant_system_name, 
        chunk_size, 
        items, 
        process_results,
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
                return await handleAggregate(process_results, customer_tenant_system_name, uds_long_token, execution_identification, tenant_identification, requested_by);
            
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
            t: "user",
            its: [
                { id: "u1", region: "US", name: "John Doe", comments: "Active" },
                { id: "u2", region: "EU", name: "Jan Kowalski", comments: "Pending" }
            ]
        },
        {
            t: "user",
            its: [
                { id: "u3", region: "US", name: "Alice Smith", comments: "Active" }
            ]
        },
        {
            t: "group",
            its: [
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

async function handleAggregate(processResults, tenantName, token, execId, tenantId, reqBy) {
    if (!processResults) throw new Error("Results required for aggregate");
    
    const validFiles = processResults
        .filter(item => item && item.output_file)
        .map(item => item.output_file);

    const errorCount = processResults.filter(item => item.status === "failed").length;

    return {
        output_file: `s3://bucket/final/${tenantName}/FULL_SYNC.json`,
        stats: {
            total_chunks: processResults.length,
            successful_chunks: validFiles.length,
            failed_chunks: errorCount
        }
    };
}