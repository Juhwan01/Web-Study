// worker.js
onmessage = function (e) {
    if (e.data === "start") {
      this.intervalId = setInterval(() => {
        postMessage(new Date().toLocaleString())
      }, 1000)
    }
    if (e.data === "stop") {
      clearInterval(this.intervalId)
    }
  }