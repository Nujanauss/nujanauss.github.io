import { checkRefresh, getGameSettings, buttonToNewPage, initializeFocusTracker } from './shared.js';
import { create_participant, get_prolific_id } from './backend_integration.js';

checkRefresh();
initializeFocusTracker();

document.addEventListener('DOMContentLoaded', function() {
  const settings = getGameSettings();
  const submitButton = document.getElementById('check-next');
  let correctAnswers;
  if (settings.includeComparison) {
    correctAnswers = [
      { question: "1", answer: !settings.binary },
      { question: "2", answer: !settings.binary },
      { question: "3", answer: false },
      { question: "4", answer: true }
    ];
  } else {
    document.getElementById('final-check').style.display = 'none';
    correctAnswers = [
      { question: "1", answer: !settings.binary },
      { question: "2", answer: !settings.binary },
      { question: "3", answer: false }
    ];
  }

  let answers = [];
  let checkedAnswerLog = [];
  let questions = document.querySelectorAll('.check');
  questions.forEach(question => {
      let qID = question.querySelector('.question').id;
      question.querySelectorAll('input[type="radio"]').forEach(answer => {
        answer.addEventListener('change', () => {
          document.getElementById('error-msg').style.visibility = 'hidden';
          question.querySelector('.question').style.color = '#333';
          if (answer.checked) {
            answers.push({
              question: qID,
              answer: answer.value === 'true' ? true : false,
              timestamp: new Date().toISOString().split('T')[1]
            });
          }
          if (new Set(answers.map(item => item.question)).size > correctAnswers.length - 1) { // if we have enough answers, release Check button
              submitButton.classList.remove('disabled');
              submitButton.classList.add('enabled');
              submitButton.disabled = false;
              submitButton.style.cursor = 'pointer';
          }
        });
      });
  });

  if (new Set(answers.map(item => item.question)).size < correctAnswers.length) { // else cannot Check until all answers complete
    submitButton.classList.add('disabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
  }

  submitButton.addEventListener('click', () => {
    let questionsChecked = [];
    checkedAnswerLog.push({timestamp: new Date().toISOString().split('T')[1]});
    for (let i = answers.length - 1; i >= 0; i--) { // work backwards because of updating answers
      let userAnswer = answers[i];
      if (questionsChecked.includes(userAnswer.question)) {
        continue;
      }
      questionsChecked.push(userAnswer.question);
      let correctAnswer = correctAnswers.find(answer => answer.question === userAnswer.question);
      if (userAnswer.answer !== correctAnswer.answer) {
        let questionElement = document.getElementById(userAnswer.question);
        //let selectedRadio = questionElement.nextElementSibling.querySelector(`input[type="radio"][value="${userAnswer.answer.toString()}"]`);
        //selectedRadio.style.accentColor = '#b50000';
        questionElement.style.color = '#b50000';
        document.getElementById('error-msg').style.visibility = 'visible';
        return;
      }
    }
    let checkQuestions = {
      answers: answers,
      checkedAnswerLog: checkedAnswerLog
    };
    sessionStorage.setItem('checkQuestions', JSON.stringify(checkQuestions));
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