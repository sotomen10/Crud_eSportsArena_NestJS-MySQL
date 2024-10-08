import { PaginationDTO } from "src/common/dto/pagination.dto";
import { CreatePlayerDto } from "../dto/create-player.dto";
import { Players } from "../entities/player.entity";

export interface CrudPlayers {
    createPlayer(createPlayer: CreatePlayerDto):Promise<Players>
    findAll(Pagination:PaginationDTO):Promise<{
        total: number;
        page: number;
        limit: number;
        players: Players[];
      }>



}
