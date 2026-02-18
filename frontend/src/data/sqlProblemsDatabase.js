// ─── SQL Problems Database ───
// 150+ SQL problems across 8 categories with real-world schemas

export const SQL_CATEGORIES = [
  { id: 'basic', name: 'Basic Queries', icon: '📋', color: '#22d3ee', desc: 'SELECT, WHERE, ORDER BY, DISTINCT, LIMIT' },
  { id: 'joins', name: 'Joins', icon: '🔗', color: '#3b82f6', desc: 'INNER, LEFT, RIGHT, FULL, self-joins, cross joins' },
  { id: 'aggregations', name: 'Aggregations', icon: '📊', color: '#10b981', desc: 'COUNT, SUM, AVG, GROUP BY, HAVING' },
  { id: 'subqueries', name: 'Subqueries', icon: '🔄', color: '#f59e0b', desc: 'Scalar, correlated, EXISTS, IN, ANY/ALL' },
  { id: 'window', name: 'Window Functions', icon: '🪟', color: '#8b5cf6', desc: 'ROW_NUMBER, RANK, LAG, LEAD, running totals' },
  { id: 'advanced', name: 'Advanced Queries', icon: '⚡', color: '#ef4444', desc: 'CTEs, recursive, pivot, string/date ops' },
  { id: 'optimization', name: 'Query Optimization', icon: '🚀', color: '#f97316', desc: 'Index usage, query rewriting, execution plans' },
  { id: 'dml', name: 'Data Manipulation', icon: '✏️', color: '#ec4899', desc: 'INSERT, UPDATE, DELETE, transactions' },
];

export const SQL_TOPICS = [
  'SELECT', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'DISTINCT', 'LIMIT',
  'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'SELF JOIN', 'CROSS JOIN',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'Subquery', 'Correlated Subquery', 'EXISTS', 'IN', 'ANY', 'ALL',
  'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'NTILE', 'LAG', 'LEAD',
  'CTE', 'Recursive CTE', 'CASE', 'COALESCE', 'CAST',
  'String Functions', 'Date Functions', 'NULL Handling',
  'INSERT', 'UPDATE', 'DELETE', 'MERGE', 'Transactions',
  'Indexes', 'Query Plans', 'Normalization',
];

export const SQL_COMPANIES = [
  { id: 'google', name: 'Google', color: '#4285F4' },
  { id: 'amazon', name: 'Amazon', color: '#FF9900' },
  { id: 'meta', name: 'Meta', color: '#1877F2' },
  { id: 'microsoft', name: 'Microsoft', color: '#00A4EF' },
  { id: 'apple', name: 'Apple', color: '#A2AAAD' },
  { id: 'netflix', name: 'Netflix', color: '#E50914' },
  { id: 'uber', name: 'Uber', color: '#000000' },
  { id: 'stripe', name: 'Stripe', color: '#635BFF' },
  { id: 'airbnb', name: 'Airbnb', color: '#FF5A5F' },
  { id: 'twitter', name: 'Twitter/X', color: '#1DA1F2' },
];

// Helper to create a problem quickly
const p = (id, title, difficulty, category, topics, schemaId, companies, acceptance, timeEstimate, description, expectedQuery, hints, explanation) => ({
  id, title, difficulty, category, topics, schemaId, companies,
  acceptance, timeEstimate, description,
  expectedQuery, hints, explanation,
  frequency: acceptance > 70 ? 'high' : acceptance > 50 ? 'medium' : 'low',
});

