const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const resultText = document.getElementById("result");
const amountInput = document.getElementById("amount");
const swapBtn = document.getElementById("swap"); // opcional se existir

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

function formatMoney(value, currency) {
  // para cripto (BTC/ETH) a AwesomeAPI retorna preço em moeda fiduciária; mostramos com até 8 casas
  const isCrypto = currency === "BTC" || currency === "ETH";
  return new Intl.NumberFormat("pt-BR", {
    style: isCrypto ? "decimal" : "currency",
    currency: isCrypto ? undefined : currency,
    maximumFractionDigits: isCrypto ? 8 : 2,
    minimumFractionDigits: isCrypto ? 2 : 2,
  }).format(value);
}

async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    resultText.textContent = "Digite um valor válido.";
    return;
  }
  if (from === to) {
    resultText.textContent = `${formatMoney(amount, to)} (mesma moeda)`;
    return;
  }

  try {
    resultText.textContent = "Convertendo...";
    const url = `https://economia.awesomeapi.com.br/last/${from}-${to}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha na requisição");
    const data = await response.json();
    const key = `${from}${to}`;
    const quote = data[key];
    if (!quote || !quote.bid) throw new Error("Par de moedas não disponível");

    const rate = parseFloat(quote.bid);
    const converted = amount * rate;

    // Exibe: 100 BRL = US$ 18,23 | Cotação: 0,1823
    resultText.textContent =
      `${formatMoney(amount, from)} = ${formatMoney(converted, to)} ` +
      `| Cotação: ${rate}`;
  } catch (error) {
    console.error(error);
    resultText.textContent = "Erro ao buscar taxa de câmbio.";
  }
}

// Eventos extras para UX melhor
populateSelects();
document.querySelector("button[onclick='convert()']")?.addEventListener("click", convert);
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convert();
});

// Botão de inverter (opcional)
swapBtn?.addEventListener("click", () => {
  const tmp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tmp;
  if (amountInput.value) convert();
});
