import { Game as MainGame } from "./scenes/Game";
import { CANVAS, Game, Scale, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: CANVAS,
    pixelArt: false,
    width: 1024,
    height: 768,
    backgroundColor: "#000000",
    scale: {
        parent: "game-container",
        width: 1024,
        height: 576,
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    scene: [MainGame],
};

export default new Game(config);
