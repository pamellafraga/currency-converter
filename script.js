const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultText = document.getElementById("result");

// Moedas mais comuns
const currencies = ["BRL", "USD", "EUR", "GBP", "ARS", "JPY", "BTC", "ETH"];

function populateSelects() {
  currencies.forEach((currency) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option2.value = currency;
    option1.textContent = option2.textContent = currency;
    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });

  fromSelect.value = "BRL";
  toSelect.value = "USD";
}

async function convert() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = "Digite um valor válido.";
    return;
  }

  if (from === to) {
    resultText.textContent = `Mesma moeda selecionada. Resultado: ${amount.toFixed(2)} ${to}`;
    return;
  }

  try {
    const url = `https://economia.awesomeapi.com.br/last/${from}-${to}`;
    const response = await fetch(url);
    const data = await response.json();
    const key = `${from}${to}`;
    const rate = parseFloat(data[key].bid);

    const converted = amount * rate;
    resultText.textContent = `${amount.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`;
  } catch (error) {
    resultText.textContent = "Erro ao buscar taxa de câmbio.";
    console.error(error);
  }
}

populateSelects();
