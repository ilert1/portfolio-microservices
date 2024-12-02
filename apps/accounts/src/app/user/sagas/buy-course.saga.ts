import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@libs/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import {
    BuyCourseSagaStateCancelled,
    BuyCourseSagaStateProgress,
    BuyCourseSagaStatePurchased,
    BuyCourseSagaStateStarted
} from './buy-course.steps';

export class BuyCourseSaga {
    private state: BuyCourseSagaState;

    constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {}

    public getState() {
        return this.state;
    }
    public setState(state: PurchaseState, courseId: string) {
        switch (state) {
            case PurchaseState.STARTED:
                this.state = new BuyCourseSagaStateStarted();
                break;
            case PurchaseState.WAITING_FOR_PAYMENT:
                this.state = new BuyCourseSagaStateProgress();
                break;
            case PurchaseState.PURCHASED:
                this.state = new BuyCourseSagaStatePurchased();
                break;
            case PurchaseState.CANCELLED:
                this.state = new BuyCourseSagaStateCancelled();
                break;
        }
        // setContext
        this.state.setContext(this);
        this.user.setCourseStatus(courseId, state);
    }
}
