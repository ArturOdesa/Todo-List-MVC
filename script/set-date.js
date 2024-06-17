let datePara = document.querySelector('#date');

function setDate () {
    let today = new Date();
    console.log(today)
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return datePara.textContent = today.toLocaleDateString('en-US', options);
}

setInterval(setDate(), 60000);