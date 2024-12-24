import { Scene } from "phaser";
import { DIRECTION } from "../common/direction";
import { SCENE_KEYS } from "../scenes/scene-keys";
import { Background } from "../battle/background";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { MONSTER_ASSET_KEYS } from "../assets/assets-keys";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";

export class BattleScene extends Scene {
    private battleMenu: BattleMenu;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private activeEnemyMonster: EnemyBattleMonster;
    private activePlayerMonster: PlayerBattleMonster;
    private activePlayerAttackIndex: number;

    constructor() {
        super({ key: SCENE_KEYS.BATTLE_SCENE });
    }

    init() {
        this.activePlayerAttackIndex = -1;
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
                attackIds: [1],
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
                attackIds: [2, 1],
                currentLevel: 5,
            },
        });

        // render out the main info and sub info panes
        this.battleMenu = new BattleMenu(this, this.activePlayerMonster);
        this.battleMenu.showMainBattleMenu();

        this.cursorKeys = this.input.keyboard!.createCursorKeys();
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

            this.activePlayerAttackIndex = this.battleMenu.selectedAttack;

            if (
                !this.activePlayerMonster.attacks[this.activePlayerAttackIndex]
            ) {
                return;
            }
            console.log(
                `Player selected the following move: ${this.battleMenu.selectedAttack}`
            );

            this.battleMenu.hideMonsterAttackSubMenu();
            this.handleBattleSequence();
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

    private handleBattleSequence() {
        // general battle flow
        // show attack used, brief pause
        // then play attack animation, brief pause
        // then play damage animation, brief pause
        // then play health bar animation, brief pause
        // then repeat the steps above for the other monster

        this.playerAttack();
    }

    private playerAttack() {
        this.battleMenu.updateInfoPaneMessagesAndWaitForInput(
            [
                `${this.activePlayerMonster.name} used ${
                    this.activePlayerMonster.attacks[
                        this.activePlayerAttackIndex
                    ].name
                }`,
            ],
            () => {
                this.time.delayedCall(500, () => {
                    this.activeEnemyMonster.takeDamage(20, () => {
                        this.enemyAttack();
                    });
                });
            }
        );
    }

    private enemyAttack() {
        this.battleMenu.updateInfoPaneMessagesAndWaitForInput(
            [
                `For ${this.activeEnemyMonster.name} used ${this.activeEnemyMonster.attacks[0].name}`,
            ],
            () => {
                this.time.delayedCall(500, () => {
                    this.activePlayerMonster.takeDamage(20, () => {
                        this.battleMenu.showMainBattleMenu();
                    });
                });
            }
        );
    }
}
