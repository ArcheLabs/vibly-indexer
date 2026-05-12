// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type ChainIdentityProps = Omit<ChainIdentity, NonNullable<FunctionPropertyNames<ChainIdentity>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatChainIdentityProps = Omit<ChainIdentityProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class ChainIdentity implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        owner: string,
        status: string,
        createdAtBlock: bigint,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.owner = owner;
        this.status = status;
        this.createdAtBlock = createdAtBlock;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public owner: string;
    public status: string;
    public activeProfile?: string;
    public activeAgentRegistry?: string;
    public activeAuthRegistry?: string;
    public activeRelationPolicy?: string;
    public nonce?: bigint;
    public createdAtBlock: bigint;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'ChainIdentity';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save ChainIdentity entity without an ID");
        await store.set('ChainIdentity', id.toString(), this as unknown as CompatChainIdentityProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove ChainIdentity entity without an ID");
        await store.remove('ChainIdentity', id.toString());
    }

    static async get(id: string): Promise<ChainIdentity | undefined> {
        assert((id !== null && id !== undefined), "Cannot get ChainIdentity entity without an ID");
        const record = await store.get('ChainIdentity', id.toString());
        if (record) {
            return this.create(record as unknown as ChainIdentityProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<ChainIdentityProps>[], options: GetOptions<ChainIdentityProps>): Promise<ChainIdentity[]> {
        const records = await store.getByFields<CompatChainIdentityProps>('ChainIdentity', filter  as unknown as FieldsExpression<CompatChainIdentityProps>[], options as unknown as GetOptions<CompatChainIdentityProps>);
        return records.map(record => this.create(record as unknown as ChainIdentityProps));
    }

    static create(record: ChainIdentityProps): ChainIdentity {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.owner,
            record.status,
            record.createdAtBlock,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
