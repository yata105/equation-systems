const mainTable = document.querySelector('.main-table');

const fields = mainTable.querySelectorAll('div');

const buttonSolve = document.querySelector('#solve');

const buttonClear = document.querySelector('#clear');

const radios = document.getElementsByName('method');

var elements = [3];
var newElements = [3];
for (let i = 0; i < 3; i++) {
    elements[i] = new Array(4);
    newElements[i] = new Array(4);
}

const output = document.querySelector('.output').querySelectorAll('li');

const xs = [];

const pastXs = [];

const epsilon = 0.001;

buttonClear.addEventListener('click', function() {
    for (let field of fields) {
        field.querySelector('input').value = '';
    }
})

buttonSolve.addEventListener('click', solve);

function solve() {
    let i = 0;
    let j = 0;
    for (let field of fields) {
        if (typeof(+(field.querySelector('input').value)) != 'number' || field.querySelector('input').value == "") {
            return;
        }
        elements[i][j] = +(field.querySelector('input').value);
        j++;
        if (j % 4 == 0) {
            j = 0;
            i++;
            if (i == 3) {
                break;
            }
        }     
    }   
    
    console.log('проверка прошла');

    let result;

    switch (methodSelect()) {
        case 0:
            result = zeidelSolve();
            break;
        case 1:
            result = gaussSolve();
            break;
    }

    for (let a = 0; a < 3; a++) {
        output[a].innerHTML = `X${a+1} = ${result[a]}`;
    }
    
}

function gaussSolve() {

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) { 
            newElements[i][j] = elements[i][j];
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 3; j++) {
            newElements[j][i] = elements[j][i] - (elements[j][0] / elements[0][0]) * elements[0][i];
        }
    }

    for (let i = 1; i < 4; i++) {
        elements[2][i] = newElements[2][i] - (newElements[2][1] / newElements[1][1]) * newElements[1][i];
    }

    xs[2] = elements[2][3] / elements[2][2];
    xs[1] = (newElements[1][3] - newElements[1][2] * xs[2]) / newElements[1][1];
    xs[0] = (newElements[0][3] - newElements[0][2] * xs[2] - newElements[0][1] * xs[1]) / newElements[0][0];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) { 
            console.log(newElements[i][j]);
        }
    }

    return xs;
}

function zeidelSolve() {
    xs[0] = elements[0][3] / elements[0][0];
    xs[1] = elements[1][3] / elements[1][1];
    xs[2] = elements[2][3] / elements[2][2];

    let iter = 0;
    let passedCount = 0;
    while (true) {
        iter++;
        for (let i = 0; i < 3; i++) {
            pastXs[i] = xs[i];
        }
        xs[0] = (elements[0][3] - elements[0][1] * pastXs[1] - elements[0][2] * pastXs[2]) / elements[0][0];
        xs[1] = (elements[1][3] - elements[1][0] * xs[0] - elements[1][2] * pastXs[2]) / elements[1][1];
        xs[2] = (elements[2][3] - elements[2][0] * xs[0] - elements[2][1] * xs[1]) / elements[2][2]; 
        for (let i = 0; i < 3; i++) {
            if (Math.abs(xs[i] - pastXs[i]) / Math.abs(xs[i]) < epsilon) {
                passedCount++;
            }
        }
        if (passedCount == 3) {
            console.log(iter);
            return xs;
        }
        passedCount = 0;
        if (iter == 100) {
            alert('Вероятно, решений не существует, количество итераций достигло 100');
            return xs;
        }
    }
}

function methodSelect() {
    for (let a = 0; a < radios.length; a++) {
        if (radios[a].checked) return a;
    }  
}