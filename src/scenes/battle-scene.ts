import { Scene } from "phaser";
import { SCENE_KEYS } from "../scenes/scene-keys";
import { BATTLE_BACKGROUND_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-keys";

export class BattleScene extends Scene {
    constructor() {
        super({ key: SCENE_KEYS.BATTLE_SCENE });
    }

    create() {
        // 512, 384
        console.log(`[${BattleScene.name}] create invoked`);
        // create main background
        this.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0);

        // render out the player and enemy monsters
        this.add.image(764, 144, MONSTER_ASSET_KEYS.CARNODUSK).setOrigin(0);
        this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE).setOrigin(0).setFlipX(true);
    }
}
