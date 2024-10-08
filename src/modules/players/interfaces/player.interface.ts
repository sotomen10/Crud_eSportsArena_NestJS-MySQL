import { PaginationDTO } from "src/common/dto/pagination.dto"
import { FindById } from "../dto/find-by-id.dto"
import { CreatePlayerDto } from "../dto/create-player.dto"
import { Player } from "../entities/player.entity"
import { UpdatePlayerDto } from "../dto/update-player.dto"

export interface PlayerInterface {

    create(createUser: CreatePlayerDto): Promise<Player>
    findAll(pagination: PaginationDTO): Promise<{
        total: number,
        page: number
        limit: number
        users: Player[]
    }>

    findOne(id: FindById): Promise<Player>
    update(id: FindById, updateUser: UpdatePlayerDto): Promise<Player>
    remove(idObject: FindById): Promise<{ message: string }>



}