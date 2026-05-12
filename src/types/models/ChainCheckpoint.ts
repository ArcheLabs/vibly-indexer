// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type ChainCheckpointProps = Omit<ChainCheckpoint, NonNullable<FunctionPropertyNames<ChainCheckpoint>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatChainCheckpointProps = Omit<ChainCheckpointProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class ChainCheckpoint implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        blockNumber: bigint,
        blockHash: string,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.blockNumber = blockNumber;
        this.blockHash = blockHash;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public blockNumber: bigint;
    public blockHash: string;
    public updatedAt: Date;
    

    get _name(): string {
        return 'ChainCheckpoint';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save ChainCheckpoint entity without an ID");
        await store.set('ChainCheckpoint', id.toString(), this as unknown as CompatChainCheckpointProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove ChainCheckpoint entity without an ID");
        await store.remove('ChainCheckpoint', id.toString());
    }

    static async get(id: string): Promise<ChainCheckpoint | undefined> {
        assert((id !== null && id !== undefined), "Cannot get ChainCheckpoint entity without an ID");
        const record = await store.get('ChainCheckpoint', id.toString());
        if (record) {
            return this.create(record as unknown as ChainCheckpointProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<ChainCheckpointProps>[], options: GetOptions<ChainCheckpointProps>): Promise<ChainCheckpoint[]> {
        const records = await store.getByFields<CompatChainCheckpointProps>('ChainCheckpoint', filter  as unknown as FieldsExpression<CompatChainCheckpointProps>[], options as unknown as GetOptions<CompatChainCheckpointProps>);
        return records.map(record => this.create(record as unknown as ChainCheckpointProps));
    }

    static create(record: ChainCheckpointProps): ChainCheckpoint {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.blockNumber,
            record.blockHash,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
