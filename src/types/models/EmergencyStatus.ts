// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type EmergencyStatusProps = Omit<EmergencyStatus, NonNullable<FunctionPropertyNames<EmergencyStatus>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatEmergencyStatusProps = Omit<EmergencyStatusProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class EmergencyStatus implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        scope: string,
        status: string,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.scope = scope;
        this.status = status;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public scope: string;
    public status: string;
    public reasonHash?: string;
    public updatedBy?: string;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'EmergencyStatus';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save EmergencyStatus entity without an ID");
        await store.set('EmergencyStatus', id.toString(), this as unknown as CompatEmergencyStatusProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove EmergencyStatus entity without an ID");
        await store.remove('EmergencyStatus', id.toString());
    }

    static async get(id: string): Promise<EmergencyStatus | undefined> {
        assert((id !== null && id !== undefined), "Cannot get EmergencyStatus entity without an ID");
        const record = await store.get('EmergencyStatus', id.toString());
        if (record) {
            return this.create(record as unknown as EmergencyStatusProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<EmergencyStatusProps>[], options: GetOptions<EmergencyStatusProps>): Promise<EmergencyStatus[]> {
        const records = await store.getByFields<CompatEmergencyStatusProps>('EmergencyStatus', filter  as unknown as FieldsExpression<CompatEmergencyStatusProps>[], options as unknown as GetOptions<CompatEmergencyStatusProps>);
        return records.map(record => this.create(record as unknown as EmergencyStatusProps));
    }

    static create(record: EmergencyStatusProps): EmergencyStatus {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.scope,
            record.status,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
