document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById('connect-btn');
    const statusText = document.getElementById('connection-status');
    const ipInput = document.getElementById('ip-input');
  
    const ATTENDANCE = document.getElementById('attendance-value');
    const QUESTIONS = document.getElementById('questions-value');
    const UNDERSTAND = document.getElementById('understand-value');
  
    let RP5_API_BASE = "";
    let isConnected = false;
    let pollInterval;
  
    async function checkRP5Connection() {
      try {
        const res = await fetch(`${RP5_API_BASE}?_=${Date.now()}`);
        if (!res.ok) throw new Error("Bad response");
  
        const data = await res.json();
        console.log("Fetched data:", data);
  
        updateConnectionStatus(true);
        updateLiveData(data);
  
        if (!isConnected) {
          isConnected = true;
          startPolling();
        }
  
      } catch (error) {
        console.error("Connection error:", error);
        updateConnectionStatus(false);
        stopPolling();
      }
    }
  
    function updateConnectionStatus(connected) {
      if (connected) {
        statusText.textContent = "Connected ✅";
        statusText.classList.add("connected");
        statusText.classList.remove("disconnected", "error");
      } else {
        statusText.textContent = "Not connected";
        statusText.classList.remove("connected");
        statusText.classList.add("disconnected");
      }
    }
  
    function updateLiveData(data) {
      animateValueChange(ATTENDANCE, data.attendance);
      animateValueChange(QUESTIONS, data.questions);
      animateValueChange(UNDERSTAND, data.understand);
    }
  
    function animateValueChange(spanElement, newValue) {
      const wrapper = spanElement.closest(".value");
      if (spanElement.textContent !== String(newValue)) {
        spanElement.textContent = newValue;
        wrapper.classList.remove("pulse");
        void wrapper.offsetWidth;
        wrapper.classList.add("pulse");
        setTimeout(() => wrapper.classList.remove("pulse"), 600);
      }
    }
  
    function startPolling() {
      pollInterval = setInterval(checkRP5Connection, 1000);
    }
  
    function stopPolling() {
      clearInterval(pollInterval);
      pollInterval = null;
      isConnected = false;
    }
  
    connectBtn.addEventListener('click', () => {
      const ip = ipInput.value.trim();
      if (!ip) {
        alert("Please enter the RP5 IP address.");
        return;
      }
  
      // ✅ CORRECT ROUTE
      RP5_API_BASE = `http://${ip}:5050/data`;
      checkRP5Connection();
    });
  });
  