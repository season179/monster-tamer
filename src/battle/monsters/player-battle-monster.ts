import { BattleMonster } from "./battle-monsters";
import { BattleMonsterConfig } from "../../types/monsters";
import { GameObjects } from "phaser";

enum PLAYER_POSITION {
    x = 256,
    y = 316,
}

export class PlayerBattleMonster extends BattleMonster {
    private healthBarTextGameObject: GameObjects.Text;

    constructor(config: BattleMonsterConfig) {
        super(config, PLAYER_POSITION);

        this._phaserGameObject.setFlipX(true);
        this._phaserHealthBarGameContainer.setPosition(556, 318);

        this.addHealthBarComponents();
    }

    takeDamage(damage: number, callback?: () => void): void {
        super.takeDamage(damage, callback);
        this.setHealthBarText();
    }

    private setHealthBarText() {
        this.healthBarTextGameObject.setText(
            `${this._currentHealth}/${this._maxHealth}`
        );
    }

    private addHealthBarComponents() {
        this.healthBarTextGameObject = this._scene.add
            .text(443, 80, "", {
                color: "#7E3D3F",
                fontSize: "16px",
            })
            .setOrigin(1, 0);
        this.setHealthBarText();

        this._phaserHealthBarGameContainer.add(this.healthBarTextGameObject);
    }
}
