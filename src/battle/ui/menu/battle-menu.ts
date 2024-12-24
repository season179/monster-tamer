import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../assets/assets-keys";
import { DIRECTION } from "../../../common/direction";
import { exhaustiveGuard } from "../../../utils/guard";

enum BATTLE_MENU_OPTIONS {
    FIGHT = "FIGHT",
    SWITCH = "SWITCH",
    ITEM = "ITEM",
    FLEE = "FLEE",
}

const battleUiTextStyle = {
    color: "black",
    fontSize: "30px",
};

enum BATTLE_MENU_CURSOR_POSITION {
    x = 42,
    y = 38,
}

export class BattleMenu {
    private scene: Phaser.Scene;
    private mainBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
    private moveSelectionSubBattleMenuPhaserContainerGameObject: Phaser.GameObjects.Container;
    private battleTextGameObjectLine1: Phaser.GameObjects.Text;
    private battleTextGameObjectLine2: Phaser.GameObjects.Text;
    private mainBattleMenuCursorPhaserImageGameObject: Phaser.GameObjects.Image;
    private attackBattleMenuCursorPhaserImageGameObject: Phaser.GameObjects.Image;
    private selectedBattleMenuOption: BATTLE_MENU_OPTIONS;

    /**
     *
     * @param scene the Phase 3 scene the battle menu will be added to
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.createMainInfoPane();
        this.createMainBattleMenu();
        this.createMonsterAttackSubMenu();
    }

    showMainBattleMenu() {
        this.battleTextGameObjectLine1.setText("What should");
        this.mainBattleMenuPhaserContainerGameObject.setAlpha(1);
        this.battleTextGameObjectLine1.setAlpha(1);
        this.battleTextGameObjectLine2.setAlpha(1);

        this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
            BATTLE_MENU_CURSOR_POSITION.x,
            BATTLE_MENU_CURSOR_POSITION.y
        );
    }

    hideMainBattleMenu() {
        this.mainBattleMenuPhaserContainerGameObject.setAlpha(0);
        this.battleTextGameObjectLine1.setAlpha(0);
        this.battleTextGameObjectLine2.setAlpha(0);
    }

    showMonsterAttackSubMenu() {
        this.moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
    }

    hideMonsterAttackSubMenu() {
        this.moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
    }

    handlePlayerInput(input: "OK" | "CANCEL" | DIRECTION) {
        if (input === "CANCEL") {
            this.hideMonsterAttackSubMenu();
            this.showMainBattleMenu();
            return;
        }

        if (input === "OK") {
            this.hideMainBattleMenu();
            this.showMonsterAttackSubMenu();
            return;
        }

        this.updateSelectedBattleMenuOptionFromInput(input);
        this.moveMainBattleMenuCursor();
    }

    private createMainBattleMenu() {
        this.battleTextGameObjectLine1 = this.scene.add.text(
            20,
            468,
            "What should",
            battleUiTextStyle
        );

        // TODO: update to use monster data that is passed into this class instance
        this.battleTextGameObjectLine2 = this.scene.add.text(
            20,
            512,
            `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
            battleUiTextStyle
        );

        this.mainBattleMenuCursorPhaserImageGameObject = this.scene.add
            .image(
                BATTLE_MENU_CURSOR_POSITION.x,
                BATTLE_MENU_CURSOR_POSITION.y,
                UI_ASSET_KEYS.CURSOR,
                0
            )
            .setOrigin(0.5)
            .setScale(2.5);

        this.mainBattleMenuPhaserContainerGameObject = this.scene.add.container(
            520,
            448,
            [
                this.createMainInfoSubPane(),
                this.scene.add.text(
                    55,
                    22,
                    BATTLE_MENU_OPTIONS.FIGHT,
                    battleUiTextStyle
                ),
                this.scene.add.text(
                    240,
                    22,
                    BATTLE_MENU_OPTIONS.SWITCH,
                    battleUiTextStyle
                ),
                this.scene.add.text(
                    55,
                    70,
                    BATTLE_MENU_OPTIONS.ITEM,
                    battleUiTextStyle
                ),
                this.scene.add.text(
                    240,
                    70,
                    BATTLE_MENU_OPTIONS.FLEE,
                    battleUiTextStyle
                ),
                this.mainBattleMenuCursorPhaserImageGameObject,
            ]
        );

        this.hideMainBattleMenu();
    }

    private createMonsterAttackSubMenu() {
        this.attackBattleMenuCursorPhaserImageGameObject = this.scene.add
            .image(42, 38, UI_ASSET_KEYS.CURSOR, 0)
            .setOrigin(0.5)
            .setScale(2.5);
            
        this.moveSelectionSubBattleMenuPhaserContainerGameObject =
            this.scene.add.container(0, 448, [
                this.scene.add.text(55, 22, "slash", battleUiTextStyle),
                this.scene.add.text(240, 22, "growl", battleUiTextStyle),
                this.scene.add.text(55, 70, "-", battleUiTextStyle),
                this.scene.add.text(240, 70, "-", battleUiTextStyle),
                this.attackBattleMenuCursorPhaserImageGameObject,
            ]);

        this.hideMonsterAttackSubMenu();
    }

    private createMainInfoPane() {
        const padding = 4;
        const rectangleHeight = 124;

        this.scene.add
            .rectangle(
                0,
                this.scene.scale.height - rectangleHeight - padding,
                this.scene.scale.width - padding * 2,
                rectangleHeight,
                0xede4f3,
                1
            )
            .setOrigin(0)
            .setStrokeStyle(8, 0xe4434a, 1);
    }

    private createMainInfoSubPane() {
        const rectangleWidth = 500;
        const rectangleHeight = 124;

        return this.scene.add
            .rectangle(0, 0, rectangleWidth, rectangleHeight, 0xede4f3, 1)
            .setOrigin(0)
            .setStrokeStyle(8, 0x805ac2, 1);
    }

    private updateSelectedBattleMenuOptionFromInput(direction: DIRECTION) {
        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    break;
                case DIRECTION.DOWN:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    break;
                case DIRECTION.LEFT:
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    break;
                default:
                    exhaustiveGuard(direction);
                    break;
            }
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
            switch (direction) {
                case DIRECTION.DOWN:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    break;
                case DIRECTION.LEFT:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    break;
                case DIRECTION.RIGHT:
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    break;
                default:
                    exhaustiveGuard(direction);
                    break;
            }
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
            switch (direction) {
                case DIRECTION.UP:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
                    break;
                case DIRECTION.RIGHT:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FLEE;
                    break;
                case DIRECTION.DOWN:
                case DIRECTION.LEFT:
                case DIRECTION.NONE:
                    break;
                default:
                    exhaustiveGuard(direction);
                    break;
            }
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
            switch (direction) {
                case DIRECTION.UP:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.SWITCH;
                    break;
                case DIRECTION.LEFT:
                    this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
                    break;
                case DIRECTION.RIGHT:
                case DIRECTION.DOWN:
                case DIRECTION.NONE:
                    break;
                default:
                    exhaustiveGuard(direction);
                    break;
            }
            return;
        }
        exhaustiveGuard(this.selectedBattleMenuOption);
    }

    private moveMainBattleMenuCursor() {
        switch (this.selectedBattleMenuOption) {
            case BATTLE_MENU_OPTIONS.FIGHT:
                this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
                    BATTLE_MENU_CURSOR_POSITION.x,
                    BATTLE_MENU_CURSOR_POSITION.y
                );
                return;
            case BATTLE_MENU_OPTIONS.SWITCH:
                this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
                    228,
                    BATTLE_MENU_CURSOR_POSITION.y
                );
                return;
            case BATTLE_MENU_OPTIONS.ITEM:
                this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
                    BATTLE_MENU_CURSOR_POSITION.x,
                    86
                );
                return;
            case BATTLE_MENU_OPTIONS.FLEE:
                this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
                    228,
                    86
                );
                return;
            default:
                exhaustiveGuard(this.selectedBattleMenuOption);
                return;
        }
    }
}
