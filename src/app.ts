import parser from './parser';
import parseFile from './grammar_parsing';
import setupInputs from './input_fields';
import { setupTree } from './parsing_tree';
import { GrammarStructure, Point, Derivation } from './types';

declare global {
  interface Window {
    grammarStructure: GrammarStructure;
    parsingTree: Derivation;
    oldSourcePoint: Point;
  }
}

// When document is ready, call add_drop_listener
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    addDropListener();
    enableExampleButtons();
    enableReturnButton();
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
  page.ondrop = (event) => {
    ignoreEvent(event);
    if (event.dataTransfer.files.length !== 1) return;
    const file = event.dataTransfer.files[0];
    if (file.type !== 'text/plain') return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target.result === 'string')
        recievedFile(event.target.result);
    };
    reader.readAsText(file);
  };
};

/**
 * Adds an onclick callback to every button in div#buttons
 */
const enableExampleButtons = () => {
  const buttonsDiv = document.getElementById('buttons');
  Array.from(buttonsDiv.getElementsByTagName('button')).forEach((child, i) => {
    child.onclick = async () => {
      const response = await fetch(`${i + 1}.txt`);
      const file = await response.text();
      recievedFile(file);
    };
  });
};

const enableReturnButton = () => {
  const returnBtn = document.getElementById('return-btn') as HTMLButtonElement;
  returnBtn.onclick = () => {
    document.getElementById('start-page').style.display = 'flex';
    document.getElementById('tree-page').style.display = 'none';
  };
};

/**
 * Processes the recieved file
 * @param file
 */
const recievedFile = (file: string) => {
  // Hide start-page and show tree-page
  document.getElementById('start-page').style.display = 'none';
  document.getElementById('tree-page').style.display = 'block';

  parseFile(file);
  setupInputs(parser);
  setupTree();
};
