import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  Store, 
  Smartphone, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  User, 
  Upload, 
  DollarSign, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  QrCode, 
  Phone, 
  Lock, 
  Search, 
  ChevronRight,
  Sparkles,
  Info,
  Menu,
  X,
  Star,
  Navigation
} from 'lucide-react';

const TOWNSHIPS = [
  "Soweto (Johannesburg)",
  "Tembisa (Ekurhuleni)",
  "Khayelitsha (Cape Town)",
  "Umlazi (Durban)",
  "Alexandras (Johannesburg)",
  "Mitchells Plain (Cape Town)",
  "Mamelodi (Pretoria)"
];

const INITIAL_VENDORS = [
  {
    id: "v1",
    name: "Sizwe's Shisanyama & Kota Joint",
    owner: "Sizwe Dlamini",
    category: "Street Food",
    address: "Zone 3, Chris Hani Rd, Soweto",
    township: "Soweto (Johannesburg)",
    rating: 4.9,
    trusted: true,
    phone: "0724567890",
    image: "🥩",
    products: [
      { id: "p1", name: "Overload Kota (Polony, Russian, Egg, Cheese, Chips, Atchar)", price: 65, category: "Kota", qty: 25, inStock: true },
      { id: "p2", name: "Quarter Leg Chicken & Pap with Chakalaka", price: 55, category: "Shisanyama", qty: 15, inStock: true },
      { id: "p3", name: "Wors & Roll (Soweto Style)", price: 35, category: "Street Food", qty: 30, inStock: true }
    ]
  },
  {
    id: "v2",
    name: "Khayelitsha Spaza Superstore",
    owner: "Lindiwe Ndlovu",
    category: "Spaza Essentials",
    address: "Block B, Site C, Khayelitsha",
    township: "Khayelitsha (Cape Town)",
    rating: 4.7,
    trusted: true,
    phone: "0839876543",
    image: "🍞",
    products: [
      { id: "p4", name: "Albany White Bread (Sash)", price: 19, category: "Groceries", qty: 50, inStock: true },
      { id: "p5", name: "Mageu Number 1 (Banana, 1L)", price: 22, category: "Beverages", qty: 40, inStock: true },
      { id: "p6", name: "Lucky Star Pilchards in Tomato (400g)", price: 26, category: "Canned Goods", qty: 35, inStock: true }
    ]
  },
  {
    id: "v3",
    name: "Gogo's Fresh Veg & Fruit Stall",
    owner: "Mama Nomvula",
    category: "Fresh Produce",
    address: "Kasi Hub Market Stall 4, Tembisa",
    township: "Tembisa (Ekurhuleni)",
    rating: 4.8,
    trusted: true,
    phone: "0713334455",
    image: "🥬",
    products: [
      { id: "p7", name: "Combo: Potatoes 2kg + Onions 1kg", price: 45, category: "Veg", qty: 12, inStock: true },
      { id: "p8", name: "Sweet Spinach Bunch", price: 15, category: "Veg", qty: 20, inStock: true },
      { id: "p9", name: "Ripe Bananas Combo (Hand of 6)", price: 18, category: "Fruit", qty: 15, inStock: true }
    ]
  }
];

const INITIAL_DRIVERS = [
  { id: "d1", name: "Sipho 'Bakkie' Khumalo", phone: "0821112233", vehicle: "Toyota Hilux Bakkie (Single Cab)", vehicleType: "Single Cab Bakkie", allowsMoving: true, baseRate: 180, isVerified: true, rating: 4.9, township: "Soweto (Johannesburg)" },
  { id: "d2", name: "Mandla '6-Ton' Ndlovu", phone: "0732223344", vehicle: "Hino 300 Series Semi-Truck", vehicleType: "Semi-Truck", allowsMoving: true, baseRate: 650, isVerified: true, rating: 4.8, township: "Khayelitsha (Cape Town)" },
  { id: "d3", name: "Nkosana 'Scooter' Dube", phone: "0614445566", vehicle: "Honda Delivery Bike", vehicleType: "Scooter", allowsMoving: false, baseRate: 15, isVerified: true, rating: 4.7, township: "Tembisa (Ekurhuleni)" }
];

