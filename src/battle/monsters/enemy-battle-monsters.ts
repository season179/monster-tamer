import { BattleMonster } from "./battle-monsters";
import { Config } from "../../types/monsters";

enum ENEMY_POSITION {
    x = 768,
    y = 144,
}

export class EnemyBattleMonster extends BattleMonster {
    constructor(config: Config ) {
        super(config, ENEMY_POSITION);
    }
}