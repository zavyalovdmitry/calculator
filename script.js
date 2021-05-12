class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.newCalc = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.newCalc = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '.')
            return;

        if (this.currentOperand === '' && this.operation !== 'SQRT') {
            if (operation === '-') {
                this.currentOperand = operation;
            }
            return;
        }
        if (this.previousOperand !== '') {
            if (this.operation !== '' && this.currentOperand === '' && operation === '-') {
                this.currentOperand = operation;
                return;
            }

            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        let decimalCount = 0;

        if (this.previousOperand.toString().indexOf('.') > -1) {
            decimalCount += this.previousOperand.toString().length -
                this.previousOperand.toString().indexOf('.') - 1;
        }

        if (this.currentOperand.toString().indexOf('.') > -1) {
            decimalCount += this.currentOperand.toString().length -
                this.currentOperand.toString().indexOf('.') - 1;
        }

        if (this.operation === 'POW') {
            decimalCount *= this.currentOperand;
        }

        const prev = parseFloat(this.previousOperand);
        let current = parseFloat(this.currentOperand);

        if (this.operation === 'SQRT') {
            if (prev < 0) {
                computation = 'ERROR';
            }
            
            this.operation = 'POW';
            current = 0.5;
            decimalCount += 5;

        }

        if (isNaN(prev) || isNaN(current)) return;

        if (computation !== 'ERROR') {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '÷':
                    computation = prev / current;
                    decimalCount += 5;
                    break;
                case 'POW':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
        }

        this.newCalc = true;
        this.currentOperand = computation === 'ERROR' ? computation : +computation.toFixed(decimalCount).toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        if (number === '-') return number;

        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === 'ERROR') {
            this.clear();
            this.currentOperandTextElement.innerText = 'ERROR';
            return;
        }

        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand);

        if (this.operation != null && this.currentOperand != '-') {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else if (this.previousOperand !== '') {
            return;
        } else {
            this.previousOperandTextElement.innerText = '';
            this.previousOperand = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (calculator.previousOperand === '' &&
            calculator.currentOperand !== '' &&
            calculator.newCalc) {
            calculator.currentOperand = '';
            calculator.newCalc = false;
        }
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})