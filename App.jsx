import React, { useState, useMemo } from "react";

const CATALOG = [
  { id: 1, name: "Клавиатура", price: 80 },
  { id: 2, name: "Монитор", price: 250 },
  { id: 3, name: "Мышь", price: 40 },
  { id: 4, name: "Наушники", price: 120 },
  { id: 5, name: "Ноутбук", price: 900 },
];

const PRICE_LIMIT = 100;

function Showcase({ onAdd }) {
  return (
    <div>
      <h2>Витрина товаров</h2>
      <ul>
        {CATALOG.map((p) => (
          <li key={p.id}>
            {p.name} — {p.price} грн{" "}
            <button onClick={() => onAdd(p)}>В корзину</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart({ items, onChangeQty, onRemove, onAddCustom }) {
  const [onlyExpensive, setOnlyExpensive] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");


  const totals = useMemo(() => {
    console.log("Пересчёт суммы корзины");
    let all = 0;
    let expensive = 0;
    items.forEach((i) => {
      const sum = i.price * i.quantity;
      all += sum;
      if (i.price > PRICE_LIMIT) expensive += sum;
    });
    return { all, expensive };
  }, [items]);

  const visibleItems = onlyExpensive
    ? items.filter((i) => i.price > PRICE_LIMIT)
    : items;

  const total = onlyExpensive ? totals.expensive : totals.all;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!name.trim() || price === "" || numPrice <= 0) {
      alert("Введите название и корректную цену");
      return;
    }
    onAddCustom(name.trim(), numPrice);
    setName("");
    setPrice("");
  };

  return (
    <div>
      <h2>Корзина</h2>

      <label>
        <input
          type="checkbox"
          checked={onlyExpensive}
          onChange={(e) => setOnlyExpensive(e.target.checked)}
        />{" "}
        Показать только товары дороже {PRICE_LIMIT}
      </label>

      {visibleItems.length === 0 ? (
        <p>Нет товаров для отображения.</p>
      ) : (
        <ul>
          {visibleItems.map((i) => (
            <li key={i.id}>
              {i.name} — {i.price} грн × {i.quantity} ={" "}
              {i.price * i.quantity} грн{" "}
              <button onClick={() => onChangeQty(i.id, -1)}>−</button>{" "}
              <button onClick={() => onChangeQty(i.id, 1)}>+</button>{" "}
              <button onClick={() => onRemove(i.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Общая стоимость: {total} грн</h3>

      <h3>Добавить новый товар</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
        <input
          type="number"
          placeholder="Цена"
          min="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />{" "}
        <button type="submit">Добавить в корзину</button>
      </form>
    </div>
  );
}

function Shop() {
  const [items, setItems] = useState([
    { id: 1, name: "Клавиатура", price: 80, quantity: 1 },
    { id: 2, name: "Монитор", price: 250, quantity: 1 },
  ]);

  const handleAddFromShowcase = (product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleAddCustom = (name, price) => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name, price, quantity: 1 },
    ]);
  };

  const handleChangeQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h1>Интернет-магазин</h1>
      <Showcase onAdd={handleAddFromShowcase} />
      <Cart
        items={items}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onAddCustom={handleAddCustom}
      />
    </div>
  );
}

export default Shop;