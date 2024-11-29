import { CourseGetCourse, PaymentGenerateLink } from '@portfolio-microservices/contracts';
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
    public checkPayment(): Promise<{ user: UserEntity }> {
        throw new Error(`Cant check payment, that's not started`);
    }
    public async cancel(): Promise<{ user: UserEntity }> {
        this.saga.setState(PurchaseState.CANCELLED, this.saga.courseId);
        return { user: this.saga.user };
    }
}