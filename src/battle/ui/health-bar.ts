import { GameObjects, Scene } from "phaser";
import { HEALTH_BAR_ASSET_KEYS } from "../../assets/assets-keys";

export class HealthBar {
    private scene: Scene;
    private healthBarContainer: GameObjects.Container;
    private fullWidth: number;
    private scaleY: number;
    private leftCap: GameObjects.Image;
    private middle: GameObjects.Image;
    private rightCap: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.fullWidth = 360;
        this.scaleY = 0.7;

        this.healthBarContainer = this.scene.add.container(x, y, []);
        this.createHealthBarImages(x, y);
        this.setMeterPercentage(1);
    }

    public get container() {
        return this.healthBarContainer;
    }

    /**
     *
     * @param x the x position to place the health bar container
     * @param y the y position to place the health bar container
     * @returns
     */
    private createHealthBarImages(x: number, y: number): void {
        this.leftCap = this.scene.add
            .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
            .setOrigin(0, 0.5)
            .setScale(1, this.scaleY);

        this.middle = this.scene.add
            .image(
                this.leftCap.x + this.leftCap.width,
                y,
                HEALTH_BAR_ASSET_KEYS.MIDDLE
            )
            .setOrigin(0, 0.5)
            .setScale(1, this.scaleY);

        

        this.rightCap = this.scene.add
            .image(
                this.middle.x + this.middle.displayWidth,
                y,
                HEALTH_BAR_ASSET_KEYS.RIGHT_CAP
            )
            .setOrigin(0, 0.5)
            .setScale(1, this.scaleY);

        this.healthBarContainer.add([this.leftCap, this.middle, this.rightCap]);
    }

    private setMeterPercentage(percent = 1) {
        const width = this.fullWidth * percent;

        this.middle.displayWidth = width;
        this.rightCap.x = this.middle.x + this.middle.displayWidth;
    }
}
