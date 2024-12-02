import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymmentStatus } from '@portfolio-microservices/contracts';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { PurchaseState } from '@libs/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
    public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(
            CourseGetCourse.topic,
            {
                id: this.saga.courseId
            }
        );

        if (!course) throw new Error('Course with this id does not exists');

        if (course.price === 0) {
            this.saga.setState(PurchaseState.PURCHASED, course._id);
            return { paymentLink: null, user: this.saga.user };
        }

        const { paymentLink } = await this.saga.rmqService.send<
            PaymentGenerateLink.Request,
            PaymentGenerateLink.Response
        >(PaymentGenerateLink.topic, {
            courseId: course._id,
            userId: this.saga.user._id,
            sum: course.price
        });

        this.saga.setState(PurchaseState.WAITING_FOR_PAYMENT, course._id);

        return { paymentLink, user: this.saga.user };
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymmentStatus }> {
        throw new Error(`Cant check payment, that's not started`);
    }
    public async cancel(): Promise<{ user: UserEntity }> {
        this.saga.setState(PurchaseState.CANCELLED, this.saga.courseId);
        return { user: this.saga.user };
    }
}
export class BuyCourseSagaStateProgress extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        throw new Error('The course is in progress');
    }
    public async checkPayment(): Promise<{ user: UserEntity; status: PaymmentStatus }> {
        const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(
            PaymentCheck.topic,
            {
                userId: this.saga.user._id,
                courseId: this.saga.courseId
            }
        );
        if (status === 'CANCELLED') {
            this.saga.setState(PurchaseState.CANCELLED, this.saga.courseId);
            return { user: this.saga.user, status: 'CANCELLED' };
        }

        if (status !== 'SUCCESS') {
            return { user: this.saga.user, status: 'PROGRESS' };
        }

        this.saga.setState(PurchaseState.PURCHASED, this.saga.courseId);
        return { user: this.saga.user, status: 'SUCCESS' };
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error('Cant cancel payment in progress');
    }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        throw new Error('The course is already bought');
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymmentStatus }> {
        const state = this.saga.getState();
        state.saga.user.courses.find(el => el.courseId);
        throw new Error('You cant check purchased course');
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error('You cant cancel course');
    }
}

export class BuyCourseSagaStateCancelled extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
        this.saga.setState(PurchaseState.STARTED, this.saga.courseId);
        return this.saga.getState().pay();
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymmentStatus }> {
        throw new Error('The payment is cancelled');
    }
    public cancel(): Promise<{ user: UserEntity }> {
        throw new Error('You cant cancel cancelled course');
    }
}
