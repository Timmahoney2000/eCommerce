import { useMemo, useState } from "react";
import { Products, Product, Inventory } from ".";
// inventory is already imported
import "./styles.css";
import "./tailwind.output.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
//import "./Carousel.js";
//import "./CarouselData.js";

/* Homework:

For each product, make an image carousel

Bonus: Put a static image as a cart column
Hint: Add image/images as part of the Product data structure
*/

interface CartItem {
  id: string;
  quantity: number;
}

type Cart = CartItem[];

interface Props {
  products: Products;
  inventory: Inventory;
}

function LinkButton({
  onClick,
  id
}: {
  onClick: (id: string) => void;
  id: string;
}) {
  function handleClick() {
    onClick(id);
  }
  return (
    <button
      className="text-red-500 underline hover:text-zinc-600"
      // changed color blue to red. text color change to zinc on mouse hover
      onClick={handleClick}
      type="button"
    >
      Remove
    </button>
  );
}

export default function App(props: Props) {
  let [cart, setCart] = useState<Cart>([]);

  const inStock = useMemo(() => {
    return cart.reduce((acc, curr) => {
      acc[curr.id] = curr.quantity < props.inventory[curr.id];

      return acc;
    }, {} as Record<string, boolean>);
  }, [cart, props.inventory]);

  const productLookup = props.products.reduce((acc, curr: Product) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, Product>);

  function addToCart(id: string) {
    const exists = cart.find((c) => c.id === id);
    if (exists) {
      const index = cart.indexOf(exists);
      setCart((c) => {
        const newCart = [...c];
        const newProduct = { ...newCart[index] };
        newProduct.quantity++;
        // && decrement the item's inventory
        newCart[index] = newProduct;
        return newCart;
      });
    } else {
      setCart((c) => {
        const newCart = [...c];
        newCart.push({
          id,
          quantity: 1
        });
        return newCart;
      });
    }
  }

  function removeItem(id: string) {
    const exists = cart.find((c) => c.id === id);
    if (exists) {
      const index = cart.indexOf(exists);
      setCart((c) => {
        const newCart = [...c];
        const newProduct = { ...newCart[index] };
        if (newProduct.quantity > 1) {
          newProduct.quantity--;
          // && re-increment the product's inventory
          newCart[index] = newProduct;
        } else {
          // if theres only one in the cart
          newCart.splice(index, 1);
        }
        return newCart;
      });
    }
  }

  return (
    <div className="bg-slate-200">
      <div className="App p-4">
        <h1 className="text-3xl text-blue-500 mb-4">My Store</h1>

        <h2 className="text-2xl font-bold">Products</h2>
        <ul>
          {props.products.map(({ name, id, description, price }) => (
            // add background image(s) here. Find how to add multiple images in a single className
            <li key={id} className="mt-2 border rounded border-gray-400 p-4">
              <h4 className="font-bold">{name}</h4>

              <p>{description}</p>
              <p>Price: ${price.toFixed(2)}</p>
              {inStock[id] !== false ? (
                <button
                  className="text-blue-500 underline hover:text-violet-600"
                  // added color blue to text and underline. increased link visibility
                  onClick={() => {
                    addToCart(id);
                  }}
                  type="button"
                >
                  Add To Cart
                </button>
              ) : (
                <p className="text-red-500">Out Of Stock</p>
              )}
            </li>
          ))}
        </ul>
        {/* add image here. it either connects to the h2 className or in the <table> */}
        <h2 className="text-2xl font-bold mt-4">Cart</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((c, index) => (
              <tr key={c.id}>
                <td>{productLookup[c.id].name}</td>
                <td>{c.quantity}</td>
                <td>${(c.quantity * productLookup[c.id].price).toFixed(2)}</td>
                <td>
                  <LinkButton onClick={removeItem} id={c.id} />
                </td>
              </tr>
            ))}
            <tr>
              <td>TOTAL</td>
              <td></td>
              <td>
                $
                {cart
                  .reduce(
                    (a, c) => a + productLookup[c.id].price * c.quantity,
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
