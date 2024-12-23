import { Scene } from "phaser";
import {
    BATTLE_ASSET_KEYS,
    BATTLE_BACKGROUND_ASSET_KEYS,
    HEALTH_BAR_ASSET_KEYS,
    MONSTER_ASSET_KEYS,
} from "../assets/assets-keys";
import { SCENE_KEYS } from "./scene-keys";

export class PreloadScene extends Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
    }

    preload() {
        console.log(`[${PreloadScene.name}] preload invoked`);
        this.load.setPath("/assets/");

        const monsterTamerAssetsPath = "images/monster-tamer";
        const kenneysAssetsPath = "images/kenneys-assets";

        // Battle background
        this.load.image(
            BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
            `${monsterTamerAssetsPath}/battle-backgrounds/forest-background.png`
        );

        // Battle assets
        this.load.image(
            BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
            `${kenneysAssetsPath}/ui-space-expansion/custom-ui.png`
        );

        // Health bar
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
            `${kenneysAssetsPath}/ui-space-expansion/barHorizontal_green_right.png`
        );

        this.load.image(
            HEALTH_BAR_ASSET_KEYS.MIDDLE,
            `${kenneysAssetsPath}/ui-space-expansion/barHorizontal_green_mid.png`
        );

        this.load.image(
            HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
            `${kenneysAssetsPath}/ui-space-expansion/barHorizontal_green_left.png`
        );

        // Monster assets
        this.load.image(
            MONSTER_ASSET_KEYS.CARNODUSK,
            `${monsterTamerAssetsPath}/monsters/carnodusk.png`
        );

        this.load.image(
            MONSTER_ASSET_KEYS.IGUANIGNITE,
            `${monsterTamerAssetsPath}/monsters/iguanignite.png`
        );
    }

    create() {
        // 512, 384
        console.log(`[${PreloadScene.name}] create invoked`);
        this.scene.start(SCENE_KEYS.BATTLE_SCENE);
    }
}
