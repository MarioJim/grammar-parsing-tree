import { isTerminalSymbol } from './types';

type parseInputFunction = (input: string, depth: number) => void;

/**
 * Adds an oninput callback to clean the inputs and call
 * the provided parse function.
 */
const setupInputs = (parseInput: parseInputFunction) => {
  // Select textField, reset it and display it
  const textField = document.getElementById('textField') as HTMLInputElement;
  textField.value = '';
  // Select depthField, reset it and display it
  const depthField = document.getElementById('depthField') as HTMLInputElement;
  depthField.value = '1';
  // Add oninput callbacks to clean inputs and parse it
  textField.oninput = () => {
    textField.value = textField.value.split('').filter(char => isTerminalSymbol(char)).join('');
    parseInput(textField.value, parseInt(depthField.value));
  };
  depthField.oninput = () => {
    depthField.value = '' + (Math.abs(parseInt(depthField.value)) || 1);
    parseInput(textField.value, parseInt(depthField.value));
  };
};

export default setupInputs;
