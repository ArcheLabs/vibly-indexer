// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type SettlementEventProps = Omit<SettlementEvent, NonNullable<FunctionPropertyNames<SettlementEvent>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatSettlementEventProps = Omit<SettlementEventProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class SettlementEvent implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        intentId: string,
        eventType: string,
        blockNumber: bigint,
        eventIndex: number,
        blockHash: string,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.intentId = intentId;
        this.eventType = eventType;
        this.blockNumber = blockNumber;
        this.eventIndex = eventIndex;
        this.blockHash = blockHash;
        
    }

    public id: string;
    public chainId: string;
    public intentId: string;
    public eventType: string;
    public blockNumber: bigint;
    public extrinsicIndex?: number;
    public eventIndex: number;
    public blockHash: string;
    public timestamp?: Date;
    

    get _name(): string {
        return 'SettlementEvent';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save SettlementEvent entity without an ID");
        await store.set('SettlementEvent', id.toString(), this as unknown as CompatSettlementEventProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove SettlementEvent entity without an ID");
        await store.remove('SettlementEvent', id.toString());
    }

    static async get(id: string): Promise<SettlementEvent | undefined> {
        assert((id !== null && id !== undefined), "Cannot get SettlementEvent entity without an ID");
        const record = await store.get('SettlementEvent', id.toString());
        if (record) {
            return this.create(record as unknown as SettlementEventProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<SettlementEventProps>[], options: GetOptions<SettlementEventProps>): Promise<SettlementEvent[]> {
        const records = await store.getByFields<CompatSettlementEventProps>('SettlementEvent', filter  as unknown as FieldsExpression<CompatSettlementEventProps>[], options as unknown as GetOptions<CompatSettlementEventProps>);
        return records.map(record => this.create(record as unknown as SettlementEventProps));
    }

    static create(record: SettlementEventProps): SettlementEvent {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.intentId,
            record.eventType,
            record.blockNumber,
            record.eventIndex,
            record.blockHash,
        );
        Object.assign(entity,record);
        return entity;
    }
}
