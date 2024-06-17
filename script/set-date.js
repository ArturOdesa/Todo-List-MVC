const datePara = document.querySelector('#date');
const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
datePara.textContent = new Date().toLocaleDateString('en-US', options);

    setInterval(() => {
        datePara.textContent = new Date().toLocaleDateString('en-US', options);
    }, 60000)
