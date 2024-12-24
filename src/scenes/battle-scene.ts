import { BATTLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/assets-keys";
import { Scene } from "phaser";
import { DIRECTION } from "../common/direction";
import { SCENE_KEYS } from "../scenes/scene-keys";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { BattleMonster } from "../battle/monsters/battle-monsters";

export class BattleScene extends Scene {
    private battleMenu: BattleMenu;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private activeEnemyMonster: BattleMonster;

    constructor() {
        super({ key: SCENE_KEYS.BATTLE_SCENE });
    }

    create() {
        // create main background
        const background = new Background(this);
        background.showForest();

        // render out the player and enemy monsters
        // 640, 18
        this.activeEnemyMonster = new BattleMonster(
            {
                scene: this,
                monsterDetails: {
                    name: MONSTER_ASSET_KEYS.CARNODUSK,
                    assetKey: MONSTER_ASSET_KEYS.CARNODUSK,
                    assetFrame: 0,
                    maxHP: 25,
                    currentHP: 25,
                    baseAttack: 5,
                    attackIds: [],
                },
            },
            { x: 768, y: 144 }
        );
        // this.add.image(640, 18, MONSTER_ASSET_KEYS.CARNODUSK, 0);
        
        this.add
            .image(120, 190, MONSTER_ASSET_KEYS.IGUANIGNITE)
            .setOrigin(0)
            .setFlipX(true);

        // render out the player health bar
        const playerHealthBar = new HealthBar(this, 34, 34);
        const playerMonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.IGUANIGNITE,
            {
                color: "#7E3D3F",
                fontSize: "32px",
            }
        );
        this.add.container(556, 318, [
            this.add
                .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
                .setOrigin(0),
            playerMonsterName,
            playerHealthBar.container,
            this.add.text(playerMonsterName.width + 35, 23, "L5", {
                color: "#ED474B",
                fontSize: "28px",
            }),
            this.add.text(30, 55, "HP", {
                color: "#FF6505",
                fontSize: "24px",
                fontStyle: "italic",
            }),
            this.add
                .text(443, 80, "25/25", {
                    color: "#7E3D3F",
                    fontSize: "16px",
                })
                .setOrigin(1, 0),
        ]);

        // render out the enemy health bar
        // const enemyHealthBar = new HealthBar(this, 34, 34);
        const enemyHealthBar = this.activeEnemyMonster.healthBar;
        const enemyMonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.CARNODUSK,
            {
                color: "#7E3D3F",
                fontSize: "32px",
            }
        );
        this.add.container(0, 0, [
            this.add
                .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
                .setOrigin(0)
                .setScale(1, 0.8),
            enemyMonsterName,
            enemyHealthBar.container,
            this.add.text(enemyMonsterName.width + 35, 23, "L5", {
                color: "#ED474B",
                fontSize: "28px",
            }),
            this.add.text(30, 55, "HP", {
                color: "#FF6505",
                fontSize: "24px",
                fontStyle: "italic",
            }),
        ]);

        // render out the main info and sub info panes
        this.battleMenu = new BattleMenu(this);
        this.battleMenu.showMainBattleMenu();

        this.cursorKeys = this.input.keyboard!.createCursorKeys();
        playerHealthBar.setMeterPercentageAnimated(0.5, {
            duration: 3000,
            callback: () => {
                console.log("Animation complete");
            },
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
