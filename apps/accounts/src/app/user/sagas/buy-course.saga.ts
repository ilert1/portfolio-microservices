import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@libs/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateStarted } from './buy-course.steps';

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
                break;
            case PurchaseState.PURCHASED:
                break;
            case PurchaseState.CANCELLED:
                break;
        }
        // setContext
        this.state.setContext(this);
        this.user.updateCourseStatus(courseId, state);
    }
}
