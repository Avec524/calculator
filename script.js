document.addEventListener('DOMContentLoaded', function() {
    const modeButtons = document.querySelectorAll('.mode-button');
    const displayInput = document.querySelector('#display');
    const buttonsContainer = document.querySelector('#buttons');
    const historyContainer = document.querySelector('#history');

    let currentInput = '0';
    let history = [];
    let currentMode = 'normal';
    let angleMode = 'radians'; // Для инженерного режима

    // Простой парсер выражений вместо eval
    function evaluateExpression(expression) {
        try {
            expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
            if (expression.includes('%+') || expression.includes('%-')) {
                const parts = expression.split(/(\%\+|\%-)/);
                const number = parseFloat(parts[0]);
                const operator = parts[1];
                const percent = parseFloat(parts[2]);
                if (operator === '%+') {
                    return number * (1 + percent / 100);
                } else if (operator === '%-') {
                    return number * (1 - percent / 100);
                }
            }
            if (expression.includes('%')) {
                expression = expression.replace(/(\d+\.?\d*)%/, '($1/100)');
            }
            return new Function(`return ${expression}`)();
        } catch (error) {
            throw new Error('Ошибка вычисления');
        }
    }

    function appendToDisplay(value) {
        if (value === 'π') {
            currentInput = currentInput === '0' ? Math.PI.toString() : currentInput + Math.PI.toString();
        } else if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
        updateDisplay();
    }

    function appendPercent(value) {
        if (!currentInput.match(/\d$/)) return;
        currentInput += value;
        updateDisplay();
    }

    function updateDisplay() {
        displayInput.value = currentInput || '0';
    }

    function updateHistory() {
        historyContainer.innerHTML = history.join('<br>');
    }

    function clearAll() {
        currentInput = '0';
        history = [];
        updateDisplay();
        updateHistory();
    }

    function addStardustEffect() {
        const calculator = document.querySelector('.calculator-container');
        for (let i = 0; i < 10; i++) {
            const dust = document.createElement('div');
            dust.className = 'stardust';
            dust.style.left = `${Math.random() * 100}%`;
            dust.style.top = `${Math.random() * 100}%`;
            calculator.appendChild(dust);
            setTimeout(() => dust.remove(), 500);
        }
    }

    function flashDisplay() {
        displayInput.classList.add('result-flash');
        setTimeout(() => displayInput.classList.remove('result-flash'), 1000);
    }

    function createStars() {
        const starsContainer = document.querySelector('.stars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starsContainer.appendChild(star);
        }
    }

    createStars();

    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            updateButtons();
            clearAll();
        });
    });

    function updateButtons() {
        buttonsContainer.innerHTML = '';

        const createButton = (text, className, onClick, tooltip) => {
            const button = document.createElement('button');
            button.classList.add('button', className);
            button.textContent = text;
            button.addEventListener('click', onClick);
            if (tooltip) {
                const tooltipSpan = document.createElement('span');
                tooltipSpan.className = 'tooltip';
                tooltipSpan.textContent = tooltip;
                button.appendChild(tooltipSpan);
            }
            buttonsContainer.appendChild(button);
        };

        if (currentMode === 'normal') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: '%', className: '', onClick: () => appendPercent('%'), tooltip: 'Процент от числа' },
                { text: '÷', className: 'operator', onClick: () => appendToDisplay('/') },
                { text: '√', className: '', onClick: calculateSquareRoot, tooltip: 'Квадратный корень' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '×', className: 'operator', onClick: () => appendToDisplay('*') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '-', className: 'operator', onClick: () => appendToDisplay('-') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '+', className: 'operator', onClick: () => appendToDisplay('+') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') },
                { text: '=', className: 'equals', onClick: calculate }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        } else if (currentMode === 'tax') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: 'НДФЛ', className: '', onClick: promptTax, tooltip: 'Налог на доход 13%' },
                { text: 'Вычет', className: '', onClick: promptTaxDeduction, tooltip: 'Налоговый вычет' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        } else if (currentMode === 'financial') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: '%+', className: '', onClick: () => appendPercent('%+'), tooltip: 'Добавить процент' },
                { text: '%-', className: '', onClick: () => appendPercent('%-'), tooltip: 'Вычесть процент' },
                { text: 'Кл. ставка', className: '', onClick: calculateKeyRate, tooltip: 'Доход по ставке 7%' },
                { text: 'Орбита', className: 'equals', onClick: promptOrbit, tooltip: 'Сложные проценты' },
                { text: 'NPV', className: '', onClick: promptNPV, tooltip: 'Чистая приведенная стоимость' },
                { text: 'ROI', className: '', onClick: promptROI, tooltip: 'Рентабельность инвестиций' },
                { text: 'Чистый доход', className: '', onClick: promptFreelanceIncome, tooltip: 'Доход фрилансера' },
                { text: 'Час. ставка', className: '', onClick: promptHourlyRate, tooltip: 'Почасовая ставка' },
                { text: 'Косм. валюта', className: 'unique', onClick: promptCosmicCurrency, tooltip: 'Конвертер с космической инфляцией' },
                { text: 'Успех', className: 'unique', onClick: promptSuccessProbability, tooltip: 'Вероятность успеха' },
                { text: 'Тайм', className: 'unique', onClick: promptTimeManagement, tooltip: 'Космический тайм-менеджмент' },
                { text: 'Аффирм', className: 'unique', onClick: generateAffirmation, tooltip: 'Финансовая аффирмация' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '×', className: 'operator', onClick: () => appendToDisplay('*') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '-', className: 'operator', onClick: () => appendToDisplay('-') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '+', className: 'operator', onClick: () => appendToDisplay('+') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        } else if (currentMode === 'engineering') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: 'Rad/Deg', className: '', onClick: toggleAngleMode, tooltip: 'Переключить радианы/градусы' },
                { text: 'sin', className: '', onClick: () => applyTrig('sin') },
                { text: 'cos', className: '', onClick: () => applyTrig('cos') },
                { text: 'tan', className: '', onClick: () => applyTrig('tan') },
                { text: 'π', className: '', onClick: () => appendToDisplay('π'), tooltip: 'Число Пи' },
                { text: '√', className: '', onClick: calculateSquareRoot, tooltip: 'Квадратный корень' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '×', className: 'operator', onClick: () => appendToDisplay('*') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '-', className: 'operator', onClick: () => appendToDisplay('-') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '+', className: 'operator', onClick: () => appendToDisplay('+') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') },
                { text: '=', className: 'equals', onClick: calculate }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        } else if (currentMode === 'advanced') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: 'Энтропия', className: '', onClick: calculateEntropy, tooltip: 'Шенноновская энтропия' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '×', className: 'operator', onClick: () => appendToDisplay('*') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '-', className: 'operator', onClick: () => appendToDisplay('-') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '+', className: 'operator', onClick: () => appendToDisplay('+') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') },
                { text: '=', className: 'equals', onClick: calculate }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        } else if (currentMode === 'scientific') {
            const buttons = [
                { text: 'C', className: '', onClick: clearAll, tooltip: 'Очистить' },
                { text: 'log', className: '', onClick: calculateLog, tooltip: 'Натуральный логарифм' },
                { text: 'e', className: '', onClick: () => appendToDisplay(Math.E.toString()), tooltip: 'Число e' },
                { text: '!', className: '', onClick: calculateFactorial, tooltip: 'Факториал' },
                { text: '7', className: '', onClick: () => appendToDisplay('7') },
                { text: '8', className: '', onClick: () => appendToDisplay('8') },
                { text: '9', className: '', onClick: () => appendToDisplay('9') },
                { text: '×', className: 'operator', onClick: () => appendToDisplay('*') },
                { text: '4', className: '', onClick: () => appendToDisplay('4') },
                { text: '5', className: '', onClick: () => appendToDisplay('5') },
                { text: '6', className: '', onClick: () => appendToDisplay('6') },
                { text: '-', className: 'operator', onClick: () => appendToDisplay('-') },
                { text: '1', className: '', onClick: () => appendToDisplay('1') },
                { text: '2', className: '', onClick: () => appendToDisplay('2') },
                { text: '3', className: '', onClick: () => appendToDisplay('3') },
                { text: '+', className: 'operator', onClick: () => appendToDisplay('+') },
                { text: '0', className: '', onClick: () => appendToDisplay('0') },
                { text: '.', className: '', onClick: () => appendToDisplay('.') },
                { text: '=', className: 'equals', onClick: calculate }
            ];
            buttons.forEach(btn => createButton(btn.text, btn.className, btn.onClick, btn.tooltip));
        }
    }

    function calculate() {
        try {
            const result = evaluateExpression(currentInput);
            history.push(`${currentInput} = ${result.toFixed(2)}`);
            currentInput = result.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function calculateSquareRoot() {
        try {
            const number = parseFloat(currentInput);
            if (number < 0) throw new Error('Отрицательное число');
            const result = Math.sqrt(number);
            history.push(`√${number} = ${result.toFixed(2)}`);
            currentInput = result.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function applyTrig(func) {
        try {
            let number = parseFloat(currentInput);
            if (angleMode === 'degrees') {
                number = number * Math.PI / 180;
            }
            let result;
            if (func === 'sin') result = Math.sin(number);
            else if (func === 'cos') result = Math.cos(number);
            else if (func === 'tan') {
                if (Math.abs(Math.cos(number)) < 1e-10) throw new Error('Недопустимое значение');
                result = Math.tan(number);
            }
            history.push(`${func}(${currentInput}${angleMode === 'degrees' ? '°' : ''}) = ${result.toFixed(6)}`);
            currentInput = result.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function toggleAngleMode() {
        angleMode = angleMode === 'radians' ? 'degrees' : 'radians';
        history.push(`Режим углов: ${angleMode === 'radians' ? 'Радианы' : 'Градусы'}`);
        updateHistory();
    }

    function calculateKeyRate() {
        try {
            const amount = parseFloat(currentInput);
            const keyRate = 7; // Условная ключевая ставка 7%
            const yearlyIncome = amount * (keyRate / 100);
            history.push(`Доход по ставке 7% от ${amount} = ${yearlyIncome.toFixed(2)}`);
            currentInput = yearlyIncome.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptOrbit() {
        try {
            const amount = parseFloat(prompt('Введите сумму:'));
            const years = parseFloat(prompt('Введите количество лет:'));
            if (isNaN(amount) || isNaN(years) || years <= 0) throw new Error('Некорректный ввод');
            const keyRate = 7;
            const compoundInterest = amount * Math.pow(1 + keyRate / 100, years);
            history.push(`Орбита: ${amount} на ${years} лет = ${compoundInterest.toFixed(2)}`);
            currentInput = compoundInterest.toString();
            generateAffirmation();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptNPV() {
        try {
            const cashFlows = prompt('Введите денежные потоки через запятую (например, -1000, 500, 600):').split(',').map(parseFloat);
            const rate = parseFloat(prompt('Введите ставку дисконтирования (%):')) / 100;
            if (cashFlows.some(isNaN) || isNaN(rate)) throw new Error('Некорректный ввод');
            let npv = 0;
            for (let i = 0; i < cashFlows.length; i++) {
                npv += cashFlows[i] / Math.pow(1 + rate, i);
            }
            history.push(`NPV: ${cashFlows.join(', ')} при ${rate * 100}% = ${npv.toFixed(2)}`);
            currentInput = npv.toString();
            generateAffirmation();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptROI() {
        try {
            const investment = parseFloat(prompt('Введите сумму инвестиций:'));
            const returns = parseFloat(prompt('Введите полученный доход:'));
            if (isNaN(investment) || isNaN(returns) || investment <= 0) throw new Error('Некорректный ввод');
            const roi = ((returns - investment) / investment) * 100;
            history.push(`ROI: (${returns} - ${investment}) / ${investment} = ${roi.toFixed(2)}%`);
            currentInput = roi.toString();
            generateAffirmation();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptTax() {
        try {
            const income = parseFloat(currentInput);
            const taxRate = 13;
            const tax = income * (taxRate / 100);
            history.push(`НДФЛ 13% от ${income} = ${tax.toFixed(2)}`);
            currentInput = tax.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptTaxDeduction() {
        try {
            const expenses = parseFloat(prompt('Введите сумму расходов для вычета:'));
            const maxDeduction = 120000;
            const taxRate = 13;
            const deduction = Math.min(expenses, maxDeduction) * (taxRate / 100);
            history.push(`Вычет: ${expenses} (макс. ${maxDeduction}) = ${deduction.toFixed(2)}`);
            currentInput = deduction.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptFreelanceIncome() {
        try {
            const grossIncome = parseFloat(currentInput);
            const taxRate = 6;
            const platformFee = parseFloat(prompt('Введите комиссию платформы (%):')) || 0;
            const tax = grossIncome * (taxRate / 100);
            const fee = grossIncome * (platformFee / 100);
            const netIncome = grossIncome - tax - fee;
            history.push(`Чистый доход: ${grossIncome} - ${taxRate}% - ${platformFee}% = ${netIncome.toFixed(2)}`);
            currentInput = netIncome.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptHourlyRate() {
        try {
            const targetIncome = parseFloat(prompt('Введите целевой месячный доход:'));
            const hoursPerWeek = parseFloat(prompt('Введите часов работы в неделю:'));
            if (isNaN(targetIncome) || isNaN(hoursPerWeek) || hoursPerWeek <= 0) throw new Error('Некорректный ввод');
            const weeksPerMonth = 4.33;
            const hourlyRate = targetIncome / (hoursPerWeek * weeksPerMonth);
            history.push(`Часовая ставка: ${targetIncome} / (${hoursPerWeek} * ${weeksPerMonth.toFixed(2)}) = ${hourlyRate.toFixed(2)}`);
            currentInput = hourlyRate.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptCosmicCurrency() {
        try {
            const amount = parseFloat(currentInput);
            const exchangeRate = parseFloat(prompt('Введите курс валюты (например, 1 USD = X RUB):')) || 1;
            const cosmicInflation = 1 + (Math.random() * 0.1);
            const converted = amount * exchangeRate * cosmicInflation;
            history.push(`Косм. конверсия: ${amount} * ${exchangeRate} * ${cosmicInflation.toFixed(2)} = ${converted.toFixed(2)}`);
            currentInput = converted.toString();
            addStardustEffect();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptSuccessProbability() {
        try {
            const investment = parseFloat(prompt('Введите сумму инвестиций:'));
            const expectedProfit = parseFloat(prompt('Введите ожидаемую прибыль:'));
            const riskLevel = parseFloat(prompt('Введите уровень риска (0-100%):')) / 100;
            if (isNaN(investment) || isNaN(expectedProfit) || isNaN(riskLevel) || riskLevel < 0 || riskLevel > 1) {
                throw new Error('Некорректный ввод');
            }
            const baseProbability = 0.7;
            const adjustedProbability = baseProbability * (1 - riskLevel) * (1 + Math.random() * 0.2 - 0.1);
            const probability = Math.max(0, Math.min(100, adjustedProbability * 100));
            history.push(`Вероятность успеха: ${probability.toFixed(2)}%`);
            currentInput = probability.toString();
            addStardustEffect();
            flashDisplay();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function promptTimeManagement() {
        try {
            const targetAmount = parseFloat(prompt('Введите целевую сумму:'));
            const hourlyRate = parseFloat(prompt('Введите почасовую ставку:'));
            const hoursPerWeek = parseFloat(prompt('Введите часов работы в неделю:'));
            if (isNaN(targetAmount) || isNaN(hourlyRate) || isNaN(hoursPerWeek) || hourlyRate <= 0 || hoursPerWeek <= 0) {
                throw new Error('Некорректный ввод');
            }
            const weeksPerMonth = 4.33;
            const monthlyEarnings = hourlyRate * hoursPerWeek * weeksPerMonth;
            const monthsNeeded = targetAmount / monthlyEarnings;
            const cosmicProductivity = 1 + (Math.random() * 0.2 - 0.1);
            const adjustedMonths = monthsNeeded * cosmicProductivity;
            history.push(`Время до цели: ${targetAmount} / ${monthlyEarnings.toFixed(2)} * ${cosmicProductivity.toFixed(2)} = ${adjustedMonths.toFixed(2)} мес.`);
            currentInput = adjustedMonths.toString();
            addStardustEffect();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function generateAffirmation() {
        const affirmations = [
            "Ваша прибыль взлетает, как ракета к Марсу!",
            "Вы — звезда финансовой галактики!",
            "Ваши инвестиции сияют ярче сверхновой!",
            "Космос благословляет ваши финансовые решения!",
            "Ваше богатство растет, как орбита Юпитера!"
        ];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        history.push(`Аффирмация: ${randomAffirmation}`);
        updateHistory();
    }

    function calculateLog() {
        try {
            const number = parseFloat(currentInput);
            if (number <= 0) throw new Error('Недопустимое значение');
            const result = Math.log(number);
            history.push(`log(${number}) = ${result.toFixed(6)}`);
            currentInput = result.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function calculateFactorial() {
        try {
            const number = parseInt(currentInput);
            if (number < 0 || !Number.isInteger(number)) throw new Error('Недопустимое значение');
            let result = 1;
            for (let i = 2; i <= number; i++) {
                result *= i;
            }
            history.push(`${number}! = ${result}`);
            currentInput = result.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    function calculateEntropy() {
        try {
            const probabilities = prompt('Введите вероятности через запятую (например, 0.5, 0.3, 0.2):').split(',').map(parseFloat);
            if (probabilities.some(isNaN) || probabilities.some(p => p < 0 || p > 1) || Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) > 0.01) {
                throw new Error('Некорректные вероятности');
            }
            let entropy = 0;
            for (let p of probabilities) {
                if (p > 0) entropy -= p * Math.log2(p);
            }
            history.push(`Энтропия: ${probabilities.join(', ')} = ${entropy.toFixed(4)}`);
            currentInput = entropy.toString();
            updateDisplay();
            updateHistory();
        } catch (error) {
            currentInput = 'Ошибка';
            updateDisplay();
            setTimeout(clearAll, 1000);
        }
    }

    // Обработка клавиатуры
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key >= '0' && key <= '9' || key === '.') {
            appendToDisplay(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            appendToDisplay(key);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Escape') {
            clearAll();
        } else if (key === '%') {
            appendPercent('%');
        }
    });

    updateButtons();
});