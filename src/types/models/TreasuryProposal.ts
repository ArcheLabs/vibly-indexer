// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type TreasuryProposalProps = Omit<TreasuryProposal, NonNullable<FunctionPropertyNames<TreasuryProposal>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatTreasuryProposalProps = Omit<TreasuryProposalProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class TreasuryProposal implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        proposalIndex: number,
        proposer: string,
        beneficiary: string,
        value: bigint,
        bond: bigint,
        status: string,
        blockNumber: bigint,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.proposalIndex = proposalIndex;
        this.proposer = proposer;
        this.beneficiary = beneficiary;
        this.value = value;
        this.bond = bond;
        this.status = status;
        this.blockNumber = blockNumber;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public proposalIndex: number;
    public proposer: string;
    public beneficiary: string;
    public value: bigint;
    public bond: bigint;
    public status: string;
    public blockNumber: bigint;
    public updatedAt: Date;
    

    get _name(): string {
        return 'TreasuryProposal';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save TreasuryProposal entity without an ID");
        await store.set('TreasuryProposal', id.toString(), this as unknown as CompatTreasuryProposalProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove TreasuryProposal entity without an ID");
        await store.remove('TreasuryProposal', id.toString());
    }

    static async get(id: string): Promise<TreasuryProposal | undefined> {
        assert((id !== null && id !== undefined), "Cannot get TreasuryProposal entity without an ID");
        const record = await store.get('TreasuryProposal', id.toString());
        if (record) {
            return this.create(record as unknown as TreasuryProposalProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<TreasuryProposalProps>[], options: GetOptions<TreasuryProposalProps>): Promise<TreasuryProposal[]> {
        const records = await store.getByFields<CompatTreasuryProposalProps>('TreasuryProposal', filter  as unknown as FieldsExpression<CompatTreasuryProposalProps>[], options as unknown as GetOptions<CompatTreasuryProposalProps>);
        return records.map(record => this.create(record as unknown as TreasuryProposalProps));
    }

    static create(record: TreasuryProposalProps): TreasuryProposal {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.proposalIndex,
            record.proposer,
            record.beneficiary,
            record.value,
            record.bond,
            record.status,
            record.blockNumber,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
