import { DIRECTION } from "../../../common/direction";
import { exhaustiveGuard } from "../../../utils/guard";
import { BATTLE_UI_TEXT_STYLE } from "./battle-menu-config";
import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../assets/assets-keys";
import {
    BATTLE_MENU_OPTIONS,
    ATTACK_MOVE_OPTIONS,
    ACTIVE_BATTLE_MENU,
} from "./battle-menu-options";

enum BATTLE_MENU_CURSOR_POSITION {
    x = 42,
    y = 38,
}

enum ATTACK_MENU_CURSOR_POSITION {
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
    private selectedAttackMenuOption: ATTACK_MOVE_OPTIONS;
    private activeBattleMenu: ACTIVE_BATTLE_MENU;
    private queuedInfoPanelMessages: string[];
    private queuedInfoPanelCallback: (() => void) | undefined;
    private waitingForPlayerInput: boolean;
    private selectedAttackIndex: number | undefined;

    /**
     *
     * @param scene the Phase 3 scene the battle menu will be added to
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
        this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
        this.queuedInfoPanelMessages = [];
        this.queuedInfoPanelCallback = undefined;
        this.waitingForPlayerInput = false;
        this.selectedAttackIndex = undefined;
        this.createMainInfoPane();
        this.createMainBattleMenu();
        this.createMonsterAttackSubMenu();
    }

    public get selectedAttack() {
        if (this.activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
            return this.selectedAttackIndex;
        }

        return undefined;
    }

    showMainBattleMenu() {
        this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN;
        this.battleTextGameObjectLine1.setText("What should");
        this.mainBattleMenuPhaserContainerGameObject.setAlpha(1);
        this.battleTextGameObjectLine1.setAlpha(1);
        this.battleTextGameObjectLine2.setAlpha(1);

        this.selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FIGHT;
        this.mainBattleMenuCursorPhaserImageGameObject.setPosition(
            BATTLE_MENU_CURSOR_POSITION.x,
            BATTLE_MENU_CURSOR_POSITION.y
        );
        this.selectedAttackIndex = undefined;
    }

    hideMainBattleMenu() {
        this.mainBattleMenuPhaserContainerGameObject.setAlpha(0);
        this.battleTextGameObjectLine1.setAlpha(0);
        this.battleTextGameObjectLine2.setAlpha(0);
    }

    showMonsterAttackSubMenu() {
        this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
        this.moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
    }

    hideMonsterAttackSubMenu() {
        this.moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
    }

    handlePlayerInput(input: "OK" | "CANCEL" | DIRECTION) {
        if (
            this.waitingForPlayerInput &&
            (input === "CANCEL" || input === "OK")
        ) {
            this.updateInfoPaneWithMessage();
            return;
        }

        if (input === "CANCEL") {
            this.switchToMainBattleMenu();
            return;
        }

        if (input === "OK") {
            if (this.activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
                this.handlePlayerChooseMainBattleOption();
                return;
            }

            if (
                this.activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT
            ) {
                this.handlePlayerChooseAttack();
                return;
            }

            return;
        }

        this.updateSelectedBattleMenuOptionFromInput(input);
        this.moveMainBattleMenuCursor();
        this.updateSelectedMoveMenuOptionFromInput(input);
        this.moveMoveSelectBattleMenuCursor();
    }

    updateInfoPaneMessagesAndWaitForInput(
        messages: string[],
        callback: (() => void) | undefined
    ) {
        this.queuedInfoPanelMessages = messages;
        this.queuedInfoPanelCallback = callback;

        this.updateInfoPaneWithMessage();
    }

    private updateInfoPaneWithMessage() {
        this.waitingForPlayerInput = false;
        this.battleTextGameObjectLine1.setText("").setAlpha(1);

        // check if all messages have been displayed from the queue and call the callback
        if (this.queuedInfoPanelMessages.length === 0) {
            if (this.queuedInfoPanelCallback) {
                this.queuedInfoPanelCallback();
                this.queuedInfoPanelCallback = undefined;
            }
            return;
        }

        // get first message from queue and animate message
        const messageToDisplay = this.queuedInfoPanelMessages.shift();
        if (messageToDisplay) {
            this.battleTextGameObjectLine1.setText(messageToDisplay);
            this.waitingForPlayerInput = true;
        }
    }

    private createMainBattleMenu() {
        this.battleTextGameObjectLine1 = this.scene.add.text(
            20,
            468,
            "What should",
            BATTLE_UI_TEXT_STYLE
        );

        // TODO: update to use monster data that is passed into this class instance
        this.battleTextGameObjectLine2 = this.scene.add.text(
            20,
            512,
            `${MONSTER_ASSET_KEYS.IGUANIGNITE} do next?`,
            BATTLE_UI_TEXT_STYLE
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
                    BATTLE_UI_TEXT_STYLE
                ),
                this.scene.add.text(
                    240,
                    22,
                    BATTLE_MENU_OPTIONS.SWITCH,
                    BATTLE_UI_TEXT_STYLE
                ),
                this.scene.add.text(
                    55,
                    70,
                    BATTLE_MENU_OPTIONS.ITEM,
                    BATTLE_UI_TEXT_STYLE
                ),
                this.scene.add.text(
                    240,
                    70,
                    BATTLE_MENU_OPTIONS.FLEE,
                    BATTLE_UI_TEXT_STYLE
                ),
                this.mainBattleMenuCursorPhaserImageGameObject,
            ]
        );

        this.hideMainBattleMenu();
    }

    private createMonsterAttackSubMenu() {
        this.attackBattleMenuCursorPhaserImageGameObject = this.scene.add
            .image(
                ATTACK_MENU_CURSOR_POSITION.x,
                ATTACK_MENU_CURSOR_POSITION.y,
                UI_ASSET_KEYS.CURSOR,
                0
            )
            .setOrigin(0.5)
            .setScale(2.5);

        this.moveSelectionSubBattleMenuPhaserContainerGameObject =
            this.scene.add.container(0, 448, [
                this.scene.add.text(55, 22, "slash", BATTLE_UI_TEXT_STYLE),
                this.scene.add.text(240, 22, "growl", BATTLE_UI_TEXT_STYLE),
                this.scene.add.text(55, 70, "-", BATTLE_UI_TEXT_STYLE),
                this.scene.add.text(240, 70, "-", BATTLE_UI_TEXT_STYLE),
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
        if (this.activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
            return;
        }

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
        if (this.activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MAIN) {
            return;
        }

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

    private updateSelectedMoveMenuOptionFromInput(direction: DIRECTION) {
        if (this.activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
            return;
        }

        if (this.selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_1) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
                    break;
                case DIRECTION.DOWN:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
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

        if (this.selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_2) {
            switch (direction) {
                case DIRECTION.LEFT:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
                    break;
                case DIRECTION.DOWN:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
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

        if (this.selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_3) {
            switch (direction) {
                case DIRECTION.RIGHT:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_4;
                    break;
                case DIRECTION.UP:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
                    break;
                case DIRECTION.LEFT:
                case DIRECTION.DOWN:
                case DIRECTION.NONE:
                    break;
                default:
                    exhaustiveGuard(direction);
                    break;
            }
            return;
        }

        if (this.selectedAttackMenuOption === ATTACK_MOVE_OPTIONS.MOVE_4) {
            switch (direction) {
                case DIRECTION.LEFT:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_3;
                    break;
                case DIRECTION.UP:
                    this.selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_2;
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

        exhaustiveGuard(this.selectedAttackMenuOption);
    }

    private moveMoveSelectBattleMenuCursor() {
        if (this.activeBattleMenu !== ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) {
            return;
        }

        switch (this.selectedAttackMenuOption) {
            case ATTACK_MOVE_OPTIONS.MOVE_1:
                this.attackBattleMenuCursorPhaserImageGameObject.setPosition(
                    ATTACK_MENU_CURSOR_POSITION.x,
                    ATTACK_MENU_CURSOR_POSITION.y
                );
                return;
            case ATTACK_MOVE_OPTIONS.MOVE_2:
                this.attackBattleMenuCursorPhaserImageGameObject.setPosition(
                    228,
                    ATTACK_MENU_CURSOR_POSITION.y
                );
                return;
            case ATTACK_MOVE_OPTIONS.MOVE_3:
                this.attackBattleMenuCursorPhaserImageGameObject.setPosition(
                    ATTACK_MENU_CURSOR_POSITION.x,
                    86
                );
                return;
            case ATTACK_MOVE_OPTIONS.MOVE_4:
                this.attackBattleMenuCursorPhaserImageGameObject.setPosition(
                    228,
                    86
                );
                return;
            default:
                exhaustiveGuard(this.selectedAttackMenuOption);
                return;
        }
    }

    private switchToMainBattleMenu() {
        this.hideMonsterAttackSubMenu();
        this.showMainBattleMenu();
    }

    private handlePlayerChooseMainBattleOption() {
        this.hideMainBattleMenu();

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FIGHT) {
            this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT;
            this.showMonsterAttackSubMenu();
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
            this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_ITEM;
            this.updateInfoPaneMessagesAndWaitForInput(
                ["Your bag is empty...", "test", "1234"],
                () => {
                    this.switchToMainBattleMenu();
                }
            );
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.SWITCH) {
            this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_SWITCH;
            this.updateInfoPaneMessagesAndWaitForInput(
                ["You have no other monsters in your party..."],
                () => {
                    this.switchToMainBattleMenu();
                }
            );
            return;
        }

        if (this.selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FLEE) {
            this.activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_FLEE;
            this.updateInfoPaneMessagesAndWaitForInput(
                ["You failed to run away..."],
                () => {
                    this.switchToMainBattleMenu();
                }
            );
            return;
        }

        exhaustiveGuard(this.selectedBattleMenuOption);
    }

    private handlePlayerChooseAttack() {
        let selectedMoveIndex = 0;

        switch (this.selectedAttackMenuOption) {
            case ATTACK_MOVE_OPTIONS.MOVE_1:
                selectedMoveIndex = 0;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_2:
                selectedMoveIndex = 1;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_3:
                selectedMoveIndex = 2;
                break;
            case ATTACK_MOVE_OPTIONS.MOVE_4:
                selectedMoveIndex = 3;
                break;
            default:
                exhaustiveGuard(this.selectedAttackMenuOption);
                break;
        }

        this.selectedAttackIndex = selectedMoveIndex;
    }
}
