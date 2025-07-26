const loginCounts = [];
const times = [];

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const token = grecaptcha.getResponse();

  const data = {
    username,
    password,
    token,
    timestamp: new Date().toISOString()
  };

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  const resultBox = document.getElementById("result");

  if (result.flagged) {
    resultBox.innerText = "⚠️ Suspicious Login Detected!";
    resultBox.style.color = "red";
    new Audio("alert.mp3").play();
  } else {
    resultBox.innerText = "✅ Login Successful!";
    resultBox.style.color = "green";
  }

  loginCounts.push(result.loginCount);
  times.push(new Date().toLocaleTimeString());
  chart.update();
});

const ctx = document.getElementById("loginChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: times,
    datasets: [{
      label: "Login Attempts",
      data: loginCounts,
      borderColor: "red",
      fill: false
    }]
  },
});
