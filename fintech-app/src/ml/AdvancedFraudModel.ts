import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

// Simple neural network with fixed weights for demonstration
function createModel(): tf.LayersModel {
  const m = tf.sequential();
  m.add(tf.layers.dense({ units: 8, inputShape: [5], activation: 'relu', useBias: true }));
  m.add(tf.layers.dense({ units: 4, activation: 'relu', useBias: true }));
  m.add(tf.layers.dense({ units: 1, activation: 'sigmoid', useBias: true }));
  return m;
}

function initializeWeights(m: tf.LayersModel) {
  // These weights are randomly generated and serve as placeholders.
  // In a real application, load trained weights here.
  const weights = m.getWeights();
  const newWeights = weights.map(w => tf.randomNormal(w.shape));
  m.setWeights(newWeights);
  weights.forEach(w => w.dispose());
}

export function getModel(): tf.LayersModel {
  if (!model) {
    model = createModel();
    initializeWeights(model);
  }
  return model;
}

export function predictRisk(features: number[]): number {
  const m = getModel();
  const input = tf.tensor2d([features]);
  const output = m.predict(input) as tf.Tensor;
  const score = output.dataSync()[0];
  tf.dispose([input, output]);
  return score;
}
