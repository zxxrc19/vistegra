import data from './data.json' assert { type: 'json' }
import config from './config.json' assert { type: 'json' }

const materialSelect = document.getElementById('material');
const pipeSelect = document.getElementById('pipe');
const widthInput = document.getElementById('width');
const lengthInput = document.getElementById('length');
const strengthSelect = document.getElementById('strength');
const calculateBtn = document.getElementById('calculate-btn');
const resultSection = document.querySelector('.result-section');

let dataMaterial = []
let dataPipe = []
let screwsName = ''
let screwsUnit = ''
let screwsPrice = ''
for (let item of data) {
  if (item.type == 'list') {
    dataMaterial.push(item)
  }
  if (item.type == 'pipe') {
    dataPipe.push(item)
  }
  if (item.type == 'fix') {
    screwsName = item.name
    screwsUnit = item.unit
    screwsPrice = item.price
  }
}
for (let item of config) {
  if (item.key === 'width') {
    widthInput.setAttribute('min', item.min)
    widthInput.setAttribute('max', item.max)
  }
  if (item.key === 'length') {
    lengthInput.setAttribute('min', item.min)
    lengthInput.setAttribute('max', item.max)
  }
  if (item.type === 'frame') {
    strengthSelect.innerHTML += `
    <option value="${item.key}">${item.name}</option>
    `
  }
}

function addOptionsToSelect(select, options) {
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.width;
    optionElement.textContent = option.name;
    select.appendChild(optionElement);
  });
}

addOptionsToSelect(materialSelect, dataMaterial);
addOptionsToSelect(pipeSelect, dataPipe);

calculateBtn.addEventListener('click', function () {
  const selectedMaterial = +materialSelect.value;
  const selectedMaterialMaterial = dataMaterial.find(list => list.width === selectedMaterial).material;
  const selectedMaterialName = dataMaterial.find(list => list.width === selectedMaterial).name;
  const selectedMaterialUnit = dataMaterial.find(list => list.width === selectedMaterial).unit;
  const selectedMaterialPrice = dataMaterial.find(list => list.width === selectedMaterial).price;

  const selectedPipe = +pipeSelect.value;
  const selectedPipeName = data.find(pipe => pipe.width === selectedPipe).name;
  const selectedPipeUnit = data.find(pipe => pipe.width === selectedPipe).unit;
  const selectedPipePrice = data.find(pipe => pipe.width === selectedPipe).price;

  const width = parseInt(widthInput.value);
  console.log(width);
  console.log(typeof width);
  const length = parseInt(lengthInput.value);
  const strength = strengthSelect.value;
  if (isNaN(width) || isNaN(length)) {
    alert("Заполните все поля");
    return false;
  }
  const area = width * length;
  const sheetsCount = Math.ceil(area / selectedMaterial);
  const sheetsCountPrice = sheetsCount * selectedMaterialPrice;

  const maxDistance = config.find(frame => frame.key === strength).step;
  const pipesWidth = area / (maxDistance * length);
  const pipesCount = Math.ceil(pipesWidth / (selectedPipe / 1000));
  const pipesCountPrice = Math.ceil(pipesCount * selectedPipePrice);


  const screwsPerSquareMeter = config.find(item =>
    item.type === 'fix' && item.key === selectedMaterialMaterial).value;
  const screwsCount = Math.ceil(area * screwsPerSquareMeter);
  const screwsCountPrice = Math.ceil(screwsCount * screwsPrice);

  const resultText = `
    <div> Площадь: ${area} м.кв. </div>
    <table>
      <thead>
        <tr>
          <th>Наименование</th>
          <th>ед.</th>
          <th>кол-во</th>
          <th>сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr> 
          <td>${selectedMaterialName}</td>
          <td>${selectedMaterialUnit}</td>
          <td>${sheetsCount}</td>
          <td>${sheetsCountPrice}</td>
        </tr>
        <tr> 
          <td>${selectedPipeName}</td>
          <td>${selectedPipeUnit}</td>
          <td>${pipesCount}</td>
          <td>${pipesCountPrice}</td>
        </tr>
        <tr>
          <td>${screwsName}</td>
          <td>${screwsUnit}</td>
          <td>${screwsCount}</td>
          <td>${screwsCountPrice}</td>
        </tr>
      </tbody>
  </table>
  `;
  // Отображаем результат
  resultSection.innerHTML = resultText;
});