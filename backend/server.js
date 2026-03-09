require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const User = require("./models/User");
const Registration = require("./models/Registration");
const { eventFees } = require("./config/events");

const app = express();

// Security: Helmet for security headers
app.use(helmet());

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register attempts per windowMs
  message: "Too many authentication attempts, please try again later.",
});

app.use("/api/", limiter);

// CORS configuration - must be before other middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.options("*", cors());

// Security: Limit request body size
app.use(express.json({ limit: "10mb" }));

app.get("/ping", (req, res) => res.json({ message: "pong_v2" }));

// Razorpay instance - only initialize if keys are provided
let razorpay = null;
if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_ID !== "rzp_test_your_key_id_here"
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✓ Razorpay initialized");
} else {
  console.log("⚠ Razorpay not configured - payment features will be disabled");
}

// Connect to DB (optimized for serverless)
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    cachedDb = db;
    console.log("MongoDB Connected Successfully");
    return db;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
};

// Middleware to ensure DB connection before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      error: "Database Connection Error",
      details:
        "Could not connect to MongoDB Atlas. Please check your credentials and IP whitelist.",
      message: err.message,
    });
  }
});

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Token is not valid" });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Access denied" });
  next();
};

// Route: Get event fee (for validation)
app.get("/api/events/:eventId/fee", (req, res) => {
  const { eventId } = req.params;
  const fee = eventFees[eventId];

  if (fee === undefined) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.json({ eventId, fee });
});

// Route: Auth
app.post(
  "/api/auth/register",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      // SECURITY: Never allow role to be set by user
      const role = "student";

      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        email,
        password: hashedPassword,
        role,
      });
      await user.save();

      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Register Error:", err);
      // SECURITY: Don't expose internal errors in production
      res.status(500).json({ error: "Server error" });
    }
  },
);

app.post(
  "/api/auth/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({
        token,
        user: { id: user._id, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Login Error:", err);
      // SECURITY: Don't expose internal errors
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Route: Registration & Payments
app.post("/api/payments/create-order", auth, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ error: "Payment service not configured" });
    }

    const { eventId, feeAmount, details } = req.body;

    // SECURITY: Validate fee amount against server-side configuration
    const expectedFee = eventFees[eventId];

    if (!expectedFee) {
      return res.status(400).json({
        error: "Invalid event ID",
        message:
          "The specified event does not exist or is not available for registration.",
      });
    }

    if (feeAmount !== expectedFee) {
      return res.status(400).json({
        error: "Invalid fee amount",
        message: `The registration fee for this event is ₹${expectedFee}. Please refresh the page and try again.`,
        expectedFee: expectedFee,
      });
    }

    // SECURITY: Check if user already has a completed registration for this event
    const existingRegistration = await Registration.findOne({
      userId: req.user.id,
      eventId: eventId,
      paymentStatus: "completed",
    });

    if (existingRegistration) {
      return res.status(400).json({
        error: "Already registered",
        message: "You have already registered for this event.",
      });
    }

    // Create razorpay order
    const options = {
      amount: feeAmount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    // Save pending registration
    const registration = new Registration({
      userId: req.user.id,
      eventId,
      feeAmount,
      details,
      paymentStatus: "pending",
      razorpayOrderId: order.id,
    });
    await registration.save();

    res.json({ order, registrationId: registration._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating order" });
  }
});

app.post("/api/payments/verify", auth, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ error: "Payment service not configured" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment successful
      // We need to fetch the payment details from Razorpay to get the ARN/RRN
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

      let bankReference = "";
      if (paymentDetails) {
        // Different payment methods might have different fields for RRN
        bankReference =
          paymentDetails.bank_transaction_id ||
          paymentDetails.acquirer_data?.rrn ||
          paymentDetails.acquirer_data?.bank_transaction_id ||
          "";
      }

      await Registration.findByIdAndUpdate(registrationId, {
        paymentStatus: "completed",
        razorpayPaymentId: razorpay_payment_id,
        bankRrn: bankReference,
      });
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

app.get("/api/registrations/my", auth, async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user.id,
    }).populate("userId", "email");
    res.json(registrations);
  } catch (err) {
    console.error("Fetch registrations error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Route: Admin
app.get("/api/admin/registrations", auth, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
