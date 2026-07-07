import dotenv from 'dotenv';
import connectDB, { sequelize } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@chocolate.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'Admin User 2',
    email: 'admin2@chocolate.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
  },
  {
    name: 'David Miller',
    email: 'david@example.com',
    password: 'password123',
  },
];

const sampleProducts = [
  {
    name: 'Belgian Dark Chocolate (70% Cocoa)',
    category: 'Dark Chocolate',
    price: 12.99,
    description: 'Rich and intense dark chocolate from Belgium with 70% cocoa content. Perfect for dark chocolate lovers.',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Swiss Milk Chocolate with Hazelnuts',
    category: 'Milk Chocolate',
    price: 14.99,
    description: 'Creamy Swiss milk chocolate with roasted hazelnut pieces. A perfect balance of smoothness and crunch.',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Italian Gianduja Chocolate',
    category: 'Nut Chocolate',
    price: 16.99,
    description: 'Traditional Italian chocolate made with hazelnut paste. Smooth, creamy, and irresistibly nutty.',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'French White Chocolate with Vanilla',
    category: 'White Chocolate',
    price: 13.99,
    description: 'Luxurious French white chocolate infused with Madagascar vanilla. Creamy and delicate.',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Luxury Chocolate Gift Box',
    category: 'Gift Box',
    price: 49.99,
    description: 'Elegant gift box containing an assortment of premium chocolates from around the world.',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Swiss Dark Chocolate with Orange',
    category: 'Dark Chocolate',
    price: 11.99,
    description: 'Swiss dark chocolate with natural orange oil. A perfect balance of bitter and citrus.',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Belgian Milk Chocolate with Caramel',
    category: 'Milk Chocolate',
    price: 15.99,
    description: 'Creamy Belgian milk chocolate with a smooth caramel center. A classic combination.',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Italian Dark Chocolate with Almonds',
    category: 'Nut Chocolate',
    price: 13.99,
    description: 'Italian dark chocolate with whole roasted almonds. Rich and crunchy.',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'French White Chocolate with Raspberry',
    category: 'White Chocolate',
    price: 14.99,
    description: 'French white chocolate with freeze-dried raspberry pieces. Sweet and tangy.',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Premium Chocolate Collection Box',
    category: 'Gift Box',
    price: 59.99,
    description: 'Luxury collection of our finest chocolates in an elegant presentation box.',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Belgian Dark Chocolate with Sea Salt',
    category: 'Dark Chocolate',
    price: 13.99,
    description: 'Premium Belgian dark chocolate with a touch of sea salt. A perfect balance of sweet and savory.',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  },
  {
    name: 'Swiss Milk Chocolate with Caramel & Sea Salt',
    category: 'Milk Chocolate',
    price: 15.99,
    description: 'Creamy Swiss milk chocolate with caramel and a hint of sea salt. A sophisticated flavor combination.',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606313564201-6c7e5b4e6e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
  }
];

