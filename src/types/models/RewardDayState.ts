// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type RewardDayStateProps = Omit<RewardDayState, NonNullable<FunctionPropertyNames<RewardDayState>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatRewardDayStateProps = Omit<RewardDayStateProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class RewardDayState implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        dayIndex: number,
        baseStakingBudget: bigint,
        observerReviewerBudget: bigint,
        taskMarketBudget: bigint,
        baseStakingReleased: bigint,
        observerReviewerReleased: bigint,
        taskMarketReleased: bigint,
        rolloverBaseStaking: bigint,
        rolloverObserverReviewer: bigint,
        rolloverTaskMarket: bigint,
        baseStakingSettled: boolean,
        observerRoundsSettled: number,
        reviewerRoundsSettled: number,
        taskRewardsSettled: number,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.dayIndex = dayIndex;
        this.baseStakingBudget = baseStakingBudget;
        this.observerReviewerBudget = observerReviewerBudget;
        this.taskMarketBudget = taskMarketBudget;
        this.baseStakingReleased = baseStakingReleased;
        this.observerReviewerReleased = observerReviewerReleased;
        this.taskMarketReleased = taskMarketReleased;
        this.rolloverBaseStaking = rolloverBaseStaking;
        this.rolloverObserverReviewer = rolloverObserverReviewer;
        this.rolloverTaskMarket = rolloverTaskMarket;
        this.baseStakingSettled = baseStakingSettled;
        this.observerRoundsSettled = observerRoundsSettled;
        this.reviewerRoundsSettled = reviewerRoundsSettled;
        this.taskRewardsSettled = taskRewardsSettled;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public dayIndex: number;
    public baseStakingBudget: bigint;
    public observerReviewerBudget: bigint;
    public taskMarketBudget: bigint;
    public baseStakingReleased: bigint;
    public observerReviewerReleased: bigint;
    public taskMarketReleased: bigint;
    public rolloverBaseStaking: bigint;
    public rolloverObserverReviewer: bigint;
    public rolloverTaskMarket: bigint;
    public baseStakingSettled: boolean;
    public observerRoundsSettled: number;
    public reviewerRoundsSettled: number;
    public taskRewardsSettled: number;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'RewardDayState';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save RewardDayState entity without an ID");
        await store.set('RewardDayState', id.toString(), this as unknown as CompatRewardDayStateProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove RewardDayState entity without an ID");
        await store.remove('RewardDayState', id.toString());
    }

    static async get(id: string): Promise<RewardDayState | undefined> {
        assert((id !== null && id !== undefined), "Cannot get RewardDayState entity without an ID");
        const record = await store.get('RewardDayState', id.toString());
        if (record) {
            return this.create(record as unknown as RewardDayStateProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<RewardDayStateProps>[], options: GetOptions<RewardDayStateProps>): Promise<RewardDayState[]> {
        const records = await store.getByFields<CompatRewardDayStateProps>('RewardDayState', filter  as unknown as FieldsExpression<CompatRewardDayStateProps>[], options as unknown as GetOptions<CompatRewardDayStateProps>);
        return records.map(record => this.create(record as unknown as RewardDayStateProps));
    }

    static create(record: RewardDayStateProps): RewardDayState {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.dayIndex,
            record.baseStakingBudget,
            record.observerReviewerBudget,
            record.taskMarketBudget,
            record.baseStakingReleased,
            record.observerReviewerReleased,
            record.taskMarketReleased,
            record.rolloverBaseStaking,
            record.rolloverObserverReviewer,
            record.rolloverTaskMarket,
            record.baseStakingSettled,
            record.observerRoundsSettled,
            record.reviewerRoundsSettled,
            record.taskRewardsSettled,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
