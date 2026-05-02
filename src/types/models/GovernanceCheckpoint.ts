// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type GovernanceCheckpointProps = Omit<GovernanceCheckpoint, NonNullable<FunctionPropertyNames<GovernanceCheckpoint>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatGovernanceCheckpointProps = Omit<GovernanceCheckpointProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class GovernanceCheckpoint implements CompatEntity {

    constructor(
        
        id: string,
        blockNumber: bigint,
        blockHash: string,
        updatedAt: Date,
    ) {
        this.id = id;
        this.blockNumber = blockNumber;
        this.blockHash = blockHash;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public blockNumber: bigint;
    public blockHash: string;
    public updatedAt: Date;
    

    get _name(): string {
        return 'GovernanceCheckpoint';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save GovernanceCheckpoint entity without an ID");
        await store.set('GovernanceCheckpoint', id.toString(), this as unknown as CompatGovernanceCheckpointProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove GovernanceCheckpoint entity without an ID");
        await store.remove('GovernanceCheckpoint', id.toString());
    }

    static async get(id: string): Promise<GovernanceCheckpoint | undefined> {
        assert((id !== null && id !== undefined), "Cannot get GovernanceCheckpoint entity without an ID");
        const record = await store.get('GovernanceCheckpoint', id.toString());
        if (record) {
            return this.create(record as unknown as GovernanceCheckpointProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<GovernanceCheckpointProps>[], options: GetOptions<GovernanceCheckpointProps>): Promise<GovernanceCheckpoint[]> {
        const records = await store.getByFields<CompatGovernanceCheckpointProps>('GovernanceCheckpoint', filter  as unknown as FieldsExpression<CompatGovernanceCheckpointProps>[], options as unknown as GetOptions<CompatGovernanceCheckpointProps>);
        return records.map(record => this.create(record as unknown as GovernanceCheckpointProps));
    }

    static create(record: GovernanceCheckpointProps): GovernanceCheckpoint {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.blockNumber,
            record.blockHash,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
