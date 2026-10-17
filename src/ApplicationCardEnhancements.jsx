import { useEffect } from 'react';

const STORAGE_KEY = 'unwritten-hackathon-v1';

export default function ApplicationCardEnhancements() {
  useEffect(() => {
    const openRelevantRequirement = event => {
      const nextButton = event.target.closest('.next-action button');
      if (!nextButton) return;

      const card = nextButton.closest('.uw-app-card');
      if (!card) return;

      const requirements = [...card.querySelectorAll('.requirement')];
      const targetRequirement = requirements.find(button => !button.classList.contains('complete')) || requirements[0];
      if (!targetRequirement) return;

      event.preventDefault();
      event.stopPropagation();
      targetRequirement.click();
    };

    const addInlineDeleteButtons = () => {
      const applicationHeading = [...document.querySelectorAll('.uw-page-head > div > span')]
        .find(element => element.textContent.trim() === 'My Applications');
      if (!applicationHeading) return;

      document.querySelectorAll('.app-grid.single .uw-app-card').forEach(card => {
        if (card.querySelector('.inline-delete-application')) return;
        const header = card.querySelector(':scope > header');
        const institution = card.querySelector('h3')?.textContent?.trim();
        if (!header || !institution) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'inline-delete-application';
        button.textContent = 'Delete';
        button.setAttribute('aria-label', `Delete ${institution}`);
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const approved = window.confirm(`Delete ${institution} and all of its local requirements, tasks, and progress?`);
          if (!approved) return;

          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const applications = Array.isArray(saved) ? saved : [];
          const updated = applications.filter(application => application.institution !== institution);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          window.location.reload();
        });
        header.appendChild(button);
      });
    };

    document.addEventListener('click', openRelevantRequirement, true);
    const observer = new MutationObserver(addInlineDeleteButtons);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    addInlineDeleteButtons();

    return () => {
      document.removeEventListener('click', openRelevantRequirement, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
