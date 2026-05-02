// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type PreimageProps = Omit<Preimage, NonNullable<FunctionPropertyNames<Preimage>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatPreimageProps = Omit<PreimageProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Preimage implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        hash: string,
        data: string,
        len: number,
        status: string,
        blockNumber: bigint,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.hash = hash;
        this.data = data;
        this.len = len;
        this.status = status;
        this.blockNumber = blockNumber;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public hash: string;
    public data: string;
    public len: number;
    public status: string;
    public blockNumber: bigint;
    public updatedAt: Date;
    

    get _name(): string {
        return 'Preimage';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Preimage entity without an ID");
        await store.set('Preimage', id.toString(), this as unknown as CompatPreimageProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Preimage entity without an ID");
        await store.remove('Preimage', id.toString());
    }

    static async get(id: string): Promise<Preimage | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Preimage entity without an ID");
        const record = await store.get('Preimage', id.toString());
        if (record) {
            return this.create(record as unknown as PreimageProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<PreimageProps>[], options: GetOptions<PreimageProps>): Promise<Preimage[]> {
        const records = await store.getByFields<CompatPreimageProps>('Preimage', filter  as unknown as FieldsExpression<CompatPreimageProps>[], options as unknown as GetOptions<CompatPreimageProps>);
        return records.map(record => this.create(record as unknown as PreimageProps));
    }

    static create(record: PreimageProps): Preimage {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.hash,
            record.data,
            record.len,
            record.status,
            record.blockNumber,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
