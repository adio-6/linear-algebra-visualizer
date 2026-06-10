import { create } from 'zustand';

const default2D = {
  A: [[1, 0], [0, 1]],
  v: [2, 1],
  u: [-1, 2],
};

const default3D = {
  A: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  v: [2, 1, 1],
  u: [-1, 2, 1],
};

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

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, cloneValue(nested)]));
  }
  return value;
}

function cloneMatrix(M) {
  return M.map((row) => [...row]);
}

function cloneDimState(value) {
  return {
    A: cloneMatrix(value.A),
    v: [...value.v],
    u: [...value.u],
  };
}

const initialCache = {
  2: cloneDimState(default2D),
  3: cloneDimState(default3D),
};

const defaultCamera3D = {
  position: [6, 5, 7],
  target: [0, 0, 0],
  zoom: 1,
};

const initialState = {
  dim: 2,
  concept: 'transformation',
  A: cloneMatrix(default2D.A),
  v: [...default2D.v],
  u: [...default2D.u],
  alpha: 1,
  beta: 1,
  t: 1,
  animSpeed: 1,
  camera3D: { ...defaultCamera3D },
  dimCache: initialCache,
};

const syncKeys = ['dim', 'concept', 'A', 'v', 'u', 'alpha', 'beta', 't', 'animSpeed', 'camera3D'];

function createDimCacheFromState(state) {
  const current = {
    A: state.A,
    v: state.v,
    u: state.u,
  };

  const nextCache = {
    ...state.dimCache,
    [state.dim]: cloneDimState(current),
  };

  return nextCache;
}

function normalizePatchForStore(patch = {}) {
  const cleanPatch = {};

  for (const key of syncKeys) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) {
      cleanPatch[key] = cloneValue(patch[key]);
    }
  }

  return cleanPatch;
}

export const useVisualizerStore = create((set, get) => ({
  ...initialState,

  setDim: (dim) => set((state) => {
    if (state.dim === dim) return state;

    const nextCache = createDimCacheFromState(state);
    const restored = nextCache[dim] ?? (dim === 3 ? default3D : default2D);

    return {
      dim,
      t: 1,
      A: cloneMatrix(restored.A),
      v: [...restored.v],
      u: [...restored.u],
      dimCache: nextCache,
    };
  }),

  setConcept: (concept) => set({ concept, t: 1 }),
  setMatrix: (A) => set({ A: cloneMatrix(A), t: 1 }),
  setVector: (key, value) => set({ [key]: [...value], t: 1 }),
  setAlpha: (alpha) => set({ alpha }),
  setBeta: (beta) => set({ beta }),
  setT: (t) => set({ t }),
  setAnimSpeed: (animSpeed) => set({ animSpeed }),
  setCamera3D: (camera3D) => set({ camera3D: cloneValue(camera3D) }),

  resetState: () => set({
    ...initialState,
    A: cloneMatrix(default2D.A),
    v: [...default2D.v],
    u: [...default2D.u],
    camera3D: { ...defaultCamera3D },
    dimCache: {
      2: cloneDimState(default2D),
      3: cloneDimState(default3D),
    },
  }),

  applyPreset: (name) => {
    const { dim } = get();
    const preset = dim === 3 ? presets3D[name] : presets2D[name];
    if (!preset) return;
    set({ A: cloneMatrix(preset), t: 1 });
  },

  getSyncSnapshot: () => {
    const state = get();
    return {
      dim: state.dim,
      concept: state.concept,
      A: cloneValue(state.A),
      v: cloneValue(state.v),
      u: cloneValue(state.u),
      alpha: state.alpha,
      beta: state.beta,
      t: state.t,
      animSpeed: state.animSpeed,
      camera3D: cloneValue(state.camera3D),
    };
  },

  applyRemotePatch: (patch = {}) => set((state) => {
    const cleanPatch = normalizePatchForStore(patch);
    if (Object.keys(cleanPatch).length === 0) return state;

    const next = {
      ...state,
      ...cleanPatch,
    };

    if (Object.prototype.hasOwnProperty.call(cleanPatch, 'dim') || cleanPatch.A || cleanPatch.v || cleanPatch.u) {
      next.dimCache = {
        ...state.dimCache,
        [next.dim]: cloneDimState({ A: next.A, v: next.v, u: next.u }),
      };
    }

    return next;
  }),
}));

export const PRESET_NAMES = Object.keys(presets2D);
