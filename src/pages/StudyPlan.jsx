import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Circle, BookOpen, Code2, MessageSquare, Clock, Trophy, ChevronRight, ChevronDown } from 'lucide-react';

const demoStudyPlan = {
  totalDays: 90,
  completedDays: 23,
  currentWeek: 4,
  weeks: [
    {
      week: 1, title: 'Foundations — Arrays & Strings',
      days: [
        { day: 1, done: true, theory: 'Array fundamentals', problems: ['Two Sum', 'Contains Duplicate'], mock: null },
        { day: 2, done: true, theory: 'String operations', problems: ['Valid Anagram', 'Group Anagrams'], mock: null },
        { day: 3, done: true, theory: 'Hash maps', problems: ['Top K Frequent Elements', 'Encode and Decode Strings'], mock: null },
        { day: 4, done: true, theory: 'Sorting basics', problems: ['Product of Array Except Self', 'Longest Consecutive Sequence'], mock: null },
        { day: 5, done: true, theory: null, problems: ['Valid Sudoku', 'Longest Substring Without Repeating'], mock: 'DSA Interview: Arrays' },
        { day: 6, done: true, theory: 'Review & practice', problems: ['Best Time to Buy and Sell Stock'], mock: null },
        { day: 7, done: true, theory: 'Rest day — review notes', problems: [], mock: null }
      ]
    },
    {
      week: 2, title: 'Two Pointers & Sliding Window',
      days: [
        { day: 8, done: true, theory: 'Two pointer technique', problems: ['Valid Palindrome', 'Two Sum II'], mock: null },
        { day: 9, done: true, theory: 'Fast/slow pointers', problems: ['3Sum', 'Container With Most Water'], mock: null },
        { day: 10, done: true, theory: 'Sliding window', problems: ['Max Subarray Sum', 'Min Size Subarray Sum'], mock: null },
        { day: 11, done: true, theory: 'Variable window', problems: ['Longest Repeating Character Replacement', 'Permutation in String'], mock: null },
        { day: 12, done: true, theory: null, problems: ['Minimum Window Substring'], mock: 'DSA Interview: Two Pointers' },
        { day: 13, done: true, theory: 'Review & practice', problems: ['Trapping Rain Water'], mock: null },
        { day: 14, done: true, theory: 'Rest day — review notes', problems: [], mock: null }
      ]
    },
    {
      week: 3, title: 'Binary Search & Stack',
      days: [
        { day: 15, done: true, theory: 'Binary search basics', problems: ['Binary Search', 'Search in Rotated Array'], mock: null },
        { day: 16, done: true, theory: 'Advanced binary search', problems: ['Find Min in Rotated Sorted Array', 'Search a 2D Matrix'], mock: null },
        { day: 17, done: true, theory: 'Stack fundamentals', problems: ['Valid Parentheses', 'Min Stack'], mock: null },
        { day: 18, done: true, theory: 'Monotonic stack', problems: ['Daily Temperatures', 'Next Greater Element'], mock: null },
        { day: 19, done: true, theory: null, problems: ['Evaluate Reverse Polish Notation'], mock: 'DSA Interview: Binary Search' },
        { day: 20, done: true, theory: 'Review & practice', problems: ['Largest Rectangle in Histogram'], mock: null },
        { day: 21, done: true, theory: 'Rest day — review notes', problems: [], mock: null }
      ]
    },
    {
      week: 4, title: 'Linked Lists & Trees',
      days: [
        { day: 22, done: true, theory: 'Linked list basics', problems: ['Reverse Linked List', 'Merge Two Sorted Lists'], mock: null },
        { day: 23, done: true, theory: 'Fast/slow in linked lists', problems: ['Linked List Cycle', 'Reorder List'], mock: null },
        { day: 24, done: false, theory: 'Binary trees', problems: ['Invert Binary Tree', 'Max Depth of Binary Tree'], mock: null },
        { day: 25, done: false, theory: 'Tree traversals', problems: ['Level Order Traversal', 'Right Side View'], mock: null },
        { day: 26, done: false, theory: null, problems: ['Validate BST', 'Kth Smallest Element in BST'], mock: 'DSA Interview: Trees' },
        { day: 27, done: false, theory: 'Review & practice', problems: ['Construct Binary Tree from Preorder and Inorder'], mock: null },
        { day: 28, done: false, theory: 'Rest day — review notes', problems: [], mock: null }
      ]
    }
  ]
};

export default function StudyPlan() {
  const [plan, setPlan] = useState(demoStudyPlan);
  const [expandedWeek, setExpandedWeek] = useState(plan.currentWeek - 1);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/study-plan', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.plan) setPlan(data.plan);
        }
      } catch (err) { console.error(err); }
    };
    fetchPlan();
  }, []);

  const pct = Math.round((plan.completedDays / plan.totalDays) * 100);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Study Plan</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>90-Day FAANG Roadmap</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 14, padding: 24, border: '1px solid var(--border)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Overall Progress</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>{pct}%</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Day {plan.completedDays} of {plan.totalDays}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{plan.completedDays}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Days Done</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--yellow)' }}>{plan.totalDays - plan.completedDays}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Remaining</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>Week {plan.currentWeek}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Current</div>
            </div>
          </div>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6c5ce7, #a855f7)', borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Weekly Breakdown */}
      {plan.weeks.map((week, wi) => (
        <div key={wi} style={{ marginBottom: 12 }}>
          <button
            onClick={() => setExpandedWeek(expandedWeek === wi ? -1 : wi)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-card)', borderRadius: expandedWeek === wi ? '14px 14px 0 0' : 14,
              padding: '16px 20px', border: '1px solid var(--border)', cursor: 'pointer',
              borderBottom: expandedWeek === wi ? 'none' : undefined, fontFamily: 'inherit'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                background: week.days.every(d => d.done) ? 'rgba(0,214,143,0.15)' : 'rgba(108,92,231,0.15)',
                color: week.days.every(d => d.done) ? 'var(--green)' : 'var(--accent)',
                padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700
              }}>
                Week {week.week}
              </span>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{week.title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {week.days.filter(d => d.done).length}/{week.days.length} days
              </span>
              {expandedWeek === wi ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
            </div>
          </button>

          {expandedWeek === wi && (
            <div style={{ background: 'var(--bg-card)', borderRadius: '0 0 14px 14px', border: '1px solid var(--border)', borderTop: 'none', padding: '4px 20px 16px' }}>
              {week.days.map((day, di) => (
                <div key={di} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                  borderBottom: di < week.days.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: day.done ? 0.7 : 1
                }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    {day.done ? <CheckCircle size={18} color="var(--green)" /> : <Circle size={18} color="var(--border)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>Day {day.day}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {day.theory && (
                        <span style={{ fontSize: 11, background: 'rgba(108,92,231,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <BookOpen size={10} /> {day.theory}
                        </span>
                      )}
                      {day.problems.map((p, pi) => (
                        <span key={pi} style={{ fontSize: 11, background: 'rgba(6,182,212,0.1)', color: '#22d3ee', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Code2 size={10} /> {p}
                        </span>
                      ))}
                      {day.mock && (
                        <span style={{ fontSize: 11, background: 'rgba(236,72,153,0.1)', color: '#f472b6', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MessageSquare size={10} /> {day.mock}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
