import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder()
      .select("games")
      .from(Game, "games")
      .where("LOWER(games.title) like LOWER(:param)", { param:`%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(games.id) FROM games"); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
    .createQueryBuilder()
    .select("users")
    .from(User, "users")
    .innerJoin("users.games", "games", "games.id = :id", { id: id })
    .getMany();
    
    return result;
  }
}
