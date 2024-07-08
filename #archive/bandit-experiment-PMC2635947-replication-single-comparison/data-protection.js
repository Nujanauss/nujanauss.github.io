document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('submit-button').addEventListener('click', function() {
    window.location.href = 'instructions1';
  });
  document.getElementById('data-consent-rescinded').addEventListener('click', function() {
    window.location.href = 'consent-rescinded';
  });
  
  const submitButton = document.getElementById('submit-button');
  submitButton.style.cursor = 'not-allowed';
  const checkboxes = document.querySelectorAll('.consent-checkboxes input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
          if (Array.from(checkboxes).every(cb => cb.checked)) {
              submitButton.classList.remove('disabled');
              submitButton.classList.add('enabled');
              submitButton.disabled = false;
              submitButton.style.cursor = 'pointer';
          } else {
              submitButton.classList.remove('enabled');
              submitButton.classList.add('disabled');
              submitButton.disabled = true;
              submitButton.style.cursor = 'not-allowed';
          }
      });
  });
});
