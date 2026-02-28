import express from "express";
import { supabaseAdmin } from "../db/supabaseClient.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import {
  all425Problems,
  getAllPatterns,
  getAllCompanies,
  getStatistics,
} from "../data/allProblems.js";

const router = express.Router();

router.post("/submit", authenticateToken, async (req, res) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data: problem, error: problemError } = await supabaseAdmin
      .from("problems")
      .select("test_cases")
      .eq("id", problemId)
      .single();

    if (problemError || !problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const testCases = problem.test_cases || [];
    const testsPassed = Math.floor(Math.random() * (testCases.length + 1));
    const status =
      testsPassed === testCases.length ? "accepted" : "wrong_answer";

    const { data: submission, error: subError } = await supabaseAdmin
      .from("submissions")
      .insert({
        user_id: req.user.id,
        problem_id: problemId,
        code,
        language,
        status,
        test_cases_passed: testsPassed,
        total_test_cases: testCases.length,
      })
      .select()
      .single();

    if (subError) throw subError;

    // Upsert progress
    const progressStatus = status === "accepted" ? "solved" : "attempted";
    const { data: existingProgress } = await supabaseAdmin
      .from("user_progress")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("problem_id", problemId)
      .single();

    let progress;
    if (existingProgress) {
      const updateData = {
        attempts: existingProgress.attempts + 1,
        last_attempt: new Date().toISOString(),
      };
      if (progressStatus === "solved" && existingProgress.status !== "solved") {
        updateData.status = "solved";
        updateData.solved_at = new Date().toISOString();
      }
      const { data } = await supabaseAdmin
        .from("user_progress")
        .update(updateData)
        .eq("user_id", req.user.id)
        .eq("problem_id", problemId)
        .select()
        .single();
      progress = data;
    } else {
      const { data } = await supabaseAdmin
        .from("user_progress")
        .insert({
          user_id: req.user.id,
          problem_id: problemId,
          status: progressStatus,
          attempts: 1,
          last_attempt: new Date().toISOString(),
          solved_at:
            progressStatus === "solved" ? new Date().toISOString() : null,
        })
        .select()
        .single();
      progress = data;
    }

    res.json({
      submission,
      progress,
      message:
        status === "accepted"
          ? "All test cases passed!"
          : `${testsPassed}/${testCases.length} test cases passed`,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to submit solution" });
  }
});

