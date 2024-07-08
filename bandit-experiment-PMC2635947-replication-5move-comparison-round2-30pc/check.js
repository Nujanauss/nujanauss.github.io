import { checkRefresh, buttonToNewPage, initializeFocusTracker } from './shared.js';
import { create_participant, get_prolific_id } from './backend_integration.js';

checkRefresh();
initializeFocusTracker();

const correctAnswers = [
    { question: "1", answer: true },
    { question: "2", answer: true },
    { question: "3", answer: false },
    { question: "4", answer: true }
];

document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('check-next');

  let answers = [];
  let questions = document.querySelectorAll('.check');
  questions.forEach(question => {
      let qID = question.querySelector('.question').id;
      question.querySelectorAll('input[type="radio"]').forEach(answer => {
        answer.addEventListener('change', () => {
          if (answer.checked) {
            answers.push({
              question: qID,
              answer: answer.value === 'true' ? true : false
            });
          }
          if (new Set(answers.map(item => item.question)).size > 3) {
              submitButton.classList.remove('disabled');
              submitButton.classList.add('enabled');
              submitButton.disabled = false;
              submitButton.style.cursor = 'pointer';
          }
        });
      });
  });

  if (new Set(answers.map(item => item.question)).size < 4) {
    submitButton.classList.add('disabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
  }

  submitButton.addEventListener('click', () => {
    let errorMessages = [];
    let questionsChecked = [];
    for (let i = answers.length - 1; i >= 0; i--) { // work backwards because of updating answers
      let userAnswer = answers[i];
      let correctAnswer = correctAnswers.find(answer => answer.question === userAnswer.question);
      if (questionsChecked.includes(userAnswer.question)) {
        continue;
      }
      questionsChecked.push(userAnswer.question);
      if (userAnswer.answer !== correctAnswer.answer) {
        let questionElement = document.getElementById(userAnswer.question);
        let selectedRadio = questionElement.nextElementSibling.querySelector(`input[type="radio"][value="${userAnswer.answer.toString()}"]`);

        if (selectedRadio) {
          selectedRadio.style.accentColor = 'red';
        }
        errorMessages.push(`Question ${i + 1} is incorrect.`);
        let errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = 'There was a mistake. Please correct the highlighted answers.';
        errorMessages.forEach(msg => {
          errorMsg.textContent += `\n${msg}`;
        });
        return;
      }
    }
    sessionStorage.setItem('checkQuestions', JSON.stringify(answers));
    document.getElementById('correct').classList.remove('gone');
    document.getElementById('final-check').style.marginBottom = '0px';
    submitButton.innerHTML = 'Play';
    buttonToNewPage('check-next', 'game');

    submitButton.classList.add('disabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    setTimeout(() => {
        submitButton.classList.remove('disabled');
        submitButton.classList.add('enabled');
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
    }, 2000);
  });
});