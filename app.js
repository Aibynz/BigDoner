// Объявляем переменную tg
let tg = window.Telegram.WebApp;
tg.expand();

// Получаем ссылку на контейнер для товаров
const container = document.querySelector('.container');
const cartElement = document.getElementById('cart');

let cart = {}; // Инициализируем корзину

const products = [
  { id: 1, name: "Студенческий донер", price: 950, image: "1.jpeg" },
  { id: 2, name: "Стандартный донер", price: 1100, image: "2.jpeg" },
  { id: 3, name: "Говяжий донер", price: 1350, image: "3.jpeg" },
  { id: 4, name: "Острый донер", price: 1500, image: "4.jpeg" },
  { id: 5, name: "Coca Cola 1л", price: 500, image: "15.jpeg" },
  { id: 6, name: "Турецкий айран", price: 250, image: "16.jpeg" }
];

// Отображаем товары динамически
products.forEach(product => {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  itemDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="img">
    <p>${product.name} - ${product.price} KZT</p>
    <div class="quantity-control">
      <button class="btn minus" data-id="${product.id}">-</button>
      <span class="quantity" data-id="${product.id}">0</span>
      <button class="btn plus" data-id="${product.id}">+</button>
    </div>
  `;
  container.appendChild(itemDiv);
});

// Добавляем обработчики событий для кнопок количества
container.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) {
    const productId = parseInt(event.target.dataset.id);
    const quantitySpan = event.target.parentElement.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);

    if (event.target.classList.contains('plus')) {
      currentQuantity++;
    } else if (event.target.classList.contains('minus') && currentQuantity > 0) {
      currentQuantity--;
    }

    quantitySpan.textContent = currentQuantity;
    cart[productId] = currentQuantity;

    updateCartDisplay();
    updateMainButton(); 
  }
});

// Функция обновления отображения корзины
function updateCartDisplay() {
  cartElement.innerHTML = '<h3>Корзина:</h3>';
  let total = 0;
  for (const productId in cart) {
    if (cart[productId] > 0) {
      const product = products.find(p => p.id === parseInt(productId));
      const itemTotal = product.price * cart[productId];
      total += itemTotal;
      cartElement.innerHTML += `<p>${product.name} x ${cart[productId]} = ${itemTotal} KZT</p>`;
    }
  }
  cartElement.innerHTML += `<p>Итого: ${total} KZT</p>`; 
}

// Функция обновления основной кнопки
function updateMainButton() {
    if (Object.keys(cart).some(key => cart[key] > 0)) {
      tg.MainButton.setText(`Оформить заказ (${calculateTotal()} KZT)`);
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify(cart));
      });
    } else {
      tg.MainButton.hide();
    }
  }
  
  

// Функция для подсчета общей суммы в корзине
function calculateTotal() {
  return Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p.id === parseInt(productId));
    return sum + product.price * quantity;
  }, 0);
}

// Обработчик событий для запуска приложения после загрузки
tg.ready(() => {
  console.log("WebApp is ready");
});
