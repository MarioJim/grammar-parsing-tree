import { isTerminalSymbol } from './types';

type parseInputFunction = (input: string, depth: number) => void;

/**
 * Reveals the text fields.
 * Adds an oninput callback to filter characters that aren't
 * terminal symbols in the textField and characters that
 * aren't numbers in the depthField.
 * Also calls the provided parse function after cleaning its
 * inputs.
 */
const setupInputs = (parseInput: parseInputFunction) => {
  // Select textField, reset it and display it
  const textField = document.getElementById('textField') as HTMLInputElement;
  textField.value = '';
  textField.style.display = 'block';

  // Select depthField, reset it and display it
  const depthField = document.getElementById('depthField') as HTMLInputElement;
  depthField.value = '0';
  depthField.style.display = 'block';

  // Add oninput callbacks to clean inputs and parse it
  textField.oninput = () => {
    textField.value = textField.value.split('').filter(char => isTerminalSymbol(char)).join('');
    parseInput(textField.value, parseInt(depthField.value));
  };
  depthField.oninput = () => {
    depthField.value = '' + Math.abs(parseInt(depthField.value)) || '0';
    parseInput(textField.value, parseInt(depthField.value));
  };
};

export default setupInputs;
