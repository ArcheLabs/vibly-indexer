// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type AgentRewardEventProps = Omit<AgentRewardEvent, NonNullable<FunctionPropertyNames<AgentRewardEvent>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatAgentRewardEventProps = Omit<AgentRewardEventProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class AgentRewardEvent implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        agentId: string,
        eventType: string,
        rewardKind: string,
        amount: bigint,
        baseAmount: bigint,
        observerAmount: bigint,
        reviewerAmount: bigint,
        taskAmount: bigint,
        blockNumber: bigint,
        eventIndex: number,
        blockHash: string,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.agentId = agentId;
        this.eventType = eventType;
        this.rewardKind = rewardKind;
        this.amount = amount;
        this.baseAmount = baseAmount;
        this.observerAmount = observerAmount;
        this.reviewerAmount = reviewerAmount;
        this.taskAmount = taskAmount;
        this.blockNumber = blockNumber;
        this.eventIndex = eventIndex;
        this.blockHash = blockHash;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public agentId: string;
    public eventType: string;
    public rewardKind: string;
    public amount: bigint;
    public baseAmount: bigint;
    public observerAmount: bigint;
    public reviewerAmount: bigint;
    public taskAmount: bigint;
    public dayIndex?: number;
    public roundId?: string;
    public taskId?: string;
    public ownerAccount?: string;
    public blockNumber: bigint;
    public extrinsicIndex?: number;
    public eventIndex: number;
    public blockHash: string;
    public timestamp?: Date;
    

    get _name(): string {
        return 'AgentRewardEvent';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save AgentRewardEvent entity without an ID");
        await store.set('AgentRewardEvent', id.toString(), this as unknown as CompatAgentRewardEventProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove AgentRewardEvent entity without an ID");
        await store.remove('AgentRewardEvent', id.toString());
    }

    static async get(id: string): Promise<AgentRewardEvent | undefined> {
        assert((id !== null && id !== undefined), "Cannot get AgentRewardEvent entity without an ID");
        const record = await store.get('AgentRewardEvent', id.toString());
        if (record) {
            return this.create(record as unknown as AgentRewardEventProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<AgentRewardEventProps>[], options: GetOptions<AgentRewardEventProps>): Promise<AgentRewardEvent[]> {
        const records = await store.getByFields<CompatAgentRewardEventProps>('AgentRewardEvent', filter  as unknown as FieldsExpression<CompatAgentRewardEventProps>[], options as unknown as GetOptions<CompatAgentRewardEventProps>);
        return records.map(record => this.create(record as unknown as AgentRewardEventProps));
    }

    static create(record: AgentRewardEventProps): AgentRewardEvent {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.agentId,
            record.eventType,
            record.rewardKind,
            record.amount,
            record.baseAmount,
            record.observerAmount,
            record.reviewerAmount,
            record.taskAmount,
            record.blockNumber,
            record.eventIndex,
            record.blockHash,
        );
        Object.assign(entity,record);
        return entity;
    }
}
