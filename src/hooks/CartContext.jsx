import { useContext, createContext, useEffect, useState, } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
    const [cartProducts, setCartProducts] = useState([])

    const putProductOnCart = (product) => {
        const cartIndex = cartProducts.findIndex((prd) => prd.id === product.id);

        let newProdutsOnCart = [];

        if (cartIndex >= 0) {
            newProdutsOnCart = cartProducts;

            newProdutsOnCart[cartIndex].quantity =
                newProdutsOnCart[cartIndex].quantity + 1;

            setCartProducts(newProdutsOnCart);
        } else {
            product.quantity = 1;
            newProdutsOnCart = [...cartProducts, product];
            setCartProducts(newProdutsOnCart);
        }

        updateLocalStorage(newProdutsOnCart);
    };

    const clearCart = () => {
        setCartProducts([]);

        updateLocalStorage([]);
    };

    const deleteProduct = (productId) => {
        const newCart = cartProducts.filter((prd => prd.id !== productId));

        setCartProducts(newCart);
        updateLocalStorage(newCart);
    }

    const increaseProduct = (productId) => {
        const newCart = cartProducts.map(prd => {
            return prd.id === productId ? { ...prd, quantity: prd.quantity + 1 } : prd;
        });

        setCartProducts(newCart);
        updateLocalStorage(newCart);
    }

    const decreaseProduct = (productId) => {
        const cartIndex = cartProducts.findIndex((prd) => prd.id === productId);

        if (cartProducts[cartIndex].quantity > 1) {
            const newCart = cartProducts.map(prd => {
                return prd.id === productId ? { ...prd, quantity: prd.quantity - 1 } : prd;
            });

            setCartProducts(newCart);
            updateLocalStorage(newCart);
        } else {
            deleteProduct(productId)
        }
    };

    const updateLocalStorage = (products) => {
        localStorage.setItem('devburger:cartInfo', JSON.stringify(products));
    }
    useEffect(() => {
        const clientCartData = localStorage.getItem('devburger:cartInfo')

        if (clientCartData) {
            setCartProducts(JSON.parse(clientCartData));
        }
    }, []);

    return (
        <CartContext.Provider value={{ cartProducts, putProductOnCart, clearCart, deleteProduct, increaseProduct, decreaseProduct }}>


            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used with a context!')
    }
    return context;
}