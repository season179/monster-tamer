import { Scene } from 'phaser';

type BattleMonsterConfig = {
    name: string;
    assetKey: string;
    assetFrame: number;
    maxHP: number;
    currentHP: number;
    baseAttack: number;
    attackIds: number[];
};

type Config = {
    scene: Scene;
    monsterDetails: BattleMonsterConfig;
};

type Coordinate = {
    x: number;
    y: number;
};

type Attack = {
    id: number;
    name: string;
    animationName: string;
}