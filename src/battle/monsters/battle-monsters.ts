import {
    Attack,
    BattleMonsterConfig,
    Config,
    Coordinate,
} from "../../types/monsters";
import { GameObjects, Scene } from "phaser";
import { HealthBar } from "../ui/health-bar";

export class BattleMonster {
    protected _scene: Scene;
    protected _monsterDetails: BattleMonsterConfig;
    protected _healthBar: HealthBar;
    protected _phaserGameObject: GameObjects.Image;
    protected _currentHealth: number;
    protected _maxHealth: number;
    protected _monsterAttacks: Attack[];

    constructor(config: Config, position: Coordinate) {
        this._scene = config.scene;
        this._monsterDetails = config.monsterDetails;
        this._currentHealth = this._monsterDetails.currentHP;
        this._maxHealth = this._monsterDetails.maxHP;
        this._monsterAttacks = [];

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

    get isFainted() {
        return this._currentHealth <= 0;
    }

    get name() {
        return this._monsterDetails.name;
    }

    get attacts() {
        return [...this._monsterAttacks];
    }

    get baseAttack() {
        return this._monsterDetails.baseAttack;
    }

    takeDamage(damage: number, callback?: () => void) {
        // update current monster health and animate health bar
        this._currentHealth -= damage;

        if (this._currentHealth < 0) {
            this._currentHealth = 0;
        }

        this._healthBar.setMeterPercentageAnimated(
            this._currentHealth / this._maxHealth,
            { callback }
        );
    }
}
