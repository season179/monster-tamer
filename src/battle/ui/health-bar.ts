import { GameObjects, Scene, Math } from "phaser";
import { HEALTH_BAR_ASSET_KEYS } from "../../assets/assets-keys";

export class HealthBar {
    private scene: Scene;
    private healthBarContainer: GameObjects.Container;
    private fullWidth: number;
    private scaleY: number;
    private leftCap: GameObjects.Image;
    private middle: GameObjects.Image;
    private rightCap: GameObjects.Image;
    private leftShadowCap: GameObjects.Image;
    private middleShadow: GameObjects.Image;
    private rightShadowCap: GameObjects.Image;

    constructor(scene: Scene, x: number, y: number) {
        this.scene = scene;
        this.fullWidth = 360;
        this.scaleY = 0.7;

        this.healthBarContainer = this.scene.add.container(x, y, []);
        this.createHealthBarShadowImages(x, y);
        this.createHealthBarImages(x, y);
        this.setMeterPercentage(1);
    }

    public get container() {
        return this.healthBarContainer;
    }

    /**
     *
     * @param x the x position to place the health bar game object
     * @param y the y position to place the health bar game object
     * @returns
     */
    private createHealthBarShadowImages(x: number, y: number): void {
        this.leftShadowCap = this.scene.add
        .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW)
        .setOrigin(0, 0.5)
        .setScale(1, this.scaleY);

    this.middleShadow = this.scene.add
        .image(
            this.leftShadowCap.x + this.leftShadowCap.width,
            y,
            HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW
        )
        .setOrigin(0, 0.5)
        .setScale(1, this.scaleY);
    this.middleShadow.displayWidth = this.fullWidth;

    this.rightShadowCap = this.scene.add
        .image(
            this.middleShadow.x + this.middleShadow.displayWidth,
            y,
            HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW
        )
        .setOrigin(0, 0.5)
        .setScale(1, this.scaleY);

    this.healthBarContainer.add([this.leftShadowCap, this.middleShadow, this.rightShadowCap]);
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

    /**
     * 
     * @param percent a number between 0 and 1 that is used for setting how filled the health bar is
     */
    private setMeterPercentage(percent: number = 1) {
        const width = this.fullWidth * percent;

        this.middle.displayWidth = width;
        this.rightCap.x = this.middle.x + this.middle.displayWidth;
    }

    /**
     * 
     * @param percent a number between 0 and 1 that is used for setting how filled the health bar is
     * @param options an object that contains the duration and callback function
     */
    setMeterPercentageAnimated(
        percent: number,
        options?: { duration?: number; callback?: () => void }
    ) {
        const width = this.fullWidth * percent;

        this.scene.tweens.add({
            targets: this.middle,
            displayWidth: width,
            duration: options?.duration || 1000,
            ease: Math.Easing.Sine.Out,
            onUpdate: () => {
                this.rightCap.x = this.middle.x + this.middle.displayWidth;
                const isVisible = this.middle.displayWidth > 0;
                this.leftCap.visible = isVisible;
                this.middle.visible = isVisible;
                this.rightCap.visible = isVisible;
            },
            onComplete: options?.callback,
        });
    }
}
