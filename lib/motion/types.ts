export interface MotionPreset {
  initial?: any;
  whileInView?: any;
  viewport?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  [key: string]: any;
}

export interface MotionPack {
  id: string;
  name: string;
  baseId?: string; // parent motion pack ID to inherit from
  presets: {
    reveal: MotionPreset;
    hover: MotionPreset;
    tap: MotionPreset;
    stagger?: number;
    [key: string]: any;
  };
}
