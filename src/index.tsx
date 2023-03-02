import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// what does the createRoot do? Required to display content to the DOM?

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Inventory {
  [key: string]: number;
}

export type Products = Product[];

const products: Products = [
  {
    id: "baseball",
    name: "Baseball",
    price: 5.5,
    description: "A fucking sweet baseball"
  },
  {
    id: "mitt",
    name: "Catchers Mitt",
    price: 25.99,
    description: "A dank catchers mitt"
  }
];

// I need to connect this variable data to both the addToCart and to the removeItem functions.
// then when each items count reaches 0, it should render "Out Of Stock" to the DOM & deactivate the add to cart button
const inventory: Inventory = {
  // do I need to add an ID/key here (ie. id:baseball) or is baseball the ID/key itself & can be called that way?
  baseball: 5,
  mitt: 9
};

root.render(
  <StrictMode>
    <App products={products} inventory={inventory} />
  </StrictMode>
);
