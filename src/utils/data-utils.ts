import { Scene } from "phaser";
import { Attack } from "../types/monsters";
import { DATA_ASSET_KEYS } from "../assets/assets-keys";

export class DataUtils {
    static getMonsterAttack(scene: Scene, attackId: number) {
        const data: Attack[] = scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS);

        return data.find((attack) => attack.id === attackId);
    }
}
