
import { supabaseAdmin } from '../db/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedSeniorBlog() {
    console.log('Starting blog seed...');

    try {
        // 1. Get an author (use the first user found or a specific admin email if known)
        // Ideally, we'd use a specific admin user, but falling back to any user works for seeding
        const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (userError) throw userError;
        if (!users || users.length === 0) {
            throw new Error('No users found to assign as author. Please create a user first.');
        }

        const authorId = users[0].id;
        console.log(`Assigning blog post to author ID: ${authorId} (${users[0].email})`);

        // 2. Define Blog Content
        const title = "Scaling Beyond the Monolith: A Senior Engineer's Guide to Distributed Systems & Interviews";
        const slug = "scaling-beyond-monolith-senior-guide-" + Date.now();
        const category = "System Design";
        const coverImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"; // Tech/Network image

        // Rich HTML Content
        const content = `
            <p>As a Junior Engineer, your focus is often on <em>"How do I make this feature work?"</em>. You learn syntax, frameworks, and how to close tickets. But as you transition to Senior roles, the questions transform.</p>
            <p>Suddenly, it's not just about making it work—it's about making it <strong>scalable, maintainable, and resilient</strong>. It's about understanding <em>why</em> things break at scale and how to prevent it.</p>
            <p>In this guide, we'll walk through the evolution of a system from a simple monolith to a distributed architecture, covering real-world production "war stories", interview patterns, and the critical trade-offs every senior engineer must master.</p>

            <h2>Phase 1: The Monolith & The "Good Problems"</h2>
            <p>Every startup begins with a Monolith. And truthfully? You should stay there as long as possible. A single codebase, a single database, and zero network latency between function calls is a beautiful thing.</p>
            
            <h3>When the cracks appear (Real World Example)</h3>
            <p>I once worked on an e-commerce platform that ran perfectly on a single LAMP stack server. Then Black Friday hit.</p>
            <p>Our database CPU spiked to 100%. Queries that usually took 50ms were timing out after 30 seconds. The site didn't just slow down; it completely locked up. Why? Because we were doing <strong>synchronous processing</strong> for everything.</p>
            <ul>
                <li>User places order &rarr; Write to DB &rarr; <strong>Send Email (Sync)</strong> &rarr; <strong>Update Inventory (Sync)</strong> &rarr; <strong>Notify Shipping (Sync)</strong> &rarr; Return Response.</li>
            </ul>
            <p>If the email server was slow, the database transaction remained open. Connection pool exhaustion followed shortly after.</p>

            <blockquote>
                <strong>Senior Insight:</strong> The first step in scaling isn't usually "Microservices". It's often "Asynchronous Processing".
            </blockquote>

            <h2>Phase 2: Decoupling & Queue-Based Architecture</h2>
            <p>To fix the Black Friday disaster, we didn't rewrite the app into 50 microservices. We introduced a <strong>Message Queue</strong> (RabbitMQ/SQS).</p>
            <p>The flow became:</p>
            <ol>
                <li>User places order &rarr; Write to DB (Status: <em>PENDING</em>).</li>
                <li>Publish event: <code>OrderCreated</code>.</li>
                <li>Return "Success" to user immediately.</li>
            </ol>
            <p>Background workers then picked up <code>OrderCreated</code> to handle emails, inventory, and shipping independently. If the email server died, the checkout process remained fast. This is the power of <strong>Event-Driven Architecture</strong>.</p>

            <h3>Interview Question: Design Ticketmaster/Booking System</h3>
            <p><strong>Interviewer:</strong> "How do you handle 10,000 users trying to buy the same last ticket for a concert?"</p>
            <p><strong>Junior Answer:</strong> "Use a database transaction." (Technically true, but fails at scale due to locking).</p>
            <p><strong>Senior Answer:</strong> "We need to handle concurrency without locking the entire table. We can use Redis for atomic decrements or optimistic locking in the database."</p>
            <pre><code class="language-sql">-- Optimistic Locking Example
UPDATE inventory 
SET quantity = quantity - 1 
WHERE item_id = 123 AND quantity > 0;
</code></pre>
            <p>If the affected row count is 0, we know the item was sold out in the microsecond between reading and writing. We return a clear error to the user without crashing the DB.</p>

            <h2>Phase 3: Relational vs. NoSQL (The "Why")</h2>
            <p>Interviews often ask: <em>"Should we use MongoDB or PostgreSQL?"</em></p>
            <p>The answer is never just one or the other. It depends on your <strong>Access Patterns</strong>.</p>
            
            <h3>Comparison Cheat Sheet</h3>
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>PostgreSQL (SQL)</th>
                        <th>DynamoDB/Mongo (NoSQL)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Structure</strong></td>
                        <td>Strict Schema (Tables, Rows)</td>
                        <td>Flexible Schema (Documents, Key-Value)</td>
                    </tr>
                    <tr>
                        <td><strong>Relationships</strong></td>
                        <td>Joins are powerful & native</td>
                        <td>Joins are expensive/impossible; prefer embedding</td>
                    </tr>
                    <tr>
                        <td><strong>Scaling</strong></td>
                        <td>Vertical (add CPU/RAM) is easiest; Horizontal (sharding) is hard</td>
                        <td>Horizontal scaling is built-in</td>
                    </tr>
                </tbody>
            </table>

            <p><strong>Best Practice:</strong> Default to SQL (Postgres) unless you have a specific reason not to (e.g., massive unstructured data, or write throughput exceeding single-node limits).</p>

            <h2>Production Best Practices & "What to Avoid"</h2>
            
            <h3>1. Avoid Distributed Transactions (Two-Phase Commit)</h3>
            <p>Trying to coordinate a transaction across Service A (Payment) and Service B (Inventory) is a nightmare. If Service B fails, you have to roll back A. It adds latency and complexity.</p>
            <p><strong>Better Approach:</strong> use the <strong>Saga Pattern</strong>. Service A completes. If Service B fails, Service A listens for that failure event and runs a "Compensating Transaction" (e.g., refund the logic).</p>

            <h3>2. Observability is non-negotiable</h3>
            <p>In a distributed system, you can't just "tail the logs". You need:</p>
            <ul>
                <li><strong>Distributed Tracing</strong> (OpenTelemetry/Jaeger) to visualize a request jumping between services.</li>
                <li><strong>Metrics</strong> (High CPU? High Error Rate?)</li>
                <li><strong>Structured Logging</strong> (JSON logs, not plain text) so you can query them.</li>
            </ul>

            <h3>3. Idempotency</h3>
            <p>Queues deliver messages <em>at least once</em>. This means your worker might receive the "Charge User $50" message twice. If you process it blindly, you charge them $100.</p>
            <p><strong>Fix:</strong> Ensure operations are Idempotent. Use a unique <code>idempotency_key</code> (like the Order ID) to track if you've already processed this event.</p>

            <h2>Summary</h2>
            <p>Senior engineering is less about code syntax and more about <strong>system behavior</strong>. It's about predicting failure before it happens.</p>
            <p>When you're designing your next system or answering that interview question:</p>
            <ul>
                <li>Start simple (Monolith).</li>
                <li>Decouple with queues when latencies rise.</li>
                <li>Choose databases based on read/write patterns, not hype.</li>
                <li>Assume everything will fail, and design for recovery.</li>
            </ul>
        `;

        // 3. Insert into DB
        const { data: blog, error: blogError } = await supabaseAdmin
            .from('blogs')
            .insert({
                title,
                slug,
                content,
                author_id: authorId,
                category,
                cover_image: coverImage,
                is_published: true,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (blogError) throw blogError;

        console.log('✅ Blog post created successfully!');
        console.log('Title:', blog.title);
        console.log('ID:', blog.id);
        console.log('Slug:', blog.slug);

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed blog post:', error);
        process.exit(1);
    }
}

seedSeniorBlog();
