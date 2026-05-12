// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type PaymentIntentProps = Omit<PaymentIntent, NonNullable<FunctionPropertyNames<PaymentIntent>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatPaymentIntentProps = Omit<PaymentIntentProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class PaymentIntent implements CompatEntity {

    constructor(
        
        id: string,
        chainId: string,
        intentId: string,
        payerIdentityId: string,
        payeeIdentityId: string,
        amount: bigint,
        settlementMode: string,
        status: string,
        createdAtBlock: bigint,
        updatedAtBlock: bigint,
    ) {
        this.id = id;
        this.chainId = chainId;
        this.intentId = intentId;
        this.payerIdentityId = payerIdentityId;
        this.payeeIdentityId = payeeIdentityId;
        this.amount = amount;
        this.settlementMode = settlementMode;
        this.status = status;
        this.createdAtBlock = createdAtBlock;
        this.updatedAtBlock = updatedAtBlock;
        
    }

    public id: string;
    public chainId: string;
    public intentId: string;
    public payerIdentityId: string;
    public payeeIdentityId: string;
    public amount: bigint;
    public settlementMode: string;
    public actionNamespace?: string;
    public actionId?: string;
    public status: string;
    public createdAtBlock: bigint;
    public updatedAtBlock: bigint;
    

    get _name(): string {
        return 'PaymentIntent';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save PaymentIntent entity without an ID");
        await store.set('PaymentIntent', id.toString(), this as unknown as CompatPaymentIntentProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove PaymentIntent entity without an ID");
        await store.remove('PaymentIntent', id.toString());
    }

    static async get(id: string): Promise<PaymentIntent | undefined> {
        assert((id !== null && id !== undefined), "Cannot get PaymentIntent entity without an ID");
        const record = await store.get('PaymentIntent', id.toString());
        if (record) {
            return this.create(record as unknown as PaymentIntentProps);
        } else {
            return;
        }
    }


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<PaymentIntentProps>[], options: GetOptions<PaymentIntentProps>): Promise<PaymentIntent[]> {
        const records = await store.getByFields<CompatPaymentIntentProps>('PaymentIntent', filter  as unknown as FieldsExpression<CompatPaymentIntentProps>[], options as unknown as GetOptions<CompatPaymentIntentProps>);
        return records.map(record => this.create(record as unknown as PaymentIntentProps));
    }

    static create(record: PaymentIntentProps): PaymentIntent {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.chainId,
            record.intentId,
            record.payerIdentityId,
            record.payeeIdentityId,
            record.amount,
            record.settlementMode,
            record.status,
            record.createdAtBlock,
            record.updatedAtBlock,
        );
        Object.assign(entity,record);
        return entity;
    }
}
