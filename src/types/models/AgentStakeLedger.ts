// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type AgentStakeLedgerProps = Omit<AgentStakeLedger, NonNullable<FunctionPropertyNames<AgentStakeLedger>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatAgentStakeLedgerProps = Omit<AgentStakeLedgerProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class AgentStakeLedger implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        agentId: string,
        activeAmount: bigint,
        unbondingAmount: bigint,
        status: string,
        releaseBlocked: boolean,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.agentId = agentId;
        this.activeAmount = activeAmount;
        this.unbondingAmount = unbondingAmount;
        this.status = status;
        this.releaseBlocked = releaseBlocked;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public agentId: string;
    public fundingAccount?: string;
    public activeAmount: bigint;
    public unbondingAmount: bigint;
    public status: string;
    public unlockAtBlock?: bigint;
    public releaseBlocked: boolean;
    public releaseBlockReason?: string;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'AgentStakeLedger';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save AgentStakeLedger entity without an ID");
        await store.set('AgentStakeLedger', id.toString(), this as unknown as CompatAgentStakeLedgerProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove AgentStakeLedger entity without an ID");
        await store.remove('AgentStakeLedger', id.toString());
    }

    static async get(id: string): Promise<AgentStakeLedger | undefined> {
        assert((id !== null && id !== undefined), "Cannot get AgentStakeLedger entity without an ID");
        const record = await store.get('AgentStakeLedger', id.toString());
        if (record) {
            return this.create(record as unknown as AgentStakeLedgerProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<AgentStakeLedgerProps>[], options: GetOptions<AgentStakeLedgerProps>): Promise<AgentStakeLedger[]> {
        const records = await store.getByFields<CompatAgentStakeLedgerProps>('AgentStakeLedger', filter  as unknown as FieldsExpression<CompatAgentStakeLedgerProps>[], options as unknown as GetOptions<CompatAgentStakeLedgerProps>);
        return records.map(record => this.create(record as unknown as AgentStakeLedgerProps));
    }

    static create(record: AgentStakeLedgerProps): AgentStakeLedger {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.agentId,
            record.activeAmount,
            record.unbondingAmount,
            record.status,
            record.releaseBlocked,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
