import { GrammarStructure, isTerminalSymbol, Symbol } from './types';
import { parseFile } from './grammar_parsing';
import { setupTree } from './parsing_tree';

declare global {
  interface Window {
    grammarStructure: GrammarStructure
    parsingTree: Symbol
  }
}

// When document is ready, call add_drop_listener
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    addDropListener();
  }
});

const ignoreEvent = (event: DragEvent) => {
  event.stopPropagation();
  event.preventDefault();
};

/**
 * Adds the drop listener to the body.
 * 
 * When an plain text file is dropped into the area, recieved_file
 * is called with the string of the file as a parameter.
 */
const addDropListener = () => {
  const page = document.getElementsByTagName('body')[0];
  page.ondragenter = ignoreEvent;
  page.ondragover = ignoreEvent;
  page.ondrop = event => {
    ignoreEvent(event);
    if (event.dataTransfer.files.length !== 1) return;
    const file = event.dataTransfer.files[0];
    if (file.type !== 'text/plain') return;
    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target.result === 'string')
        recievedFile(event.target.result);
    };
    reader.readAsText(file);
  };
};

/**
 * Reveals the text field and adds its on input callback
 * to filter characters that aren't terminal symbols
 */
const setupTextField = () => {
  const textField = document.getElementById('textField') as HTMLInputElement;
  textField.value = '';
  textField.style.display = 'block';
  textField.oninput = () => {
    textField.value = textField.value
      .split('')
      .filter(char => isTerminalSymbol(char))
      .join('');
  };
};
/**
 * Processes the recieved file
 * @param file 
 */
const recievedFile = (file: string) => {
  parseFile(file);
  setupTextField();
  // Add hardcoded tree for d3 tests
  window.parsingTree = {
    name: 'S',
    children: [
      {
        name: 'A',
        children: [
          {
            name: 'a',
          },
        ],
      },
      {
        name: 'b',
      },
      {
        name: 'B',
        children: [
          {
            name: 'A',
            children: [
              {
                name: 'a',
              },
            ],
          },
          {
            name: 'a',
          },
          {
            name: 'A',
            children: [
              {
                name: 'a',
              },
            ],
          },
        ],
      },
    ],
  }
  setupTree();
};
