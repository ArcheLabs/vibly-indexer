// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type RoundRewardSettlementProps = Omit<RoundRewardSettlement, NonNullable<FunctionPropertyNames<RoundRewardSettlement>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatRoundRewardSettlementProps = Omit<RoundRewardSettlementProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class RoundRewardSettlement implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        roundId: string,
        role: string,
        dayIndex: number,
        participantCount: number,
        totalEffectiveStake: bigint,
        released: bigint,
        rollover: bigint,
        blockNumber: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.roundId = roundId;
        this.role = role;
        this.dayIndex = dayIndex;
        this.participantCount = participantCount;
        this.totalEffectiveStake = totalEffectiveStake;
        this.released = released;
        this.rollover = rollover;
        this.blockNumber = blockNumber;
        
    }

    public id: string;
    public chainId: string;
    public roundId: string;
    public role: string;
    public dayIndex: number;
    public participantCount: number;
    public totalEffectiveStake: bigint;
    public released: bigint;
    public rollover: bigint;
    public blockNumber: bigint;
    

    get _name(): string {
        return 'RoundRewardSettlement';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save RoundRewardSettlement entity without an ID");
        await store.set('RoundRewardSettlement', id.toString(), this as unknown as CompatRoundRewardSettlementProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove RoundRewardSettlement entity without an ID");
        await store.remove('RoundRewardSettlement', id.toString());
    }

    static async get(id: string): Promise<RoundRewardSettlement | undefined> {
        assert((id !== null && id !== undefined), "Cannot get RoundRewardSettlement entity without an ID");
        const record = await store.get('RoundRewardSettlement', id.toString());
        if (record) {
            return this.create(record as unknown as RoundRewardSettlementProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<RoundRewardSettlementProps>[], options: GetOptions<RoundRewardSettlementProps>): Promise<RoundRewardSettlement[]> {
        const records = await store.getByFields<CompatRoundRewardSettlementProps>('RoundRewardSettlement', filter  as unknown as FieldsExpression<CompatRoundRewardSettlementProps>[], options as unknown as GetOptions<CompatRoundRewardSettlementProps>);
        return records.map(record => this.create(record as unknown as RoundRewardSettlementProps));
    }

    static create(record: RoundRewardSettlementProps): RoundRewardSettlement {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.roundId,
            record.role,
            record.dayIndex,
            record.participantCount,
            record.totalEffectiveStake,
            record.released,
            record.rollover,
            record.blockNumber,
        );
        Object.assign(entity,record);
        return entity;
    }
}
