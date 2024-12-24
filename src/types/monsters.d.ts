import { Scene } from 'phaser';

interface Monster {
    name: string;
    assetKey: string;
    assetFrame: number;
    currentLevel: number;
    maxHP: number;
    currentHP: number;
    baseAttack: number;
    attackIds: number[];
};

interface BattleMonsterConfig {
    scene: Scene;
    monsterDetails: Monster;
    scaleHealthBarBackgroundImageByY?: number = 1;
};

interface Coordinate {
    x: number;
    y: number;
};

interface Attack {
    id: number;
    name: string;
    animationName: string;
}