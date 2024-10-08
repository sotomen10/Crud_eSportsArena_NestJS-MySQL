import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Players } from '../../modules/players/entities/player.entity'; 

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Players, Players => Players.roles)
    users: Players[];
}