export const SQL_PROBLEMS = [
  // ════════════════════════════════════════
  // BASIC QUERIES (1-20)
  // ════════════════════════════════════════
  p('sql-1', 'Select All Customers', 'Easy', 'basic', ['SELECT'], 'ecommerce', ['google', 'amazon'], 95, 5,
    'Write a query to retrieve all columns from the `customers` table.',
    'SELECT * FROM customers;',
    ['Use SELECT * to get all columns', 'No WHERE clause needed'],
    'A simple SELECT * retrieves every column and every row from the specified table.'
  ),
  p('sql-2', 'Filter by Country', 'Easy', 'basic', ['SELECT', 'WHERE'], 'ecommerce', ['amazon'], 92, 5,
    'Write a query to find all customers from the USA.',
    "SELECT * FROM customers WHERE country = 'USA';",
    ['Use WHERE to filter rows', 'String values need quotes'],
    'The WHERE clause filters rows. String comparisons use single quotes in SQL.'
  ),
  p('sql-3', 'Sort Products by Price', 'Easy', 'basic', ['SELECT', 'ORDER BY'], 'ecommerce', ['amazon', 'google'], 90, 5,
    'Write a query to list all products sorted by price in descending order.',
    'SELECT * FROM products ORDER BY price DESC;',
    ['Use ORDER BY for sorting', 'DESC for descending order'],
    'ORDER BY sorts results. DESC gives highest-first ordering.'
  ),
  p('sql-4', 'Unique Countries', 'Easy', 'basic', ['SELECT', 'DISTINCT'], 'ecommerce', ['meta'], 88, 5,
    'Write a query to find all unique countries where customers are located.',
    'SELECT DISTINCT country FROM customers;',
    ['DISTINCT removes duplicates'],
    'DISTINCT eliminates duplicate values from the result set.'
  ),
  p('sql-5', 'Top 3 Expensive Products', 'Easy', 'basic', ['SELECT', 'ORDER BY', 'LIMIT'], 'ecommerce', ['amazon'], 87, 5,
    'Write a query to find the 3 most expensive products.',
    'SELECT * FROM products ORDER BY price DESC LIMIT 3;',
    ['Combine ORDER BY with LIMIT'],
    'ORDER BY price DESC sorts highest first, LIMIT 3 returns only the top 3.'
  ),
  p('sql-6', 'Filter by Date Range', 'Easy', 'basic', ['SELECT', 'WHERE'], 'ecommerce', ['google', 'meta'], 85, 8,
    'Write a query to find all orders placed in January 2024.',
    "SELECT * FROM orders WHERE order_date >= '2024-01-01' AND order_date < '2024-02-01';",
    ['Use AND for multiple conditions', 'Compare dates with string format YYYY-MM-DD'],
    'Date range filtering uses >= start and < end of next period for precision.'
  ),
  p('sql-7', 'Products in Stock', 'Easy', 'basic', ['SELECT', 'WHERE'], 'ecommerce', ['amazon'], 90, 5,
    'Write a query to find all products with stock_quantity greater than 100.',
    'SELECT * FROM products WHERE stock_quantity > 100;',
    ['Use > for greater than comparison'],
    'Numeric comparisons use standard operators: >, <, >=, <=, =, != or <>.'
  ),
  p('sql-8', 'Pattern Matching', 'Easy', 'basic', ['SELECT', 'WHERE', 'String Functions'], 'ecommerce', ['google'], 82, 8,
    'Write a query to find all products whose name contains "Samsung".',
    "SELECT * FROM products WHERE product_name LIKE '%Samsung%';",
    ['Use LIKE with % wildcards for pattern matching'],
    'LIKE with % wildcards matches any characters before and after the pattern.'
  ),
  p('sql-9', 'NULL Values', 'Easy', 'basic', ['SELECT', 'WHERE', 'NULL Handling'], 'social', ['meta', 'twitter'], 80, 8,
    'Write a query to find all users who have not set a bio (bio is NULL).',
    'SELECT * FROM users WHERE bio IS NULL;',
    ['Use IS NULL, not = NULL'],
    'NULL represents unknown values. Use IS NULL or IS NOT NULL to check for NULLs.'
  ),
  p('sql-10', 'IN Operator', 'Easy', 'basic', ['SELECT', 'WHERE', 'IN'], 'ecommerce', ['amazon', 'google'], 85, 5,
    'Write a query to find all orders with status "pending" or "shipped".',
    "SELECT * FROM orders WHERE status IN ('pending', 'shipped');",
    ['IN checks if a value matches any in a list'],
    'IN is shorthand for multiple OR conditions on the same column.'
  ),
  p('sql-11', 'BETWEEN Operator', 'Easy', 'basic', ['SELECT', 'WHERE'], 'ecommerce', ['amazon'], 88, 5,
    'Write a query to find all products priced between $50 and $200.',
    'SELECT * FROM products WHERE price BETWEEN 50 AND 200;',
    ['BETWEEN is inclusive on both ends'],
    'BETWEEN includes both boundary values. Equivalent to >= 50 AND <= 200.'
  ),
  p('sql-12', 'Multiple Columns', 'Easy', 'basic', ['SELECT'], 'hr', ['microsoft', 'google'], 92, 5,
    'Write a query to get only the first_name, last_name, and salary of all employees.',
    'SELECT first_name, last_name, salary FROM employees;',
    ['List specific column names instead of *'],
    'Selecting specific columns is better practice than SELECT * for readability and performance.'
  ),
  p('sql-13', 'Column Aliases', 'Easy', 'basic', ['SELECT'], 'hr', ['google'], 90, 5,
    'Write a query to display employee full names (first + last) as "full_name" and their salary as "annual_pay".',
    "SELECT CONCAT(first_name, ' ', last_name) AS full_name, salary AS annual_pay FROM employees;",
    ['Use AS for column aliases', 'CONCAT joins strings together'],
    'AS creates aliases for columns. CONCAT concatenates string values.'
  ),
  p('sql-14', 'Conditional Selection', 'Easy', 'basic', ['SELECT', 'WHERE'], 'banking', ['stripe', 'google'], 83, 8,
    'Write a query to find all active accounts with a balance greater than $10,000.',
    'SELECT * FROM accounts WHERE is_active = TRUE AND balance > 10000;',
    ['Combine conditions with AND'],
    'AND requires both conditions to be true for a row to be included.'
  ),
  p('sql-15', 'OR Conditions', 'Easy', 'basic', ['SELECT', 'WHERE'], 'healthcare', ['google'], 86, 5,
    'Write a query to find all appointments that are either scheduled or completed.',
    "SELECT * FROM appointments WHERE status = 'scheduled' OR status = 'completed';",
    ['Use OR when either condition should match'],
    'OR includes rows where at least one condition is true.'
  ),
  p('sql-16', 'NOT Operator', 'Easy', 'basic', ['SELECT', 'WHERE'], 'ecommerce', ['amazon'], 84, 5,
    'Write a query to find all orders that are NOT cancelled.',
    "SELECT * FROM orders WHERE status != 'cancelled';",
    ['Use != or <> or NOT for negation'],
    '!= (or <>) excludes rows matching the specified value.'
  ),
  p('sql-17', 'Count Rows', 'Easy', 'basic', ['SELECT', 'COUNT'], 'ecommerce', ['google', 'meta'], 90, 5,
    'Write a query to count the total number of products.',
    'SELECT COUNT(*) AS total_products FROM products;',
    ['COUNT(*) counts all rows'],
    'COUNT(*) returns the total number of rows in the result set.'
  ),
  p('sql-18', 'Arithmetic in SELECT', 'Easy', 'basic', ['SELECT'], 'ecommerce', ['amazon'], 88, 8,
    'Write a query to show each product name and its price with 10% tax added.',
    'SELECT product_name, price, price * 1.10 AS price_with_tax FROM products;',
    ['You can do arithmetic in SELECT'],
    'SQL supports arithmetic operations (+, -, *, /) directly in SELECT expressions.'
  ),
  p('sql-19', 'Multi-Column Sort', 'Easy', 'basic', ['SELECT', 'ORDER BY'], 'hr', ['microsoft'], 85, 8,
    'Write a query to list all employees sorted by department_id ascending, then by salary descending within each department.',
    'SELECT * FROM employees ORDER BY department_id ASC, salary DESC;',
    ['ORDER BY can have multiple columns'],
    'Multiple ORDER BY columns are evaluated left to right. Each can be ASC or DESC.'
  ),
  p('sql-20', 'CASE Expression', 'Medium', 'basic', ['SELECT', 'CASE'], 'ecommerce', ['google', 'amazon'], 72, 10,
    'Write a query to classify products as "Budget" (price < 100), "Mid-Range" (100-500), or "Premium" (> 500). Show product_name and the classification as "tier".',
    "SELECT product_name, CASE WHEN price < 100 THEN 'Budget' WHEN price <= 500 THEN 'Mid-Range' ELSE 'Premium' END AS tier FROM products;",
    ['CASE WHEN creates conditional logic', 'ELSE handles all remaining cases', 'END closes the CASE block'],
    'CASE expressions allow conditional logic in SQL, similar to if/else in programming.'
  ),

  // ════════════════════════════════════════
  // JOINS (21-45)
  // ════════════════════════════════════════
  p('sql-21', 'Basic Inner Join', 'Easy', 'joins', ['INNER JOIN'], 'ecommerce', ['google', 'amazon'], 88, 8,
    'Write a query to list all orders with the customer\'s first_name and last_name.',
    'SELECT o.order_id, c.first_name, c.last_name, o.order_date, o.total_amount FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id;',
    ['INNER JOIN matches rows from both tables', 'Use ON to specify the join condition'],
    'INNER JOIN returns only rows where there is a match in both tables.'
  ),
  p('sql-22', 'Left Join', 'Easy', 'joins', ['LEFT JOIN'], 'ecommerce', ['amazon', 'meta'], 82, 10,
    'Write a query to list ALL customers and their orders. Customers without orders should still appear with NULL order details.',
    'SELECT c.first_name, c.last_name, o.order_id, o.total_amount FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;',
    ['LEFT JOIN keeps all rows from the left table', 'Unmatched rows get NULL for right table columns'],
    'LEFT JOIN preserves all rows from the left table. When no match exists in the right table, columns from the right table are NULL.'
  ),
  p('sql-23', 'Multi-Table Join', 'Medium', 'joins', ['INNER JOIN'], 'ecommerce', ['google', 'meta', 'amazon'], 75, 12,
    'Write a query to show each order item with the order date, product name, quantity, and unit price.',
    'SELECT o.order_date, p.product_name, oi.quantity, oi.unit_price FROM order_items oi JOIN orders o ON oi.order_id = o.order_id JOIN products p ON oi.product_id = p.product_id;',
    ['Chain multiple JOINs', 'Each JOIN adds another table'],
    'Multiple JOINs can be chained to connect 3+ tables. Each JOIN needs its own ON condition.'
  ),
  p('sql-24', 'Self Join — Manager Lookup', 'Medium', 'joins', ['SELF JOIN'], 'hr', ['google', 'microsoft', 'amazon'], 68, 15,
    'Write a query to list each employee\'s name alongside their manager\'s name. Employees without a manager should show NULL for manager name.',
    "SELECT e.first_name || ' ' || e.last_name AS employee, m.first_name || ' ' || m.last_name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.employee_id;",
    ['A self-join joins a table to itself', 'Use different aliases for the same table', 'LEFT JOIN to include employees with no manager'],
    'Self-joins use table aliases to treat one table as two. This is common for hierarchical data like org charts.'
  ),
  p('sql-25', 'Join with Aggregation', 'Medium', 'joins', ['INNER JOIN', 'COUNT', 'GROUP BY'], 'ecommerce', ['amazon', 'google'], 70, 12,
    'Write a query to find the number of orders placed by each customer. Show customer name and order count, sorted by most orders first.',
    "SELECT c.first_name, c.last_name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY order_count DESC;",
    ['Join customers and orders first', 'Then GROUP BY customer', 'COUNT the orders per customer'],
    'Combining JOINs with GROUP BY is one of the most common SQL patterns for summarizing related data.'
  ),
  p('sql-26', 'Products Never Ordered', 'Medium', 'joins', ['LEFT JOIN', 'NULL Handling'], 'ecommerce', ['meta', 'amazon'], 65, 12,
    'Write a query to find all products that have never been ordered.',
    'SELECT p.product_name FROM products p LEFT JOIN order_items oi ON p.product_id = oi.product_id WHERE oi.item_id IS NULL;',
    ['LEFT JOIN keeps all products', 'Filter for NULLs to find non-matches'],
    'LEFT JOIN + WHERE IS NULL is a common anti-join pattern to find rows in one table with no match in another.'
  ),
  p('sql-27', 'Cross Join — All Combinations', 'Medium', 'joins', ['CROSS JOIN'], 'education', ['google'], 70, 10,
    'Write a query to generate all possible student-course combinations.',
    'SELECT s.name AS student, c.course_name FROM students s CROSS JOIN courses c;',
    ['CROSS JOIN produces the Cartesian product', 'Every row in table A is combined with every row in table B'],
    'CROSS JOIN creates all possible pairings. Useful for generating combinations, but can produce very large result sets.'
  ),
  p('sql-28', 'Join Three Tables', 'Medium', 'joins', ['INNER JOIN'], 'healthcare', ['google', 'amazon'], 72, 12,
    'Write a query to list each appointment with the patient name, doctor name, and diagnosis.',
    "SELECT p.first_name || ' ' || p.last_name AS patient, d.first_name || ' ' || d.last_name AS doctor, a.appointment_date, a.diagnosis FROM appointments a JOIN patients p ON a.patient_id = p.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id;",
    ['Join appointments to both patients and doctors'],
    'Three-table joins are common when a junction/bridge table connects two entity tables.'
  ),
  p('sql-29', 'Right Join', 'Easy', 'joins', ['RIGHT JOIN'], 'hr', ['microsoft'], 78, 10,
    'Write a query to list all departments and any employees in them. Departments with no employees should still appear.',
    'SELECT d.department_name, e.first_name, e.last_name FROM employees e RIGHT JOIN departments d ON e.department_id = d.department_id;',
    ['RIGHT JOIN keeps all rows from the right table'],
    'RIGHT JOIN is the mirror of LEFT JOIN — it preserves all rows from the right table.'
  ),
  p('sql-30', 'Join with Filter', 'Medium', 'joins', ['INNER JOIN', 'WHERE'], 'ecommerce', ['amazon', 'google'], 74, 10,
    'Write a query to find all 5-star reviews with the product name and customer name.',
    "SELECT p.product_name, c.first_name, c.last_name, r.review_text FROM reviews r JOIN products p ON r.product_id = p.product_id JOIN customers c ON r.customer_id = c.customer_id WHERE r.rating = 5;",
    ['Join reviews to products and customers', 'Filter with WHERE after joining'],
    'WHERE is applied after JOINs, so you can filter on any column from the joined tables.'
  ),
  p('sql-31', 'Followers — Mutual Follows', 'Hard', 'joins', ['SELF JOIN', 'INNER JOIN'], 'social', ['meta', 'twitter'], 45, 20,
    'Write a query to find all pairs of users who follow each other (mutual followers). Show both usernames.',
    "SELECT u1.username AS user1, u2.username AS user2 FROM followers f1 JOIN followers f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id JOIN users u1 ON f1.follower_id = u1.user_id JOIN users u2 ON f1.following_id = u2.user_id WHERE f1.follower_id < f1.following_id;",
    ['Self-join the followers table to find reciprocal pairs', 'Use < to avoid duplicates'],
    'This pattern joins followers to itself to find reciprocal relationships. The < condition avoids showing (A,B) and (B,A) as separate results.'
  ),
  p('sql-32', 'Full Outer Join', 'Medium', 'joins', ['FULL JOIN'], 'inventory', ['google'], 62, 12,
    'Write a query showing all products and all warehouses — even products not in any warehouse and warehouses with no products.',
    'SELECT p.product_name, w.warehouse_name, s.quantity FROM products p FULL OUTER JOIN stock s ON p.product_id = s.product_id FULL OUTER JOIN warehouses w ON s.warehouse_id = w.warehouse_id;',
    ['FULL OUTER JOIN preserves unmatched rows from both tables'],
    'FULL OUTER JOIN combines LEFT and RIGHT JOIN behaviors — no rows are lost from either table.'
  ),
  p('sql-33', 'Revenue Per Category', 'Medium', 'joins', ['INNER JOIN', 'SUM', 'GROUP BY'], 'ecommerce', ['amazon', 'google', 'meta'], 65, 15,
    'Write a query to calculate total revenue per product category. Show category name and total revenue, sorted by revenue descending.',
    'SELECT cat.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM order_items oi JOIN products p ON oi.product_id = p.product_id JOIN categories cat ON p.category_id = cat.category_id GROUP BY cat.category_name ORDER BY total_revenue DESC;',
    ['Join order_items → products → categories', 'Revenue = quantity × unit_price', 'SUM and GROUP BY for totals per category'],
    'Multi-table joins with aggregation are a staple of business reporting. The revenue calculation happens at the order_items level.'
  ),
  p('sql-34', 'Doctors Without Appointments', 'Medium', 'joins', ['LEFT JOIN', 'NULL Handling'], 'healthcare', ['google'], 70, 10,
    'Find all doctors who have no appointments scheduled.',
    'SELECT d.first_name, d.last_name, d.specialization FROM doctors d LEFT JOIN appointments a ON d.doctor_id = a.doctor_id WHERE a.appointment_id IS NULL;',
    ['LEFT JOIN doctors to appointments', 'WHERE IS NULL finds doctors with no match'],
    'Anti-join pattern: LEFT JOIN combined with IS NULL check to find unmatched rows.'
  ),
  p('sql-35', 'Join with Date Filter', 'Medium', 'joins', ['INNER JOIN', 'WHERE'], 'banking', ['stripe', 'google'], 72, 12,
    'Find all transactions made from checking accounts in January 2024. Show account holder name, transaction type, amount, and date.',
    "SELECT a.customer_name, t.transaction_type, t.amount, t.transaction_date FROM transactions t JOIN accounts a ON t.account_id = a.account_id WHERE a.account_type = 'checking' AND t.transaction_date >= '2024-01-01' AND t.transaction_date < '2024-02-01';",
    ['Join transactions with accounts first', 'Filter by account_type and date range'],
    'Combining JOINs with date range filters is common in financial queries.'
  ),

  // ════════════════════════════════════════
  // AGGREGATIONS (36-55)
  // ════════════════════════════════════════
  p('sql-36', 'Average Salary by Department', 'Easy', 'aggregations', ['AVG', 'GROUP BY'], 'hr', ['google', 'microsoft', 'amazon'], 85, 8,
    'Write a query to find the average salary for each department. Show department_id and average salary rounded to 2 decimal places.',
    'SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary FROM employees GROUP BY department_id;',
    ['AVG calculates the mean', 'GROUP BY splits into groups', 'ROUND to 2 decimals'],
    'GROUP BY creates groups of rows sharing the same department_id, then AVG computes the mean salary within each group.'
  ),
  p('sql-37', 'Orders Per Status', 'Easy', 'aggregations', ['COUNT', 'GROUP BY'], 'ecommerce', ['amazon'], 88, 8,
    'Write a query to count how many orders exist in each status.',
    'SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;',
    ['GROUP BY status to create groups', 'COUNT per group'],
    'Counting by status is a fundamental reporting pattern used across all domains.'
  ),
  p('sql-38', 'HAVING Filter', 'Medium', 'aggregations', ['COUNT', 'GROUP BY', 'HAVING'], 'ecommerce', ['google', 'amazon'], 72, 10,
    'Find products that have received more than 1 review. Show product_id and review count.',
    'SELECT product_id, COUNT(*) AS review_count FROM reviews GROUP BY product_id HAVING COUNT(*) > 1;',
    ['HAVING filters groups, WHERE filters rows', 'HAVING comes after GROUP BY'],
    'HAVING is like WHERE but for aggregated groups. It filters after GROUP BY has been applied.'
  ),
  p('sql-39', 'Min and Max Salary', 'Easy', 'aggregations', ['MIN', 'MAX'], 'hr', ['microsoft'], 90, 5,
    'Write a query to find the minimum and maximum salary across all employees.',
    'SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees;',
    ['MIN and MAX find extremes'],
    'MIN and MAX work on any sortable data type: numbers, strings, dates.'
  ),
  p('sql-40', 'Total Revenue Per Customer', 'Medium', 'aggregations', ['SUM', 'GROUP BY', 'INNER JOIN'], 'ecommerce', ['amazon', 'google'], 70, 12,
    'Calculate the total amount spent by each customer. Show customer name and total amount, sorted by highest spender.',
    "SELECT c.first_name, c.last_name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_spent DESC;",
    ['Join customers to orders', 'SUM order amounts per customer'],
    'This combines JOIN with aggregation — a core analytics pattern.'
  ),
  p('sql-41', 'Average Rating Per Product', 'Easy', 'aggregations', ['AVG', 'GROUP BY'], 'ecommerce', ['amazon'], 82, 8,
    'Find the average rating for each product. Show product_id and average rating.',
    'SELECT product_id, ROUND(AVG(rating), 1) AS avg_rating FROM reviews GROUP BY product_id ORDER BY avg_rating DESC;',
    ['AVG(rating) computes the mean rating per product'],
    'Average ratings are one of the most common aggregation queries in e-commerce.'
  ),
  p('sql-42', 'Departments with High Avg Salary', 'Medium', 'aggregations', ['AVG', 'GROUP BY', 'HAVING'], 'hr', ['google', 'microsoft'], 68, 12,
    'Find departments where the average salary exceeds $150,000.',
    'SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary FROM employees GROUP BY department_id HAVING AVG(salary) > 150000;',
    ['Use HAVING to filter on aggregated values'],
    'HAVING works on aggregate values — you cannot use WHERE with AVG(), SUM(), etc.'
  ),
  p('sql-43', 'Monthly Order Totals', 'Medium', 'aggregations', ['SUM', 'GROUP BY', 'Date Functions'], 'ecommerce', ['amazon', 'google', 'meta'], 65, 15,
    'Calculate total order value per month. Show year-month and total.',
    "SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS monthly_total FROM orders GROUP BY DATE_FORMAT(order_date, '%Y-%m') ORDER BY month;",
    ['Use DATE_FORMAT to extract year-month', 'GROUP BY the formatted date'],
    'Date-based aggregation is essential for time-series analysis. DATE_FORMAT extracts parts of a date.'
  ),
  p('sql-44', 'Count Per Difficulty', 'Easy', 'aggregations', ['COUNT', 'GROUP BY'], 'social', ['meta'], 85, 5,
    'Count how many public vs private posts exist.',
    'SELECT is_public, COUNT(*) AS post_count FROM posts GROUP BY is_public;',
    ['GROUP BY boolean column'],
    'Boolean columns can be grouped just like any other column.'
  ),
  p('sql-45', 'Highest Spending Customer', 'Medium', 'aggregations', ['SUM', 'GROUP BY', 'ORDER BY', 'LIMIT'], 'ecommerce', ['amazon'], 72, 10,
    'Find the customer who has spent the most money overall. Show their name and total spending.',
    "SELECT c.first_name, c.last_name, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_spent DESC LIMIT 1;",
    ['Aggregate, sort, and limit to find the top 1'],
    'ORDER BY DESC + LIMIT 1 is the standard pattern for finding the maximum.'
  ),
  p('sql-46', 'Multiple Aggregations', 'Medium', 'aggregations', ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'GROUP BY'], 'banking', ['stripe'], 68, 12,
    'For each account type, find the number of accounts, total balance, average balance, min balance, and max balance.',
    'SELECT account_type, COUNT(*) AS num_accounts, SUM(balance) AS total_balance, ROUND(AVG(balance), 2) AS avg_balance, MIN(balance) AS min_balance, MAX(balance) AS max_balance FROM accounts GROUP BY account_type;',
    ['You can use multiple aggregate functions in one query'],
    'Combining multiple aggregations gives a comprehensive statistical summary of each group.'
  ),
  p('sql-47', 'Group by Multiple Columns', 'Medium', 'aggregations', ['COUNT', 'GROUP BY'], 'hr', ['microsoft', 'google'], 70, 10,
    'Count the number of employees per department per job title.',
    'SELECT department_id, job_title, COUNT(*) AS emp_count FROM employees GROUP BY department_id, job_title ORDER BY department_id, emp_count DESC;',
    ['GROUP BY accepts multiple columns'],
    'Multi-column GROUP BY creates groups based on unique combinations of the specified columns.'
  ),
  p('sql-48', 'Conditional Aggregation', 'Medium', 'aggregations', ['COUNT', 'CASE', 'GROUP BY'], 'ecommerce', ['google', 'amazon'], 60, 15,
    'Write a single query to count orders by status: pending_count, shipped_count, delivered_count, cancelled_count.',
    "SELECT COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count, COUNT(CASE WHEN status = 'shipped' THEN 1 END) AS shipped_count, COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_count, COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_count FROM orders;",
    ['CASE inside COUNT for conditional counting', 'No GROUP BY needed — this pivots into columns'],
    'Conditional aggregation uses CASE inside aggregate functions to create pivot-style results in a single row.'
  ),
  p('sql-49', 'Percentage Calculation', 'Medium', 'aggregations', ['COUNT', 'GROUP BY'], 'ecommerce', ['amazon', 'meta'], 58, 15,
    'Calculate the percentage of orders in each status. Show status and percentage rounded to 1 decimal.',
    'SELECT status, COUNT(*) AS cnt, ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS percentage FROM orders GROUP BY status;',
    ['Divide each group count by total count', 'Multiply by 100 for percentage'],
    'Window function SUM() OVER() calculates the total across all groups, enabling percentage calculation.'
  ),
  p('sql-50', 'Rollup Summary', 'Hard', 'aggregations', ['SUM', 'GROUP BY'], 'ecommerce', ['google'], 48, 20,
    'Calculate total revenue per category with a grand total row at the bottom using ROLLUP.',
    'SELECT COALESCE(cat.category_name, \'TOTAL\') AS category, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON oi.product_id = p.product_id JOIN categories cat ON p.category_id = cat.category_id GROUP BY ROLLUP(cat.category_name);',
    ['ROLLUP adds subtotal/grand total rows', 'COALESCE replaces NULL with a label'],
    'GROUP BY ROLLUP creates hierarchical subtotals.'
  ),

  // ════════════════════════════════════════
  // SUBQUERIES (51-65)
  // ════════════════════════════════════════
  p('sql-51', 'Scalar Subquery', 'Medium', 'subqueries', ['Subquery'], 'hr', ['google', 'amazon'], 72, 10,
    'Find all employees whose salary is above the company average.',
    'SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    ['A scalar subquery returns a single value', 'Use it in WHERE for comparison'],
    'Scalar subqueries return one value and can be used anywhere a single value is expected.'
  ),
  p('sql-52', 'IN Subquery', 'Medium', 'subqueries', ['Subquery', 'IN'], 'ecommerce', ['amazon'], 70, 10,
    'Find all customers who have placed at least one order.',
    'SELECT * FROM customers WHERE customer_id IN (SELECT DISTINCT customer_id FROM orders);',
    ['IN subquery returns a list of values'],
    'IN subquery checks if a value exists in the set returned by the inner query.'
  ),
  p('sql-53', 'NOT IN Subquery', 'Medium', 'subqueries', ['Subquery', 'IN'], 'ecommerce', ['meta'], 68, 10,
    'Find all customers who have never placed an order.',
    'SELECT * FROM customers WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM orders);',
    ['NOT IN excludes matching values'],
    'NOT IN is the inverse of IN. Be careful with NULLs in the subquery result.'
  ),
  p('sql-54', 'EXISTS Subquery', 'Medium', 'subqueries', ['EXISTS', 'Correlated Subquery'], 'ecommerce', ['google', 'amazon'], 62, 15,
    'Find all products that have at least one 5-star review using EXISTS.',
    'SELECT p.product_name FROM products p WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.product_id = p.product_id AND r.rating = 5);',
    ['EXISTS returns TRUE if the subquery returns any rows', 'The subquery references the outer query (correlated)'],
    'EXISTS is often faster than IN for large datasets because it short-circuits on the first match.'
  ),
  p('sql-55', 'Correlated Subquery', 'Hard', 'subqueries', ['Correlated Subquery'], 'hr', ['google', 'microsoft'], 52, 18,
    'Find employees who earn more than the average salary in their own department.',
    'SELECT e.first_name, e.last_name, e.salary, e.department_id FROM employees e WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id);',
    ['The inner query references the outer query', 'It runs once per row in the outer query'],
    'Correlated subqueries reference columns from the outer query, making them row-dependent.'
  ),
  p('sql-56', 'Subquery in FROM', 'Medium', 'subqueries', ['Subquery', 'GROUP BY'], 'ecommerce', ['amazon'], 65, 12,
    'Find the average number of orders per customer using a subquery in FROM.',
    'SELECT AVG(order_count) AS avg_orders_per_customer FROM (SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id) AS customer_orders;',
    ['Subqueries in FROM act as derived tables', 'Must be aliased'],
    'Derived tables (subqueries in FROM) let you aggregate on top of aggregations.'
  ),
  p('sql-57', 'Top N Per Group', 'Hard', 'subqueries', ['Correlated Subquery'], 'hr', ['google', 'amazon', 'meta'], 42, 20,
    'Find the top 2 highest-paid employees in each department.',
    'SELECT e.department_id, e.first_name, e.last_name, e.salary FROM employees e WHERE (SELECT COUNT(*) FROM employees e2 WHERE e2.department_id = e.department_id AND e2.salary > e.salary) < 2 ORDER BY e.department_id, e.salary DESC;',
    ['Count how many employees earn more in the same dept', 'If fewer than 2 earn more, this employee is in top 2'],
    'This correlated subquery approach works in all SQL dialects. Window functions offer a cleaner alternative.'
  ),
  p('sql-58', 'ANY / ALL Operators', 'Medium', 'subqueries', ['ANY', 'ALL', 'Subquery'], 'hr', ['microsoft'], 58, 12,
    'Find employees whose salary is greater than ALL salaries in the Marketing department (dept 2).',
    'SELECT first_name, last_name, salary FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 2);',
    ['ALL means the condition must be true for every value'],
    'ALL requires the comparison to hold against every value returned by the subquery.'
  ),
  p('sql-59', 'Subquery in SELECT', 'Medium', 'subqueries', ['Subquery'], 'ecommerce', ['google'], 60, 12,
    'For each product, show its name, price, and the average price of all products.',
    'SELECT product_name, price, (SELECT ROUND(AVG(price), 2) FROM products) AS avg_price FROM products;',
    ['Scalar subqueries can appear in SELECT'],
    'A subquery in SELECT computes a value for each row. Here the subquery is uncorrelated so it returns the same value for every row.'
  ),
  p('sql-60', 'Nested Subqueries', 'Hard', 'subqueries', ['Subquery', 'IN'], 'ecommerce', ['amazon', 'google'], 45, 20,
    'Find the names of customers who ordered products in the Electronics category (category_id = 1).',
    "SELECT first_name, last_name FROM customers WHERE customer_id IN (SELECT customer_id FROM orders WHERE order_id IN (SELECT order_id FROM order_items WHERE product_id IN (SELECT product_id FROM products WHERE category_id = 1)));",
    ['Subqueries can be nested multiple levels deep', 'Work from the innermost query outward'],
    'Deeply nested subqueries trace a path through related tables. JOINs are often more readable for this pattern.'
  ),

  // ════════════════════════════════════════
  // WINDOW FUNCTIONS (61-80)
  // ════════════════════════════════════════
  p('sql-61', 'ROW_NUMBER Basics', 'Medium', 'window', ['ROW_NUMBER'], 'hr', ['google', 'amazon'], 72, 10,
    'Assign a row number to each employee ordered by salary descending.',
    'SELECT first_name, last_name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num FROM employees;',
    ['ROW_NUMBER() assigns sequential numbers', 'OVER defines the window'],
    'ROW_NUMBER assigns a unique sequential integer to each row within the result set.'
  ),
  p('sql-62', 'RANK vs DENSE_RANK', 'Medium', 'window', ['RANK', 'DENSE_RANK'], 'hr', ['google', 'microsoft'], 65, 12,
    'Rank employees by salary. Show both RANK and DENSE_RANK to see the difference.',
    'SELECT first_name, last_name, salary, RANK() OVER (ORDER BY salary DESC) AS rank, DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank FROM employees;',
    ['RANK skips numbers after ties', 'DENSE_RANK does not skip'],
    'With salaries 100, 100, 80: RANK gives 1,1,3 while DENSE_RANK gives 1,1,2.'
  ),
  p('sql-63', 'PARTITION BY', 'Medium', 'window', ['ROW_NUMBER', 'RANK'], 'hr', ['google', 'amazon', 'meta'], 60, 15,
    'Rank employees within each department by salary. Show department, name, salary, and rank.',
    'SELECT department_id, first_name, last_name, salary, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank FROM employees;',
    ['PARTITION BY creates independent groups for the window function'],
    'PARTITION BY is like GROUP BY for window functions — it resets the calculation for each partition.'
  ),
  p('sql-64', 'Running Total', 'Medium', 'window', ['SUM'], 'banking', ['stripe', 'google'], 58, 15,
    'Calculate a running total of transaction amounts for account 1001, ordered by date.',
    'SELECT transaction_date, amount, SUM(amount) OVER (ORDER BY transaction_date) AS running_total FROM transactions WHERE account_id = 1001;',
    ['SUM() OVER (ORDER BY ...) creates a cumulative sum'],
    'A window SUM with ORDER BY accumulates values row by row, creating a running total.'
  ),
  p('sql-65', 'LAG — Previous Row', 'Medium', 'window', ['LAG'], 'banking', ['stripe', 'google'], 55, 15,
    'For each transaction on account 1001, show the previous transaction amount.',
    'SELECT transaction_date, amount, LAG(amount, 1) OVER (ORDER BY transaction_date) AS prev_amount FROM transactions WHERE account_id = 1001;',
    ['LAG(column, n) looks back n rows'],
    'LAG accesses data from a previous row without needing a self-join.'
  ),
  p('sql-66', 'LEAD — Next Row', 'Medium', 'window', ['LEAD'], 'banking', ['stripe'], 55, 15,
    'For each transaction on account 1001, show the next transaction amount.',
    'SELECT transaction_date, amount, LEAD(amount, 1) OVER (ORDER BY transaction_date) AS next_amount FROM transactions WHERE account_id = 1001;',
    ['LEAD(column, n) looks forward n rows'],
    'LEAD accesses data from a subsequent row. NULL is returned when there is no next row.'
  ),
  p('sql-67', 'Month-over-Month Change', 'Hard', 'window', ['LAG', 'Date Functions'], 'ecommerce', ['amazon', 'google', 'meta'], 42, 20,
    'Calculate the month-over-month percentage change in total order revenue.',
    "SELECT month, monthly_revenue, LAG(monthly_revenue) OVER (ORDER BY month) AS prev_month, ROUND((monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY month)) * 100.0 / LAG(monthly_revenue) OVER (ORDER BY month), 1) AS pct_change FROM (SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS monthly_revenue FROM orders GROUP BY DATE_FORMAT(order_date, '%Y-%m')) monthly;",
    ['First aggregate by month', 'Then use LAG to get previous month', 'Calculate percentage change'],
    'This two-step pattern (aggregate then window) is the standard approach for period-over-period analysis.'
  ),
  p('sql-68', 'Top N Per Group (Window)', 'Hard', 'window', ['ROW_NUMBER'], 'hr', ['google', 'amazon', 'microsoft'], 48, 18,
    'Find the highest-paid employee in each department using window functions.',
    'SELECT department_id, first_name, last_name, salary FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn FROM employees) ranked WHERE rn = 1;',
    ['ROW_NUMBER with PARTITION BY ranks within groups', 'Filter for rn = 1 in outer query'],
    'ROW_NUMBER + PARTITION BY is the standard window function approach for top-N-per-group queries.'
  ),
  p('sql-69', 'NTILE — Quartiles', 'Medium', 'window', ['NTILE'], 'hr', ['google'], 58, 12,
    'Divide employees into 4 salary quartiles.',
    'SELECT first_name, last_name, salary, NTILE(4) OVER (ORDER BY salary) AS quartile FROM employees;',
    ['NTILE(n) divides rows into n roughly equal groups'],
    'NTILE distributes rows into buckets. Useful for percentile analysis and data segmentation.'
  ),
  p('sql-70', 'Moving Average', 'Hard', 'window', ['AVG'], 'banking', ['stripe', 'google'], 45, 20,
    'Calculate a 3-transaction moving average of amounts for account 1001.',
    'SELECT transaction_date, amount, ROUND(AVG(amount) OVER (ORDER BY transaction_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg FROM transactions WHERE account_id = 1001;',
    ['ROWS BETWEEN defines the window frame', '2 PRECEDING AND CURRENT ROW = 3-row window'],
    'Window frames control exactly which rows are included in each calculation. ROWS BETWEEN is the key clause.'
  ),
  p('sql-71', 'Cumulative Distribution', 'Hard', 'window', ['RANK'], 'hr', ['google'], 40, 20,
    'Calculate the percentile rank of each employee salary using PERCENT_RANK.',
    'SELECT first_name, last_name, salary, ROUND(PERCENT_RANK() OVER (ORDER BY salary) * 100, 1) AS percentile FROM employees;',
    ['PERCENT_RANK gives relative position as 0-1'],
    'PERCENT_RANK = (rank - 1) / (total_rows - 1). It shows where each value falls in the distribution.'
  ),
  p('sql-72', 'First and Last Value', 'Medium', 'window', ['LAG', 'LEAD'], 'hr', ['microsoft'], 55, 15,
    'For each employee, show the highest and lowest salary in their department using FIRST_VALUE and LAST_VALUE.',
    'SELECT first_name, department_id, salary, FIRST_VALUE(salary) OVER (PARTITION BY department_id ORDER BY salary DESC) AS highest_in_dept, FIRST_VALUE(salary) OVER (PARTITION BY department_id ORDER BY salary ASC) AS lowest_in_dept FROM employees;',
    ['FIRST_VALUE returns the first row in the window frame'],
    'FIRST_VALUE with different ORDER BY directions can get both min and max within a partition.'
  ),

  // ════════════════════════════════════════
  // ADVANCED QUERIES (73-92)
  // ════════════════════════════════════════
  p('sql-73', 'Basic CTE', 'Medium', 'advanced', ['CTE'], 'ecommerce', ['google', 'amazon'], 68, 12,
    'Using a CTE, find customers who have spent more than $1000 total.',
    "WITH customer_spending AS (SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id) SELECT c.first_name, c.last_name, cs.total_spent FROM customers c JOIN customer_spending cs ON c.customer_id = cs.customer_id WHERE cs.total_spent > 1000;",
    ['WITH ... AS defines a CTE', 'CTEs make complex queries more readable'],
    'CTEs (Common Table Expressions) are named temporary result sets that improve query readability.'
  ),
  p('sql-74', 'Multiple CTEs', 'Hard', 'advanced', ['CTE'], 'ecommerce', ['google', 'meta'], 50, 18,
    'Find products where the average review rating is above 4 AND total units sold exceed 1. Use two CTEs.',
    "WITH avg_ratings AS (SELECT product_id, AVG(rating) AS avg_rating FROM reviews GROUP BY product_id), total_sold AS (SELECT product_id, SUM(quantity) AS units_sold FROM order_items GROUP BY product_id) SELECT p.product_name, ar.avg_rating, ts.units_sold FROM products p JOIN avg_ratings ar ON p.product_id = ar.product_id JOIN total_sold ts ON p.product_id = ts.product_id WHERE ar.avg_rating > 4 AND ts.units_sold > 1;",
    ['Multiple CTEs are separated by commas', 'Each CTE can reference previous ones'],
    'Multiple CTEs decompose complex logic into named, readable steps.'
  ),
  p('sql-75', 'Recursive CTE — Org Chart', 'Hard', 'advanced', ['Recursive CTE'], 'hr', ['google', 'microsoft', 'amazon'], 35, 25,
    'Using a recursive CTE, build the full management chain for each employee (employee → manager → manager\'s manager → ...).',
    "WITH RECURSIVE org_chart AS (SELECT employee_id, first_name, last_name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.employee_id, e.first_name, e.last_name, e.manager_id, oc.level + 1 FROM employees e JOIN org_chart oc ON e.manager_id = oc.employee_id) SELECT * FROM org_chart ORDER BY level, employee_id;",
    ['Recursive CTEs have a base case and recursive step', 'UNION ALL connects them', 'The recursion stops when no more rows match'],
    'Recursive CTEs traverse hierarchical data. The base case selects root nodes; the recursive step follows relationships.'
  ),
  p('sql-76', 'Recursive CTE — Category Tree', 'Hard', 'advanced', ['Recursive CTE'], 'ecommerce', ['google'], 38, 25,
    'Build the full category path for each category (e.g., "Electronics > Smartphones").',
    "WITH RECURSIVE cat_tree AS (SELECT category_id, category_name, parent_category_id, CAST(category_name AS CHAR(200)) AS full_path FROM categories WHERE parent_category_id IS NULL UNION ALL SELECT c.category_id, c.category_name, c.parent_category_id, CONCAT(ct.full_path, ' > ', c.category_name) FROM categories c JOIN cat_tree ct ON c.parent_category_id = ct.category_id) SELECT * FROM cat_tree;",
    ['Build path by concatenating names at each level'],
    'Recursive CTEs can accumulate data (like paths) as they traverse the hierarchy.'
  ),
  p('sql-77', 'UNION and UNION ALL', 'Easy', 'advanced', ['CTE'], 'hr', ['microsoft'], 78, 8,
    'Combine a list of all employee names and all department names into a single column.',
    "SELECT first_name AS name, 'Employee' AS type FROM employees UNION SELECT department_name, 'Department' FROM departments;",
    ['UNION combines result sets', 'UNION removes duplicates, UNION ALL keeps them'],
    'UNION vertically stacks results from multiple queries. Columns must match in number and type.'
  ),
  p('sql-78', 'String Functions', 'Easy', 'advanced', ['String Functions'], 'ecommerce', ['google'], 80, 8,
    'Show customer emails in uppercase and extract the domain name (part after @).',
    "SELECT email, UPPER(email) AS upper_email, SUBSTRING(email, LOCATE('@', email) + 1) AS domain FROM customers;",
    ['UPPER converts to uppercase', 'SUBSTRING extracts part of a string', 'LOCATE finds position of a character'],
    'String functions allow text manipulation directly in SQL queries.'
  ),
  p('sql-79', 'Date Functions', 'Medium', 'advanced', ['Date Functions'], 'ecommerce', ['amazon', 'google'], 68, 12,
    'For each order, show how many days ago it was placed and what day of the week it was.',
    "SELECT order_id, order_date, DATEDIFF(CURDATE(), order_date) AS days_ago, DAYNAME(order_date) AS day_of_week FROM orders;",
    ['DATEDIFF calculates difference between dates', 'DAYNAME returns the weekday name'],
    'Date functions provide powerful date manipulation without application-level processing.'
  ),
  p('sql-80', 'COALESCE and IFNULL', 'Easy', 'advanced', ['COALESCE', 'NULL Handling'], 'social', ['meta'], 82, 8,
    'Show all users, replacing NULL bios with "No bio set".',
    "SELECT username, display_name, COALESCE(bio, 'No bio set') AS bio FROM users;",
    ['COALESCE returns the first non-NULL argument'],
    'COALESCE is ANSI-standard and works across all databases. IFNULL is MySQL-specific.'
  ),
  p('sql-81', 'Pivoting Data', 'Hard', 'advanced', ['CASE', 'GROUP BY'], 'ecommerce', ['google', 'amazon'], 42, 20,
    'Create a pivot table showing each customer and their total spending per order status.',
    "SELECT c.first_name, c.last_name, SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END) AS delivered_total, SUM(CASE WHEN o.status = 'shipped' THEN o.total_amount ELSE 0 END) AS shipped_total, SUM(CASE WHEN o.status = 'pending' THEN o.total_amount ELSE 0 END) AS pending_total FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name, c.last_name;",
    ['CASE inside SUM creates pivot columns', 'Each CASE handles one status value'],
    'Manual pivoting uses conditional aggregation to transform row values into columns.'
  ),
  p('sql-82', 'Generate Series — Date Range', 'Hard', 'advanced', ['Recursive CTE', 'Date Functions'], 'ecommerce', ['google'], 38, 22,
    'Generate a date series for all days in January 2024, showing each date and the number of orders placed on that date (0 if none).',
    "WITH RECURSIVE dates AS (SELECT DATE('2024-01-01') AS d UNION ALL SELECT d + INTERVAL 1 DAY FROM dates WHERE d < '2024-01-31') SELECT dates.d AS date, COUNT(o.order_id) AS order_count FROM dates LEFT JOIN orders o ON DATE(o.order_date) = dates.d GROUP BY dates.d ORDER BY dates.d;",
    ['Recursive CTE generates the date series', 'LEFT JOIN orders to include days with 0 orders'],
    'Generating date series fills gaps in time-based data, ensuring every date appears even without data.'
  ),
  p('sql-83', 'JSON in SQL', 'Hard', 'advanced', ['String Functions'], 'social', ['google', 'meta'], 35, 20,
    'Extract the first hashtag from posts whose content contains a # symbol.',
    "SELECT post_id, content, SUBSTRING_INDEX(SUBSTRING_INDEX(content, '#', -1), ' ', 1) AS first_hashtag FROM posts WHERE content LIKE '%#%';",
    ['SUBSTRING_INDEX splits strings by delimiter'],
    'While not ideal, string functions can parse simple patterns from text content.'
  ),
  p('sql-84', 'GROUPING SETS', 'Hard', 'advanced', ['GROUP BY'], 'ecommerce', ['google'], 40, 20,
    'Calculate total revenue grouped by category alone, by status alone, and overall total using GROUPING SETS.',
    "SELECT cat.category_name, o.status, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON oi.product_id = p.product_id JOIN categories cat ON p.category_id = cat.category_id JOIN orders o ON oi.order_id = o.order_id GROUP BY GROUPING SETS ((cat.category_name), (o.status), ());",
    ['GROUPING SETS defines multiple grouping combinations in one query'],
    'GROUPING SETS is like running multiple GROUP BY queries and combining results with UNION ALL.'
  ),

  // ════════════════════════════════════════
  // QUERY OPTIMIZATION (85-95)
  // ════════════════════════════════════════
  p('sql-85', 'Rewrite Correlated to JOIN', 'Medium', 'optimization', ['Indexes', 'INNER JOIN'], 'hr', ['google', 'amazon'], 65, 15,
    'Rewrite this correlated subquery as a JOIN: SELECT * FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)',
    'SELECT e.* FROM employees e JOIN (SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id) dept_avg ON e.department_id = dept_avg.department_id WHERE e.salary > dept_avg.avg_sal;',
    ['Pre-compute department averages in a subquery/CTE', 'JOIN instead of correlated subquery'],
    'JOINs are typically faster than correlated subqueries because they avoid row-by-row execution.'
  ),
  p('sql-86', 'EXISTS vs IN', 'Medium', 'optimization', ['EXISTS', 'IN', 'Indexes'], 'ecommerce', ['google'], 60, 12,
    'Rewrite this query using EXISTS instead of IN: SELECT * FROM customers WHERE customer_id IN (SELECT customer_id FROM orders)',
    'SELECT * FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);',
    ['EXISTS short-circuits on first match', 'More efficient when the subquery returns many rows'],
    'EXISTS stops scanning as soon as it finds a match. IN must evaluate the entire subquery result.'
  ),
  p('sql-87', 'Avoid SELECT *', 'Easy', 'optimization', ['SELECT', 'Indexes'], 'ecommerce', ['google', 'amazon'], 85, 8,
    'Rewrite SELECT * FROM products WHERE price > 100 to only select needed columns: product_name and price.',
    'SELECT product_name, price FROM products WHERE price > 100;',
    ['Select only columns you need', 'Reduces I/O and memory usage'],
    'SELECT * fetches all columns, wasting bandwidth. Specifying columns enables covering index optimizations.'
  ),
  p('sql-88', 'Index-Friendly WHERE', 'Medium', 'optimization', ['Indexes', 'WHERE'], 'ecommerce', ['google', 'amazon'], 55, 15,
    'Rewrite WHERE YEAR(order_date) = 2024 to be index-friendly (sargable).',
    "SELECT * FROM orders WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';",
    ['Functions on columns prevent index usage', 'Use range comparisons instead'],
    'Wrapping a column in a function (YEAR, UPPER, etc.) makes the predicate non-sargable, bypassing indexes.'
  ),
  p('sql-89', 'UNION ALL vs UNION', 'Easy', 'optimization', ['Query Plans'], 'hr', ['microsoft'], 78, 8,
    'Explain why UNION ALL is faster than UNION and rewrite a query that combines employee names from two departments.',
    "SELECT first_name, last_name FROM employees WHERE department_id = 1 UNION ALL SELECT first_name, last_name FROM employees WHERE department_id = 2;",
    ['UNION removes duplicates (requires sorting/hashing)', 'UNION ALL skips deduplication'],
    'UNION ALL is faster because it skips the expensive deduplication step. Use it when duplicates are acceptable.'
  ),
  p('sql-90', 'Pagination with OFFSET', 'Medium', 'optimization', ['LIMIT', 'Query Plans'], 'ecommerce', ['google', 'amazon'], 62, 12,
    'Write an efficient paginated query to get page 3 (items 21-30) of products sorted by price.',
    'SELECT product_id, product_name, price FROM products ORDER BY price, product_id LIMIT 10 OFFSET 20;',
    ['LIMIT sets page size', 'OFFSET skips rows', 'Include a unique column in ORDER BY for deterministic results'],
    'OFFSET-based pagination is simple but gets slower for deep pages. Keyset pagination is more efficient for large datasets.'
  ),
  p('sql-91', 'Anti-Join vs NOT IN', 'Medium', 'optimization', ['LEFT JOIN', 'NULL Handling', 'Indexes'], 'ecommerce', ['google'], 58, 15,
    'Rewrite NOT IN as a LEFT JOIN anti-pattern to find customers without orders (handles NULLs safely).',
    'SELECT c.* FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;',
    ['LEFT JOIN + IS NULL is NULL-safe', 'NOT IN can return unexpected results with NULLs'],
    'LEFT JOIN anti-join is preferred over NOT IN because NOT IN returns no rows if any NULL exists in the subquery.'
  ),

  // ════════════════════════════════════════
  // DATA MANIPULATION (92-100)
  // ════════════════════════════════════════
  p('sql-92', 'INSERT Single Row', 'Easy', 'dml', ['INSERT'], 'ecommerce', ['amazon'], 92, 5,
    'Write a query to insert a new customer: "Frank Wilson", frank@mail.com, from Tokyo, Japan, signed up today.',
    "INSERT INTO customers (first_name, last_name, email, city, country, signup_date) VALUES ('Frank', 'Wilson', 'frank@mail.com', 'Tokyo', 'Japan', CURDATE());",
    ['INSERT INTO ... VALUES adds a new row', 'CURDATE() returns today\'s date'],
    'INSERT adds new rows. Column names and values must correspond in order and count.'
  ),
  p('sql-93', 'INSERT Multiple Rows', 'Easy', 'dml', ['INSERT'], 'ecommerce', ['amazon'], 88, 8,
    'Insert 3 new products at once into the products table.',
    "INSERT INTO products (product_name, category_id, price, stock_quantity, created_at) VALUES ('Pixel 9', 3, 699.99, 100, NOW()), ('iPad Air', 4, 599.99, 80, NOW()), ('Sony WH-1000XM5', 1, 349.99, 200, NOW());",
    ['Multiple VALUES clauses in one INSERT'],
    'Multi-row INSERT is more efficient than multiple single-row inserts.'
  ),
  p('sql-94', 'UPDATE with Condition', 'Easy', 'dml', ['UPDATE', 'WHERE'], 'ecommerce', ['amazon'], 85, 8,
    'Increase the price of all products in category 3 (Smartphones) by 10%.',
    'UPDATE products SET price = price * 1.10 WHERE category_id = 3;',
    ['UPDATE ... SET changes existing data', 'Always use WHERE to avoid updating all rows!'],
    'UPDATE modifies existing rows. Omitting WHERE updates every row in the table — a dangerous mistake.'
  ),
  p('sql-95', 'DELETE with Condition', 'Easy', 'dml', ['DELETE', 'WHERE'], 'ecommerce', ['amazon'], 82, 8,
    'Delete all cancelled orders.',
    "DELETE FROM orders WHERE status = 'cancelled';",
    ['DELETE removes rows', 'Always use WHERE to avoid deleting all data!'],
    'DELETE removes matching rows. Like UPDATE, always include WHERE unless you intend to clear the table.'
  ),
  p('sql-96', 'INSERT from SELECT', 'Medium', 'dml', ['INSERT', 'Subquery'], 'hr', ['google'], 65, 12,
    'Create a backup of all Engineering department employees by inserting them into an employees_backup table.',
    'INSERT INTO employees_backup SELECT * FROM employees WHERE department_id = 1;',
    ['INSERT ... SELECT copies data from one table to another'],
    'INSERT from SELECT is useful for data archiving, backup, and ETL operations.'
  ),
  p('sql-97', 'UPDATE with JOIN', 'Medium', 'dml', ['UPDATE', 'INNER JOIN'], 'ecommerce', ['amazon', 'google'], 55, 15,
    'Update the stock quantity of all products that have been ordered by subtracting the ordered quantity.',
    'UPDATE products p JOIN (SELECT product_id, SUM(quantity) AS total_ordered FROM order_items GROUP BY product_id) oi ON p.product_id = oi.product_id SET p.stock_quantity = p.stock_quantity - oi.total_ordered;',
    ['JOIN in UPDATE to reference another table', 'Aggregate ordered quantities first'],
    'UPDATE with JOIN allows modifying one table based on data from another — common in inventory systems.'
  ),
  p('sql-98', 'Transaction Basics', 'Medium', 'dml', ['Transactions'], 'banking', ['stripe', 'google'], 58, 15,
    'Write a transaction that transfers $500 from account 1001 to account 1002. Both operations must succeed or both must fail.',
    "START TRANSACTION; UPDATE accounts SET balance = balance - 500 WHERE account_id = 1001; UPDATE accounts SET balance = balance + 500 WHERE account_id = 1002; COMMIT;",
    ['START TRANSACTION begins atomic operations', 'COMMIT saves all changes', 'ROLLBACK would undo them all'],
    'Transactions ensure atomicity — either all operations succeed or none do. Critical for financial data.'
  ),
  p('sql-99', 'UPSERT / ON DUPLICATE', 'Medium', 'dml', ['INSERT', 'UPDATE'], 'inventory', ['amazon', 'google'], 52, 15,
    'Insert or update stock for product 1 in warehouse 1. If the entry exists, update the quantity; otherwise, insert a new record.',
    "INSERT INTO stock (product_id, warehouse_id, quantity, last_updated) VALUES (1, 1, 5000, NOW()) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), last_updated = NOW();",
    ['ON DUPLICATE KEY UPDATE handles conflicts', 'Avoids separate SELECT + INSERT/UPDATE logic'],
    'UPSERT (INSERT ... ON DUPLICATE KEY UPDATE) atomically inserts or updates based on unique constraints.'
  ),
  p('sql-100', 'Soft Delete Pattern', 'Medium', 'dml', ['UPDATE', 'WHERE'], 'ecommerce', ['google', 'amazon', 'meta'], 60, 12,
    'Instead of deleting cancelled orders, implement a soft delete by adding an is_deleted flag set to TRUE.',
    "UPDATE orders SET is_deleted = TRUE WHERE status = 'cancelled';",
    ['Soft deletes mark rows as deleted without removing them', 'Allows recovery and audit trails'],
    'Soft deletes preserve data for auditing and recovery. Applications filter with WHERE is_deleted = FALSE.'
  ),
];

// ═══ Helper Functions ═══
export const getSQLProblemById = (id) => SQL_PROBLEMS.find(p => p.id === id);
export const getSQLProblemsByCategory = (cat) => SQL_PROBLEMS.filter(p => p.category === cat);
export const getSQLProblemsByDifficulty = (diff) => SQL_PROBLEMS.filter(p => p.difficulty === diff);
export const getSQLProblemsBySchema = (schemaId) => SQL_PROBLEMS.filter(p => p.schemaId === schemaId);