export default function App() {
  const [role, setRole] = useState("customer"); // Standard customer view by default
  const [currentTownship, setCurrentTownship] = useState("Soweto (Johannesburg)");
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState("synced"); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Database mock state
  const [localDB, setLocalDB] = useState({
    vendors: INITIAL_VENDORS,
    orders: [
      {
        id: "KE-1024",
        vendorId: "v1",
        vendorName: "Sizwe's Shisanyama",
        customerName: "Thabo Molefe",
        customerPhone: "078 222 1122",
        items: [{ id: "p1", name: "Overload Kota", price: 65, quantity: 2 }],
        total: 130,
        status: "Delivered",
        paymentMethod: "Cash on Delivery",
        otpVendor: "5821",
        otpCustomer: "9312",
        deliveryAddress: "House 458, Zone 3, Soweto",
        createdAt: "2026-06-15 14:20"
      }
    ],
    drivers: INITIAL_DRIVERS
  });

  // Client Portal States
  const [customerTab, setCustomerTab] = useState("market"); // "market" | "movers"
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Mover Service States
  const [pickupMoverAddress, setPickupMoverAddress] = useState("");
  const [dropoffMoverAddress, setDropoffMoverAddress] = useState("");
  const [moverLoadType, setMoverLoadType] = useState("Furniture / Moving House");
  const [moverVehicleSize, setMoverVehicleSize] = useState("Single Cab Bakkie"); 
  const [selectedMoverDriver, setSelectedMoverDriver] = useState(INITIAL_DRIVERS[0]);

  // Authentication, Profile Vetting & Registration States
  const [currentUser, setCurrentUser] = useState(null); 
  const [showPartnerPortalModal, setShowPartnerPortalModal] = useState(false); // Controls partner gate
  const [showRegisterModal, setShowRegisterModal] = useState(null); // "vendor" | "driver" | null
  
  // New States to manage Customer Rating inputs
  const [ratingVendorScore, setRatingVendorScore] = useState(5);
  const [ratingDriverScore, setRatingDriverScore] = useState(5);

  const [regForm, setRegForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    township: "Soweto (Johannesburg)",
    idNumber: "",
    vehicleType: "Single Cab Bakkie",
    licensePlate: "",
    address: ""
  });
  
  const [verifyingDoc, setVerifyingDoc] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Guard Login States
  const [loginPhone, setLoginPhone] = useState("");
  const [loginError, setLoginError] = useState("");

  // Driver/Vendor Operation States
  const [myActiveJob, setMyActiveJob] = useState(null);
  const [otpInputs, setOtpInputs] = useState({ vendorOtp: "", customerOtp: "" });
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const [vendorNewProduct, setVendorNewProduct] = useState({ name: "", price: "", category: "Kota", qty: "" });
  const [notificationToast, setNotificationToast] = useState(null);

  // Strict Custom Dialog States (Replacing alert/confirm)
  const [customAlert, setCustomAlert] = useState(null); // { title, message }
  const [customConfirm, setCustomConfirm] = useState(null); // { title, message, onAccept }

  const [isLocating, setIsLocating] = useState(false);

  const toggleProductStock = (productId) => {
    const updatedVendors = localDB.vendors.map(v => {
      if (v.id === currentUser.id) {
        return {
          ...v,
          products: v.products.map(p => 
            p.id === productId ? { ...p, inStock: p.hasOwnProperty('inStock') ? !p.inStock : false } : p
          )
        };
      }
      return v;
    });
    setLocalDB({ ...localDB, vendors: updatedVendors });
    showNotification("Stock Updated", "Item availability adjusted successfully inside SQLite cache.");
    if (!isOnline) {
      setSyncStatus("pending");
    } else {
      triggerSync();
    }
  };

  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setCustomAlert({
        title: "GPS Not Supported",
        message: "Your current browser or device does not support native GPS lookup."
      });
      return;
    }

    setIsLocating(true);
    showNotification("Requesting GPS...", "Checking device coordinates.");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Attempt real-time reverse geocode lookup
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          
          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};
            const detectedArea = address.suburb || address.neighbourhood || address.town || address.city_district || address.city || "Soweto";
            
            // Map common township names to standard search sectors
            let standardizedArea = detectedArea;
            if (detectedArea.toLowerCase().includes("soweto")) standardizedArea = "Soweto (Johannesburg)";
            else if (detectedArea.toLowerCase().includes("tembisa")) standardizedArea = "Tembisa (Ekurhuleni)";
            else if (detectedArea.toLowerCase().includes("khayelitsha")) standardizedArea = "Khayelitsha (Cape Town)";
            else if (detectedArea.toLowerCase().includes("mitchell")) standardizedArea = "Mitchells Plain (Cape Town)";
            else if (detectedArea.toLowerCase().includes("mamelodi")) standardizedArea = "Mamelodi (Pretoria)";
            else if (detectedArea.toLowerCase().includes("umlazi")) standardizedArea = "Umlazi (Durban)";
            
            setCurrentTownship(standardizedArea);
            setSelectedVendor(null);
            showNotification("GPS Resolved", `Located: ${standardizedArea}`);
          } else {
            throw new Error("OSM Nominatim offline");
          }
        } catch (error) {
          // Fallback coordinate mapping for South African Metros
          let fallbackArea = "Soweto (Johannesburg)";
          if (latitude < -33.8 && longitude > 18.3) {
            fallbackArea = "Khayelitsha (Cape Town)";
          } else if (latitude < -29.7 && latitude > -30.3 && longitude > 30.7) {
            fallbackArea = "Umlazi (Durban)";
          } else if (latitude < -25.8 && latitude > -26.1 && longitude > 28.1) {
            fallbackArea = "Tembisa (Ekurhuleni)";
          }
          setCurrentTownship(fallbackArea);
          setSelectedVendor(null);
          showNotification("GPS Fallback Map", `Simulation mapped you to: ${fallbackArea}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Please check your device's location services.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access was denied. Please type your township manually.";
        }
        setCustomAlert({
          title: "GPS Access Denied",
          message: errorMsg
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    if (!isOnline) return;
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
      showNotification("Database Synced", "SQLite offline transactions synced to the kasiExpress mesh cloud network.");
    }, 1500);
  };

  const showNotification = (title, message) => {
    setNotificationToast({ title, message });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handlePartnerLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginPhone) {
      setLoginError("Please enter your registered mobile number.");
      return;
    }

    const sanitizedPhone = loginPhone.replace(/\s+/g, "");

    // Look up in Vendors
    const foundVendor = localDB.vendors.find(
      (v) => v.phone.replace(/\s+/g, "") === sanitizedPhone
    );

    // Look up in Drivers
    const foundDriver = localDB.drivers.find(
      (d) => d.phone.replace(/\s+/g, "") === sanitizedPhone
    );

    if (foundVendor) {
      setCurrentUser({
        id: foundVendor.id,
        name: foundVendor.owner,
        businessName: foundVendor.name,
        role: "vendor",
        details: foundVendor
      });
      setRole("vendor");
      setLoginPhone("");
      setShowPartnerPortalModal(false);
      showNotification("Welcome Back!", `Vendor Access granted: ${foundVendor.name}`);
    } else if (foundDriver) {
      setCurrentUser({
        id: foundDriver.id,
        name: foundDriver.name,
        role: "driver",
        details: foundDriver
      });
      setRole("driver");
      setLoginPhone("");
      setShowPartnerPortalModal(false);
      showNotification("Welcome Back!", `Driver profile verified: ${foundDriver.name}`);
    } else {
      setLoginError("No registered Partner profile matches this phone number. Try registering below!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole("customer");
    showNotification("Logged Out", "Secure partner session closed successfully.");
  };

  const handleAddToCart = (product, vendor) => {
    if (cart.length > 0 && cart[0].vendorId !== vendor.id) {
      setCustomConfirm({
        title: "Switch Spaza Shops?",
        message: `You already have items from "${cart[0].vendorName}" in your basket. Discard those items and start a new order with "${vendor.name}"?`,
        onAccept: () => {
          setCart([{ ...product, quantity: 1, vendorId: vendor.id, vendorName: vendor.name }]);
          setCustomConfirm(null);
        }
      });
    } else {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { ...product, quantity: 1, vendorId: vendor.id, vendorName: vendor.name }]);
      }
    }
  };

  const handleUpdateCartQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(cart.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    }
  };

  const handleRequestMover = (e) => {
    e.preventDefault();
    if (!pickupMoverAddress || !dropoffMoverAddress || !custName || !custPhone) {
      setCustomAlert({
        title: "Incomplete Booking",
        message: "Please complete all pick-up, drop-off, and identity fields to proceed."
      });
      return;
    }

    const calculatedTotal = moverVehicleSize === "Single Cab Bakkie" ? 180 : 650;

    const newMoverOrder = {
      id: `KE-M${Math.floor(1000 + Math.random() * 9000)}`,
      type: "moving",
      vendorId: selectedMoverDriver.id,
      vendorName: `${selectedMoverDriver.name} (${selectedMoverDriver.vehicle})`,
      customerName: custName,
      customerPhone: custPhone,
      deliveryAddress: `From: ${pickupMoverAddress} ➔ To: ${dropoffMoverAddress}`,
      items: [{ name: `Mover Hire (${moverVehicleSize}) - ${moverLoadType}`, price: calculatedTotal, quantity: 1 }],
      total: calculatedTotal,
      status: "Ready for Bakkie Collection", 
      paymentMethod: paymentMethod === "COD" ? "Cash/Card on Arrival" : paymentMethod === "CapitecPay" ? "Capitec Pay" : "FNB eWallet",
      otpVendor: Math.floor(1000 + Math.random() * 9000).toString(), 
      otpCustomer: Math.floor(1000 + Math.random() * 9000).toString(), 
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedOrders = [newMoverOrder, ...localDB.orders];
    setLocalDB({ ...localDB, orders: updatedOrders });
    setActiveOrder(newMoverOrder);
    
    setPickupMoverAddress("");
    setDropoffMoverAddress("");

    if (!isOnline) {
      setSyncStatus("pending");
    } else {
      triggerSync();
    }

    showNotification("Mover Requested!", `SMS token dispatched to ${newMoverOrder.customerName}. Vetted single-cab bakkies/trucks notified.`);
  };

  const handlePlaceOrder = () => {
    if (!custName || !custPhone || !custAddress) {
      setCustomAlert({
        title: "Missing Information",
        message: "Please complete all delivery fields to verify order legitimacy."
      });
      return;
    }

    const newOrder = {
      id: `KE-${Math.floor(1000 + Math.random() * 9000)}`,
      type: "delivery",
      vendorId: cart[0].vendorId,
      vendorName: cart[0].vendorName,
      customerName: custName,
      customerPhone: custPhone,
      deliveryAddress: `${custAddress}, ${currentTownship}`,
      items: [...cart],
      total: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) + 15, 
      status: "Order Sent to Spaza",
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod === "CapitecPay" ? "Capitec Pay (Instant)" : "FNB eWallet Transfer",
      otpVendor: Math.floor(1000 + Math.random() * 9000).toString(), 
      otpCustomer: Math.floor(1000 + Math.random() * 9000).toString(), 
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedOrders = [newOrder, ...localDB.orders];
    setLocalDB({ ...localDB, orders: updatedOrders });
    setCart([]);
    setCheckoutStep(false);
    setActiveOrder(newOrder);

    if (!isOnline) {
      setSyncStatus("pending");
    } else {
      triggerSync();
    }

    showNotification("Order Sent Successfully!", `SMS/WhatsApp security token sent to ${newOrder.customerName} & ${newOrder.vendorName}.`);
  };

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone || !regForm.idNumber) {
      setCustomAlert({
        title: "Validation Failed",
        message: "Please provide the legal ID and essential details to execute national verification."
      });
      return;
    }

    setVerifyingDoc(true);
    // Real-time Department of Home Affairs (DHA) & CIPC status simulation
    setTimeout(() => {
      setVerifyingDoc(false);
      setVerificationSuccess(true);
      
      setTimeout(() => {
        const userId = `usr-${Math.floor(Math.random() * 1000)}`;
        const cleanedPhone = regForm.phone.replace(/\s+/g, "");

        if (showRegisterModal === "vendor") {
          const newVendor = {
            id: `v-${userId}`,
            name: regForm.businessName || `${regForm.name}'s Spaza`,
            owner: regForm.name,
            category: "Spaza Essentials",
            address: regForm.address || "Kasi Plot 44",
            township: regForm.township,
            rating: 5.0,
            trusted: true,
            phone: cleanedPhone,
            image: "🏪",
            products: [
              { id: `p-new-1`, name: "Kasi Combo (Soda + Chips)", price: 30, category: "Combo", qty: 10, inStock: true }
            ]
          };
          setLocalDB(prev => ({
            ...prev,
            vendors: [...prev.vendors, newVendor]
          }));
          setCurrentUser({
            id: newVendor.id,
            name: newVendor.owner,
            businessName: newVendor.name,
            role: "vendor",
            details: newVendor
          });
          setRole("vendor");
        } else {
          const isSemiTruck = regForm.vehicleType === "Semi-Truck";
          const isSingleCabBakkie = regForm.vehicleType === "Single Cab Bakkie";
          const allowsMoving = isSemiTruck || isSingleCabBakkie;
          
          const newDriver = {
            id: `drv-${userId}`,
            name: regForm.name,
            phone: cleanedPhone,
            vehicle: `${regForm.vehicleType} (${regForm.licensePlate})`,
            vehicleType: regForm.vehicleType,
            allowsMoving: allowsMoving,
            baseRate: isSemiTruck ? 650 : isSingleCabBakkie ? 180 : 15,
            isVerified: true,
            rating: 5.0,
            township: regForm.township
          };
          
          setLocalDB(prev => ({
            ...prev,
            drivers: [...prev.drivers, newDriver]
          }));
          setCurrentUser({
            id: newDriver.id,
            name: newDriver.name,
            role: "driver",
            details: newDriver
          });
          setRole("driver");
        }

        setShowRegisterModal(null);
        setVerificationSuccess(false);
        setRegForm({
          name: "",
          businessName: "",
          phone: "",
          township: "Soweto (Johannesburg)",
          idNumber: "",
          vehicleType: "Single Cab Bakkie",
          licensePlate: "",
          address: ""
        });
        showNotification("Account Verified!", "Vetted with CIPC & DHA. Profile is active on kasiExpress.");
      }, 1500);

    }, 2000);
  };

  const handleVendorAddItem = (e) => {
    e.preventDefault();
    if (!vendorNewProduct.name || !vendorNewProduct.price) return;
    
    const updatedVendors = localDB.vendors.map(v => {
      if (v.id === currentUser.id) {
        return {
          ...v,
          products: [
            ...v.products,
            {
              id: `p-${Math.floor(Math.random() * 10000)}`,
              name: vendorNewProduct.name,
              price: parseFloat(vendorNewProduct.price),
              category: vendorNewProduct.category,
              qty: parseInt(vendorNewProduct.qty) || 10,
              inStock: true
            }
          ]
        };
      }
      return v;
    });

    setLocalDB({ ...localDB, vendors: updatedVendors });
    setVendorNewProduct({ name: "", price: "", category: "Kota", qty: "" });
    showNotification("Product Added", "Product registered directly inside local SQLite cache.");
    if (!isOnline) {
      setSyncStatus("pending");
    } else {
      triggerSync();
    }
  };

  const selectActiveJob = (job) => {
    setMyActiveJob({ 
      ...job, 
      status: "Driver En-route to Spaza", 
      driverId: currentUser.id, 
      driverName: currentUser.name 
    });
    updateOrderStatus(job.id, "Driver En-route to Spaza", currentUser.id, currentUser.name);
  };

  const updateOrderStatus = (orderId, newStatus, driverId = null, driverName = null) => {
    const updatedOrders = localDB.orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (driverId) updated.driverId = driverId;
        if (driverName) updated.driverName = driverName;
        return updated;
      }
      return o;
    });
    setLocalDB({ ...localDB, orders: updatedOrders });
    if (activeOrder && activeOrder.id === orderId) {
      const updatedActive = { ...activeOrder, status: newStatus };
      if (driverId) updatedActive.driverId = driverId;
      if (driverName) updatedActive.driverName = driverName;
      setActiveOrder(updatedActive);
    }
    if (!isOnline) {
      setSyncStatus("pending");
    } else {
      triggerSync();
    }
  };

  const handleRateSubmit = (orderId, vendorId, driverId, vendorScore, driverScore) => {
    // 1. Finalize order state
    const updatedOrders = localDB.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: "Delivered & Rated", vendorRating: vendorScore, driverRating: driverScore };
      }
      return o;
    });

    // 2. Adjust Vendor rating average (Emulated DB recalculation)
    const updatedVendors = localDB.vendors.map(v => {
      if (v.id === vendorId) {
        const currentRating = v.rating || 5.0;
        const recalculatedRating = parseFloat(((currentRating + vendorScore) / 2).toFixed(1));
        return { ...v, rating: recalculatedRating };
      }
      return v;
    });

    // 3. Adjust Driver rating average
    const targetDriverId = driverId || "d1";
    const updatedDrivers = localDB.drivers.map(d => {
      if (d.id === targetDriverId) {
        const currentRating = d.rating || 5.0;
        const recalculatedRating = parseFloat(((currentRating + driverScore) / 2).toFixed(1));
        return { ...d, rating: recalculatedRating };
      }
      return d;
    });

    setLocalDB({
      ...localDB,
      orders: updatedOrders,
      vendors: updatedVendors,
      drivers: updatedDrivers
    });

    // Close customer review space
    setActiveOrder(null);
    setRatingVendorScore(5);
    setRatingDriverScore(5);
    showNotification("Ratings Submitted!", "Siyabonga! Your reviews help maintain safety and high service quality.");
  };

  const handleVerifyVendorOtp = () => {
    if (otpInputs.vendorOtp === myActiveJob.otpVendor) {
      setMyActiveJob({ ...myActiveJob, status: "Driver Delivering Goods" });
      updateOrderStatus(myActiveJob.id, "Driver Delivering Goods");
      setOtpInputs({ ...otpInputs, vendorOtp: "" });
      setOtpErrorMessage("");
      showNotification("Vendor Handshake Approved", "OTP 1 Verified. Cargo securement complete, transit initiated.");
    } else {
      setOtpErrorMessage("Incorrect OTP from Vendor/Sender. Double check authorization.");
    }
  };

  const handleVerifyCustomerOtp = () => {
    if (otpInputs.customerOtp === myActiveJob.otpCustomer) {
      setMyActiveJob(null);
      updateOrderStatus(myActiveJob.id, "Delivered");
      setOtpInputs({ ...otpInputs, customerOtp: "" });
      setOtpErrorMessage("");
      showNotification("Delivery Legitimate & Complete!", "Customer OTP 2 Handshake successful. Payment authorized.");
    } else {
      setOtpErrorMessage("Incorrect OTP from Customer. Handshake rejected.");
    }
  };

  const filteredVendors = localDB.vendors.filter(v => {
    const matchesTownship = v.township.toLowerCase().includes(currentTownship.toLowerCase()) || 
                           currentTownship.toLowerCase().includes(v.township.toLowerCase());
    const matchesQuery = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTownship && matchesQuery;
  });

  const activeTownshipMovers = localDB.drivers.filter(d => 
    d.allowsMoving && 
    (d.township.toLowerCase().includes(currentTownship.toLowerCase()) || 
     currentTownship.toLowerCase().includes(d.township.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased">
      
      {/* --- CUSTOMER-CENTRIC CLEAN HEADER --- */}
      <header className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 px-4 py-3 shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo - Returns always to customer market view */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setRole("customer"); setSelectedVendor(null); }}>
            <span className="text-2xl">🇿🇦</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                kasiExpress <span className="text-xs bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold tracking-wide">PWA</span>
              </h1>
              <p className="text-[10px] text-orange-100 leading-none">Spaza & Bakkie Logistics Hub</p>
            </div>
          </div>

          {/* DYNAMIC NAVIGATION - ONLY SHOWS THE RELEVANT LOGGED-IN VIEW */}
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => { setRole("customer"); setSelectedVendor(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === "customer" ? 'bg-slate-900 text-amber-400 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Buy & Hire Movers</span>
            </button>
            
            {/* Show Vendor Shop Dashboard Tab ONLY if authenticated as Vendor */}
            {currentUser?.role === "vendor" && (
              <button 
                onClick={() => setRole("vendor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  role === "vendor" ? 'bg-slate-900 text-orange-400 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Store size={14} />
                <span>My Shop Dashboard ✅</span>
              </button>
            )}

            {/* Show Driver Dashboard Tab ONLY if authenticated as Driver */}
            {currentUser?.role === "driver" && (
              <button 
                onClick={() => setRole("driver")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  role === "driver" ? 'bg-slate-900 text-red-400 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                <Truck size={14} />
                <span>My Driver Portal ✅</span>
              </button>
            )}

            {/* Unified Partner Sign In / Registration Gateway */}
            {!currentUser ? (
              <button 
                onClick={() => setShowPartnerPortalModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 ml-4"
              >
                <User size={14} className="text-amber-400" />
                <span>Partner Workspace</span>
              </button>
            ) : (
              <div className="flex items-center pl-4 space-x-2 border-l border-white/25">
                <span className="text-xs text-white italic">Hi, {currentUser.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] px-2 py-1 rounded transition-all"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>

          {/* RIGHT-HAND SYNC INDICATOR & MOBILE MENU BUTTON */}
          <div className="flex items-center space-x-2">
            <div className={`hidden sm:flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full ${
              isOnline ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/20' : 'bg-red-950/80 text-red-300 border border-red-500/20'
            }`}>
              {isOnline ? <Wifi size={10} className="animate-pulse" /> : <WifiOff size={10} />}
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>

            <button 
              onClick={triggerSync}
              disabled={!isOnline || syncStatus === "syncing"}
              className="bg-slate-900/40 border border-slate-700/50 p-1.5 rounded-full text-white hover:bg-slate-900 transition-all"
              title="Sync SQLite Mesh"
            >
              <RefreshCw size={13} className={syncStatus === "syncing" ? "animate-spin" : ""} />
            </button>

            {/* Mobile menu triggers */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* --- MOBILE REORGANIZED NAVIGATION DRAWER --- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3 z-40">
          <button 
            onClick={() => { setRole("customer"); setSelectedVendor(null); setMobileMenuOpen(false); }}
            className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-bold flex items-center gap-2 ${
              role === "customer" ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Buy Spazas & Hire Movers</span>
          </button>
          
          {currentUser?.role === "vendor" && (
            <button 
              onClick={() => { setRole("vendor"); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-bold flex items-center gap-2 ${
                role === "vendor" ? 'bg-orange-500 text-slate-900' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Store size={16} />
              <span>My Shop Dashboard ✅</span>
            </button>
          )}

          {currentUser?.role === "driver" && (
            <button 
              onClick={() => { setRole("driver"); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-3 rounded-xl text-left text-sm font-bold flex items-center gap-2 ${
                role === "driver" ? 'bg-red-500 text-slate-900' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Truck size={16} />
              <span>My Driver Portal ✅</span>
            </button>
          )}

          <div className="border-t border-slate-850 pt-3">
            {!currentUser ? (
              <button 
                onClick={() => { setMobileMenuOpen(false); setShowPartnerPortalModal(true); }}
                className="w-full bg-slate-900 border border-amber-500/40 hover:border-amber-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <User size={16} className="text-amber-500" />
                <span>Log In / Sign Up as Partner</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-2">
                <span className="text-xs text-slate-400 italic">Logged in as {currentUser.name}</span>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 md:p-6 pb-24">
        
        {/* --- 1. ALWAYS OPEN VIEW: CLEAN CUSTOMER MARKETPLACE --- */}
        {role === "customer" && (
          <div className="space-y-6">
            
            {/* HERO HERO SECTION */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 rounded-3xl p-5 md:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles size={11} />
                    <span>Instant Township Verification Engine</span>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    Welcome to <span className="text-amber-400">kasiExpress</span>
                  </h2>
                  <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl">
                    Connect securely to verified spazas, food joints, and bakkie/truck movers. All transactions are protected via the double OTP secure handshake.
                  </p>
                </div>

                {}
                {/* Township Filter Selector */}
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0 flex items-center space-x-2.5">
                  <MapPin className="text-red-500" size={20} />
                  <div>
                    <label className="block text-[8px] text-slate-400 uppercase font-bold tracking-widest">Your Location</label>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <input 
                        type="text" 
                        placeholder="e.g. Soweto"
                        value={currentTownship} 
                        onChange={(e) => {
                          setCurrentTownship(e.target.value);
                          setSelectedVendor(null);
                        }}
                        className="bg-transparent text-white font-bold text-xs focus:outline-none border-b border-slate-700/50 focus:border-amber-500 w-32 block"
                      />
                      <button 
                        type="button"
                        onClick={handleGetGPSLocation}
                        disabled={isLocating}
                        title="Use device GPS location"
                        className={`p-1.5 bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-lg text-slate-300 hover:text-amber-400 transition-all ${
                          isLocating ? "animate-pulse" : ""
                        }`}
                      >
                        {isLocating ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : (
                          <Navigation size={12} className="rotate-45" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEGMENT TAB CONTROLLER: SHOPPERS VS MOVERS */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={() => setCustomerTab("market")}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  customerTab === "market" ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store size={14} />
                <span>Buy Spaza & Street Food</span>
              </button>
              <button 
                onClick={() => setCustomerTab("movers")}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  customerTab === "movers" ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck size={14} />
                <span>Request Bakkie & Heavy Movers</span>
              </button>
            </div>

            {/* Active Order State Notification Tracker */}
            {activeOrder && (
              <div className="bg-indigo-950/40 border-2 border-indigo-500/30 rounded-2xl p-4">
                
                {}
                {activeOrder.status === "Delivered" ? (
                  // CUSTOMER RATINGS INTERACTIVE INTERFACE
                  <div className="space-y-4">
                    <div className="border-b border-indigo-500/20 pb-3">
                      <span className="text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        🎉 Handshake Complete
                      </span>
                      <h4 className="text-lg font-black text-white mt-2">Rate Your Experience!</h4>
                      <p className="text-xs text-slate-300">Your feedback helps verify real-world legitimacy and rewards outstanding local movers and traders.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shop Rating */}
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Store size={14} className="text-orange-400" />
                          <span>Shop: {activeOrder.vendorName}</span>
                        </p>
                        <div className="flex items-center space-x-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingVendorScore(star)}
                              className="transition-transform active:scale-125 focus:outline-none"
                            >
                              <Star 
                                size={22} 
                                className={star <= ratingVendorScore ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Rate goods, cleanliness, and kitchen preparation speed.</p>
                      </div>

                      {/* Driver/Mover Rating */}
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                        <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Truck size={14} className="text-red-400" />
                          <span>Mover: {activeOrder.driverName || "Sipho 'Bakkie' Khumalo"}</span>
                        </p>
                        <div className="flex items-center space-x-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingDriverScore(star)}
                              className="transition-transform active:scale-125 focus:outline-none"
                            >
                              <Star 
                                size={22} 
                                className={star <= ratingDriverScore ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Rate cargo securement, safe driving, and physical dropoff assistance.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRateSubmit(activeOrder.id, activeOrder.vendorId, activeOrder.driverId, ratingVendorScore, ratingDriverScore)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={15} />
                      <span>Submit Ratings & Close Tracker</span>
                    </button>
                  </div>
                ) : (
                  // ACTIVE RUN REGULAR PROGRESS VIEW
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="text-indigo-400 animate-spin" size={18} />
                        <span className="text-xs font-bold text-white">Active Order: {activeOrder.id} ({activeOrder.type === 'moving' ? 'Mover Hire' : 'Spaza Delivery'})</span>
                      </div>
                      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {activeOrder.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-slate-300">
                      <p><strong>Cargo Driver:</strong> {activeOrder.vendorName}</p>
                      <p><strong>Total Value:</strong> R{activeOrder.total} ({activeOrder.paymentMethod})</p>
                      
                      <div className="mt-3 bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-2">
                        <p className="text-amber-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <Lock size={12} /> Double-OTP Handshake Security Keys:
                        </p>
                        <p className="text-[11px] text-slate-300">
                          1. Driver Pickup Verification: 
                          <span className="font-mono text-white text-xs bg-slate-800 px-2 py-0.5 rounded ml-1 font-bold">{activeOrder.otpVendor}</span>
                        </p>
                        <p className="text-[11px] text-slate-300 font-semibold text-emerald-400">
                          2. Delivery Dropoff Authorization: 
                          <span className="font-mono text-white text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded ml-1 font-bold">{activeOrder.otpCustomer}</span>
                        </p>
                        <p className="text-[9px] text-slate-400 italic">Do not hand OTP 2 to the driver until goods are fully offloaded and in your custody.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB CUSTOMER VIEW: STREET FOOD & SPAZAS */}
            {customerTab === "market" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Available Store listings */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Available Shops ({filteredVendors.length})</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search Kotas, milk..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg text-xs py-1 px-3 w-40 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {selectedVendor ? (
                    // Vendor Product Menu Listing
                    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 space-y-4 animate-fadeIn">
                      <button onClick={() => setSelectedVendor(null)} className="text-xs text-amber-500 hover:underline flex items-center gap-1">
                        ← Back to Traders
                      </button>

                      <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                        <div>
                          <h4 className="text-lg font-black text-white">{selectedVendor.name}</h4>
                          <p className="text-xs text-slate-400">{selectedVendor.category} • {selectedVendor.address}</p>
                        </div>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded text-xs font-bold">
                          ★ {selectedVendor.rating}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedVendor.products.map((p) => {
                          const isProductInStock = p.hasOwnProperty('inStock') ? p.inStock : true;
                          return (
                            <div key={p.id} className={`bg-slate-900/80 p-3 rounded-xl border flex flex-col justify-between transition-all ${
                              isProductInStock ? 'border-slate-800' : 'border-slate-950 opacity-50'
                            }`}>
                              <div>
                                <div className="flex justify-between">
                                  <span className={`text-xs font-bold ${isProductInStock ? 'text-white' : 'text-slate-500 line-through'}`}>{p.name}</span>
                                  <span className={`text-xs font-mono font-bold ${isProductInStock ? 'text-amber-400' : 'text-slate-600'}`}>R{p.price}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">
                                  {isProductInStock ? `In Stock: ${p.qty} units` : 'OUT OF STOCK'}
                                </p>
                              </div>
                              <button 
                                onClick={() => isProductInStock && handleAddToCart(p, selectedVendor)}
                                disabled={!isProductInStock}
                                className={`mt-3 text-xs font-bold py-1.5 rounded-lg transition-all ${
                                  isProductInStock 
                                    ? 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white' 
                                    : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-900'
                                }`}
                              >
                                {isProductInStock ? 'Add to Basket' : 'Out of Stock'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // Regular list of spazas
                    <div className="space-y-3">
                      {filteredVendors.map((vendor) => (
                        <div 
                          key={vendor.id}
                          onClick={() => setSelectedVendor(vendor)}
                          className="bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl bg-slate-900 p-2 rounded-xl">{vendor.image}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                                {vendor.name}
                                {vendor.trusted && <CheckCircle size={14} className="text-emerald-400" />}
                              </h4>
                              <p className="text-xs text-slate-400">{vendor.category} • {vendor.address}</p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Secure customer shopping cart panel */}
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 h-fit space-y-4">
                  <h4 className="font-bold text-white text-sm pb-2 border-b border-slate-700 flex items-center gap-1.5">
                    <ShoppingBag size={16} className="text-amber-500" />
                    My Shopping Basket
                  </h4>

                  {cart.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">Your basket is empty. Select a Spaza above to load items.</p>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <div>
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-amber-400">R{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button onClick={() => handleUpdateCartQty(item.id, -1)} className="p-1 bg-slate-800 rounded"><Minus size={10} /></button>
                              <span className="w-4 text-center font-bold">{item.quantity}</span>
                              <button onClick={() => handleUpdateCartQty(item.id, 1)} className="p-1 bg-slate-800 rounded"><Plus size={10} /></button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 pt-2 border-t border-slate-700 text-xs font-mono">
                        <div className="flex justify-between text-slate-400"><span>Goods total:</span><span>R{cart.reduce((a, b) => a + (b.price*b.quantity), 0)}</span></div>
                        <div className="flex justify-between text-slate-400"><span>Bakkie delivery:</span><span>R15</span></div>
                        <div className="flex justify-between font-bold text-white pt-1.5 border-t border-slate-800">
                          <span>Grand Total:</span>
                          <span className="text-amber-400">R{cart.reduce((a, b) => a + (b.price*b.quantity), 0) + 15}</span>
                        </div>
                      </div>

                      {!checkoutStep ? (
                        <button onClick={() => setCheckoutStep(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-extrabold py-2 rounded-xl">
                          Proceed to Checkout
                        </button>
                      ) : (
                        <div className="space-y-3 pt-3 border-t border-slate-800">
                          <input type="text" placeholder="Full Name" value={custName} onChange={(e)=>setCustName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-xs" />
                          <input type="tel" placeholder="Mobile phone" value={custPhone} onChange={(e)=>setCustPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-xs" />
                          <input type="text" placeholder="House/Street address" value={custAddress} onChange={(e)=>setCustAddress(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-xs" />
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={()=>setCheckoutStep(false)} className="bg-slate-800 text-xs py-1.5 rounded-lg border border-slate-700">Back</button>
                            <button onClick={handlePlaceOrder} className="bg-emerald-500 text-slate-900 font-bold text-xs py-1.5 rounded-lg">Confirm Order</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

            {/* TAB CUSTOMER VIEW: REQUEST BAKKIE & HEAVY MOVERS */}
            {customerTab === "movers" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                
                {/* Mover Booking Form (Left 2 Columns) */}
                <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                    <Truck className="text-amber-500" />
                    Secure Township Mover Service
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transparent upfront pricing, registered drivers, and complete security guarantees against cargo diversion.
                  </p>

                  <form onSubmit={handleRequestMover} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">1. Pick-up Address (Township Area)</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. 402 Vilakazi St, Orlando" 
                          value={pickupMoverAddress} 
                          onChange={(e)=>setPickupMoverAddress(e.target.value)} 
                          className="w-full bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">2. Drop-off Destination</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. House 50, Phase 3, Tembisa" 
                          value={dropoffMoverAddress} 
                          onChange={(e)=>setDropoffMoverAddress(e.target.value)} 
                          className="w-full bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">3. Select Cargo Class</label>
                        <select value={moverLoadType} onChange={(e)=>setMoverLoadType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-2 rounded-xl text-xs">
                          <option>Furniture / Moving House</option>
                          <option>Spaza Bulk Inventory Goods</option>
                          <option>Construction / Building Materials</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">4. Vehicle Class Required</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            type="button" 
                            onClick={()=>{
                              setMoverVehicleSize("Single Cab Bakkie");
                              const d = activeTownshipMovers.find(m => m.vehicleType === "Single Cab Bakkie") || INITIAL_DRIVERS[0];
                              setSelectedMoverDriver(d);
                            }}
                            className={`p-2 rounded-lg border text-xs font-bold ${moverVehicleSize === "Single Cab Bakkie" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400"}`}
                          >
                            🛻 Single Cab Bakkie (Base R180)
                          </button>
                          <button 
                            type="button" 
                            onClick={()=>{
                              setMoverVehicleSize("Semi-Truck");
                              const d = activeTownshipMovers.find(m => m.vehicleType === "Semi-Truck") || INITIAL_DRIVERS[1];
                              setSelectedMoverDriver(d);
                            }}
                            className={`p-2 rounded-lg border text-xs font-bold ${moverVehicleSize === "Semi-Truck" ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-slate-700 text-slate-400"}`}
                          >
                            🚛 Semi-Truck (Base R650)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2.5">
                      <h4 className="text-[10px] uppercase font-bold text-slate-300">DHA Identity Verification</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input type="text" placeholder="Full Name" required value={custName} onChange={(e)=>setCustName(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
                        <input type="tel" placeholder="SMS / WhatsApp phone" required value={custPhone} onChange={(e)=>setCustPhone(e.target.value)} className="bg-slate-950 border border-slate-800 p-2 rounded text-xs" />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5">
                      <ShieldCheck size={16} />
                      <span>Book Secure Transport Run (Est: R{moverVehicleSize === "Single Cab Bakkie" ? 180 : 650})</span>
                    </button>
                  </form>
                </div>

                {/* Township Drivers Fleet Vetting (Right 1 Column) */}
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 h-fit space-y-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">Verified Fleet: {currentTownship}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Showing vetted operators immediately available in your vicinity.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {activeTownshipMovers.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No heavy movers registered in {currentTownship} yet. Register as a driver to appear here!</p>
                    ) : (
                      activeTownshipMovers.map((mover) => (
                        <div 
                          key={mover.id}
                          onClick={() => {
                            setSelectedMoverDriver(mover);
                            setMoverVehicleSize(mover.vehicleType);
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedMoverDriver.id === mover.id ? "border-amber-500 bg-slate-900" : "border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{mover.vehicleType === "Single Cab Bakkie" ? "🛻" : "🚛"}</span>
                            <div className="flex-1">
                              <h5 className="text-xs font-bold text-white flex items-center gap-1">
                                {mover.name} {mover.isVerified && <CheckCircle size={10} className="text-emerald-400" />}
                              </h5>
                              <p className="text-[9px] text-slate-400">{mover.vehicle}</p>
                            </div>
                            <span className="text-[10px] font-bold text-amber-400">R{mover.baseRate}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* --- 2. VENDOR SHOP DASHBOARD (OWNER ONLY SECURED PATH) --- */}
        {role === "vendor" && currentUser?.role === "vendor" && (
          <div className="space-y-6">
            
            {/* Vendor Portal Header */}
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div>
                <button onClick={() => setRole("customer")} className="text-xs text-orange-500 hover:underline flex items-center gap-1 mb-1">
                  ← Return to Customer view
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Store className="text-orange-400" />
                  {currentUser.businessName} (Spaza Manager)
                </h2>
                <p className="text-xs text-slate-400">
                  Registered Owner: <strong className="text-white">{currentUser.name}</strong> | CIPC & DHA Trust Verified ✅
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-200 font-mono">Accepting Instant Orders</span>
              </div>
            </div>

            {/* TWO COLUMN WORKSPACE (Orders & Inventory) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* VENDOR ORDERS (Left 2 Columns) */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShoppingBag size={18} className="text-orange-500" />
                  Customer Deliveries Inbound ({localDB.orders.filter(o => o.vendorId === currentUser.id).length})
                </h3>

                {localDB.orders.filter(o => o.vendorId === currentUser.id).length === 0 ? (
                  <div className="bg-slate-800/20 border border-slate-700 rounded-xl p-8 text-center">
                    <Clock className="mx-auto text-slate-600 mb-2" size={32} />
                    <p className="text-xs text-slate-400">No active orders queued in your offline database right now.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localDB.orders.filter(o => o.vendorId === currentUser.id).map((order) => (
                      <div key={order.id} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                          <div>
                            <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-orange-400 font-mono font-bold">{order.id}</span>
                            <span className="text-[10px] text-slate-400 ml-2">{order.createdAt}</span>
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            order.status === "Delivered" 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-orange-950 text-orange-300 border border-orange-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="text-xs space-y-1">
                          {order.items.map((it, idx) => (
                            <p key={idx} className="text-slate-300">
                              • <strong className="text-white">{it.quantity}x</strong> {it.name} <span className="text-slate-500">(R{it.price} each)</span>
                            </p>
                          ))}
                        </div>

                        {/* Customer details */}
                        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                          <p className="text-slate-400"><strong>Customer:</strong> {order.customerName} ({order.customerPhone})</p>
                          <p className="text-slate-400"><strong>Location:</strong> {order.deliveryAddress}</p>
                          <p className="text-slate-400"><strong>Payment:</strong> {order.paymentMethod} (Total: <strong className="text-amber-400">R{order.total}</strong>)</p>
                        </div>

                        {/* Legitimacy handshake details */}
                        <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-orange-400">🔑 Security Handshake:</span>
                            <p className="text-[10px] text-slate-300">Give this OTP to the Bakkie Driver ONLY after loading the items into their vehicle.</p>
                          </div>
                          <span className="font-mono text-white text-sm bg-slate-900 px-3 py-1 rounded font-bold border border-orange-500/30">
                            {order.otpVendor}
                          </span>
                        </div>

                        {/* Simple Order management buttons */}
                        {order.status === "Order Sent to Spaza" && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, "Items Being Prepared");
                                showNotification("Status Updated", "Customer and bakkie drivers informed that prep has started.");
                              }}
                              className="bg-orange-500 hover:bg-orange-600 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg"
                            >
                              Accept & Prepare Goods
                            </button>
                          </div>
                        )}

                        {}
                        {order.status === "Items Being Prepared" && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                updateOrderStatus(order.id, "Ready for Bakkie Collection");
                                showNotification("Order Ready!", "Status changed to Ready. Bakkie couriers notified.");
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 hover:scale-105"
                            >
                              <CheckCircle size={14} />
                              <span>Mark Order as Ready</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* INVENTORY & PRODUCT MANAGEMENT (Right 1 Column) */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 h-fit space-y-4">
                <h3 className="font-bold text-white text-sm border-b border-slate-700 pb-2">
                  Add Stock / Modify Menu
                </h3>

                <form onSubmit={handleVendorAddItem} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Traditional Beef Wors" 
                      value={vendorNewProduct.name}
                      onChange={(e) => setVendorNewProduct({ ...vendorNewProduct, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Price (ZAR)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 45" 
                        value={vendorNewProduct.price}
                        onChange={(e) => setVendorNewProduct({ ...vendorNewProduct, price: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Available Qty</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 20" 
                        value={vendorNewProduct.qty}
                        onChange={(e) => setVendorNewProduct({ ...vendorNewProduct, qty: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Category Type</label>
                    <select 
                      value={vendorNewProduct.category}
                      onChange={(e) => setVendorNewProduct({ ...vendorNewProduct, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Kota">Kota</option>
                      <option value="Shisanyama">Shisanyama</option>
                      <option value="Spaza Essentials">Spaza Essentials</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-slate-900 text-xs font-extrabold py-2 rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Plus size={14} />
                    <span>Save Item (Local SQLite)</span>
                  </button>
                </form>

                {}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 border-t border-slate-700 pt-3 mb-2">My Menu Items</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {localDB.vendors.find(v => v.id === currentUser.id)?.products.map(p => {
                      const isItemInStock = p.hasOwnProperty('inStock') ? p.inStock : true;
                      return (
                        <div key={p.id} className="flex justify-between items-center text-[11px] bg-slate-900/60 p-2 rounded.5 border border-slate-800">
                          <div>
                            <p className={`font-bold ${isItemInStock ? 'text-white' : 'text-slate-500 line-through'}`}>{p.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {p.qty} • {p.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-orange-400 font-bold">R{p.price}</span>
                            <button
                              onClick={() => toggleProductStock(p.id)}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
                                isItemInStock 
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/20' 
                                  : 'bg-rose-950 text-rose-300 border-rose-500/20'
                              }`}
                            >
                              {isItemInStock ? 'In Stock' : 'Out Stock'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* --- 3. DRIVER PORTAL VIEW (OWNER ONLY SECURED PATH) --- */}
        {role === "driver" && currentUser?.role === "driver" && (
          <div className="space-y-6">
            
            {/* Driver Profile Header */}
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div>
                <button onClick={() => setRole("customer")} className="text-xs text-red-500 hover:underline flex items-center gap-1 mb-1">
                  ← Return to Customer view
                </button>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Truck className="text-red-500" />
                  {currentUser.name} (Driver / Mover Portal)
                </h2>
                <p className="text-xs text-slate-400">
                  Vetted Vehicle: <strong className="text-white">{currentUser.details?.vehicle || "Toyota Hilux Bakkie"}</strong> | Licensed & Verified ✅
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <CheckCircle className="text-emerald-400" size={16} />
                <span className="text-xs font-bold text-emerald-300">Active Transit Vetted</span>
              </div>
            </div>

            {/* TWO COLUMN GRID FOR DRIVER (Active Job vs Job board) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* MAIN ACTIVE TRANSIT AREA (Left 2 Columns) */}
              <div className="lg:col-span-2 space-y-4">
                
                {myActiveJob ? (
                  // ACTIVE JOB INTERACTIVE RUNNER
                  <div className="bg-slate-800/60 border-2 border-amber-500 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                      <div>
                        <span className="text-xs bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">RUN: {myActiveJob.id}</span>
                        <p className="text-[10px] text-slate-400 mt-1">Delivery Target Address: {myActiveJob.deliveryAddress}</p>
                      </div>
                      <span className="text-xs bg-amber-500 text-slate-900 px-2.5 py-1 rounded-full font-bold">
                        {myActiveJob.status}
                      </span>
                    </div>

                    {/* Step Map Route Optimization Mock */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-white flex items-center gap-1">
                          <MapPin size={14} className="text-red-500" /> Optimized Route Engine
                        </span>
                        <span className="text-slate-400 font-mono">1.2 km (Est 6 mins)</span>
                      </div>
                      
                      {/* Visual ASCII Map representation tailored for low-connectivity fallback */}
                      <div className="bg-slate-950 p-3 rounded font-mono text-[10px] text-emerald-400 leading-tight border border-slate-800">
                        <p>[Spaza Store: {myActiveJob.vendorName}]</p>
                        <p className="pl-6 text-slate-500">|</p>
                        <p className="pl-6 text-slate-500">v (Go down Road 10)</p>
                        <p className="pl-6">=== [Left turn at Gogo's Market Stall] ===</p>
                        <p className="pl-6 text-slate-500">|</p>
                        <p className="pl-12 text-slate-500">v (Continue into Section 4)</p>
                        <p className="pl-12 font-bold text-white">[Destination: {myActiveJob.customerName}]</p>
                      </div>
                    </div>

                    {/* TWO-WAY OTP HANDSHAKE PANEL */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-4">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                        <Lock size={14} /> Legitimate Double Handshake Verification
                      </h4>

                      {otpErrorMessage && (
                        <div className="p-2.5 bg-red-950 border border-red-500/30 text-red-300 rounded text-xs">
                          ⚠️ {otpErrorMessage}
                        </div>
                      )}

                      {/* STEP 1 HANDSHAKE: VENDOR CONFIRMATION */}
                      {myActiveJob.status === "Driver En-route to Spaza" && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-300">
                            <strong>Step 1:</strong> Arrive at <strong>{myActiveJob.vendorName}</strong>. Request the vendor's secure pickup OTP to authorize cargo release.
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              maxLength={4}
                              placeholder="Enter 4-Digit Vendor OTP" 
                              value={otpInputs.vendorOtp}
                              onChange={(e) => setOtpInputs({ ...otpInputs, vendorOtp: e.target.value })}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono tracking-widest text-white focus:outline-none w-48"
                            />
                            <button 
                              onClick={handleVerifyVendorOtp}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg"
                            >
                              Confirm Cargo Load
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 2 HANDSHAKE: CUSTOMER CONFIRMATION */}
                      {myActiveJob.status === "Driver Delivering Goods" && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-300">
                            <strong>Step 2:</strong> Arrive at customer address: <strong>{myActiveJob.deliveryAddress}</strong>. Request the customer's kasiExpress delivery token to release the consignment.
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              maxLength={4}
                              placeholder="Enter 4-Digit Customer OTP" 
                              value={otpInputs.customerOtp}
                              onChange={(e) => setOtpInputs({ ...otpInputs, customerOtp: e.target.value })}
                              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono tracking-widest text-white focus:outline-none w-48"
                            />
                            <button 
                              onClick={handleVerifyCustomerOtp}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg"
                            >
                              Finalize Delivery
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                ) : (
                  // DRIVER STATS / ACTIVE DASHBOARD
                  <div className="bg-slate-800/20 border border-slate-700 rounded-2xl p-6 text-center space-y-4">
                    <Truck className="mx-auto text-slate-600" size={40} />
                    <h3 className="font-bold text-white text-base">No Active Transit Run</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      You are online and ready to accept loads in the <strong className="text-white">{currentTownship}</strong> area. Select an inbound order from the kasiExpress job pool on the right to start earning.
                    </p>
                  </div>
                )}

              </div>

              {/* INBOUND TOWNSHIP JOB POOL (Right 1 Column) */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 h-fit space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <h3 className="font-bold text-white text-sm">
                    {currentTownship} Jobs Available
                  </h3>
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">
                    {localDB.orders.filter(o => o.status === "Ready for Bakkie Collection").length} active
                  </span>
                </div>

                <div className="space-y-3">
                  {localDB.orders.filter(o => o.status === "Ready for Bakkie Collection").length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No ready-for-pickup spaza loads in this township right now. They'll pop up once vendors finish food prep!</p>
                  ) : (
                    localDB.orders.filter(o => o.status === "Ready for Bakkie Collection").map((job) => (
                      <div key={job.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">{job.id}</span>
                            <h4 className="font-bold text-xs text-white mt-1.5">{job.vendorName}</h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">R15 Fee</span>
                        </div>

                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <p><strong>Deliver to:</strong> {job.customerName}</p>
                          <p><strong>Address:</strong> {job.deliveryAddress}</p>
                        </div>

                        <button
                          onClick={() => selectActiveJob(job)}
                          disabled={!!myActiveJob}
                          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-extrabold text-xs py-2 rounded-lg transition-colors"
                        >
                          {myActiveJob ? "Finish Active Run First" : "Accept Bakkie Payout Job"}
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* --- CONTEXTUAL FOOTER SWITCHER (CUSTOMER HUB + REGISTERED PORTAL ONLY) --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 px-4 py-3 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 text-slate-400">
            <Smartphone size={14} className="text-amber-500" />
            <span className="hidden sm:inline font-semibold">kasiExpress Navigation:</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Always show the standard Customer Hub */}
            <button 
              onClick={() => { setRole("customer"); setSelectedVendor(null); }}
              className={`px-3 py-1 text-xs rounded font-bold transition-all ${role === "customer" ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              Customer Hub (Default)
            </button>

            {/* Show only if logged in or registered as a Vendor */}
            {currentUser?.role === "vendor" && (
              <button 
                onClick={() => setRole("vendor")}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${role === "vendor" ? 'bg-amber-500 text-slate-950' : 'bg-orange-600 text-white shadow-lg'}`}
              >
                My Shop ({currentUser.businessName || "Spaza"})
              </button>
            )}

            {/* Show only if logged in or registered as a Bakkie Mover */}
            {currentUser?.role === "driver" && (
              <button 
                onClick={() => setRole("driver")}
                className={`px-3 py-1 text-xs rounded font-bold transition-all ${role === "driver" ? 'bg-amber-500 text-slate-950' : 'bg-red-600 text-white shadow-lg'}`}
              >
                My Driver Portal ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* --- SECURE UNIFIED PARTNER GATE MODAL --- */}
      {showPartnerPortalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            
            <button 
              onClick={() => setShowPartnerPortalModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-extrabold text-base transition-transform hover:scale-110"
            >
              ✕
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-black text-white">Partner Workspace Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in to access your secure Spaza Shop dashboard or claiming/delivering bakkie transport runs.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-medium flex items-start gap-1.5 mb-4">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handlePartnerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Partner Mobile Number</label>
                <input 
                  type="tel"
                  placeholder="e.g. 072 456 7890" 
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-amber-500 transition-colors"
                />
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 mt-2 text-[10px] text-slate-400 space-y-1">
                  <p className="font-bold text-amber-500 uppercase tracking-wide">Developer Sandbox Logins:</p>
                  <p>• Shop Owner: <span className="text-white font-mono font-bold">0724567890</span> (Sizwe's Shisanyama)</p>
                  <p>• Bakkie Driver: <span className="text-white font-mono font-bold">0821112233</span> (Sipho's Bakkie)</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <ShieldCheck size={18} />
                <span>Verify & Access Dashboard</span>
              </button>
            </form>

            <div className="border-t border-slate-800/80 pt-4 mt-5 text-center">
              <p className="text-xs text-slate-400">Don't have a partner account yet?</p>
              <div className="flex justify-center space-x-4 mt-2">
                <button 
                  onClick={() => { setShowPartnerPortalModal(false); setShowRegisterModal("vendor"); }}
                  className="text-xs text-orange-400 font-bold hover:underline"
                >
                  Register Shop 🏪
                </button>
                <span className="text-slate-600">|</span>
                <button 
                  onClick={() => { setShowPartnerPortalModal(false); setShowRegisterModal("driver"); }}
                  className="text-xs text-red-400 font-bold hover:underline"
                >
                  Register as Driver 🛻
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- PARTNER REGISTER MODAL WITH DHA & CIPC VETTING SIMULATION --- */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            
            <button 
              onClick={() => setShowRegisterModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-extrabold text-base"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="text-emerald-400" />
              {showRegisterModal === "vendor" ? "Register Spaza Shop" : "Register Driver / Mover"}
            </h3>
            
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Details will be cross-vetted with **Department of Home Affairs (DHA)** and the **CIPC register** to ensure full transport and transaction security.
            </p>

            {verifyingDoc ? (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="animate-spin text-amber-500 mx-auto" size={40} />
                <p className="text-sm font-bold text-white">Verifying credentials against DHA databases...</p>
                <p className="text-xs text-slate-400">Validating ID numbers and matching vehicle license discs.</p>
              </div>
            ) : verificationSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 p-4">
                <CheckCircle className="text-emerald-400 mx-auto animate-bounce" size={48} />
                <h4 className="text-base font-bold text-emerald-300">Identity Vetting Approved!</h4>
                <p className="text-xs text-slate-200">National identity successfully matched. Sync keys activated.</p>
              </div>
            ) : (
              <form onSubmit={handleOnboardSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name (As on ID)</label>
                  <input 
                    type="text" required placeholder="e.g. Sipho Khumalo" value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                {showRegisterModal === "vendor" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Spaza Trading Name</label>
                    <input 
                      type="text" required placeholder="e.g. Sizwe's Hot Kota Joint" value={regForm.businessName}
                      onChange={(e) => setRegForm({ ...regForm, businessName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">SA ID Number</label>
                    <input 
                      type="text" maxLength={13} required placeholder="ID Number" value={regForm.idNumber}
                      onChange={(e) => setRegForm({ ...regForm, idNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Township / Area Area</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Soweto, Orlando West" 
                      value={regForm.township}
                      onChange={(e) => setRegForm({ ...regForm, township: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / SMS Number</label>
                  <input 
                    type="tel" required placeholder="e.g. 072 456 7890" value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                {showRegisterModal === "driver" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Class</label>
                      <select
                        value={regForm.vehicleType}
                        onChange={(e) => setRegForm({ ...regForm, vehicleType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="Single Cab Bakkie">Single Cab Bakkie</option>
                        <option value="Semi-Truck">Semi-Truck</option>
                        <option value="Scooter / Delivery Bike">Scooter / Delivery Bike</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">License Plate</label>
                      <input 
                        type="text" required placeholder="GP 1234 GP" value={regForm.licensePlate}
                        onChange={(e) => setRegForm({ ...regForm, licensePlate: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <p className="text-[10px] text-slate-400">
                    I authorize verification of business records and identity registries under POPIA guidelines.
                  </p>
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1">
                  <ShieldCheck size={16} />
                  <span>Verify Vetting Status</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

      {/* --- STRICTLY COMPLIANT CUSTOM MODAL DIALOGS (REPLACING NATIVE ALERTS & CONFIRMS) --- */}
      {customAlert && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-amber-500/15 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h4 className="text-base font-black text-white">{customAlert.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{customAlert.message}</p>
            <button 
              onClick={() => setCustomAlert(null)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition-colors"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

      {customConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-orange-500 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-orange-500/15 text-orange-400 rounded-full flex items-center justify-center mx-auto">
              <Info size={24} />
            </div>
            <h4 className="text-base font-black text-white text-center">{customConfirm.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed text-center">{customConfirm.message}</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button 
                onClick={() => setCustomConfirm(null)}
                className="bg-slate-800 text-slate-300 font-bold text-xs py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                No, Cancel
              </button>
              <button 
                onClick={customConfirm.onAccept}
                className="bg-orange-500 text-slate-950 font-bold text-xs py-2 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Yes, Change Shop
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}