// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type GovernanceSubjectProps = Omit<GovernanceSubject, NonNullable<FunctionPropertyNames<GovernanceSubject>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatGovernanceSubjectProps = Omit<GovernanceSubjectProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class GovernanceSubject implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        referendumIndex: number,
        status: string,
        track: number,
        submittedAt: bigint,
        ayeVotes: bigint,
        nayVotes: bigint,
        abstainVotes: bigint,
        updatedAt: Date,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.referendumIndex = referendumIndex;
        this.status = status;
        this.track = track;
        this.submittedAt = submittedAt;
        this.ayeVotes = ayeVotes;
        this.nayVotes = nayVotes;
        this.abstainVotes = abstainVotes;
        this.updatedAt = updatedAt;
        
    }

    public id: string;
    public chainId: string;
    public referendumIndex: number;
    public status: string;
    public track: number;
    public submittedAt: bigint;
    public decidingSince?: bigint;
    public confirmingSince?: bigint;
    public endsAt?: bigint;
    public decidedAt?: bigint;
    public proposalHash?: string;
    public proposalLen?: number;
    public proposalDecoded?: string;
    public ayeVotes: bigint;
    public nayVotes: bigint;
    public abstainVotes: bigint;
    public supportPct?: number;
    public updatedAt: Date;
    

    get _name(): string {
        return 'GovernanceSubject';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save GovernanceSubject entity without an ID");
        await store.set('GovernanceSubject', id.toString(), this as unknown as CompatGovernanceSubjectProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove GovernanceSubject entity without an ID");
        await store.remove('GovernanceSubject', id.toString());
    }

    static async get(id: string): Promise<GovernanceSubject | undefined> {
        assert((id !== null && id !== undefined), "Cannot get GovernanceSubject entity without an ID");
        const record = await store.get('GovernanceSubject', id.toString());
        if (record) {
            return this.create(record as unknown as GovernanceSubjectProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<GovernanceSubjectProps>[], options: GetOptions<GovernanceSubjectProps>): Promise<GovernanceSubject[]> {
        const records = await store.getByFields<CompatGovernanceSubjectProps>('GovernanceSubject', filter  as unknown as FieldsExpression<CompatGovernanceSubjectProps>[], options as unknown as GetOptions<CompatGovernanceSubjectProps>);
        return records.map(record => this.create(record as unknown as GovernanceSubjectProps));
    }

    static create(record: GovernanceSubjectProps): GovernanceSubject {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.referendumIndex,
            record.status,
            record.track,
            record.submittedAt,
            record.ayeVotes,
            record.nayVotes,
            record.abstainVotes,
            record.updatedAt,
        );
        Object.assign(entity,record);
        return entity;
    }
}
