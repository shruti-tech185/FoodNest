document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // FOODNEST JAVASCRIPT
    // ==========================================

    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-button");
    const restaurantCards = document.querySelectorAll(".restaurant-card");
    const categories = document.querySelectorAll(".category");
    const loginButton = document.querySelector(".login-btn");
    const signupButton = document.querySelector(".signup-btn");


    // ==========================================
    // 1. SEARCH RESTAURANTS
    // ==========================================

    function searchRestaurants() {

        const value = searchInput.value
            .toLowerCase()
            .trim();

        let found = false;

        restaurantCards.forEach(function (card) {

            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {
                card.style.display = "";
                found = true;
            } else {
                card.style.display = "none";
            }

        });

        // Scroll to restaurant section
        const restaurantSection =
            document.querySelector("#restaurants");

        if (restaurantSection && value !== "") {
            restaurantSection.scrollIntoView({
                behavior: "smooth"
            });
        }

        if (!found && value !== "") {
            showNotification(
                "No restaurant found for \"" + value + "\""
            );
        }
    }


    if (searchButton) {
        searchButton.addEventListener(
            "click",
            searchRestaurants
        );
    }


    // Search using Enter key

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    searchRestaurants();
                }

            }
        );

    }


    // ==========================================
    // 2. CATEGORY FILTER
    // ==========================================

    categories.forEach(function (category) {

        category.addEventListener(
            "click",
            function () {

                const categoryName =
                    category.querySelector("h3")
                        .innerText
                        .toLowerCase();

                let found = false;

                restaurantCards.forEach(function (card) {

                    const cardText =
                        card.innerText.toLowerCase();

                    if (
                        cardText.includes(categoryName)
                    ) {

                        card.style.display = "";
                        found = true;

                    } else {

                        card.style.display = "none";

                    }

                });


                const restaurantSection =
                    document.querySelector("#restaurants");

                if (restaurantSection) {

                    restaurantSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }


                if (!found) {

                    showNotification(
                        "No " +
                        categoryName +
                        " restaurant found."
                    );

                }

            }
        );

    });


    // ==========================================
    // 3. ADD CART BUTTON TO RESTAURANT CARDS
    // ==========================================

    restaurantCards.forEach(function (card) {

        const info = card.querySelector(
            ".restaurant-info"
        );

        if (!info) return;


        const button = document.createElement("button");

        button.innerText = "Add to Cart";

        button.className = "foodnest-cart-btn";


        info.appendChild(button);


        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const name =
                    card.querySelector(
                        ".restaurant-name"
                    ).innerText;

                const priceText =
                    card.querySelector(
                        ".restaurant-price"
                    ).innerText;


                addToCart(name, priceText);

            }
        );

    });


    // ==========================================
    // 4. CART SYSTEM
    // ==========================================

    let cart = [];


    function addToCart(name, priceText) {

        let price = 0;

        const match =
            priceText.match(/₹(\d+)/);

        if (match) {
            price = parseInt(match[1]);
        }


        const existing =
            cart.find(function (item) {

                return item.name === name;

            });


        if (existing) {

            existing.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();

        showNotification(
            name + " added to cart 🛒"
        );

    }


    // ==========================================
    // 5. CREATE CART ICON
    // ==========================================

    const headerButtons =
        document.querySelector(".header-buttons");


    if (headerButtons) {

        const cartButton =
            document.createElement("button");

        cartButton.className =
            "foodnest-cart-icon";

        cartButton.innerHTML =
            "🛒 Cart <span>0</span>";


        headerButtons.insertBefore(
            cartButton,
            headerButtons.firstChild
        );


        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    // ==========================================
    // 6. UPDATE CART COUNT
    // ==========================================

    function updateCart() {

        let totalItems = 0;

        cart.forEach(function (item) {

            totalItems += item.quantity;

        });


        const cartCount =
            document.querySelector(
                ".foodnest-cart-icon span"
            );


        if (cartCount) {

            cartCount.innerText =
                totalItems;

        }

    }


    // ==========================================
    // 7. CART POPUP
    // ==========================================

    function openCart() {

        let existingPopup =
            document.querySelector(
                ".foodnest-cart-popup"
            );


        if (existingPopup) {
            existingPopup.remove();
        }


        const popup =
            document.createElement("div");

        popup.className =
            "foodnest-cart-popup";


        let html = `
            <div class="foodnest-cart-box">

                <button class="foodnest-close">
                    ×
                </button>

                <h2>Your Cart 🛒</h2>
        `;


        if (cart.length === 0) {

            html += `
                <div class="empty-cart">
                    <div>🛍️</div>
                    <p>Your cart is empty</p>
                    <small>
                        Add delicious food to continue.
                    </small>
                </div>
            `;

        } else {

            let total = 0;


            cart.forEach(function (item, index) {

                total +=
                    item.price *
                    item.quantity;


                html += `
                    <div class="cart-row">

                        <div>
                            <strong>
                                ${item.name}
                            </strong>

                            <p>
                                ₹${item.price}
                                × ${item.quantity}
                            </p>
                        </div>

                        <div class="cart-actions">

                            <button
                                onclick="decreaseFood(${index})">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="increaseFood(${index})">
                                +
                            </button>

                            <button
                                onclick="removeFood(${index})">
                                Remove
                            </button>

                        </div>

                    </div>
                `;

            });


            html += `
                <div class="cart-total">
                    <strong>Total</strong>
                    <strong>₹${total}</strong>
                </div>

                <button
                    class="checkout-button"
                    onclick="checkoutFood()">
                    Proceed to Checkout
                </button>
            `;

        }


        html += `
            </div>
        `;


        popup.innerHTML = html;

        document.body.appendChild(popup);


        popup.querySelector(
            ".foodnest-close"
        ).addEventListener(
            "click",
            function () {

                popup.remove();

            }
        );

    }


    // ==========================================
    // 8. CART QUANTITY FUNCTIONS
    // ==========================================

    window.increaseFood = function (index) {

        cart[index].quantity++;

        updateCart();

        openCart();

    };


    window.decreaseFood = function (index) {

        cart[index].quantity--;


        if (cart[index].quantity <= 0) {

            cart.splice(index, 1);

        }


        updateCart();

        openCart();

    };


    window.removeFood = function (index) {

        cart.splice(index, 1);

        updateCart();

        openCart();

    };


    // ==========================================
    // 9. CHECKOUT
    // ==========================================

    window.checkoutFood = function () {

        if (cart.length === 0) {

            showNotification(
                "Your cart is empty."
            );

            return;

        }


        alert(
            "Thank you for choosing FoodNest! 🎉\n\n" +
            "Your order has been placed successfully."
        );


        cart = [];

        updateCart();


        const popup =
            document.querySelector(
                ".foodnest-cart-popup"
            );


        if (popup) {
            popup.remove();
        }

    };


    // ==========================================
    // 10. LOGIN / SIGN UP POPUP
    // ==========================================

    function openLoginPopup(title) {

        const oldPopup =
            document.querySelector(
                ".foodnest-login-popup"
            );


        if (oldPopup) {
            oldPopup.remove();
        }


        const popup =
            document.createElement("div");

        popup.className =
            "foodnest-login-popup";


        popup.innerHTML = `

            <div class="foodnest-login-box">

                <button class="foodnest-login-close">
                    ×
                </button>

                <div class="login-logo">
                    FoodNest
                </div>

                <h2>
                    ${title}
                </h2>

                <p>
                    ${title === "Create your account"
                        ? "Join FoodNest and discover amazing food."
                        : "Welcome back! Please login to continue."
                    }
                </p>

                ${
                    title === "Create your account"
                    ? `
                        <input
                            type="text"
                            placeholder="Full Name"
                            class="login-input"
                        >
                    `
                    : ""
                }

                <input
                    type="email"
                    placeholder="Email address"
                    class="login-input"
                >

                <input
                    type="password"
                    placeholder="Password"
                    class="login-input"
                >

                <button class="login-submit">
                    ${title === "Create your account"
                        ? "Create Account"
                        : "Login"
                    }
                </button>

                <small>
                    This is a demo login for your FoodNest project.
                </small>

            </div>

        `;


        document.body.appendChild(popup);


        popup.querySelector(
            ".foodnest-login-close"
        ).addEventListener(
            "click",
            function () {

                popup.remove();

            }
        );


        popup.querySelector(
            ".login-submit"
        ).addEventListener(
            "click",
            function () {

                const email =
                    popup.querySelector(
                        'input[type="email"]'
                    );


                const password =
                    popup.querySelector(
                        'input[type="password"]'
                    );


                if (
                    !email.value.trim() ||
                    !password.value.trim()
                ) {

                    showNotification(
                        "Please fill all details."
                    );

                    return;

                }


                showNotification(
                    title === "Create your account"
                        ? "Account created successfully! 🎉"
                        : "Login successful! 👋"
                );


                popup.remove();

            }
        );

    }


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            function () {

                openLoginPopup("Login to FoodNest");

            }
        );

    }


    if (signupButton) {

        signupButton.addEventListener(
            "click",
            function () {

                openLoginPopup(
                    "Create your account"
                );

            }
        );

    }


    // ==========================================
    // 11. NOTIFICATION
    // ==========================================

    function showNotification(message) {

        const old =
            document.querySelector(
                ".foodnest-notification"
            );


        if (old) {
            old.remove();
        }


        const notification =
            document.createElement("div");

        notification.className =
            "foodnest-notification";


        notification.innerText =
            message;


        document.body.appendChild(
            notification
        );


        setTimeout(function () {

            notification.classList.add(
                "show"
            );

        }, 10);


        setTimeout(function () {

            notification.classList.remove(
                "show"
            );


            setTimeout(function () {

                notification.remove();

            }, 300);

        }, 2500);

    }


    // ==========================================
    // 12. NAVIGATION
    // ==========================================

    document.querySelectorAll(
        ".navbar a"
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    link.getAttribute("href");


                if (
                    target &&
                    target.startsWith("#")
                ) {

                    const section =
                        document.querySelector(
                            target
                        );


                    if (section) {

                        event.preventDefault();

                        section.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }

            }
        );

    });


    // ==========================================
    // 13. EXPLORE RESTAURANTS BUTTON
    // ==========================================

    const exploreButton =
        document.querySelector(
            ".discover-button"
        );


    if (exploreButton) {

        exploreButton.addEventListener(
            "click",
            function () {

                const section =
                    document.querySelector(
                        "#restaurants"
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    // ==========================================
    // 14. FEATURE CARDS
    // ==========================================

    document.querySelectorAll(
        ".feature-card"
    ).forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                const feature =
                    card.querySelector("h3")
                        .innerText;


                showNotification(
                    feature +
                    " feature selected."
                );

            }
        );

    });


    // ==========================================
    // 15. ESC KEY CLOSE
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(
                        ".foodnest-cart-popup, .foodnest-login-popup"
                    )
                    .forEach(function (popup) {

                        popup.remove();

                    });

            }

        }
    );


});
