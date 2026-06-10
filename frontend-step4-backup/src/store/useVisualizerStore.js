import { create } from 'zustand';

const identity2 = [[1, 0], [0, 1]];
const identity3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

const presets2D = {
  identity: [[1, 0], [0, 1]],
  scale: [[1.5, 0], [0, 1.5]],
  rotate: [[0.71, -0.71], [0.71, 0.71]],
  shear: [[1, 1], [0, 1]],
  reflect: [[1, 0], [0, -1]],
  collapse: [[1, 1], [2, 2]],
};

const presets3D = {
  identity: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  scale: [[1.5, 0, 0], [0, 1.5, 0], [0, 0, 1.5]],
  rotate: [[0.71, -0.71, 0], [0.71, 0.71, 0], [0, 0, 1]],
  shear: [[1, 1, 0], [0, 1, 0], [0, 0, 1]],
  reflect: [[1, 0, 0], [0, 1, 0], [0, 0, -1]],
  collapse: [[1, 0, 1], [0, 1, 1], [1, 1, 2]],
};

const initialState = {
  dim: 2,
  concept: 'transformation',
  A: identity2,
  v: [2, 1],
  u: [-1, 2],
  alpha: 1,
  beta: 1,
  t: 1,
  animSpeed: 1,
};

function cloneMatrix(M) {
  return M.map((row) => [...row]);
}

export const useVisualizerStore = create((set, get) => ({
  ...initialState,

  setDim: (dim) => set((state) => {
    if (state.dim === dim) return state;
    return {
      dim,
      t: 1,
      A: dim === 3 ? cloneMatrix(identity3) : cloneMatrix(identity2),
      v: dim === 3 ? [2, 1, 1] : [2, 1],
      u: dim === 3 ? [-1, 2, 1] : [-1, 2],
    };
  }),

  setConcept: (concept) => set({ concept, t: 1 }),
  setMatrix: (A) => set({ A: cloneMatrix(A), t: 1 }),
  setVector: (key, value) => set({ [key]: [...value], t: 1 }),
  setAlpha: (alpha) => set({ alpha }),
  setBeta: (beta) => set({ beta }),
  setT: (t) => set({ t }),
  setAnimSpeed: (animSpeed) => set({ animSpeed }),

  resetState: () => set({ ...initialState, A: cloneMatrix(identity2), v: [2, 1], u: [-1, 2] }),

  applyPreset: (name) => {
    const { dim } = get();
    const preset = dim === 3 ? presets3D[name] : presets2D[name];
    if (!preset) return;
    set({ A: cloneMatrix(preset), t: 1 });
  },
}));

export const PRESET_NAMES = Object.keys(presets2D);
