import { IsEmail, IsNumber, IsString } from "class-validator";
import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import {Role} from '../../../auth/entities/roles.entity';

@Entity()
export class Players {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @Column()
    nickname: string;

    @Column()
    fullname:string

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column()
    age: number;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    @IsString()
    password: string;

    @Column({ type: 'bigint' })
    @IsNumber()
    whatsapp: number;


    @ManyToMany(() => Role, role => role.users)
    @JoinTable() 
    roles: Role[];
}