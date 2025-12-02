import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Rating {
    @PrimaryColumn()
    productId: string;

    @Column('float')
    averageRating: number;

    @Column()
    reviewsCount: number;
}
