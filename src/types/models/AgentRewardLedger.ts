// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type AgentRewardLedgerProps = Omit<AgentRewardLedger, NonNullable<FunctionPropertyNames<AgentRewardLedger>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatAgentRewardLedgerProps = Omit<AgentRewardLedgerProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class AgentRewardLedger implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        agentId: string,
        claimableTotal: bigint,
        claimedTotal: bigint,
        claimableBase: bigint,
        claimableObserver: bigint,
        claimableReviewer: bigint,
        claimableTask: bigint,
        claimedBase: bigint,
        claimedObserver: bigint,
        claimedReviewer: bigint,
        claimedTask: bigint,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.agentId = agentId;
        this.claimableTotal = claimableTotal;
        this.claimedTotal = claimedTotal;
        this.claimableBase = claimableBase;
        this.claimableObserver = claimableObserver;
        this.claimableReviewer = claimableReviewer;
        this.claimableTask = claimableTask;
        this.claimedBase = claimedBase;
        this.claimedObserver = claimedObserver;
        this.claimedReviewer = claimedReviewer;
        this.claimedTask = claimedTask;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public agentId: string;
    public claimableTotal: bigint;
    public claimedTotal: bigint;
    public claimableBase: bigint;
    public claimableObserver: bigint;
    public claimableReviewer: bigint;
    public claimableTask: bigint;
    public claimedBase: bigint;
    public claimedObserver: bigint;
    public claimedReviewer: bigint;
    public claimedTask: bigint;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'AgentRewardLedger';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save AgentRewardLedger entity without an ID");
        await store.set('AgentRewardLedger', id.toString(), this as unknown as CompatAgentRewardLedgerProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove AgentRewardLedger entity without an ID");
        await store.remove('AgentRewardLedger', id.toString());
    }

    static async get(id: string): Promise<AgentRewardLedger | undefined> {
        assert((id !== null && id !== undefined), "Cannot get AgentRewardLedger entity without an ID");
        const record = await store.get('AgentRewardLedger', id.toString());
        if (record) {
            return this.create(record as unknown as AgentRewardLedgerProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<AgentRewardLedgerProps>[], options: GetOptions<AgentRewardLedgerProps>): Promise<AgentRewardLedger[]> {
        const records = await store.getByFields<CompatAgentRewardLedgerProps>('AgentRewardLedger', filter  as unknown as FieldsExpression<CompatAgentRewardLedgerProps>[], options as unknown as GetOptions<CompatAgentRewardLedgerProps>);
        return records.map(record => this.create(record as unknown as AgentRewardLedgerProps));
    }

    static create(record: AgentRewardLedgerProps): AgentRewardLedger {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.agentId,
            record.claimableTotal,
            record.claimedTotal,
            record.claimableBase,
            record.claimableObserver,
            record.claimableReviewer,
            record.claimableTask,
            record.claimedBase,
            record.claimedObserver,
            record.claimedReviewer,
            record.claimedTask,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
