// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type PenaltyRecordProps = Omit<PenaltyRecord, NonNullable<FunctionPropertyNames<PenaltyRecord>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatPenaltyRecordProps = Omit<PenaltyRecordProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class PenaltyRecord implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        reasonHash: string,
        blockNumber: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.reasonHash = reasonHash;
        this.blockNumber = blockNumber;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public reasonHash: string;
    public amount?: bigint;
    public sourceRef?: string;
    public blockNumber: bigint;
    

    get _name(): string {
        return 'PenaltyRecord';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save PenaltyRecord entity without an ID");
        await store.set('PenaltyRecord', id.toString(), this as unknown as CompatPenaltyRecordProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove PenaltyRecord entity without an ID");
        await store.remove('PenaltyRecord', id.toString());
    }

    static async get(id: string): Promise<PenaltyRecord | undefined> {
        assert((id !== null && id !== undefined), "Cannot get PenaltyRecord entity without an ID");
        const record = await store.get('PenaltyRecord', id.toString());
        if (record) {
            return this.create(record as unknown as PenaltyRecordProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<PenaltyRecordProps>[], options: GetOptions<PenaltyRecordProps>): Promise<PenaltyRecord[]> {
        const records = await store.getByFields<CompatPenaltyRecordProps>('PenaltyRecord', filter  as unknown as FieldsExpression<CompatPenaltyRecordProps>[], options as unknown as GetOptions<CompatPenaltyRecordProps>);
        return records.map(record => this.create(record as unknown as PenaltyRecordProps));
    }

    static create(record: PenaltyRecordProps): PenaltyRecord {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.reasonHash,
            record.blockNumber,
        );
        Object.assign(entity,record);
        return entity;
    }
}
