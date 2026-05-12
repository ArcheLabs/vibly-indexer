// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type AgentStakeEventProps = Omit<AgentStakeEvent, NonNullable<FunctionPropertyNames<AgentStakeEvent>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatAgentStakeEventProps = Omit<AgentStakeEventProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class AgentStakeEvent implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        identityId: string,
        agentId: string,
        eventType: string,
        blockNumber: bigint,
        eventIndex: number,
        blockHash: string,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.identityId = identityId;
        this.agentId = agentId;
        this.eventType = eventType;
        this.blockNumber = blockNumber;
        this.eventIndex = eventIndex;
        this.blockHash = blockHash;
        
    }

    public id: string;
    public chainId: string;
    public identityId: string;
    public agentId: string;
    public fundingAccount?: string;
    public eventType: string;
    public amount?: bigint;
    public activeAmount?: bigint;
    public unlockAtBlock?: bigint;
    public reasonRef?: string;
    public blockNumber: bigint;
    public extrinsicIndex?: number;
    public eventIndex: number;
    public blockHash: string;
    public timestamp?: Date;
    

    get _name(): string {
        return 'AgentStakeEvent';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save AgentStakeEvent entity without an ID");
        await store.set('AgentStakeEvent', id.toString(), this as unknown as CompatAgentStakeEventProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove AgentStakeEvent entity without an ID");
        await store.remove('AgentStakeEvent', id.toString());
    }

    static async get(id: string): Promise<AgentStakeEvent | undefined> {
        assert((id !== null && id !== undefined), "Cannot get AgentStakeEvent entity without an ID");
        const record = await store.get('AgentStakeEvent', id.toString());
        if (record) {
            return this.create(record as unknown as AgentStakeEventProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<AgentStakeEventProps>[], options: GetOptions<AgentStakeEventProps>): Promise<AgentStakeEvent[]> {
        const records = await store.getByFields<CompatAgentStakeEventProps>('AgentStakeEvent', filter  as unknown as FieldsExpression<CompatAgentStakeEventProps>[], options as unknown as GetOptions<CompatAgentStakeEventProps>);
        return records.map(record => this.create(record as unknown as AgentStakeEventProps));
    }

    static create(record: AgentStakeEventProps): AgentStakeEvent {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.identityId,
            record.agentId,
            record.eventType,
            record.blockNumber,
            record.eventIndex,
            record.blockHash,
        );
        Object.assign(entity,record);
        return entity;
    }
}
