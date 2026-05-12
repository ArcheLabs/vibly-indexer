// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type IdentityKeyProps = Omit<IdentityKey, NonNullable<FunctionPropertyNames<IdentityKey>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatIdentityKeyProps = Omit<IdentityKeyProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class IdentityKey implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        keyId: string,
        account: string,
        purpose: string,
        status: string,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.keyId = keyId;
        this.account = account;
        this.purpose = purpose;
        this.status = status;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public keyId: string;
    public account: string;
    public purpose: string;
    public status: string;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'IdentityKey';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save IdentityKey entity without an ID");
        await store.set('IdentityKey', id.toString(), this as unknown as CompatIdentityKeyProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove IdentityKey entity without an ID");
        await store.remove('IdentityKey', id.toString());
    }

    static async get(id: string): Promise<IdentityKey | undefined> {
        assert((id !== null && id !== undefined), "Cannot get IdentityKey entity without an ID");
        const record = await store.get('IdentityKey', id.toString());
        if (record) {
            return this.create(record as unknown as IdentityKeyProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<IdentityKeyProps>[], options: GetOptions<IdentityKeyProps>): Promise<IdentityKey[]> {
        const records = await store.getByFields<CompatIdentityKeyProps>('IdentityKey', filter  as unknown as FieldsExpression<CompatIdentityKeyProps>[], options as unknown as GetOptions<CompatIdentityKeyProps>);
        return records.map(record => this.create(record as unknown as IdentityKeyProps));
    }

    static create(record: IdentityKeyProps): IdentityKey {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.keyId,
            record.account,
            record.purpose,
            record.status,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
