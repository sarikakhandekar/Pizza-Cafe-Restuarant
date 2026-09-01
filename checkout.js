/* =========================
   LOAD CART DATA
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderList = document.getElementById("orderItemsList");
const itemTotalEl = document.getElementById("itemTotal");
const grandTotalEl = document.getElementById("grandTotal");
const btnAmount = document.getElementById("btnAmount");
const tipAmountEl = document.getElementById("tipAmount");

let deliveryFee = 40;
let platformFee = 5;
let tipAmount = 30;
let discount = 0;

/* =========================
   RENDER CART
========================= */
function renderCart() {
  orderList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    orderList.innerHTML += `
      <div class="order-item">
        <span>${item.name} × ${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
      </div>
    `;
  });

  itemTotalEl.textContent = `₹${total}`;
  calculateTotal(total);
}

function calculateTotal(itemTotal) {
  let finalTotal =
    itemTotal -
    discount +
    deliveryFee +
    platformFee +
    tipAmount;

  grandTotalEl.textContent = `₹${finalTotal}`;
  btnAmount.textContent = `₹${finalTotal}`;
}

/* =========================
   COUPON
========================= */
document.getElementById("applyCouponBtn").addEventListener("click", () => {
  const code = document.getElementById("couponCode").value;

  if (code === "WELCOME50") {
    discount = 100;
    document.getElementById("couponMessage").textContent =
      "✅ Coupon applied successfully";
  } else {
    discount = 0;
    document.getElementById("couponMessage").textContent =
      "❌ Invalid coupon";
  }
  renderCart();
});

/* =========================
   TIP
========================= */
document.querySelectorAll(".tip-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    tipAmount = Number(btn.dataset.tip);
    tipAmountEl.textContent = `₹${tipAmount}`;
    renderCart();
  });
});

/* =========================
   FORM VALIDATION
========================= */
document.getElementById("proceedPaymentBtn").addEventListener("click", () => {
  const name = document.getElementById("fullName").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  if (!name || /\d/.test(name)) {
    alert("Please enter valid name");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    alert("Mobile number must be 10 digits");
    return;
  }

  if (!/^\d{6}$/.test(pincode)) {
    alert("Pincode must be 6 digits");
    return;
  }

  alert("Validation successful → Redirecting to payment");
  window.location.href = "payment.html";
});

/* =========================
   INIT
========================= */
renderCart();
