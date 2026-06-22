"use client";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useCheckout } from "@/features/orders/hooks/use-checkout";
import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { Armchair, Banknote, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  // 1. Guard page (only authenticated users can checkout)
  const { isAuthenticated, isHydrated } = useAuthGuard();

  // 2. Fetch cart details
  const { data: cart, isLoading: isCartLoading } = useCart();

  // 3. Instantiate checkout form handler
  const {
    shippingName,
    setShippingName,
    shippingEmail,
    setShippingEmail,
    shippingPhone,
    setShippingPhone,
    shippingAddress,
    setShippingAddress,
    shippingCity,
    setShippingCity,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    saveToProfile,
    setSaveToProfile,
    errors,
    isProcessing,
    handlePlaceOrder,
  } = useCheckout();

  if (!isHydrated || isCartLoading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            background: "var(--bg-base)",
          }}
        >
          <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)" }}>
            Loading checkout...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return null;

  const items = cart?.items || [];
  const cartSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingCharge = deliveryMethod === "Express" ? 1000 : 0;
  const cartTotal = cartSubtotal + shippingCharge;

  if (items.length === 0) {
    return (
      <MainLayout>
        <div
          style={{
            background: "var(--bg-base)",
            minHeight: "70vh",
            padding: "4rem 1.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              padding: "3rem 2rem",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                marginBottom: "1rem",
              }}
            >
              Your Cart is Empty
            </h2>
            <p style={{ color: "var(--fg-secondary)", marginBottom: "2rem" }}>
              Add some luxury furniture pieces to your cart before proceeding to
              checkout.
            </p>
            <Link
              href="/products"
              style={{
                background: "var(--accent-dark)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "100vh",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                marginBottom: "0.5rem",
              }}
            >
              Secure Checkout
            </h1>
            <p style={{ color: "var(--fg-muted)", fontSize: "0.95rem" }}>
              Review your shipping options and complete your order.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2.5rem",
            }}
          >
            {/* Desktop Layout grid columns */}
            <div
              className="checkout-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
                gap: "2.5rem",
              }}
            >
              {/* Left Side: Shipping, Delivery, Payment */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {/* 1. Shipping Details */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        background: "var(--accent)",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      1
                    </span>
                    Shipping Information
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: `1.5px solid ${errors.shippingName ? "red" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          outline: "none",
                          background: "transparent",
                          color: "var(--fg-primary)",
                        }}
                        placeholder="John Doe"
                      />
                      {errors.shippingName && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.shippingName}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "var(--fg-secondary)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={shippingEmail}
                          onChange={(e) => setShippingEmail(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: `1.5px solid ${errors.shippingEmail ? "red" : "var(--border)"}`,
                            borderRadius: "var(--radius-md)",
                            outline: "none",
                            background: "transparent",
                            color: "var(--fg-primary)",
                          }}
                          placeholder="john@example.com"
                        />
                        {errors.shippingEmail && (
                          <span
                            style={{
                              color: "red",
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                              display: "block",
                            }}
                          >
                            {errors.shippingEmail}
                          </span>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "var(--fg-secondary)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: `1.5px solid ${errors.shippingPhone ? "red" : "var(--border)"}`,
                            borderRadius: "var(--radius-md)",
                            outline: "none",
                            background: "transparent",
                            color: "var(--fg-primary)",
                          }}
                          placeholder="e.g. +94 77 123 4567"
                        />
                        {errors.shippingPhone && (
                          <span
                            style={{
                              color: "red",
                              fontSize: "0.75rem",
                              marginTop: "0.25rem",
                              display: "block",
                            }}
                          >
                            {errors.shippingPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: `1.5px solid ${errors.shippingAddress ? "red" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          outline: "none",
                          background: "transparent",
                          color: "var(--fg-primary)",
                        }}
                        placeholder="Street address, apartment, suite"
                      />
                      {errors.shippingAddress && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.shippingAddress}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: `1.5px solid ${errors.shippingCity ? "red" : "var(--border)"}`,
                          borderRadius: "var(--radius-md)",
                          outline: "none",
                          background: "transparent",
                          color: "var(--fg-primary)",
                        }}
                        placeholder="e.g. Colombo / Kandy"
                      />
                      {errors.shippingCity && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.shippingCity}
                        </span>
                      )}
                    </div>

                    {/* Save to Profile checkbox */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.875rem 1rem",
                        background: saveToProfile
                          ? "rgba(201,169,110,0.06)"
                          : "var(--bg-elevated)",
                        border: `1.5px solid ${saveToProfile ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "var(--accent-dark)",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "var(--fg-primary)",
                            display: "block",
                          }}
                        >
                          Save Details To Profile
                        </span>
                        <span
                          style={{
                            fontSize: "0.775rem",
                            color: "var(--fg-muted)",
                          }}
                        >
                          Your phone, address & city will be saved for faster
                          checkout next time.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. Delivery Method */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        background: "var(--accent)",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      2
                    </span>
                    Delivery Method
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    {/* Standard */}
                    <div
                      onClick={() => setDeliveryMethod("Standard")}
                      style={{
                        padding: "1.25rem",
                        border: `1.5px solid ${deliveryMethod === "Standard" ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-lg)",
                        background:
                          deliveryMethod === "Standard"
                            ? "rgba(201,169,110,0.06)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--fg-primary)",
                            fontSize: "0.95rem",
                          }}
                        >
                          Standard Delivery
                        </span>
                        <input
                          type="radio"
                          checked={deliveryMethod === "Standard"}
                          readOnly
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--fg-secondary)",
                          margin: 0,
                        }}
                      >
                        Takes 3-5 business days. Free shipping.
                      </p>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "var(--fg-primary)",
                        }}
                      >
                        FREE
                      </div>
                    </div>

                    {/* Express */}
                    <div
                      onClick={() => setDeliveryMethod("Express")}
                      style={{
                        padding: "1.25rem",
                        border: `1.5px solid ${deliveryMethod === "Express" ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-lg)",
                        background:
                          deliveryMethod === "Express"
                            ? "rgba(201,169,110,0.06)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--fg-primary)",
                            fontSize: "0.95rem",
                          }}
                        >
                          Express Courier
                        </span>
                        <input
                          type="radio"
                          checked={deliveryMethod === "Express"}
                          readOnly
                        />
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--fg-secondary)",
                          margin: 0,
                        }}
                      >
                        Takes 1-2 business days. Flat-rate fee.
                      </p>
                      <div
                        style={{
                          marginTop: "0.75rem",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "var(--fg-primary)",
                        }}
                      >
                        Rs. 1,000
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        background: "var(--accent)",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      3
                    </span>
                    Payment Method
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {/* COD */}
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1.25rem",
                        border: `1.5px solid ${paymentMethod === "COD" ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-lg)",
                        background:
                          paymentMethod === "COD"
                            ? "rgba(201,169,110,0.06)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        readOnly
                        style={{ marginRight: "1rem" }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--fg-primary)",
                            fontSize: "0.95rem",
                            display: "block",
                          }}
                        >
                          Cash on Delivery (COD)
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--fg-secondary)",
                          }}
                        >
                          Pay with cash upon package delivery to your doorstep.
                        </span>
                      </div>
                      <Banknote
                        size={24}
                        style={{
                          color: "var(--fg-secondary)",
                          marginLeft: "auto",
                        }}
                      />
                    </div>

                    {/* PayHere */}
                    <div
                      onClick={() => setPaymentMethod("PAYHERE")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1.25rem",
                        border: `1.5px solid ${paymentMethod === "PAYHERE" ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: "var(--radius-lg)",
                        background:
                          paymentMethod === "PAYHERE"
                            ? "rgba(201,169,110,0.06)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "PAYHERE"}
                        readOnly
                        style={{ marginRight: "1rem" }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "var(--fg-primary)",
                            fontSize: "0.95rem",
                            display: "block",
                          }}
                        >
                          PayHere (Credit/Debit Card)
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--fg-secondary)",
                          }}
                        >
                          Secure online payment via Visa, Mastercard, AMEX, or
                          Genie.
                        </span>
                      </div>
                      <CreditCard
                        size={24}
                        style={{
                          color: "var(--fg-secondary)",
                          marginLeft: "auto",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Order Summary Panel */}
              <div
                style={{
                  height: "fit-content",
                  position: "sticky",
                  top: "2rem",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "1rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Order Summary
                  </h3>

                  {/* Item List */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      maxHeight: "250px",
                      overflowY: "auto",
                      marginBottom: "1.5rem",
                      paddingRight: "0.5rem",
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item.cartItemId}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "4rem",
                            height: "4rem",
                            background:
                              "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Armchair
                              size={24}
                              style={{ color: "var(--fg-muted)" }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "var(--fg-primary)",
                              margin: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.product.name}
                          </h4>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--fg-secondary)",
                            }}
                          >
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "var(--fg-primary)",
                          }}
                        >
                          Rs.{" "}
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Subtotal</span>
                      <span
                        style={{ color: "var(--fg-primary)", fontWeight: 500 }}
                      >
                        Rs. {cartSubtotal.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Shipping ({deliveryMethod})</span>
                      <span
                        style={{ color: "var(--fg-primary)", fontWeight: 500 }}
                      >
                        {shippingCharge === 0
                          ? "Free"
                          : `Rs. ${shippingCharge.toLocaleString()}`}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "1rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      <span>Total Amount</span>
                      <span
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        Rs. {cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      background: "var(--accent-dark)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      opacity: isProcessing ? 0.7 : 1,
                      transition: "background 0.2s ease",
                    }}
                  >
                    {isProcessing
                      ? "Processing Order..."
                      : paymentMethod === "COD"
                        ? "Place COD Order"
                        : "Proceed to Online Payment"}
                  </button>

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--fg-muted)",
                      textAlign: "center",
                      marginTop: "1rem",
                      margin: "1rem 0 0",
                    }}
                  >
                    By clicking the button above, you agree to our Terms of
                    Service & Refund Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}
