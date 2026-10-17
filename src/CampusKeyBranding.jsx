import { useEffect } from 'react';

const replacements = [
  [/Unlock the rules no one taught you\./g, 'Unlock the college rules no one taught you.'],
  [/UNWRITTEN/g, 'CAMPUSKEY'],
  [/Unwritten/g, 'CampusKey'],
];

function replaceBranding(value) {
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export default function CampusKeyBranding() {
  useEffect(() => {
    document.title = 'CampusKey — College Application Guidance';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', 'CampusKey reveals hidden college-application expectations and turns them into clear next steps.');

    const updateTextNode = node => {
      if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue) return;
      const updated = replaceBranding(node.nodeValue);
      if (updated !== node.nodeValue) node.nodeValue = updated;
    };

    const updateTree = root => {
      if (root.nodeType === Node.TEXT_NODE) return updateTextNode(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) updateTextNode(node);
    };

    updateTree(document.getElementById('root'));
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(updateTree)));
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });

    const correctCopiedPrompt = event => {
      const button = event.target.closest('button');
      if (!button || !/Copy action for Go|Copy prompt for Go/i.test(button.textContent)) return;
      window.setTimeout(async () => {
        const visiblePrompt = document.querySelector('.agent-prompt')?.textContent;
        if (visiblePrompt) return navigator.clipboard?.writeText(replaceBranding(visiblePrompt));
        const context = document.querySelector('.go-selected-context p')?.textContent || '';
        const action = document.querySelector('.go-actions button.active')?.textContent || 'Decode this context';
        const prompt = `Use the CampusKey Superhuman Go agent inline. Action: ${action.trim()}. Use the current browser page and selected text as context, distinguish official requirements from general conventions, flag missing or unverified facts, and keep the first response concise. Selected text: “${context.trim()}”`;
        await navigator.clipboard?.writeText(prompt);
      }, 40);
    };

    document.addEventListener('click', correctCopiedPrompt);
    return () => {
      observer.disconnect();
      document.removeEventListener('click', correctCopiedPrompt);
    };
  }, []);

  return null;
}
