// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type GovernanceVoteProps = Omit<GovernanceVote, NonNullable<FunctionPropertyNames<GovernanceVote>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatGovernanceVoteProps = Omit<GovernanceVoteProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class GovernanceVote implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        referendumIndex: number,
        voter: string,
        stance: string,
        conviction: number,
        balance: bigint,
        isRemoved: boolean,
        subjectId: string,
        blockNumber: bigint,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.referendumIndex = referendumIndex;
        this.voter = voter;
        this.stance = stance;
        this.conviction = conviction;
        this.balance = balance;
        this.isRemoved = isRemoved;
        this.subjectId = subjectId;
        this.blockNumber = blockNumber;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public referendumIndex: number;
    public voter: string;
    public stance: string;
    public conviction: number;
    public balance: bigint;
    public isRemoved: boolean;
    public subjectId: string;
    public blockNumber: bigint;
    public extrinsicIndex?: number;
    public updatedAt: Date;
    

    get _name(): string {
        return 'GovernanceVote';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save GovernanceVote entity without an ID");
        await store.set('GovernanceVote', id.toString(), this as unknown as CompatGovernanceVoteProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove GovernanceVote entity without an ID");
        await store.remove('GovernanceVote', id.toString());
    }

    static async get(id: string): Promise<GovernanceVote | undefined> {
        assert((id !== null && id !== undefined), "Cannot get GovernanceVote entity without an ID");
        const record = await store.get('GovernanceVote', id.toString());
        if (record) {
            return this.create(record as unknown as GovernanceVoteProps);
        } else {
            return;
        }
    }

    static async getBySubjectId(subjectId: string, options: GetOptions<CompatGovernanceVoteProps>): Promise<GovernanceVote[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatGovernanceVoteProps>('GovernanceVote', 'subjectId', subjectId, options);
        return records.map(record => this.create(record as unknown as GovernanceVoteProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<GovernanceVoteProps>[], options: GetOptions<GovernanceVoteProps>): Promise<GovernanceVote[]> {
        const records = await store.getByFields<CompatGovernanceVoteProps>('GovernanceVote', filter  as unknown as FieldsExpression<CompatGovernanceVoteProps>[], options as unknown as GetOptions<CompatGovernanceVoteProps>);
        return records.map(record => this.create(record as unknown as GovernanceVoteProps));
    }

    static create(record: GovernanceVoteProps): GovernanceVote {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.referendumIndex,
            record.voter,
            record.stance,
            record.conviction,
            record.balance,
            record.isRemoved,
            record.subjectId,
            record.blockNumber,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
