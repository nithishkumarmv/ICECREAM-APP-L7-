import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserDashboard.css';  // Importing CSS file for styles

const UserDashboard = () => {
    const [iceCreams, setIceCreams] = useState([]);
    const [filteredIceCreams, setFilteredIceCreams] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [orders, setOrders] = useState([]); // New state for storing orders
    const username = 'user1'; // Example username, modify as needed

    // Fetch available ice creams and orders
    useEffect(() => {
        axios.get('http://localhost:5000/api/ice-creams')
            .then(response => {
                setIceCreams(response.data);
                setFilteredIceCreams(response.data);
            })
            .catch(error => console.error('Error fetching ice creams:', error));

        // Fetch user's previous orders
        axios.get(`http://localhost:5000/api/orders/${username}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterAndSortIceCreams(query, sortOrder);
    };

    // Handle sorting order change
    const handleSortChange = (e) => {
        const order = e.target.value;
        setSortOrder(order);
        filterAndSortIceCreams(searchQuery, order);
    };

    // Filter and sort ice creams
    const filterAndSortIceCreams = (query, order) => {
        let filtered = iceCreams.filter(iceCream =>
            iceCream[1].toLowerCase().includes(query)
        );

        if (order === 'asc') {
            filtered.sort((a, b) => a[2] - b[2]);
        } else {
            filtered.sort((a, b) => b[2] - a[2]);
        }

        setFilteredIceCreams(filtered);
    };

    // Add to cart
    const addToCart = (iceCream) => {
        const existingItem = cart.find(item => item.name === iceCream[1]);
        if (existingItem) {
            setCart(cart.map(item =>
                item.name === iceCream[1] ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { name: iceCream[1], price: iceCream[2], quantity: 1 }]);
        }
    };

    // Remove from cart
    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const handleBook = async () => {
        try {
            // Map through the cart to create individual orders
            const orderDetails = cart.map(item => ({
                username,
                ice_cream_name: item.name, // Name of the ice cream
                quantity: item.quantity, // Quantity of the item
                total_price: item.price * item.quantity, // Total price for the item
                date: new Date().toLocaleString(), // Date and time of the order
            }));
    
            console.log("Order Details to send:", orderDetails); // Debugging: Check order details
    
            // Sending each item in the cart separately to the backend
            for (const order of orderDetails) {
                const response = await axios.post('http://localhost:5000/api/orders', order);
                console.log('Order placed:', response.data); // Log each order response
            }
    
            // If successful, clear the cart and update orders
            alert('Order placed successfully!');
            setOrders([orderDetails, ...orders]); // Add new order to the list
            setCart([]); // Clear the cart
        } catch (error) {
            console.error('Error booking order:', error);
            alert('There was an error placing your order. Please try again.');
        }
    };
    
    

    return (
        <div className="dashboard-container">
            <h2>ICE CREAM PARLOR CAFE</h2>
            <h2>Welcome to the user dashboard!</h2>

            {/* Search and Sort Controls */}
            <div className="search-sort-container">
                <input
                    type="text"
                    placeholder="Search ice creams..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                <select value={sortOrder} onChange={handleSortChange} className="sort-dropdown">
                    <option value="asc">Sort by Price: Low to High</option>
                    <option value="desc">Sort by Price: High to Low</option>
                </select>
            </div>

            {/* Available Ice Creams List */}
            <h3>Available Ice Creams</h3>
            <div className="ice-cream-list">
                {filteredIceCreams.length === 0 ? (
                    <p>No ice creams available.</p>
                ) : (
                    filteredIceCreams.map(iceCream => (
                        <div key={iceCream[0]} className="ice-cream-item">
                            <div>
                                <strong>{iceCream[1]}</strong> - ${iceCream[2].toFixed(2)}
                            </div>
                            <button
                                onClick={() => addToCart(iceCream)}
                                className="add-to-cart-btn"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Section */}
            <div className="cart-container">
                <h3>Your Cart</h3>

                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <ul className="cart-items-list">
                            {cart.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <div>
                                        <strong>{item.name}</strong> - {item.quantity} x ${item.price.toFixed(2)}
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="remove-btn">Remove</button>
                                </li>
                            ))}
                        </ul>

                        <div className="total-price">
                            <strong>Total: ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</strong>
                        </div>

                        <button onClick={handleBook} className="book-order-btn">
                            Book Order
                        </button>
                    </div>
                )}
            </div>

            {/* My Orders Section */}
            <h3>My Orders</h3>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order Date</th>
                        <th>Items</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="3">No orders yet.</td>
                        </tr>
                    ) : (
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.date}</td>
                                <td>
                                    <ul>
                                        {order.cart.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    ${order.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserDashboard;