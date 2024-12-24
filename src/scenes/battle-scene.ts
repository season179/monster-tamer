import { BATTLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-keys";
import { Scene } from "phaser";
import { DIRECTION } from "../common/direction";
import { SCENE_KEYS } from "../scenes/scene-keys";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";

export class BattleScene extends Scene {
    private battleMenu: BattleMenu;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private activeEnemyMonster: EnemyBattleMonster;
    private activePlayerMonster: PlayerBattleMonster;

    constructor() {
        super({ key: SCENE_KEYS.BATTLE_SCENE });
    }

    create() {
        // create main background
        const background = new Background(this);
        background.showForest();

        // render out the player and enemy monsters
        this.activeEnemyMonster = new EnemyBattleMonster({
            scene: this,
            monsterDetails: {
                name: MONSTER_ASSET_KEYS.CARNODUSK,
                assetKey: MONSTER_ASSET_KEYS.CARNODUSK,
                assetFrame: 0,
                maxHP: 25,
                currentHP: 25,
                baseAttack: 5,
                attackIds: [],
                currentLevel: 5,
            },
        });

        this.activePlayerMonster = new PlayerBattleMonster({
            scene: this,
            monsterDetails: {
                name: MONSTER_ASSET_KEYS.IGUANIGNITE,
                assetKey: MONSTER_ASSET_KEYS.IGUANIGNITE,
                assetFrame: 0,
                maxHP: 25,
                currentHP: 25,
                baseAttack: 5,
                attackIds: [],
                currentLevel: 5,
            },
        });

        // render out the main info and sub info panes
        this.battleMenu = new BattleMenu(this);
        this.battleMenu.showMainBattleMenu();

        this.cursorKeys = this.input.keyboard!.createCursorKeys();

        this.activeEnemyMonster.takeDamage(20, () => {
            this.activePlayerMonster.takeDamage(15);
        });
    }

    update() {
        const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
            this.cursorKeys.space
        );
        // console.log(this.cursorKeys.space.isDown); // This is for when space key is pressed and hold down.

        if (wasSpaceKeyPressed) {
            this.battleMenu.handlePlayerInput("OK");

            // check if the player selected an attack, and update display text
            if (this.battleMenu.selectedAttack === undefined) {
                return;
            }

            console.log(
                `Player selected the following move: ${this.battleMenu.selectedAttack}`
            );
            this.battleMenu.hideMonsterAttackSubMenu();
            this.battleMenu.updateInfoPaneMessagesAndWaitForInput(
                ["Your monster attacks the enemy"],
                () => {
                    this.battleMenu.showMainBattleMenu();
                }
            );
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.shift)) {
            this.battleMenu.handlePlayerInput("CANCEL");
            return;
        }

        let selectedDirection = DIRECTION.NONE;

        if (this.cursorKeys.left.isDown) {
            selectedDirection = DIRECTION.LEFT;
        } else if (this.cursorKeys.right.isDown) {
            selectedDirection = DIRECTION.RIGHT;
        } else if (this.cursorKeys.up.isDown) {
            selectedDirection = DIRECTION.UP;
        } else if (this.cursorKeys.down.isDown) {
            selectedDirection = DIRECTION.DOWN;
        }

        if (selectedDirection !== DIRECTION.NONE) {
            this.battleMenu.handlePlayerInput(selectedDirection);
        }
    }
}
