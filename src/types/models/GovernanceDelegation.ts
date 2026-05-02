// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type GovernanceDelegationProps = Omit<GovernanceDelegation, NonNullable<FunctionPropertyNames<GovernanceDelegation>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatGovernanceDelegationProps = Omit<GovernanceDelegationProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class GovernanceDelegation implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        track: number,
        delegator: string,
        delegatee: string,
        conviction: number,
        balance: bigint,
        isActive: boolean,
        blockNumber: bigint,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.track = track;
        this.delegator = delegator;
        this.delegatee = delegatee;
        this.conviction = conviction;
        this.balance = balance;
        this.isActive = isActive;
        this.blockNumber = blockNumber;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public track: number;
    public delegator: string;
    public delegatee: string;
    public conviction: number;
    public balance: bigint;
    public isActive: boolean;
    public subjectId?: string;
    public blockNumber: bigint;
    public updatedAt: Date;
    

    get _name(): string {
        return 'GovernanceDelegation';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save GovernanceDelegation entity without an ID");
        await store.set('GovernanceDelegation', id.toString(), this as unknown as CompatGovernanceDelegationProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove GovernanceDelegation entity without an ID");
        await store.remove('GovernanceDelegation', id.toString());
    }

    static async get(id: string): Promise<GovernanceDelegation | undefined> {
        assert((id !== null && id !== undefined), "Cannot get GovernanceDelegation entity without an ID");
        const record = await store.get('GovernanceDelegation', id.toString());
        if (record) {
            return this.create(record as unknown as GovernanceDelegationProps);
        } else {
            return;
        }
    }

    static async getBySubjectId(subjectId: string, options: GetOptions<CompatGovernanceDelegationProps>): Promise<GovernanceDelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatGovernanceDelegationProps>('GovernanceDelegation', 'subjectId', subjectId, options);
        return records.map(record => this.create(record as unknown as GovernanceDelegationProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<GovernanceDelegationProps>[], options: GetOptions<GovernanceDelegationProps>): Promise<GovernanceDelegation[]> {
        const records = await store.getByFields<CompatGovernanceDelegationProps>('GovernanceDelegation', filter  as unknown as FieldsExpression<CompatGovernanceDelegationProps>[], options as unknown as GetOptions<CompatGovernanceDelegationProps>);
        return records.map(record => this.create(record as unknown as GovernanceDelegationProps));
    }

    static create(record: GovernanceDelegationProps): GovernanceDelegation {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.track,
            record.delegator,
            record.delegatee,
            record.conviction,
            record.balance,
            record.isActive,
            record.blockNumber,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