const initDB = async () => {
  try {
    await connectDB();

    // Re-syncing database tables (dropping and recreating)
    await sequelize.sync({ force: true });
    console.log('🗑️ Cleaned database tables.');

    // Create users (enable hooks for bcrypt hashing)
    const createdUsers = await User.bulkCreate(sampleUsers, { individualHooks: true });
    console.log(`👤 Seeded ${createdUsers.length} users.`);

    // Create products
    const createdProducts = await Product.bulkCreate(sampleProducts);
    console.log(`📦 Seeded ${createdProducts.length} products.`);

    // Helper to calculate past dates
    const getPastDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date;
    };

    // Create sample orders
    const sampleOrders = [
      {
        userId: createdUsers[1].id,
        orderItems: [
          {
            name: createdProducts[0].name,
            qty: 2,
            image: createdProducts[0].images[0],
            price: createdProducts[0].price,
            product: createdProducts[0].id,
          },
        ],
        shippingAddress: {
          address: '123 Main St',
          city: 'Colombo',
          postalCode: '10280',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Credit Card',
        itemsPrice: createdProducts[0].price * 2,
        taxPrice: 2.00,
        shippingPrice: 4.99,
        totalPrice: (createdProducts[0].price * 2) + 2.00 + 4.99,
        isPaid: true,
        paidAt: getPastDate(15),
        isDelivered: true,
        deliveredAt: getPastDate(14),
        createdAt: getPastDate(15)
      },
      {
        userId: createdUsers[2].id,
        orderItems: [
          {
            name: createdProducts[1].name,
            qty: 1,
            image: createdProducts[1].images[0],
            price: createdProducts[1].price,
            product: createdProducts[1].id,
          },
          {
            name: createdProducts[2].name,
            qty: 1,
            image: createdProducts[2].images[0],
            price: createdProducts[2].price,
            product: createdProducts[2].id,
          }
        ],
        shippingAddress: {
          address: '456 Galle Rd',
          city: 'Kandy',
          postalCode: '20000',
          country: 'Sri Lanka',
        },
        paymentMethod: 'PayPal',
        itemsPrice: createdProducts[1].price + createdProducts[2].price,
        taxPrice: 3.00,
        shippingPrice: 0.00,
        totalPrice: createdProducts[1].price + createdProducts[2].price + 3.00,
        isPaid: true,
        paidAt: getPastDate(10),
        isDelivered: true,
        deliveredAt: getPastDate(9),
        createdAt: getPastDate(10)
      },
      {
        userId: createdUsers[3].id,
        orderItems: [
          {
            name: createdProducts[4].name,
            qty: 1,
            image: createdProducts[4].images[0],
            price: createdProducts[4].price,
            product: createdProducts[4].id,
          }
        ],
        shippingAddress: {
          address: '789 Flower Rd',
          city: 'Colombo',
          postalCode: '10700',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Credit Card',
        itemsPrice: createdProducts[4].price,
        taxPrice: 5.00,
        shippingPrice: 0.00,
        totalPrice: createdProducts[4].price + 5.00,
        isPaid: true,
        paidAt: getPastDate(8),
        isDelivered: false,
        deliveredAt: null,
        createdAt: getPastDate(8)
      },
      {
        userId: createdUsers[4].id,
        orderItems: [
          {
            name: createdProducts[5].name,
            qty: 2,
            image: createdProducts[5].images[0],
            price: createdProducts[5].price,
            product: createdProducts[5].id,
          }
        ],
        shippingAddress: {
          address: '101 Lake View',
          city: 'Negombo',
          postalCode: '11500',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Credit Card',
        itemsPrice: createdProducts[5].price * 2,
        taxPrice: 2.40,
        shippingPrice: 4.99,
        totalPrice: (createdProducts[5].price * 2) + 2.40 + 4.99,
        isPaid: false,
        paidAt: null,
        isDelivered: false,
        deliveredAt: null,
        createdAt: getPastDate(5)
      },
      {
        userId: createdUsers[5].id,
        orderItems: [
          {
            name: createdProducts[6].name,
            qty: 1,
            image: createdProducts[6].images[0],
            price: createdProducts[6].price,
            product: createdProducts[6].id,
          },
          {
            name: createdProducts[3].name,
            qty: 2,
            image: createdProducts[3].images[0],
            price: createdProducts[3].price,
            product: createdProducts[3].id,
          }
        ],
        shippingAddress: {
          address: '202 Temple Rd',
          city: 'Jaffna',
          postalCode: '40000',
          country: 'Sri Lanka',
        },
        paymentMethod: 'PayPal',
        itemsPrice: createdProducts[6].price + (createdProducts[3].price * 2),
        taxPrice: 4.20,
        shippingPrice: 0.00,
        totalPrice: createdProducts[6].price + (createdProducts[3].price * 2) + 4.20,
        isPaid: true,
        paidAt: getPastDate(3),
        isDelivered: true,
        deliveredAt: getPastDate(2),
        createdAt: getPastDate(3)
      },
      {
        userId: createdUsers[6].id,
        orderItems: [
          {
            name: createdProducts[8].name,
            qty: 1,
            image: createdProducts[8].images[0],
            price: createdProducts[8].price,
            product: createdProducts[8].id,
          },
          {
            name: createdProducts[9].name,
            qty: 1,
            image: createdProducts[9].images[0],
            price: createdProducts[9].price,
            product: createdProducts[9].id,
          }
        ],
        shippingAddress: {
          address: '303 Beach Rd',
          city: 'Galle',
          postalCode: '80000',
          country: 'Sri Lanka',
        },
        paymentMethod: 'Credit Card',
        itemsPrice: createdProducts[8].price + createdProducts[9].price,
        taxPrice: 2.60,
        shippingPrice: 4.99,
        totalPrice: createdProducts[8].price + createdProducts[9].price + 2.60 + 4.99,
        isPaid: true,
        paidAt: getPastDate(1),
        isDelivered: false,
        deliveredAt: null,
        createdAt: getPastDate(1)
      }
    ];

    await Order.bulkCreate(sampleOrders);
    console.log('🛒 Seeded orders.');

    // Create sample reviews
    const sampleReviews = [
      {
        userId: createdUsers[1].id,
        productId: createdProducts[0].id,
        rating: 5,
        comment: 'Excellent chocolate! Very rich and smooth.',
      },
      {
        userId: createdUsers[2].id,
        productId: createdProducts[1].id,
        rating: 4,
        comment: 'Great milk chocolate, very creamy.',
      },
      {
        userId: createdUsers[3].id,
        productId: createdProducts[0].id,
        rating: 5,
        comment: 'Absolutely love the 70% cocoa intensity!',
      },
      {
        userId: createdUsers[4].id,
        productId: createdProducts[4].id,
        rating: 5,
        comment: 'This gift box was the perfect present. Beautiful packaging!',
      },
      {
        userId: createdUsers[5].id,
        productId: createdProducts[5].id,
        rating: 4,
        comment: 'The orange flavor combination is delicious.',
      }
    ];

    const createdReviews = await Review.bulkCreate(sampleReviews);
    console.log('⭐️ Seeded reviews.');

    // Update product ratings and review counts
    for (const product of createdProducts) {
      const productReviews = createdReviews.filter(review => 
        review.productId === product.id
      );
      
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        await Product.update({
          rating: averageRating,
          numReviews: productReviews.length
        }, {
          where: { id: product.id }
        });
      }
    }

    console.log('🚀 Database initialized successfully!');
    if (sequelize) await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDB();