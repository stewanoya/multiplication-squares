import { Injectable } from '@angular/core';
import { PlayerModel } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }

  createDummyPlayers() {
    return [new PlayerModel('Player 1', '#32a852'), new PlayerModel('Player 2', '#177ec2')];
  }
}
