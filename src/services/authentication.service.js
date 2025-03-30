const MongoDB = require("./mongodb.service");
const { mongoConfig, tokenSecret } = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
// const config = require("../config");

const userRegister = async (user) => {
  console.log("user objects", user);
  try {
    // throw new Error("test error");
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
      userId: uuidv4(),
    };

    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        {
          username: userObject?.username,
          email: userObject?.email,
          userId: uuidv4(),
        },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "User registered successfully",
        token: token,
      };
    } else {
      return {
        status: false,
        message: "User registered failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "User registered failed";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already exist")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exist")
      : null;

    throw error;
  }
};

const userLogin = async (user) => {
  try {
    if (!user?.username || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username: user?.username });
    console.log("user login objects", userObject);
    if (userObject) {
      let isPasswordVerfied = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      console.log("isPasswordVerfied", isPasswordVerfied);
      if (isPasswordVerfied) {
        let token = jwt.sign(
          {
            username: userObject?.username,
            email: userObject?.email,
            userId: userObject?.userId,
          },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "User login successful",
          token: token,
        };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No user found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};
const userDetails = async (token) => {
  console.log("token", token);
  try {
    if (!token) {
      return { status: false, message: "Token is required" };
    }

    // Verify the token
    const decoded = jwt.verify(token, tokenSecret);

    // Find user in database
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username: decoded?.username });

    if (!userObject) {
      return {
        status: false,
        message: "User not found",
      };
    }

    // Return user details (excluding sensitive information like password)
    return {
      status: true,
      message: "User details fetched successfully",
      user: {
        username: userObject.username,
        email: userObject.email,
        userId: userObject.userId,
        // Add any other non-sensitive user fields you want to return
      },
    };
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return {
        status: false,
        message: "Invalid token",
      };
    }
    if (error.name === "TokenExpiredError") {
      return {
        status: false,
        message: "Token expired",
      };
    }
    return {
      status: false,
      message: "Failed to fetch user details",
      error: error?.toString(),
    };
  }
};
const adminRegister = async (user) => {
  console.log("user objects", user);
  try {
    // throw new Error("test error");
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
      userId: uuidv4(),
    };

    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.ADMINS)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        {
          username: userObject?.username,
          email: userObject?.email,
          userId: uuidv4(),
        },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "Admin registered successfully",
        token: token,
      };
    } else {
      return {
        status: false,
        message: "Admin registered failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "Admin registered failed";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already exist")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exist")
      : null;

    throw error;
  }
};

const adminLogin = async (user) => {
  try {
    if (!user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.ADMINS)
      .findOne({ email: user?.email });
    console.log("user login objects", userObject);
    if (userObject) {
      let isPasswordVerfied = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      console.log("isPasswordVerfied", isPasswordVerfied);
      if (isPasswordVerfied) {
        let token = jwt.sign(
          {
            username: userObject?.username,
            email: userObject?.email,
            userId: userObject?.userId,
          },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "Admin login successful",
          token: token,
        };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No admin found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};
const securityRegister = async (user) => {
  console.log("user objects", user);
  try {
    // throw new Error("test error");
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
      userId: uuidv4(),
    };

    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.SECURITY)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        {
          username: userObject?.username,
          email: userObject?.email,
          userId: uuidv4(),
        },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "Security registered successfully",
        token: token,
      };
    } else {
      return {
        status: false,
        message: "Security registered failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "Security registered failed";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already exist")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exist")
      : null;

    throw error;
  }
};

const securityLogin = async (user) => {
  try {
    if (!user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.SECURITY)
      .findOne({ email: user?.email });
    console.log("user login objects", userObject);
    if (userObject) {
      let isPasswordVerfied = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      console.log("isPasswordVerfied", isPasswordVerfied);
      if (isPasswordVerfied) {
        let token = jwt.sign(
          {
            username: userObject?.username,
            email: userObject?.email,
            userId: userObject?.userId,
          },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "Security login successful",
          token: token,
        };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No admin found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};
const labRegister = async (user) => {
  console.log("user objects", user);
  try {
    // throw new Error("test error");
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
      userId: uuidv4(),
    };

    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.LAB)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        {
          username: userObject?.username,
          email: userObject?.email,
          userId: uuidv4(),
        },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "Lab registered successfully",
        token: token,
      };
    } else {
      return {
        status: false,
        message: "Lab registered failed",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "Lab registered failed";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Username already exist")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email already exist")
      : null;

    throw error;
  }
};

const labLogin = async (user) => {
  try {
    if (!user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.LAB)
      .findOne({ email: user?.email });
    console.log("user login objects", userObject);
    if (userObject) {
      let isPasswordVerfied = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      console.log("isPasswordVerfied", isPasswordVerfied);
      if (isPasswordVerfied) {
        let token = jwt.sign(
          {
            username: userObject?.username,
            email: userObject?.email,
            userId: userObject?.userId,
          },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "Lab login successful",
          token: token,
        };
      } else {
        return {
          status: false,
          message: "Incorrect password",
        };
      }
    } else {
      return {
        status: false,
        message: "No Lab found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "User login failed",
      error: error?.toString(),
    };
  }
};
const tokenVerification = async (req, res, next) => {
  console.log(
    `authentication.service | tokenVerification | ${req?.originalUrl}`
  );
  try {
    if (
      req?.originalUrl.includes("/auth") ||
      req?.originalUrl.includes("/auth/register") ||
      req?.originalUrl.includes("/auth/admin/register") ||
      req?.originalUrl.includes("/auth/admin/login") ||
      req?.originalUrl.includes("/product/upload-multiple")
    )
      return next();
    let token = req?.headers["authorization"];
    console.log("token", token);
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(token, tokenSecret, (error, decoded) => {
        if (error) {
          res.status(401).json({
            status: false,
            message: error?.name ? error?.name : "Invalid Token",
            error: `Invalid token | ${error?.message}`,
          });
        } else {
          console.log("decode token", decoded);
          req["userId"] = decoded?.userId;
          next();
        }
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  tokenVerification,
  adminRegister,
  adminLogin,
  userDetails,
  securityRegister,
  securityLogin,
  labRegister,
  labLogin,
};
