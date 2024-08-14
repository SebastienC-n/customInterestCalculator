document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loan-form');
    const addPaymentButton = document.getElementById('add-payment');
    const separatePaymentsDiv = document.getElementById('separate-payments');

    let paymentCount = 0;

    addPaymentButton.addEventListener('click', () => {
        paymentCount++;
        const paymentDiv = document.createElement('div');
        paymentDiv.className = 'payment-entry';
        paymentDiv.innerHTML = `
            <label for="start-date-${paymentCount}">Start Date:</label>
            <input type="date" id="start-date-${paymentCount}" required>

            <label for="end-date-${paymentCount}">End Date:</label>
            <input type="date" id="end-date-${paymentCount}" required>

            <label for="amount-${paymentCount}">Amount ($):</label>
            <input type="number" id="amount-${paymentCount}" step="0.01" required>
            <button type="button" class="remove-payment">Remove</button>
        `;
        separatePaymentsDiv.appendChild(paymentDiv);
    });

    separatePaymentsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-payment')) {
            e.target.parentElement.remove();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const principal = parseFloat(document.getElementById('principal').value);
        const annualRate = parseFloat(document.getElementById('annual-rate').value) / 100;
        const startDate = new Date(document.getElementById('start-date').value);
        const endDate = new Date(document.getElementById('end-date').value);
        const interestType = document.getElementById('interest-type').value;

        if (isNaN(principal) || isNaN(annualRate) || !startDate || !endDate || principal <= 0 || annualRate <= 0 || startDate >= endDate) {
            alert('Please enter valid input values.');
            return;
        }

        const months = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        const monthlyRate = annualRate / 12;
        let monthlyPayment, totalPayments, totalInterest;

        if (interestType === 'simple') {
            totalPayments = principal * (1 + annualRate * (months / 12));
            totalInterest = totalPayments - principal;
            monthlyPayment = totalPayments / months;
        } else if (interestType === 'compound') {
            const n = 12; // Compounded monthly
            const totalAmount = principal * Math.pow((1 + annualRate / n), n * (months / 12));
            totalPayments = totalAmount;
            totalInterest = totalPayments - principal;
            monthlyPayment = totalPayments / months;
        } else if (interestType === 'variable') {
            // For variable interest, implement your logic here.
            // This is a placeholder example:
            totalPayments = principal; // Placeholder
            totalInterest = 0; // Placeholder
            monthlyPayment = principal / months; // Placeholder
        }

        // Process separate payments
        const separatePayments = document.querySelectorAll('.payment-entry');
        separatePayments.forEach(paymentEntry => {
            const paymentStartDate = new Date(paymentEntry.querySelector('input[id^="start-date"]').value);
            const paymentEndDate = new Date(paymentEntry.querySelector('input[id^="end-date"]').value);
            const amount = parseFloat(paymentEntry.querySelector('input[id^="amount"]').value);

            if (!isNaN(amount) && amount > 0) {
                const duration = Math.ceil((paymentEndDate - paymentStartDate) / (1000 * 60 * 60 * 24 * 30)); // Approximate duration in months
                const separatePayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
                totalPayments += separatePayment * duration;
                totalInterest += (separatePayment * duration) - amount;
            }
        });

        document.getElementById('monthly-payment').textContent = `Monthly Payment: $${monthlyPayment.toFixed(2)}`;
        document.getElementById('total-payment').textContent = `Total Payment: $${totalPayments.toFixed(2)}`;
        document.getElementById('total-interest').textContent = `Total Interest: $${totalInterest.toFixed(2)}`;
    });
});
