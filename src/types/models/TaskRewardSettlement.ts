// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type TaskRewardSettlementProps = Omit<TaskRewardSettlement, NonNullable<FunctionPropertyNames<TaskRewardSettlement>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatTaskRewardSettlementProps = Omit<TaskRewardSettlementProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class TaskRewardSettlement implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        taskId: string,
        identityId: string,
        agentId: string,
        difficulty: string,
        amount: bigint,
        dayIndex: number,
        blockNumber: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.taskId = taskId;
        this.identityId = identityId;
        this.agentId = agentId;
        this.difficulty = difficulty;
        this.amount = amount;
        this.dayIndex = dayIndex;
        this.blockNumber = blockNumber;
        
    }

    public id: string;
    public chainId: string;
    public taskId: string;
    public identityId: string;
    public agentId: string;
    public difficulty: string;
    public amount: bigint;
    public dayIndex: number;
    public blockNumber: bigint;
    

    get _name(): string {
        return 'TaskRewardSettlement';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save TaskRewardSettlement entity without an ID");
        await store.set('TaskRewardSettlement', id.toString(), this as unknown as CompatTaskRewardSettlementProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove TaskRewardSettlement entity without an ID");
        await store.remove('TaskRewardSettlement', id.toString());
    }

    static async get(id: string): Promise<TaskRewardSettlement | undefined> {
        assert((id !== null && id !== undefined), "Cannot get TaskRewardSettlement entity without an ID");
        const record = await store.get('TaskRewardSettlement', id.toString());
        if (record) {
            return this.create(record as unknown as TaskRewardSettlementProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<TaskRewardSettlementProps>[], options: GetOptions<TaskRewardSettlementProps>): Promise<TaskRewardSettlement[]> {
        const records = await store.getByFields<CompatTaskRewardSettlementProps>('TaskRewardSettlement', filter  as unknown as FieldsExpression<CompatTaskRewardSettlementProps>[], options as unknown as GetOptions<CompatTaskRewardSettlementProps>);
        return records.map(record => this.create(record as unknown as TaskRewardSettlementProps));
    }

    static create(record: TaskRewardSettlementProps): TaskRewardSettlement {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.taskId,
            record.identityId,
            record.agentId,
            record.difficulty,
            record.amount,
            record.dayIndex,
            record.blockNumber,
        );
        Object.assign(entity,record);
        return entity;
    }
}
