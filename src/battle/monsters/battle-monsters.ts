import { GameObjects, Scene } from "phaser";
import { HealthBar } from "../ui/health-bar";

interface BattleMonsterConfig {
    name: string;
    assetKey: string;
    assetFrame: number;
    maxHP: number;
    currentHP: number;
    baseAttack: number;
    attackIds: string[];
}

interface Config {
    scene: Scene;
    monsterDetails: BattleMonsterConfig;
}

interface Coordinate {
    x: number;
    y: number;
}

export class BattleMonster {
    protected _scene: Scene;
    protected _monsterDetails: BattleMonsterConfig;
    protected _healthBar: HealthBar;
    protected _phaserGameObject: GameObjects.Image;

    constructor(config: Config, position: Coordinate) {
        this._scene = config.scene;
        this._monsterDetails = config.monsterDetails;

        this._healthBar = new HealthBar(this._scene, 34, 34);

        this._phaserGameObject = this._scene.add.image(
            position.x,
            position.y,
            this._monsterDetails.assetKey,
            this._monsterDetails.assetFrame || 0
        );
    }

    get healthBar() {
        return this._healthBar;
    }
}
