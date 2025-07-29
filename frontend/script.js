document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const ip = document.getElementById('ip').value;
  const captcha = grecaptcha.getResponse();

  if (!captcha) {
    alert("Please verify CAPTCHA");
    return;
  }

  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, ip, captcha })
  });

  const data = await res.json();
  alert(data.message || 'Login Attempt Sent');

  // Update chart
  drawChart(data.count);
});

function drawChart(count) {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Login Attempts'],
      datasets: [{
        label: '# of Attempts',
        data: [count],
        backgroundColor: ['rgba(255, 99, 132, 0.6)']
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
