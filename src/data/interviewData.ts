import { InterviewQuestion } from '../types';

export const ROLE_INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  'data-analyst': [
    {
      id: 'da-1',
      topic: 'SQL Window Functions',
      difficulty: 'Mid',
      question: 'What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL? Provide an example.',
      answerSummary: 'ROW_NUMBER() produces consecutive unique integers regardless of ties. RANK() assigns the same rank to ties and skips the next numbers (e.g. 1, 2, 2, 4). DENSE_RANK() assigns the same rank to ties without skipping (e.g. 1, 2, 2, 3).',
      keyConcepts: ['Partition by', 'Order by', 'Tie breaking', 'Running totals'],
      codeSnippet: `SELECT employee_id, department_id, salary,
  ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) as row_num,
  RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rnk,
  DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as dense_rnk
FROM employees;`,
      category: 'Technical',
    },
    {
      id: 'da-2',
      topic: 'Pandas Vectorization vs Loops',
      difficulty: 'Junior',
      question: 'Why should you avoid using Python for-loops to iterate over rows in a Pandas DataFrame?',
      answerSummary: 'Pandas uses vectorized NumPy array operations implemented in C under the hood. Using .iterrows() or loops introduces huge Python interpreter overhead, running 50x-100x slower than vectorized broadcasting or .apply() / np.where().',
      keyConcepts: ['Vectorization', 'NumPy memory layout', 'Broadcasting', 'Execution speed'],
      category: 'Conceptual',
    },
    {
      id: 'da-3',
      topic: 'SQL Cumulative Sales Query',
      difficulty: 'Mid',
      question: 'Write a SQL query to calculate running monthly revenue for the year 2024.',
      answerSummary: 'Use SUM(monthly_amount) OVER (ORDER BY month_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
      keyConcepts: ['Window framing', 'Cumulative sums', 'Aggregation'],
      codeSnippet: `SELECT 
  DATE_TRUNC('month', order_date) AS month,
  SUM(order_total) AS monthly_revenue,
  SUM(SUM(order_total)) OVER(ORDER BY DATE_TRUNC('month', order_date)) AS running_ytd_revenue
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2024
GROUP BY 1
ORDER BY 1;`,
      category: 'Coding Challenge',
    },
    {
      id: 'da-4',
      topic: 'Handling Conflicting Metrics',
      difficulty: 'Junior',
      question: 'Describe a situation where two stakeholders disagreed on how a KPI (like active users) should be defined. How did you resolve it?',
      answerSummary: 'Used the STAR technique: defined the context, audited existing definitions, convened both stakeholders with exploratory data distributions, documented edge cases, and aligned on a unified metric dictionary.',
      keyConcepts: ['STAR Method', 'Stakeholder alignment', 'Metric definitions', 'Documentation'],
      category: 'Behavioral',
    },
  ],
  'frontend-developer': [
    {
      id: 'fe-1',
      topic: 'React Re-renders & Memoization',
      difficulty: 'Mid',
      question: 'Explain the difference between useMemo, useCallback, and React.memo. When can premature optimization hurt performance?',
      answerSummary: 'useMemo caches the calculated value of a function. useCallback caches the function instance itself. React.memo prevents a component from re-rendering if its props are shallowly equal. Overusing them adds memory overhead and unnecessary dependency comparison costs for cheap computations.',
      keyConcepts: ['Referential equality', 'Shallow comparison', 'Closure dependencies', 'Profiler API'],
      codeSnippet: `const memoizedValue = useMemo(() => computeHeavyData(data), [data]);
const memoizedCallback = useCallback((id: string) => {
  setActiveItem(id);
}, []);`,
      category: 'Technical',
    },
    {
      id: 'fe-2',
      topic: 'Virtual DOM & Reconciliation',
      difficulty: 'Junior',
      question: 'How does React’s reconciliation algorithm work and why is the "key" prop critical in lists?',
      answerSummary: 'React maintains a lightweight Virtual DOM tree. During reconciliation, React compares fiber nodes. Keys give elements a persistent identity across renders, allowing React to match children across trees and avoid recreating DOM nodes.',
      keyConcepts: ['Fiber architecture', 'Diffing algorithm O(n)', 'Keys and identity', 'DOM mutations'],
      category: 'Conceptual',
    },
    {
      id: 'fe-3',
      topic: 'Custom Debounce Hook',
      difficulty: 'Mid',
      question: 'Implement a reusable useDebounce hook in TypeScript for search input handling.',
      answerSummary: 'Sets up a state that only updates after a specified delay using useEffect and setTimeout, clearing previous timers on dependency change.',
      keyConcepts: ['useEffect cleanup', 'Timers', 'Generics'],
      codeSnippet: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`,
      category: 'Coding Challenge',
    },
  ],
  'backend-developer': [
    {
      id: 'be-1',
      topic: 'Database Indexing & Query Optimization',
      difficulty: 'Mid',
      question: 'How do B-Tree indexes work in PostgreSQL? When does an index scan become slower than a sequential table scan?',
      answerSummary: 'B-Tree indexes maintain a balanced tree of ordered keys pointing to heap tuples, providing O(log n) lookups. When a query returns a large fraction of the table (>15-20%), random I/O from index lookups is slower than a sequential scan reading contiguous disk blocks.',
      keyConcepts: ['B-Tree traversal', 'EXPLAIN ANALYZE', 'Selectivity', 'Covering indexes'],
      category: 'Technical',
    },
    {
      id: 'be-2',
      topic: 'Connection Pooling & Caching',
      difficulty: 'Mid',
      question: 'What happens when thousands of concurrent requests hit a backend without a connection pool? How does Redis alleviate this?',
      answerSummary: 'Each database TCP connection consumes RAM (e.g. 5-10MB in Postgres) and incurs handshake overhead. Without pooling, the DB suffers from thread exhaustion. Connection poolers limit active connections, while Redis caches hot read data.',
      keyConcepts: ['PgBouncer', 'Cache-aside pattern', 'Cache stampede', 'TTL'],
      category: 'Conceptual',
    },
  ],
};

export const DEFAULT_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'gen-1',
    topic: 'Git Branching & Merge Conflicts',
    difficulty: 'Junior',
    question: 'How do you handle a complex merge conflict between your feature branch and the main production branch?',
    answerSummary: 'Fetch latest main, rebase or merge main into the feature branch locally, inspect conflicting files, verify test suite passes, and commit cleanly.',
    keyConcepts: ['git rebase', 'git merge', 'conflict markers', 'local validation'],
    category: 'Technical',
  },
  {
    id: 'gen-2',
    topic: 'Continuous Learning & Problem Solving',
    difficulty: 'Junior',
    question: 'Tell me about a time you encountered a technology or bug you had zero prior experience with. How did you diagnose and solve it?',
    answerSummary: 'Use STAR: describe the roadblock, reading official documentation and issue trackers, constructing a minimal reproducible example, fixing the root cause, and documenting lessons.',
    keyConcepts: ['STAR Method', 'Root cause analysis', 'Self-directed learning', 'Documentation'],
    category: 'Behavioral',
  },
  {
    id: 'gen-3',
    topic: 'REST API Best Practices',
    difficulty: 'Junior',
    question: 'What are idempotent HTTP methods, and why is PUT idempotent while POST is not?',
    answerSummary: 'An idempotent method produces the exact same server state whether executed once or ten times. PUT replaces the entire resource representation at a specific URI, whereas POST creates a new sub-resource with a new ID every call.',
    keyConcepts: ['HTTP semantics', 'Idempotency', 'Status codes 200 vs 201', 'REST'],
    category: 'Conceptual',
  },
];
