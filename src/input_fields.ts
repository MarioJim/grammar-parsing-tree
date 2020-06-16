import { isTerminalSymbol } from './types';

type parseInputFunction = (input: string, depth: number) => void;

/**
 * Adds an oninput callback to clean the inputs and call
 * the provided parse function.
 */
const setupInputs = (parseInput: parseInputFunction) => {
  // Select string-field, reset it and display it
  const stringField = document.getElementById(
    'string-field',
  ) as HTMLInputElement;
  stringField.value = '';
  // Select depth-field, reset it and display it
  const depthField = document.getElementById('depth-field') as HTMLInputElement;
  depthField.value = '1';
  // Add oninput callbacks to clean inputs and parse it
  stringField.oninput = () => {
    stringField.value = stringField.value
      .split('')
      .filter((char) => isTerminalSymbol(char))
      .join('');
    parseInput(stringField.value, parseInt(depthField.value));
  };
  depthField.oninput = () => {
    depthField.value = '' + (Math.abs(parseInt(depthField.value)) || 1);
    parseInput(stringField.value, parseInt(depthField.value));
  };
};

export default setupInputs;