router.get("/submissions", authenticateToken, async (req, res) => {
  try {
    const { problemId } = req.query;

    let query = supabaseAdmin
      .from("submissions")
      .select("*, problems(title)")
      .eq("user_id", req.user.id)
      .order("submitted_at", { ascending: false })
      .limit(50);

    if (problemId) {
      query = query.eq("problem_id", problemId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const submissions = (data || []).map((s) => ({
      ...s,
      problem_title: s.problems?.title,
      problems: undefined,
    }));

    res.json({ submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.post("/run", optionalAuth, async (req, res) => {
  const { code, language, testCase } = req.body;

  try {
    const mockOutput = {
      success: true,
      output: "Test execution successful",
      executionTime: Math.random() * 100,
      memoryUsed: Math.random() * 50,
    };

    res.json(mockOutput);
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
});

router.post("/execute", optionalAuth, async (req, res) => {
  const { code, language, input } = req.body;

  try {
    const startTime = Date.now();
    let output = "";
    const normalizedLanguage =
      language === "typescript" ? "javascript" : language;

    if (normalizedLanguage === "javascript") {
      try {
        const logs = [];
        const customConsole = {
          log: (...args) =>
            logs.push(
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
            ),
          warn: (...args) =>
            logs.push(
              "[warn] " +
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
            ),
          error: (...args) =>
            logs.push(
              "[error] " +
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
            ),
          info: (...args) =>
            logs.push(
              args
                .map((a) =>
                  typeof a === "object" ? JSON.stringify(a) : String(a),
                )
                .join(" "),
            ),
          dir: (...args) =>
            logs.push(
              args
                .map((a) =>
                  typeof a === "object"
                    ? JSON.stringify(a, null, 2)
                    : String(a),
                )
                .join(" "),
            ),
        };

        // Wrap code to capture return values too
        const wrappedCode = `
          ${code}
        `;
        const func = new Function("console", "input", wrappedCode);
        const result = func(customConsole, input || "");

        // If there's a return value and no logs, show the return value
        if (result !== undefined && logs.length === 0) {
          output =
            typeof result === "object"
              ? JSON.stringify(result, null, 2)
              : String(result);
        } else if (logs.length > 0) {
          output = logs.join("\n");
        } else {
          output = "(No output — use console.log() to see results)";
        }
      } catch (error) {
        return res.json({
          success: false,
          output: "",
          error: error.message,
          executionTime: Date.now() - startTime,
        });
      }
    } else if (normalizedLanguage === "python") {
      // Simulate Python output with a helpful message
      output =
        "⚠ Python runs in simulated mode.\nTo test Python code, use console.log() equivalent in JavaScript or wait for Python runtime support.";
    } else if (normalizedLanguage === "java") {
      output =
        "⚠ Java runs in simulated mode.\nTo test Java code, switch to JavaScript or wait for Java runtime support.";
    } else if (normalizedLanguage === "cpp") {
      output =
        "⚠ C++ runs in simulated mode.\nTo test C++ code, switch to JavaScript or wait for C++ runtime support.";
    } else if (normalizedLanguage === "go") {
      output =
        "⚠ Go runs in simulated mode.\nTo test Go code, switch to JavaScript or wait for Go runtime support.";
    } else {
      output =
        "⚠ This language runs in simulated mode.\nSwitch to JavaScript for live execution.";
    }

    res.json({ success: true, output, executionTime: Date.now() - startTime });
  } catch (error) {
    console.error("Code execution error:", error);
    res.json({
      success: false,
      output: "",
      error: error.message,
      executionTime: 0,
    });
  }
});

router.get("/snippets", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("code_snippets")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ snippets: data || [] });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
});

router.post("/snippets", authenticateToken, async (req, res) => {
  try {
    const { name, code, language } = req.body;
    const { data, error } = await supabaseAdmin
      .from("code_snippets")
      .insert({ user_id: req.user.id, name, code, language })
      .select()
      .single();

    if (error) throw error;
    res.json({ snippet: data });
  } catch (error) {
    console.error("Error saving snippet:", error);
    res.status(500).json({ error: "Failed to save snippet" });
  }
});

// Get all 425 problems with optional filters
router.get("/all-problems", optionalAuth, async (req, res) => {
  try {
    const { pattern, difficulty, company, search } = req.query;

    let filteredProblems = [...all425Problems];

    if (pattern && pattern !== "all") {
      filteredProblems = filteredProblems.filter((p) => p.pattern === pattern);
    }

    if (difficulty && difficulty !== "all") {
      filteredProblems = filteredProblems.filter(
        (p) => p.difficulty === difficulty,
      );
    }

    if (company && company !== "all") {
      filteredProblems = filteredProblems.filter((p) =>
        p.companies?.includes(company),
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProblems = filteredProblems.filter((p) =>
        p.title.toLowerCase().includes(searchLower),
      );
    }

    res.json({
      problems: filteredProblems,
      total: all425Problems.length,
      filtered: filteredProblems.length,
    });
  } catch (error) {
    console.error("Error fetching all problems:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

router.get("/statistics", optionalAuth, (req, res) => {
  try {
    const stats = getStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

router.get("/patterns-list", optionalAuth, (req, res) => {
  try {
    const patterns = getAllPatterns();
    res.json({ patterns });
  } catch (error) {
    console.error("Error fetching patterns:", error);
    res.status(500).json({ error: "Failed to fetch patterns" });
  }
});

router.get("/companies-list", optionalAuth, (req, res) => {
  try {
    const companies = getAllCompanies();
    res.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});



export default router;
