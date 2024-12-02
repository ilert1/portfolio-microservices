import { PurchaseState } from '@libs/interfaces';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSaga } from './buy-course.saga';
import { PaymmentStatus } from '@portfolio-microservices/contracts';

export abstract class BuyCourseSagaState {
    public saga: BuyCourseSaga;

    public setContext(saga: BuyCourseSaga) {
        this.saga = saga;
    }

    public abstract pay(): Promise<{ paymentLink: string; user: UserEntity }>;
    public abstract checkPayment(): Promise<{ user: UserEntity; status: PaymmentStatus }>;
    public abstract cancel(): Promise<{ user: UserEntity }>;
}
