import { Scene } from "phaser";
import { SCENE_KEYS } from "../scenes/scene-keys";
import {
    BATTLE_ASSET_KEYS,
    BATTLE_BACKGROUND_ASSET_KEYS,
    HEALTH_BAR_ASSET_KEYS,
    MONSTER_ASSET_KEYS,
} from "../assets/assets-keys";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION } from "../common/direction";

export class BattleScene extends Scene {
    private battleMenu: BattleMenu;
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: SCENE_KEYS.BATTLE_SCENE });
    }

    create() {
        // create main background
        this.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0);

        // render out the player and enemy monsters
        this.add.image(640, 18, MONSTER_ASSET_KEYS.CARNODUSK).setOrigin(0);
        this.add
            .image(120, 190, MONSTER_ASSET_KEYS.IGUANIGNITE)
            .setOrigin(0)
            .setFlipX(true);

        // render out the player health bar
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
            this.createHealthBar(34, 34),
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
        const enemyMonsterName = this.add.text(
            30,
            20,
            MONSTER_ASSET_KEYS.IGUANIGNITE,
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
            this.createHealthBar(34, 34),
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

    /**
     *
     * @param x the x position to place the health bar container
     * @param y the y position to place the health bar container
     * @returns
     */
    private createHealthBar(
        x: number,
        y: number
    ): Phaser.GameObjects.Container {
        const scaleY = 0.7;

        const leftCap: Phaser.GameObjects.Image = this.add
            .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
            .setOrigin(0, 0.5)
            .setScale(1, scaleY);

        const middle: Phaser.GameObjects.Image = this.add
            .image(leftCap.x + leftCap.width, y, HEALTH_BAR_ASSET_KEYS.MIDDLE)
            .setOrigin(0, 0.5)
            .setScale(1, scaleY);

        middle.displayWidth = 360;

        const rightCap: Phaser.GameObjects.Image = this.add
            .image(
                middle.x + middle.displayWidth,
                y,
                HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
            )
            .setOrigin(0, 0.5)
            .setScale(1, scaleY);

        return this.add.container(x, y, [leftCap, middle, rightCap]);
    }
}
