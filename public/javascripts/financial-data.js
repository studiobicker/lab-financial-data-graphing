window.onload = async function() {
  let bitcoinData = await getBitCoinData();
  const bcChart = createDataChart("bcChart", bitcoinData);
  displayExtraValues(bitcoinData);

  const form = document.getElementById("chart-form");
  form.onsubmit = async function(e) {
    e.preventDefault();

    const startdate = document.getElementById("startdate").value;
    const enddate = document.getElementById("enddate").value;

    const currency = document.getElementById("currSelect");
    const selectedCurr = currency.options[currency.selectedIndex].value;

    let apiParams = "";

    if (startdate && enddate) {
      apiParams += apiParams === "" ? "&" : "?";
      apiParams += `start=${startdate}&end=${enddate}`;
    }
    if (selectedCurr) {
      apiParams += apiParams === "" ? "&" : "?";
      apiParams += `currency=${selectedCurr}`;
    }
    bitcoinData = await getBitCoinData(apiParams);
    updateDataChart(bcChart, bitcoinData);
    displayExtraValues(bitcoinData);
  };

  function getBitCoinData(apiParams) {
    debugger;

    return axios
      .get(`http://api.coindesk.com/v1/bpi/historical/close.json${apiParams}`)
      .then(response => {
        debugger;
        return response.data.bpi;
      })
      .catch(err => {
        console.log(err);
      });
  }
  function createDataChart(selector, data) {
    const ctx = document.getElementById(selector).getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            label: "BitCoin Price Index",
            data: Object.values(data),
            backgroundColor: ["rgba(204, 204, 204, 0.2)"],
            borderColor: ["rgba(204, 204, 204, 1)"],
            borderWidth: 1
          }
        ]
      }
    });

    return chart;
  }

  function updateDataChart(chart, data) {
    chart.data.labels = Object.keys(data);
    chart.data.datasets.data = Object.values(data);
    chart.update();
  }

  function displayExtraValues(data) {
    document.getElementById("maxValue").innerHTML = Math.max(
      ...Object.values(data)
    );
    document.getElementById("minValue").innerHTML = Math.min(
      ...Object.values(data)
    );
  }
};
