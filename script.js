const rows = [
  { name: 'あ行', chars: ['a','i','u','e','o'], hira:['あ','い','う','え','お'] },
  { name: 'か行', chars: ['ka','ki','ku','ke','ko'], hira:['か','き','く','け','こ'] },
  { name: 'さ行', chars: ['sa','shi','su','se','so'], hira:['さ','し','す','せ','そ'] },
  { name: 'た行', chars: ['ta','chi','tsu','te','to'], hira:['た','ち','つ','て','と'] },
  { name: 'な行', chars: ['na','ni','nu','ne','no'], hira:['な','に','ぬ','ね','の'] },
  { name: 'は行', chars: ['ha','hi','fu','he','ho'], hira:['は','ひ','ふ','へ','ほ'] },
  { name: 'ま行', chars: ['ma','mi','mu','me','mo'], hira:['ま','み','む','め','も'] },
  { name: 'や行', chars: ['ya','','yu','','yo'], hira:['や','','ゆ','','よ'] },
  { name: 'ら行', chars: ['ra','ri','ru','re','ro'], hira:['ら','り','る','れ','ろ'] },
  { name: 'わ行', chars: ['wa','','','','wo'], hira:['わ','','','','を'] }
];

const rangeSelect = document.getElementById('range');
rows.forEach((row, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.textContent = `あ行～${row.name}`;
  rangeSelect.appendChild(opt);
});

const shuffle = arr => arr.sort(() => Math.random() - 0.5);

let pool = [], current = 0, results = [], mode;

document.getElementById('start').onclick = () => {
  const maxRow = parseInt(document.getElementById('range').value);
  const count = parseInt(document.getElementById('count').value);
  mode = document.getElementById('mode').value;

  pool = [];
  for (let i = 0; i <= maxRow; i++) {
    rows[i].chars.forEach((romaji, j) => {
      if (romaji) {
        pool.push({ romaji, hira: rows[i].hira[j] });
      }
    });
  }
  pool = shuffle(pool).slice(0, count);
  current = 0;
  results = [];

  document.getElementById('setup').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  nextQuestion();
};

function nextQuestion() {
  if (current >= pool.length) {
    showResult();
    return;
  }
  const item = pool[current];
  const qDiv = document.getElementById('question');
  const optsDiv = document.getElementById('options');
  optsDiv.innerHTML = '';

  let correct, questionText, options;
  if (mode === 'toHira') {
    questionText = `請選出：「${item.romaji}」 對應的平假名`;
    correct = item.hira;
    options = shuffle(pool.map(x => x.hira)).filter(x => x !== '').slice(0, 3);
  } else {
    questionText = `請選出：「${item.hira}」 對應的讀音`;
    correct = item.romaji;
    options = shuffle(pool.map(x => x.romaji)).slice(0, 3);
  }
  if (!options.includes(correct)) {
    options[Math.floor(Math.random() * 3)] = correct;
  }
  options = shuffle(options);

  qDiv.textContent = questionText;
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('opt');
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === correct) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('wrong');
      }
      results.push({
        question: mode === 'toHira' ? item.romaji : item.hira,
        correct,
        chosen: opt
      });
      document.querySelectorAll('button.opt').forEach(b => b.disabled = true);
      setTimeout(() => {
        current++;
        nextQuestion();
      }, 1000);
    };
    optsDiv.appendChild(btn);
  });
}

function showResult() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');

  const score = results.filter(r => r.chosen === r.correct).length;
  document.getElementById('score').textContent = `你的分數：${score} / ${results.length}`;

  const ul = document.getElementById('details');
  ul.innerHTML = '';
  results.forEach((r, i) => {
    if (r.chosen !== r.correct) {
      const li = document.createElement('li');
      li.textContent = `第 ${i + 1} 題：題目「${r.question}」，你選「${r.chosen}」，正確答案「${r.correct}」。`;
      ul.appendChild(li);
    }
  });
}

document.getElementById('restart').onclick = () => {
  document.getElementById('result').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
};
