import { SCENE_KEYS } from "./scenes/scene-keys";
import { BattleScene } from "./scenes/battle-scene";
import { PreloadScene } from "./scenes/preload-scene";
import { CANVAS, Game, Scale, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: CANVAS,
    pixelArt: false,
    scale: {
        parent: "game-container",
        width: 1024,
        height: 576,
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    backgroundColor: "#000000",
};

const game = new Game(config);

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
