// Low Level Design Learning Path - Complete Curriculum
export const lldLearningPath = {
  id: 'lld',
  title: 'Low Level Design Mastery',
  slug: 'lld',
  description: 'Master Object-Oriented Design, Design Patterns, and build scalable, maintainable software systems',
  duration: '8-10 weeks',
  difficulty: 'Intermediate to Advanced',
  totalModules: 12,
  totalProblems: 50,
  color: '#8b5cf6',
  icon: 'Box',
  
  overview: {
    objectives: [
      'Master Object-Oriented Programming principles (OOP)',
      'Learn all 23 Gang of Four (GoF) design patterns',
      'Understand SOLID principles deeply',
      'Design real-world systems from scratch',
      'Write clean, maintainable, and extensible code',
      'Prepare for LLD interview rounds at top companies'
    ],
    prerequisites: [
      'Strong programming skills in Java, C++, Python, or JavaScript',
      'Basic understanding of OOP concepts',
      'Familiarity with data structures',
      'Experience with building small applications'
    ],
    outcomes: [
      'Design complex systems with proper abstraction',
      'Apply design patterns to solve real problems',
      'Write SOLID, maintainable code',
      'Ace LLD rounds at FAANG companies',
      'Refactor legacy code effectively',
      'Make informed design decisions'
    ],
    skillsGained: [
      'Object-Oriented Design',
      'Design Patterns',
      'SOLID Principles',
      'Clean Code',
      'Refactoring',
      'API Design',
      'Code Architecture',
      'System Modeling'
    ]
  },

  studyPlan: {
    beginner: {
      duration: '10 weeks',
      hoursPerWeek: '8-10 hours',
      approach: 'Focus on OOP fundamentals, start with simple patterns',
      weeklyGoals: '1 module per week, implement 3-4 patterns/designs'
    },
    intermediate: {
      duration: '8 weeks',
      hoursPerWeek: '10-12 hours',
      approach: 'Deep dive into patterns, build complex systems',
      weeklyGoals: '1-2 modules per week, implement 5-6 patterns/designs'
    },
    advanced: {
      duration: '6 weeks',
      hoursPerWeek: '12-15 hours',
      approach: 'Focus on system design, pattern combinations, real-world problems',
      weeklyGoals: '2 modules per week, implement 7-8 complex systems'
    }
  },

  modules: [
    {
      id: 1,
      slug: 'oop-fundamentals',
      title: 'OOP Fundamentals',
      description: 'Master the four pillars of Object-Oriented Programming',
      difficulty: 'Beginner',
      estimatedTime: '1 week',
      problemCount: 5,
      topics: [
        'Classes and Objects',
        'Encapsulation',
        'Inheritance',
        'Polymorphism',
        'Abstraction',
        'Interfaces vs Abstract Classes',
        'Composition vs Inheritance',
        'Access Modifiers'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Object-Oriented Programming Fundamentals',
          duration: '60 min',
          description: 'Complete guide to OOP concepts with real-world examples',
          difficulty: 'Beginner',
          url: 'https://www.youtube.com/watch?v=pTB0EiLXUC8'
        },
        {
          type: 'article',
          title: 'The Four Pillars of OOP',
          duration: '45 min',
          description: 'Deep dive into encapsulation, inheritance, polymorphism, and abstraction',
          difficulty: 'Beginner'
        },
        {
          type: 'video',
          title: 'Composition vs Inheritance',
          duration: '30 min',
          description: 'When to use composition over inheritance',
          difficulty: 'Intermediate'
        },
        {
          type: 'practice',
          title: 'OOP Practice Problems',
          duration: '4 hours',
          description: 'Hands-on exercises to solidify OOP concepts',
          difficulty: 'Beginner'
        }
      ],
      keyProblems: [
        { 
          title: 'Design a Library Management System',
          difficulty: 'Easy',
          description: 'Create classes for Book, Member, Library with proper encapsulation',
          mustSolve: true 
        },
        { 
          title: 'Implement a Banking System',
          difficulty: 'Easy',
          description: 'Design Account hierarchy with checking, savings accounts',
          mustSolve: true 
        },
        { 
          title: 'Build a Shape Hierarchy',
          difficulty: 'Easy',
          description: 'Demonstrate polymorphism with different shapes',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Start by identifying real-world entities. Practice converting requirements to classes. Focus on proper encapsulation.',
      commonMistakes: [
        'Making everything public (breaking encapsulation)',
        'Overusing inheritance instead of composition',
        'Not understanding the difference between interface and abstract class',
        'Creating god classes that do everything'
      ],
      tips: [
        'Think in terms of real-world objects and their behaviors',
        'Use composition when "has-a" relationship, inheritance for "is-a"',
        'Keep classes focused on single responsibility',
        'Program to interfaces, not implementations',
        'Practice identifying access levels for class members'
      ]
    },
    {
      id: 2,
      slug: 'solid-principles',
      title: 'SOLID Principles',
      description: 'Master the five principles of object-oriented design',
      difficulty: 'Intermediate',
      estimatedTime: '1 week',
      problemCount: 5,
      topics: [
        'Single Responsibility Principle (SRP)',
        'Open/Closed Principle (OCP)',
        'Liskov Substitution Principle (LSP)',
        'Interface Segregation Principle (ISP)',
        'Dependency Inversion Principle (DIP)',
        'Code Smells',
        'Refactoring Techniques',
        'Clean Code Practices'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'SOLID Principles Explained',
          duration: '70 min',
          description: 'Complete guide to all five SOLID principles with examples',
          difficulty: 'Intermediate',
          url: 'https://www.youtube.com/watch?v=_jDNAf3CzeY'
        },
        {
          type: 'article',
          title: 'SOLID Principles in Action',
          duration: '60 min',
          description: 'Real-world examples of applying SOLID principles',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Refactoring to SOLID Code',
          duration: '50 min',
          description: 'How to refactor existing code to follow SOLID',
          difficulty: 'Advanced'
        },
        {
          type: 'practice',
          title: 'SOLID Refactoring Exercises',
          duration: '6 hours',
          description: 'Practice identifying and fixing SOLID violations',
          difficulty: 'Intermediate'
        }
      ],
      keyProblems: [
        { 
          title: 'Refactor Code to Follow SRP',
          difficulty: 'Medium',
          description: 'Take a god class and split it following Single Responsibility',
          mustSolve: true 
        },
        { 
          title: 'Implement Plugin System (OCP)',
          difficulty: 'Medium',
          description: 'Design extensible system without modifying existing code',
          mustSolve: true 
        },
        { 
          title: 'Fix LSP Violations',
          difficulty: 'Medium',
          description: 'Correct inheritance hierarchy that violates Liskov Substitution',
          mustSolve: true 
        },
        { 
          title: 'Apply Dependency Injection',
          difficulty: 'Medium',
          description: 'Refactor code to use dependency inversion',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Learn one principle at a time. Practice identifying violations in existing code. Refactor code to follow principles.',
      commonMistakes: [
        'Trying to apply all principles at once',
        'Over-engineering simple solutions',
        'Misunderstanding LSP (it\'s not just about inheritance)',
        'Creating too many small classes (over-splitting)'
      ],
      tips: [
        'SRP: Each class should have one reason to change',
        'OCP: Extend behavior without modifying existing code',
        'LSP: Subtypes must be substitutable for base types',
        'ISP: Many specific interfaces > one general interface',
        'DIP: Depend on abstractions, not concrete implementations'
      ]
    },
    {
      id: 3,
      slug: 'creational-patterns',
      title: 'Creational Design Patterns',
      description: 'Master object creation mechanisms and patterns',
      difficulty: 'Intermediate',
      estimatedTime: '1-2 weeks',
      problemCount: 6,
      topics: [
        'Singleton Pattern',
        'Factory Method Pattern',
        'Abstract Factory Pattern',
        'Builder Pattern',
        'Prototype Pattern',
        'Object Pool Pattern',
        'Dependency Injection',
        'Lazy Initialization'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Creational Design Patterns',
          duration: '90 min',
          description: 'All creational patterns explained with real examples',
          difficulty: 'Intermediate',
          url: 'https://www.youtube.com/watch?v=EcFVTgRHJLM'
        },
        {
          type: 'article',
          title: 'When to Use Which Creational Pattern',
          duration: '45 min',
          description: 'Decision guide for choosing the right pattern',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Builder Pattern Deep Dive',
          duration: '40 min',
          description: 'Master the builder pattern for complex object creation',
          difficulty: 'Intermediate'
        },
        {
          type: 'practice',
          title: 'Implement All Creational Patterns',
          duration: '8 hours',
          description: 'Hands-on implementation of each pattern',
          difficulty: 'Intermediate'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Database Connection Pool',
          difficulty: 'Medium',
          description: 'Implement Singleton pattern for connection management',
          mustSolve: true 
        },
        { 
          title: 'Build a Document Creator',
          difficulty: 'Medium',
          description: 'Use Factory pattern to create different document types',
          mustSolve: true 
        },
        { 
          title: 'Implement Complex Object Builder',
          difficulty: 'Medium',
          description: 'Use Builder pattern for objects with many parameters',
          mustSolve: true 
        },
        { 
          title: 'Design UI Component Factory',
          difficulty: 'Medium',
          description: 'Use Abstract Factory for cross-platform UI components',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Implement each pattern from scratch. Understand when to use each pattern. Practice identifying use cases.',
      commonMistakes: [
        'Overusing Singleton (global state anti-pattern)',
        'Not making Singleton thread-safe',
        'Confusing Factory Method with Abstract Factory',
        'Making Builder mutable'
      ],
      tips: [
        'Singleton: Use for truly global resources only',
        'Factory Method: When subclasses decide which class to instantiate',
        'Abstract Factory: When you need families of related objects',
        'Builder: For complex objects with many optional parameters',
        'Prototype: When object creation is expensive'
      ]
    },
    {
      id: 4,
      slug: 'structural-patterns',
      title: 'Structural Design Patterns',
      description: 'Learn to compose objects and classes into larger structures',
      difficulty: 'Intermediate',
      estimatedTime: '1-2 weeks',
      problemCount: 7,
      topics: [
        'Adapter Pattern',
        'Bridge Pattern',
        'Composite Pattern',
        'Decorator Pattern',
        'Facade Pattern',
        'Flyweight Pattern',
        'Proxy Pattern',
        'Module Pattern'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Structural Design Patterns Explained',
          duration: '100 min',
          description: 'Complete guide to all structural patterns',
          difficulty: 'Intermediate',
          url: 'https://www.youtube.com/watch?v=v9ejT8FO-7I'
        },
        {
          type: 'article',
          title: 'Decorator vs Proxy vs Adapter',
          duration: '40 min',
          description: 'Understanding the differences between similar patterns',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Composite Pattern in Real Systems',
          duration: '45 min',
          description: 'How to use Composite for tree structures',
          difficulty: 'Intermediate'
        },
        {
          type: 'practice',
          title: 'Structural Patterns Workshop',
          duration: '10 hours',
          description: 'Build real systems using structural patterns',
          difficulty: 'Intermediate'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Legacy System Adapter',
          difficulty: 'Medium',
          description: 'Make incompatible interfaces work together',
          mustSolve: true 
        },
        { 
          title: 'Build File System with Composite',
          difficulty: 'Medium',
          description: 'Implement hierarchical file/folder structure',
          mustSolve: true 
        },
        { 
          title: 'Implement Logging Decorator',
          difficulty: 'Medium',
          description: 'Add logging to objects without modifying them',
          mustSolve: true 
        },
        { 
          title: 'Create API Facade',
          difficulty: 'Medium',
          description: 'Simplify complex subsystem with simple interface',
          mustSolve: true 
        },
        { 
          title: 'Design Caching Proxy',
          difficulty: 'Hard',
          description: 'Implement lazy loading and caching with Proxy',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Understand the problem each pattern solves. Draw UML diagrams. Implement real-world examples.',
      commonMistakes: [
        'Confusing Decorator with inheritance',
        'Using Adapter when you should redesign interfaces',
        'Overcomplicating with Bridge pattern',
        'Not understanding Flyweight\'s memory optimization'
      ],
      tips: [
        'Adapter: Convert interface of class to another interface',
        'Decorator: Add responsibilities to objects dynamically',
        'Composite: Treat individual objects and compositions uniformly',
        'Facade: Provide unified interface to subsystem',
        'Proxy: Control access to objects'
      ]
    },
    {
      id: 5,
      slug: 'behavioral-patterns',
      title: 'Behavioral Design Patterns',
      description: 'Master patterns for object interaction and responsibility distribution',
      difficulty: 'Advanced',
      estimatedTime: '2 weeks',
      problemCount: 11,
      topics: [
        'Observer Pattern',
        'Strategy Pattern',
        'Command Pattern',
        'State Pattern',
        'Template Method Pattern',
        'Iterator Pattern',
        'Mediator Pattern',
        'Memento Pattern',
        'Chain of Responsibility',
        'Visitor Pattern',
        'Interpreter Pattern'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Behavioral Design Patterns',
          duration: '120 min',
          description: 'All 11 behavioral patterns with examples',
          difficulty: 'Advanced',
          url: 'https://www.youtube.com/watch?v=v9ejT8FO-7I'
        },
        {
          type: 'article',
          title: 'Observer vs Mediator vs Event Bus',
          duration: '50 min',
          description: 'Choosing the right communication pattern',
          difficulty: 'Advanced'
        },
        {
          type: 'video',
          title: 'State Pattern vs Strategy Pattern',
          duration: '35 min',
          description: 'Understanding the subtle differences',
          difficulty: 'Advanced'
        },
        {
          type: 'practice',
          title: 'Behavioral Patterns Implementation',
          duration: '15 hours',
          description: 'Build systems using each behavioral pattern',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Event System (Observer)',
          difficulty: 'Medium',
          description: 'Implement pub-sub system for event handling',
          mustSolve: true 
        },
        { 
          title: 'Build Text Editor (Command + Memento)',
          difficulty: 'Hard',
          description: 'Implement undo/redo functionality',
          mustSolve: true 
        },
        { 
          title: 'Design Vending Machine (State)',
          difficulty: 'Hard',
          description: 'Implement state transitions properly',
          mustSolve: true 
        },
        { 
          title: 'Create Payment System (Strategy)',
          difficulty: 'Medium',
          description: 'Support multiple payment methods dynamically',
          mustSolve: true 
        },
        { 
          title: 'Implement Request Chain (Chain of Responsibility)',
          difficulty: 'Medium',
          description: 'Build middleware/filter chain',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'These patterns are complex. Focus on understanding the intent. Build real systems, not toy examples.',
      commonMistakes: [
        'Confusing Strategy with State pattern',
        'Not properly decoupling Observer from Observable',
        'Making Command classes too complex',
        'Using Chain of Responsibility when simple if-else would work'
      ],
      tips: [
        'Observer: For one-to-many dependency notifications',
        'Strategy: Encapsulate algorithms and make them interchangeable',
        'Command: Encapsulate requests as objects',
        'State: Allow object to alter behavior when state changes',
        'Chain of Responsibility: Pass request along chain of handlers'
      ]
    },
    {
      id: 6,
      slug: 'design-parking-lot',
      title: 'Design Parking Lot System',
      description: 'Complete LLD of parking lot with multiple vehicle types',
      difficulty: 'Medium',
      estimatedTime: '3-4 days',
      problemCount: 1,
      topics: [
        'Requirements Gathering',
        'Class Diagram Design',
        'Use Case Analysis',
        'API Design',
        'Concurrency Handling',
        'Payment Integration',
        'Spot Allocation Strategies',
        'Rate Calculation'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Parking Lot System Design',
          duration: '60 min',
          description: 'Step-by-step LLD of parking lot system',
          difficulty: 'Medium',
          url: 'https://www.youtube.com/watch?v=DSGsa0pu8-k'
        },
        {
          type: 'article',
          title: 'Parking Lot Design - Complete Guide',
          duration: '45 min',
          description: 'Requirements, classes, and implementation',
          difficulty: 'Medium'
        },
        {
          type: 'video',
          title: 'Advanced Parking Lot Features',
          duration: '40 min',
          description: 'Reservations, handicap spots, electric charging',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Multi-Level Parking Lot',
          difficulty: 'Medium',
          description: 'Support cars, bikes, trucks with different pricing',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Start with requirements. Draw class diagram. Identify relationships. Implement core functionality first.',
      commonMistakes: [
        'Not handling concurrent parking requests',
        'Tight coupling between vehicle types and spots',
        'Not designing for extensibility (new vehicle types)',
        'Poor separation of concerns'
      ],
      tips: [
        'Use Strategy pattern for rate calculation',
        'Use Factory pattern for vehicle creation',
        'Consider thread safety for spot allocation',
        'Design clear interfaces for payment methods',
        'Think about real-world constraints (handicap spots, EV charging)'
      ]
    },
    {
      id: 7,
      slug: 'design-elevator-system',
      title: 'Design Elevator System',
      description: 'Design a multi-elevator control system',
      difficulty: 'Hard',
      estimatedTime: '3-4 days',
      problemCount: 1,
      topics: [
        'State Machine Design',
        'Scheduling Algorithms',
        'Request Dispatching',
        'Door Control',
        'Emergency Handling',
        'Load Balancing',
        'Optimization Strategies',
        'Real-time Systems'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Elevator System Design',
          duration: '70 min',
          description: 'Complete LLD with scheduling algorithms',
          difficulty: 'Hard',
          url: 'https://www.youtube.com/watch?v=siqiJAJWUVg'
        },
        {
          type: 'article',
          title: 'Elevator Scheduling Algorithms',
          duration: '50 min',
          description: 'SCAN, LOOK, FCFS algorithms explained',
          difficulty: 'Hard'
        },
        {
          type: 'video',
          title: 'State Pattern in Elevator System',
          duration: '30 min',
          description: 'Managing elevator states properly',
          difficulty: 'Medium'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Smart Elevator System',
          difficulty: 'Hard',
          description: 'Optimize wait time with multiple elevators',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Focus on state management. Design clean dispatcher. Implement at least one scheduling algorithm.',
      commonMistakes: [
        'Not properly managing elevator states',
        'Poor request dispatching logic',
        'Not handling edge cases (overload, emergency)',
        'Tight coupling between controller and elevators'
      ],
      tips: [
        'Use State pattern for elevator states',
        'Use Strategy pattern for scheduling algorithms',
        'Consider Observer pattern for button press notifications',
        'Design for real-world scenarios (maintenance mode, emergency)',
        'Think about minimizing wait time and energy consumption'
      ]
    },
    {
      id: 8,
      slug: 'design-library-management',
      title: 'Design Library Management System',
      description: 'Complete library system with book catalog, members, and lending',
      difficulty: 'Medium',
      estimatedTime: '2-3 days',
      problemCount: 1,
      topics: [
        'Catalog Management',
        'Member Management',
        'Book Lending & Returns',
        'Fine Calculation',
        'Search & Filtering',
        'Reservation System',
        'Notification System',
        'Report Generation'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Library Management System Design',
          duration: '55 min',
          description: 'End-to-end LLD with all features',
          difficulty: 'Medium'
        },
        {
          type: 'article',
          title: 'Library System Requirements & Design',
          duration: '40 min',
          description: 'Complete requirements and class design',
          difficulty: 'Medium'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Complete Library System',
          difficulty: 'Medium',
          description: 'Handle books, members, lending, fines, reservations',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Start with core entities. Add features incrementally. Focus on business logic.',
      commonMistakes: [
        'Not handling book copies vs book items',
        'Poor fine calculation logic',
        'Not supporting different member types',
        'Missing reservation and waitlist functionality'
      ],
      tips: [
        'Separate Book (metadata) from BookItem (physical copy)',
        'Use Strategy pattern for fine calculation',
        'Use Observer pattern for reservation notifications',
        'Consider Factory pattern for creating different member types',
        'Design extensible search/filter system'
      ]
    },
    {
      id: 9,
      slug: 'design-hotel-management',
      title: 'Design Hotel Management System',
      description: 'Hotel booking system with rooms, reservations, and services',
      difficulty: 'Medium',
      estimatedTime: '2-3 days',
      problemCount: 1,
      topics: [
        'Room Management',
        'Booking & Reservations',
        'Guest Management',
        'Service Management',
        'Billing & Invoicing',
        'Room Service',
        'Housekeeping',
        'Dynamic Pricing'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Hotel Management System LLD',
          duration: '65 min',
          description: 'Complete system with all features',
          difficulty: 'Medium'
        },
        {
          type: 'article',
          title: 'Hotel Booking System Design',
          duration: '45 min',
          description: 'Requirements and implementation guide',
          difficulty: 'Medium'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Hotel Booking System',
          difficulty: 'Medium',
          description: 'Handle rooms, bookings, services, billing',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Focus on booking logic and conflict resolution. Design flexible pricing strategy.',
      commonMistakes: [
        'Not handling booking conflicts properly',
        'Poor room availability checking',
        'Not supporting different room types',
        'Missing cancellation and refund logic'
      ],
      tips: [
        'Use Strategy pattern for pricing strategies',
        'Use State pattern for booking states',
        'Consider Factory pattern for room types',
        'Design proper concurrency control for bookings',
        'Think about overbooking scenarios'
      ]
    },
    {
      id: 10,
      slug: 'design-atm-system',
      title: 'Design ATM System',
      description: 'ATM machine with cash dispensing, balance inquiry, and transactions',
      difficulty: 'Medium',
      estimatedTime: '2-3 days',
      problemCount: 1,
      topics: [
        'Authentication & Security',
        'Cash Dispensing',
        'Transaction Management',
        'Balance Inquiry',
        'Receipt Printing',
        'PIN Management',
        'Cash Management',
        'Transaction Limits'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'ATM System Design',
          duration: '50 min',
          description: 'Complete ATM system with state management',
          difficulty: 'Medium'
        },
        {
          type: 'article',
          title: 'ATM Design Patterns',
          duration: '35 min',
          description: 'State pattern and Chain of Responsibility in ATM',
          difficulty: 'Medium'
        }
      ],
      keyProblems: [
        { 
          title: 'Design ATM Machine',
          difficulty: 'Medium',
          description: 'Handle authentication, transactions, cash dispensing',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Use State pattern extensively. Focus on security and cash management.',
      commonMistakes: [
        'Not properly managing ATM states',
        'Poor cash denomination dispensing logic',
        'Not handling insufficient funds',
        'Missing transaction rollback on failure'
      ],
      tips: [
        'Use State pattern for ATM states',
        'Use Chain of Responsibility for cash dispensing',
        'Use Strategy pattern for different transaction types',
        'Consider security aspects (PIN encryption, session timeout)',
        'Handle edge cases (out of cash, network failure)'
      ]
    },
    {
      id: 11,
      slug: 'design-online-shopping',
      title: 'Design Online Shopping System',
      description: 'E-commerce platform with products, cart, orders, and payments',
      difficulty: 'Hard',
      estimatedTime: '4-5 days',
      problemCount: 1,
      topics: [
        'Product Catalog',
        'Shopping Cart',
        'Order Management',
        'Payment Processing',
        'Inventory Management',
        'User Management',
        'Review & Ratings',
        'Recommendation System'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'E-commerce System Design',
          duration: '90 min',
          description: 'Complete online shopping platform design',
          difficulty: 'Hard',
          url: 'https://www.youtube.com/watch?v=EpASu_1dUdE'
        },
        {
          type: 'article',
          title: 'Shopping Cart Design Patterns',
          duration: '45 min',
          description: 'Best practices for cart and order management',
          difficulty: 'Medium'
        },
        {
          type: 'video',
          title: 'Inventory Management System',
          duration: '40 min',
          description: 'Handling stock, reservations, and concurrency',
          difficulty: 'Hard'
        }
      ],
      keyProblems: [
        { 
          title: 'Design E-commerce Platform',
          difficulty: 'Hard',
          description: 'Complete shopping system with cart, orders, payments',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Start with core shopping flow. Add payment and inventory. Focus on concurrency issues.',
      commonMistakes: [
        'Not handling inventory race conditions',
        'Poor order state management',
        'Not supporting multiple payment methods properly',
        'Missing cart persistence'
      ],
      tips: [
        'Use Strategy pattern for payment methods',
        'Use State pattern for order states',
        'Use Observer pattern for order notifications',
        'Design proper concurrency control for inventory',
        'Consider cart abandonment and session management'
      ]
    },
    {
      id: 12,
      slug: 'design-patterns-real-world',
      title: 'Design Patterns in Real Systems',
      description: 'Apply multiple patterns together in complex systems',
      difficulty: 'Advanced',
      estimatedTime: '1 week',
      problemCount: 3,
      topics: [
        'Pattern Combinations',
        'Anti-patterns',
        'Refactoring',
        'Pattern Selection',
        'Trade-offs',
        'Performance Considerations',
        'Maintainability',
        'Scalability'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Combining Design Patterns',
          duration: '80 min',
          description: 'How patterns work together in real systems',
          difficulty: 'Advanced'
        },
        {
          type: 'article',
          title: 'Design Pattern Anti-patterns',
          duration: '50 min',
          description: 'Common mistakes when applying patterns',
          difficulty: 'Advanced'
        },
        {
          type: 'video',
          title: 'Refactoring to Patterns',
          duration: '60 min',
          description: 'When and how to introduce patterns',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { 
          title: 'Design Trading Platform',
          difficulty: 'Hard',
          description: 'Use multiple patterns for order matching, execution, and notification',
          mustSolve: true 
        },
        { 
          title: 'Design Social Media Feed',
          difficulty: 'Hard',
          description: 'Combine patterns for posts, comments, notifications, and recommendations',
          mustSolve: true 
        },
        { 
          title: 'Design Notification Service',
          difficulty: 'Hard',
          description: 'Support multiple channels with filtering and preferences',
          mustSolve: true 
        }
      ],
      practiceStrategy: 'Don\'t force patterns. Let them emerge from requirements. Focus on solving real problems.',
      commonMistakes: [
        'Overengineering with too many patterns',
        'Forcing patterns where they don\'t fit',
        'Not considering performance implications',
        'Sacrificing simplicity for pattern purity'
      ],
      tips: [
        'Start simple, add patterns when needed',
        'Understand the problem before applying patterns',
        'Consider maintenance and team knowledge',
        'Patterns should make code clearer, not more complex',
        'Know when NOT to use a pattern'
      ]
    }
  ],

  resources: {
    books: [
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Gang of Four (Gamma, Helm, Johnson, Vlissides)',
        difficulty: 'Advanced',
        topics: ['All 23 GoF Patterns'],
        description: 'The definitive book on design patterns - a must-read classic'
      },
      {
        title: 'Head First Design Patterns',
        author: 'Freeman & Robson',
        difficulty: 'Beginner',
        topics: ['Design Patterns'],
        description: 'Most accessible introduction to design patterns with engaging examples'
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        difficulty: 'Intermediate',
        topics: ['Clean Code', 'Best Practices'],
        description: 'Essential book for writing maintainable, clean code'
      },
      {
        title: 'Refactoring: Improving the Design of Existing Code',
        author: 'Martin Fowler',
        difficulty: 'Intermediate',
        topics: ['Refactoring', 'Code Quality'],
        description: 'Learn to improve code design without changing behavior'
      },
      {
        title: 'Object-Oriented Analysis and Design',
        author: 'Grady Booch',
        difficulty: 'Advanced',
        topics: ['OOP', 'System Design'],
        description: 'Comprehensive guide to object-oriented design principles'
      }
    ],
    websites: [
      {
        name: 'Refactoring.Guru',
        url: 'https://refactoring.guru/design-patterns',
        type: 'Tutorials',
        description: 'Best visual guide to design patterns with examples in multiple languages'
      },
      {
        name: 'SourceMaking',
        url: 'https://sourcemaking.com/design_patterns',
        type: 'Reference',
        description: 'Design patterns, anti-patterns, and refactoring techniques'
      },
      {
        name: 'Design Patterns Game',
        url: 'https://designpatternsgame.com',
        type: 'Practice',
        description: 'Interactive game to learn design patterns'
      },
      {
        name: 'OODesign.com',
        url: 'https://www.oodesign.com',
        type: 'Tutorials',
        description: 'Object-oriented design principles and patterns'
      }
    ],
    videos: [
      {
        title: 'Design Patterns in Object Oriented Programming',
        platform: 'YouTube',
        instructor: 'Christopher Okhravi',
        duration: '30+ videos',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com/playlist?list=PLrhzvIcii6GNjpARdnO4ueTUAVR9eMBpc'
      },
      {
        title: 'Low Level Design Primer',
        platform: 'YouTube',
        instructor: 'Gaurav Sen',
        duration: '15 videos',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX'
      },
      {
        title: 'SOLID Principles',
        platform: 'YouTube',
        instructor: 'Uncle Bob',
        duration: '5 hours',
        difficulty: 'Advanced',
        url: 'https://www.youtube.com/watch?v=t86v3N4OshQ'
      }
    ],
    tools: [
      {
        name: 'PlantUML',
        description: 'Create UML diagrams from text',
        url: 'https://plantuml.com'
      },
      {
        name: 'draw.io',
        description: 'Free online diagram software',
        url: 'https://www.draw.io'
      },
      {
        name: 'Lucidchart',
        description: 'Professional diagramming tool',
        url: 'https://www.lucidchart.com'
      }
    ]
  },

  tips: {
    general: [
      'Master OOP fundamentals before diving into patterns',
      'Learn SOLID principles - they are foundation of good design',
      'Draw UML diagrams before coding',
      'Practice implementing patterns from scratch',
      'Don\'t memorize patterns - understand when to use them',
      'Read real codebases to see patterns in action',
      'Refactor existing code to apply patterns',
      'Focus on problem-solving, not pattern-matching'
    ],
    beforeInterview: [
      'Review all 23 GoF patterns',
      'Practice drawing class diagrams quickly',
      'Prepare 5-6 LLD problems thoroughly',
      'Be ready to explain SOLID principles with examples',
      'Practice thinking out loud while designing',
      'Know tradeoffs of different approaches',
      'Prepare questions about requirements'
    ],
    duringInterview: [
      'Ask clarifying questions about requirements',
      'Start with core entities and relationships',
      'Think about extensibility from the start',
      'Discuss design patterns you\'re using',
      'Consider edge cases and error handling',
      'Explain your design decisions',
      'Be open to feedback and iteration',
      'Use proper OOP terminology'
    ],
    antiPatterns: [
      'God Class - class that does everything',
      'Spaghetti Code - tangled, unstructured code',
      'Golden Hammer - using same pattern for everything',
      'Premature Optimization - optimizing before needed',
      'Tight Coupling - classes too dependent on each other',
      'Not Invented Here - rejecting existing solutions',
      'Analysis Paralysis - overthinking the design'
    ]
  },

  faqs: [
    {
      question: 'Do I need to memorize all 23 design patterns?',
      answer: 'No. Focus on understanding the principles behind patterns. Know 10-12 common patterns well (Singleton, Factory, Observer, Strategy, Decorator, Adapter, Command, Template Method). Others you can learn when needed.'
    },
    {
      question: 'Which programming language should I use for LLD interviews?',
      answer: 'Java and C++ are most common for LLD interviews. Python is also accepted. Choose the language you know best and that supports OOP well. The concepts matter more than syntax.'
    },
    {
      question: 'How do I know which design pattern to use?',
      answer: 'Focus on the problem, not the pattern. Understand what each pattern solves. With practice, you\'ll recognize patterns naturally. Don\'t force patterns - use them when they make code clearer and more maintainable.'
    },
    {
      question: 'How much time should I spend on LLD interviews?',
      answer: 'LLD rounds typically last 45-60 minutes. Spend 10 minutes on requirements, 15-20 minutes on class diagram, 20-25 minutes on implementation details, and 5-10 minutes on discussion/improvements.'
    },
    {
      question: 'Should I focus on implementation or class design?',
      answer: 'Class design is more important in LLD interviews. Have clean class diagrams with proper relationships. Implementation can be pseudo-code or key methods. Focus on extensibility and SOLID principles.'
    },
    {
      question: 'How detailed should my UML diagrams be?',
      answer: 'Include all major classes, their attributes, key methods, and relationships (inheritance, composition, association). Don\'t add getter/setters to clutter. Focus on design, not every detail.'
    }
  ],

  practiceProblems: [
    {
      id: 1,
      title: 'Design Chess Game',
      difficulty: 'Medium',
      topics: ['OOP', 'State Pattern', 'Strategy Pattern'],
      description: 'Design chess game with pieces, board, moves, and game rules',
      estimatedTime: '3-4 hours'
    },
    {
      id: 2,
      title: 'Design Tic-Tac-Toe',
      difficulty: 'Easy',
      topics: ['OOP', 'State Pattern'],
      description: 'Simple tic-tac-toe game with win detection',
      estimatedTime: '1-2 hours'
    },
    {
      id: 3,
      title: 'Design Snake and Ladder',
      difficulty: 'Easy',
      topics: ['OOP', 'Random'],
      description: 'Classic board game with snakes and ladders',
      estimatedTime: '2 hours'
    },
    {
      id: 4,
      title: 'Design Movie Ticket Booking',
      difficulty: 'Medium',
      topics: ['Booking System', 'Concurrency'],
      description: 'Book movie tickets with seat selection',
      estimatedTime: '3 hours'
    },
    {
      id: 5,
      title: 'Design Car Rental System',
      difficulty: 'Medium',
      topics: ['Rental', 'Booking', 'Pricing'],
      description: 'Rent cars with different types and pricing',
      estimatedTime: '3 hours'
    },
    {
      id: 6,
      title: 'Design LinkedIn',
      difficulty: 'Hard',
      topics: ['Social Network', 'Connections', 'Feed'],
      description: 'Social network with connections, posts, and feed',
      estimatedTime: '5 hours'
    },
    {
      id: 7,
      title: 'Design Uber/Ola',
      difficulty: 'Hard',
      topics: ['Ride Sharing', 'Matching', 'Pricing'],
      description: 'Ride sharing with driver-rider matching',
      estimatedTime: '4-5 hours'
    },
    {
      id: 8,
      title: 'Design Restaurant Management',
      difficulty: 'Medium',
      topics: ['Booking', 'Orders', 'Billing'],
      description: 'Manage reservations, orders, and billing',
      estimatedTime: '3 hours'
    },
    {
      id: 9,
      title: 'Design Stack Overflow',
      difficulty: 'Hard',
      topics: ['Q&A', 'Voting', 'Reputation'],
      description: 'Q&A platform with voting and reputation system',
      estimatedTime: '4 hours'
    },
    {
      id: 10,
      title: 'Design Logging Framework',
      difficulty: 'Medium',
      topics: ['Logging', 'Decorator', 'Chain of Responsibility'],
      description: 'Flexible logging with levels, formats, and outputs',
      estimatedTime: '2-3 hours'
    },
    {
      id: 11,
      title: 'Design Cache System',
      difficulty: 'Medium',
      topics: ['LRU Cache', 'Eviction Policies'],
      description: 'Cache with different eviction strategies',
      estimatedTime: '2 hours'
    },
    {
      id: 12,
      title: 'Design Notification Service',
      difficulty: 'Medium',
      topics: ['Observer', 'Strategy', 'Factory'],
      description: 'Send notifications via email, SMS, push',
      estimatedTime: '2-3 hours'
    },
    {
      id: 13,
      title: 'Design Rate Limiter',
      difficulty: 'Medium',
      topics: ['Rate Limiting', 'Strategy Pattern'],
      description: 'Rate limiter with different algorithms',
      estimatedTime: '2 hours'
    },
    {
      id: 14,
      title: 'Design URL Shortener',
      difficulty: 'Easy',
      topics: ['Hashing', 'Encoding'],
      description: 'Shorten URLs and redirect',
      estimatedTime: '1-2 hours'
    },
    {
      id: 15,
      title: 'Design File System',
      difficulty: 'Medium',
      topics: ['Composite Pattern', 'Tree'],
      description: 'File system with files, folders, and operations',
      estimatedTime: '2-3 hours'
    }
  ],

  interviewCompanies: [
    'Google', 'Amazon', 'Microsoft', 'Facebook/Meta', 'Apple',
    'Netflix', 'Uber', 'Airbnb', 'LinkedIn', 'Twitter',
    'Adobe', 'Oracle', 'Salesforce', 'Atlassian', 'Flipkart',
    'PhonePe', 'Razorpay', 'Swiggy', 'Zomato', 'Ola'
  ]
};

export default lldLearningPath;
