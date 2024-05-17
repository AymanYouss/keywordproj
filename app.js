let trendChart; // Define chart outside of function to maintain its state

function fetchTrends() {
    const keyword = document.getElementById('keyword').value;
    makeRequest(keyword);
}

function makeRequest(keyword, retries = 3, delay = 1000) {
    const baseUrl = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://https://keywordproj.vercel.app";
    fetch(`${baseUrl}/trends?keyword=${keyword}`)
        .then(response => {
            if (!response.ok) {
                if (retries > 0) {
                    console.log(`Retrying due to server status ${response.status}... Attempts left: ${retries}`);
                    setTimeout(() => {
                        makeRequest(keyword, retries - 1, delay);
                    }, delay);
                    return null;  // Indicate a retry situation
                }
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.text();  // First convert to text to check if it's JSON
        })
        .then(text => {
            try {
                // Try to parse text as JSON
                return JSON.parse(text);
            } catch (error) {
                if (retries > 0) {
                    console.log(`Retrying due to JSON parsing error... Attempts left: ${retries}`);
                    setTimeout(() => {
                        makeRequest(keyword, retries - 1, delay);
                    }, delay);
                    return null;  // Indicate a retry situation
                }
                console.error("Failed to parse response as JSON:", text);
                throw new Error("Response is not in JSON format");
            }
        })
        .then(data => {
            if (data) {  // Ensure data is not null from a retry
                console.log("Data printed for keyword :");

                const labels = data.default.timelineData.map(item => item.formattedAxisTime);
                const values = data.default.timelineData.map(item => item.value[0]);

                const ctx = document.getElementById('chart').getContext('2d');

                // Check if chart instance exists, destroy if it does
                if (trendChart) {
                    trendChart.destroy();
                }

                trendChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Trend over Time',
                            data: values,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error:', error));
}
