import React from 'react';

const Cart = ({ cart, onRemove, onBook }) => {
    return (
        <div>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>
                            {item.name} - ${item.price} x {item.quantity}
                            <button onClick={() => onRemove(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            {cart.length > 0 && <button onClick={onBook}>Book Ice Cream</button>}
        </div>
    );
};

export default Cart;
