let selectedMain = null;
let selectedAccomp1 = null;
let selectedAccomp2 = null;
let selectedDessert = null;
let currentMealType = '';
let currentMenu = [];

const breakfast = [
  { name: "Tostadas con mermelada", price: 3 },
  { name: "Cereal con leche", price: 2.5 },
  { name: "Fruta fresca", price: 2.8 }
];

const lunchDinnerBase = [
  { name: "Pollo a la parrilla", basePrice: 7 },
  { name: "Salmón a la parrilla", basePrice: 8 },
  { name: "Risotto de vegetales", basePrice: 5 }
];

const accompaniments = [
  { name: "Endivias a la plancha", price: 3 },
  { name: "Cebollitas glaseadas", price: 2.5 },
  { name: "Brochetas de verduras", price: 2.5 }
];

const desserts = [
  { name: "Tarta de queso", price: 3 },
  { name: "Yogurt", price: 2.5 },
  { name: "Arroz con leche", price: 2 }
];

const comments = [
  "¡Excelente elección!",
  "Esa opción es muy popular entre nuestros clientes.",
  "El chef recomienda este plato.",
  "Una combinación deliciosa, ¡disfrútalo!",
  "Buena elección, queda muy bien con los acompañamientos."
];

// Muestra un comentario aleatorio
function showComment() {
  const comment = comments[Math.floor(Math.random() * comments.length)];
  document.getElementById("comentarios").innerHTML = `<p><strong>Comentario:</strong> ${comment}</p>`;
}

// Mostrar opciones de menú
function displayMenuOptions(menuArray, message, menuType) {
  let optionHTML = `<p>${message}</p><ul>`;
  menuArray.forEach(item => {
    optionHTML += `<li><button onclick="selectOption('${item.name}', '${menuType}')">${item.name} ($${item.price})</button></li>`;
  });
  optionHTML += '</ul>';
  document.getElementById("menu").innerHTML = optionHTML;
}

// Buscar plato en menú
function findDishInMenu(name, menu) {
  return menu.find(item => item.name === name);
}

// Obtener menú según la hora introducida
function getMenuByHour(hour) {
  if (hour >= 6 && hour < 12) {
    return { menu: breakfast, type: "Desayuno" };
  } else if (hour >= 12 && hour < 16) {
    const lunchMenu = lunchDinnerBase.map(item => ({
      name: item.name,
      price: item.basePrice
    }));
    return { menu: lunchMenu, type: "Almuerzo" };
  } else if (hour >= 16 && hour <= 23) {
    const dinnerMenu = lunchDinnerBase.map(item => ({
      name: item.name,
      price: (item.basePrice * 1.2).toFixed(2)
    }));
    return { menu: dinnerMenu, type: "Cena" };
  } else {
    alert("Hora fuera del horario de atención (6:00 - 23:00).");
    return null;
  }
}

// Maneja la selección del usuario
function selectOption(selectedItemName, menuType) {
  let selectedDish;

  if (menuType === 'main') {
    selectedDish = findDishInMenu(selectedItemName, currentMenu);
    selectedMain = selectedDish;
    document.getElementById("menu").innerHTML = `<p>Has seleccionado: ${selectedDish.name} ($${selectedDish.price})</p>`;
    showComment();

    if (currentMealType === "Desayuno") {
      showSummary();
    } else {
      displayMenuOptions(accompaniments, "Elige tu primer acompañamiento", 'accomp1');
    }

  } else if (menuType === 'accomp1') {
    selectedDish = findDishInMenu(selectedItemName, accompaniments);
    selectedAccomp1 = selectedDish;
    document.getElementById("menu").innerHTML += `<p>Primer acompañamiento: ${selectedDish.name} ($${selectedDish.price})</p>`;
    showComment();
    displayMenuOptions(accompaniments, "Elige tu segundo acompañamiento", 'accomp2');

  } else if (menuType === 'accomp2') {
    selectedDish = findDishInMenu(selectedItemName, accompaniments);
    selectedAccomp2 = selectedDish;
    document.getElementById("menu").innerHTML += `<p>Segundo acompañamiento: ${selectedDish.name} ($${selectedDish.price})</p>`;
    showComment();
    displayMenuOptions(desserts, "Elige tu postre", 'dessert');

  } else if (menuType === 'dessert') {
    selectedDish = findDishInMenu(selectedItemName, desserts);
    selectedDessert = selectedDish;
    document.getElementById("menu").innerHTML += `<p>Postre: ${selectedDish.name} ($${selectedDish.price})</p>`;
    showComment();
    showSummary();
  }
}

// Muestra el resumen final del pedido
function showSummary() {
  let total = parseFloat(selectedMain.price);

  let summaryHTML = `
    <h3>Resumen de tu pedido (${currentMealType}):</h3>
    <ul>
      <li><strong>Plato:</strong> ${selectedMain.name} - $${selectedMain.price}</li>
  `;

  if (currentMealType !== "Desayuno") {
    total += selectedAccomp1.price + selectedAccomp2.price + selectedDessert.price;
    summaryHTML += `
      <li><strong>Acompañamientos:</strong> ${selectedAccomp1.name} y ${selectedAccomp2.name} - $${(selectedAccomp1.price + selectedAccomp2.price).toFixed(2)}</li>
      <li><strong>Postre:</strong> ${selectedDessert.name} - $${selectedDessert.price}</li>
    `;
  }

  summaryHTML += `</ul><p><strong>Total:</strong> $${total.toFixed(2)}</p>`;
  document.getElementById("resumen").innerHTML = summaryHTML;
}

// Función principal
function showMenu() {
  selectedMain = null;
  selectedAccomp1 = null;
  selectedAccomp2 = null;
  selectedDessert = null;

  let inputHour = prompt("¿Qué hora es? (Introduce la hora en formato 24h, ej: 9 para 9:00 am)");
  inputHour = parseInt(inputHour);

  if (isNaN(inputHour)) {
    alert("Por favor introduce una hora válida (número entre 6 y 23).");
    return;
  }

  const menuData = getMenuByHour(inputHour);

  if (!menuData) return;

  currentMealType = menuData.type;
  currentMenu = menuData.menu;

  document.getElementById("menu").innerHTML = `<h2>Menú de ${currentMealType}</h2><p>Bienvenido a Bottega Diner</p>`;
  displayMenuOptions(currentMenu, `Elige tu ${currentMealType === "Desayuno" ? "plato" : "plato principal"}:`, 'main');

  document.getElementById("comentarios").innerHTML = "";
  document.getElementById("resumen").innerHTML = "";
}
