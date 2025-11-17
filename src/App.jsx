import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  Home,
  FileText,
  History,
  LogIn,
  Mail,
  Sun,
  Moon,
  Upload,
  Sparkles,
  X,
  Sprout,
  Layers,
  Rocket,
  CheckCircle,
  Play,
  Clock,
  User,
  LogOut,
  Brain,
  Calculator,
  ArrowRight,
  Eye,
  Code,
  CheckSquare,
  Type,
  AlignLeft,
  Github,
  Linkedin,
  Copyright,
  Award,
  Timer,
  BarChart2,
  Send,
  MapPin,
  Globe,
  Settings,
  Palette,
  Bug,
  Lightbulb,
  Cpu,
  Database,
  Layout,
  Edit3,
  Shield,
  Activity,
  Flag,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Grid,
  Menu, // Added Menu icon for mobile
} from "lucide-react";

// --- 1. HELPERS & CONFIG ---

const generateMockQuestions = (count, topicOrFile, types = ["mcq"]) => {
  const topic =
    typeof topicOrFile === "string"
      ? topicOrFile
      : topicOrFile?.name || "Uploaded Document";

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const type = Array.isArray(types)
      ? types[Math.floor(Math.random() * types.length)]
      : types;

    let question = {
      id,
      type,
      question: `Question ${id}: Sample question regarding ${topic}?`,
      userAnswer: type === "mcq" ? [] : null,
    };

    if (type === "true_false") {
      question.options = [
        { id: "True", text: "True" },
        { id: "False", text: "False" },
      ];
      question.correctAnswer = Math.random() > 0.5 ? "True" : "False";
    } else if (type === "fill_blank" || type === "short_answer") {
      question.question = `Question ${id}: Complete the following sentence about ${topic}: "The primary function of..."`;
      question.correctAnswer = "Sample Answer";
      question.options = [];
    } else {
      // Default MCQ
      question.options = [
        { id: "A", text: `Option A for Q${id}` },
        { id: "B", text: `Option B for Q${id}` },
        { id: "C", text: `Option C for Q${id}` },
        { id: "D", text: `Option D for Q${id}` },
      ];
      question.correctAnswer = ["A", "B", "C", "D"][
        Math.floor(Math.random() * 4)
      ];
    }

    return question;
  });
};

const themeConfig = {
  indigo: {
    primary: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
    text: "text-indigo-600",
    border: "border-indigo-600",
    ring: "focus:ring-indigo-500",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-500/10",
    textDark: "dark:text-indigo-400",
    from: "from-indigo-600",
    to: "to-purple-600",
  },
  blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    text: "text-blue-600",
    border: "border-blue-600",
    ring: "focus:ring-blue-500",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-500/10",
    textDark: "dark:text-blue-400",
    from: "from-blue-600",
    to: "to-cyan-600",
  },
  purple: {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-700",
    text: "text-purple-600",
    border: "border-purple-600",
    ring: "focus:ring-purple-500",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-500/10",
    textDark: "dark:text-purple-400",
    from: "from-purple-600",
    to: "to-pink-600",
  },
  emerald: {
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    text: "text-emerald-600",
    border: "border-emerald-600",
    ring: "focus:ring-emerald-500",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-500/10",
    textDark: "dark:text-emerald-400",
    from: "from-emerald-600",
    to: "to-teal-600",
  },
  rose: {
    primary: "bg-rose-600",
    hover: "hover:bg-rose-700",
    text: "text-rose-600",
    border: "border-rose-600",
    ring: "focus:ring-rose-500",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-500/10",
    textDark: "dark:text-rose-400",
    from: "from-rose-600",
    to: "to-red-600",
  },
  amber: {
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    text: "text-amber-600",
    border: "border-amber-600",
    ring: "focus:ring-amber-500",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-500/10",
    textDark: "dark:text-amber-400",
    from: "from-amber-600",
    to: "to-orange-600",
  },
};

// --- 2. CONTEXT ---
const TestContext = createContext();

const TestProvider = ({ children }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState("indigo");

  const theme = themeConfig[themeColor];

  const startTest = (
    sourceType,
    sourceValue,
    count,
    difficulty,
    questionTypes,
    customTitle
  ) => {
    const questions = generateMockQuestions(count, sourceValue, questionTypes);
    const title =
      customTitle || (sourceType === "file" ? sourceValue.name : sourceValue);
    const newTest = {
      id: Date.now(),
      title: title,
      sourceType,
      difficulty,
      questionType: Array.isArray(questionTypes)
        ? questionTypes.join(", ")
        : questionTypes,
      date: new Date().toLocaleString(),
      questions: questions,
      duration: 0,
      totalQuestions: count,
    };
    setActiveTest(newTest);
    return newTest;
  };

  const completeTest = (answers, timeSpent) => {
    if (!activeTest) return;
    let correct = 0;
    const processedQuestions = activeTest.questions.map((q, index) => {
      const answer = answers[index];
      let isCorrect = false;
      if (q.type === "mcq") {
        if (Array.isArray(answer)) {
          isCorrect = answer.includes(q.correctAnswer) && answer.length === 1;
        }
      } else if (q.type === "true_false") {
        isCorrect = answer === q.correctAnswer;
      } else {
        isCorrect = answer && answer.toLowerCase().includes("sample");
      }
      if (isCorrect) correct++;
      return { ...q, userAnswer: answer, isCorrect };
    });
    const result = {
      ...activeTest,
      processedQuestions,
      score: {
        correct,
        wrong: activeTest.questions.length - correct,
        accuracy: Math.round((correct / activeTest.questions.length) * 100),
      },
      timeSpent,
      completedAt: new Date().toLocaleString(),
    };
    setTestResults(result);
    setHistory((prev) => [result, ...prev]);
    setActiveTest(null);
  };

  return (
    <TestContext.Provider
      value={{
        activeTest,
        setActiveTest,
        startTest,
        completeTest,
        testResults,
        setTestResults,
        history,
        user,
        setUser,
        isDarkMode,
        setIsDarkMode,
        themeColor,
        setThemeColor,
        theme,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

const useTest = () => useContext(TestContext);

// --- 3. GLOBAL UI COMPONENTS ---

const Navbar = ({ currentPage, navigate }) => {
  const { user, setUser, isDarkMode, setIsDarkMode, theme } = useTest();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (page) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("home")}
        >
          <div
            className={`${theme.primary} p-1.5 rounded-lg shadow-lg transition-transform group-hover:scale-105`}
          >
            <Upload size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            QuizGen<span className={`${theme.text} ${theme.textDark}`}>AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl border border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => navigate("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === "home"
                  ? `bg-white dark:bg-zinc-800 ${theme.text} ${theme.textDark} shadow-sm`
                  : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Home size={16} /> Home
            </button>
            <button
              onClick={() => navigate("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === "dashboard"
                  ? `bg-white dark:bg-zinc-800 ${theme.text} ${theme.textDark} shadow-sm`
                  : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FileText size={16} /> Tests
            </button>
            <button
              onClick={() => navigate("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === "history"
                  ? `bg-white dark:bg-zinc-800 ${theme.text} ${theme.textDark} shadow-sm`
                  : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <History size={16} /> History
            </button>
          </div>
          <button
            onClick={() => navigate("contact")}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === "contact"
                ? `${theme.text} ${theme.textDark}`
                : `text-gray-700 dark:text-gray-400 hover:${
                    theme.text
                  } dark:hover:${theme.textDark.split(":")[1]}`
            }`}
          >
            <Mail size={18} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 hover:${theme.text} dark:hover:text-white transition-colors ring-1 ring-gray-200 dark:ring-zinc-800`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="p-2.5 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-zinc-800 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Desktop Login/Profile Buttons */}
          {!user ? (
            <button
              onClick={() => navigate("login")}
              className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${theme.primary} ${theme.hover} text-white shadow-lg`}
            >
              <LogIn size={18} /> Login
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${theme.text} bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors`}
              >
                <User size={18} /> Profile
              </button>
              <button
                onClick={() => setUser(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-500/20"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-4 right-4 w-[calc(100vw-32px)] max-w-sm bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Menu
              </span>
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleMobileNav("home")}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  currentPage === "home"
                    ? `${theme.bgLight} dark:bg-zinc-800 ${theme.text} ${theme.textDark}`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Home size={20} /> Home
              </button>
              <button
                onClick={() => handleMobileNav("dashboard")}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  currentPage === "dashboard"
                    ? `${theme.bgLight} dark:bg-zinc-800 ${theme.text} ${theme.textDark}`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <FileText size={20} /> Tests
              </button>
              <button
                onClick={() => handleMobileNav("history")}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  currentPage === "history"
                    ? `${theme.bgLight} dark:bg-zinc-800 ${theme.text} ${theme.textDark}`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <History size={20} /> History
              </button>
              <button
                onClick={() => handleMobileNav("contact")}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  currentPage === "contact"
                    ? `${theme.bgLight} dark:bg-zinc-800 ${theme.text} ${theme.textDark}`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Mail size={20} /> Contact
              </button>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                {!user ? (
                  <button
                    onClick={() => handleMobileNav("login")}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${theme.primary} ${theme.hover} text-white shadow-lg`}
                  >
                    <LogIn size={18} /> Login
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleMobileNav("profile")}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${theme.text} ${theme.textDark} bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors`}
                    >
                      <User size={18} /> Profile
                    </button>
                    <button
                      onClick={() => {
                        setUser(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-500/20"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SettingsButton = () => {
  const { themeColor, setThemeColor, theme } = useTest();
  const [isOpen, setIsOpen] = useState(false);
  const colors = ["indigo", "blue", "purple", "emerald", "rose", "amber"];
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-full shadow-2xl text-white transition-all transform hover:scale-110 ${theme.primary} hover:${theme.hover}`}
        >
          {isOpen ? <X size={20} /> : <Settings size={20} />}
        </button>
      </div>
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
            <Settings size={18} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              Settings
            </h3>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Palette size={14} /> Theme Color
              </p>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${
                      themeColor === color
                        ? "border-gray-900 dark:border-white"
                        : "border-transparent"
                    } ${themeConfig[color].primary}`}
                  ></button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Feedback
              </p>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-left transition-colors">
                <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-lg text-red-600 dark:text-red-400">
                  <Bug size={16} />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Report a Bug
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-500">
                    Something not working?
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-left transition-colors">
                <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                  <Lightbulb size={16} />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Suggest Feature
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-500">
                    We need your ideas!
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const QuestionCountModal = ({ isOpen, onClose, onGenerate }) => {
  const { theme } = useTest();
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionTypes, setQuestionTypes] = useState(["mcq"]);
  const [count, setCount] = useState(10);
  const [customCount, setCustomCount] = useState("");
  const [testName, setTestName] = useState("");

  if (!isOpen) return null;

  const handleCustomCountChange = (e) => {
    const val = e.target.value;
    setCustomCount(val);
    if (val && !isNaN(val)) {
      const num = parseInt(val);
      if (num > 0 && num <= 100) setCount(num);
    }
  };

  const toggleQuestionType = (typeId) => {
    setQuestionTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.length > 1 ? prev.filter((t) => t !== typeId) : prev;
      } else {
        return [...prev, typeId];
      }
    });
  };

  const types = [
    { id: "mcq", label: "Multiple Choice", icon: CheckSquare },
    { id: "true_false", label: "True / False", icon: CheckCircle },
    { id: "fill_blank", label: "Fill in Blanks", icon: Type },
    { id: "short_answer", label: "Short Answer", icon: AlignLeft },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Configure Your Test
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Test Name (Optional)
            </p>
            <input
              type="text"
              placeholder="e.g. JavaScript Fundamentals"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className={`w-full bg-white dark:bg-zinc-950 border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none transition-all border-gray-200 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Question Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {types.map((t) => {
                const isSelected = questionTypes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleQuestionType(t.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all ${
                      isSelected
                        ? `${theme.bgLight} ${theme.bgDark} ${theme.border} ${theme.text} ${theme.textDark} ring-1 ring-opacity-50`
                        : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <t.icon
                      size={18}
                      className={
                        isSelected
                          ? `${theme.text} ${theme.textDark}`
                          : "text-gray-400"
                      }
                    />{" "}
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Difficulty Level
            </p>
            <div className="grid gap-3">
              {["Beginner", "Intermediate", "Pro"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    difficulty === level
                      ? `${theme.bgLight} ${theme.bgDark} ${theme.border} ring-1 ring-opacity-50`
                      : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg ${
                      level === "Beginner"
                        ? "bg-emerald-100 text-emerald-600"
                        : level === "Intermediate"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {level === "Beginner" ? (
                      <Sprout size={20} />
                    ) : level === "Intermediate" ? (
                      <Layers size={20} />
                    ) : (
                      <Rocket size={20} />
                    )}
                  </div>
                  <div className="text-left">
                    <div
                      className={`font-bold text-base ${
                        difficulty === level
                          ? `text-gray-900 dark:text-white`
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {level}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Question Count
            </p>
            <div className="grid grid-cols-4 gap-3 mb-2">
              {[5, 10, 20, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setCount(num);
                    setCustomCount("");
                  }}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                    count === num && customCount === ""
                      ? `${theme.primary} ${theme.border} text-white shadow-md`
                      : "bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Enter custom number (1-100)"
                value={customCount}
                onChange={handleCustomCountChange}
                className={`w-full bg-white dark:bg-zinc-950 border rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none transition-all ${
                  customCount
                    ? `${theme.border} ring-1 ${theme.ring}`
                    : "border-gray-200 dark:border-zinc-800 focus:border-gray-400 dark:focus:border-zinc-700"
                }`}
              />
              {customCount && (
                <span
                  className={`absolute right-4 top-3 text-sm font-bold ${theme.text} ${theme.textDark}`}
                >
                  Set to {count}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              onGenerate(count, difficulty, questionTypes, testName)
            }
            className={`w-full py-4 ${theme.primary} ${theme.hover} text-white font-bold text-lg rounded-xl transition-all shadow-lg transform active:scale-[0.98]`}
          >
            Start Quiz Generation
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. PAGE COMPONENTS (Defined BEFORE usage) ---

const HomeData = ({ onOpenModal, setSource, onNavigate }) => {
  const { theme } = useTest();
  const [activeTab, setActiveTab] = useState("upload");
  const [topic, setTopic] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleStart = (type) => {
    let val = null;
    if (type === "file" && uploadedFile) val = uploadedFile;
    else if (type === "topic") val = topic;
    else val = type;
    if (val) {
      setSource({ type, value: val });
      onOpenModal();
    }
  };

  const codingLanguages = [
    "Python",
    "JavaScript",
    "Java",
    "C++",
    "C#",
    "React",
    "Angular",
    "Vue.js",
    "HTML/CSS",
    "SQL",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
          QuizGen{" "}
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.from} ${theme.to}`}
          >
            AI
          </span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Transform any content into a personalized learning experience.
          Generate quizzes from documents, topics, or code in seconds.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        {[
          { id: "upload", icon: FileText, label: "Document" },
          { id: "topic", icon: Sparkles, label: "Topic" },
          { id: "coding", icon: Code, label: "Coding" },
          { id: "aptitude", icon: Brain, label: "Aptitude" },
          { id: "math", icon: Calculator, label: "Maths" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-105"
                : "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-500">
        {activeTab === "upload" && (
          <div
            className={`border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-3xl p-6 bg-gray-50 dark:bg-zinc-900/50 hover:${theme.border} dark:hover:${theme.border} transition-all text-center group min-h-[280px] flex flex-col justify-center items-center`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.txt"
            />
            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer w-full"
              >
                <div
                  className={`bg-white dark:bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${theme.text} ${theme.textDark} shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Upload size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Upload Document
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag & drop or click to browse PDF, DOCX, TXT
                </p>
                <button
                  className={`${theme.primary} ${theme.hover} text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg`}
                >
                  Select File
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-md w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-500/10 p-2 rounded-lg text-red-500 dark:text-red-400">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900 dark:text-white font-bold text-sm">
                      {uploadedFile.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => handleStart("file")}
                    className={`${theme.primary} ${theme.hover} text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-md`}
                  >
                    Generate Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "topic" && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl min-h-[280px] flex flex-col justify-center">
            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
              What do you want to learn today?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quantum Physics, React Hooks..."
                className={`flex-1 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 rounded-2xl px-6 py-4 text-gray-900 dark:text-white text-lg focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all placeholder-gray-400`}
              />
              <button
                onClick={() => handleStart("topic")}
                disabled={!topic}
                className={`${theme.primary} ${theme.hover} disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg`}
              >
                Go
              </button>
            </div>
          </div>
        )}
        {activeTab === "coding" && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xl min-h-[280px] flex flex-col justify-center">
            <div className="bg-amber-50 dark:bg-amber-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-amber-400">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Coding Challenges
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Master your favorite language with tailored challenges.
            </p>
            <div className="text-left mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Please choose your language:
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {codingLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleStart(lang)}
                  className="bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-white py-2 rounded-lg font-bold text-xs transition-all border border-gray-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-500"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === "aptitude" && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xl flex flex-col items-center justify-center min-h-[280px]">
            <div className="bg-blue-50 dark:bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              General Aptitude
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Sharpen your logical reasoning, critical thinking, and
              problem-solving skills.
            </p>
            <button
              onClick={() => handleStart("aptitude")}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
              Start Assessment
            </button>
          </div>
        )}
        {activeTab === "math" && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xl flex flex-col items-center justify-center min-h-[280px]">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Mathematics Practice
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              From Algebra to Calculus, practice problems designed to reinforce
              your mathematical concepts.
            </p>
            <button
              onClick={() => handleStart("math")}
              className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20"
            >
              Start Math Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage = ({ onNavigate }) => {
  const { activeTest, history, setTestResults, theme } = useTest();
  const handleViewResult = (result) => {
    setTestResults(result);
    onNavigate("result");
  };
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
          My Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your active, completed, and upcoming tests
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col min-h-[320px] shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-lg">
              <div
                className={`p-2 rounded-lg ${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark}`}
              >
                <Play size={20} />
              </div>
              Active Tests
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                activeTest
                  ? `${theme.bgLight} ${theme.text} ${theme.bgDark} ${theme.textDark}`
                  : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
              }`}
            >
              {activeTest ? 1 : 0}
            </span>
          </div>
          {activeTest ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold text-xl mb-1 line-clamp-2">
                    {activeTest.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activeTest.date}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md font-medium">
                    {activeTest.totalQuestions} Qs
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md font-medium">
                    {activeTest.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate("test")}
                className={`w-full mt-6 py-3 ${theme.primary} ${theme.hover} text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                Resume <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Play size={24} />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                No active tests
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Ready to challenge yourself?
              </p>
              <button
                onClick={() => onNavigate("home")}
                className={`${theme.text} ${theme.textDark} font-bold hover:underline`}
              >
                Start New Test
              </button>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col min-h-[320px] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-lg">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={20} />
              </div>
              Completed
            </div>
            <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
              {history.length}
            </span>
          </div>
          {history.length > 0 ? (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-700">
              {history.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
                >
                  <div className="overflow-hidden mr-3">
                    <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate w-32">
                      {test.title}
                    </h5>
                    <p
                      className={`text-xs font-bold mt-1 ${
                        test.score.accuracy >= 70
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }`}
                    >
                      {test.score.accuracy}% Accuracy
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewResult(test)}
                    className={`p-2 bg-white dark:bg-zinc-800 text-gray-600 hover:${theme.text} dark:text-gray-400 dark:hover:text-white rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700 transition-colors`}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              ))}
              <div className="mt-auto pt-2 text-center">
                <button
                  onClick={() => onNavigate("history")}
                  className={`text-xs font-bold text-gray-600 hover:${theme.text} dark:hover:text-white transition-colors uppercase tracking-wider`}
                >
                  View All History
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <CheckCircle size={24} />
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                No completed tests
              </p>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col min-h-[320px] shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold text-lg">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                <Clock size={20} />
              </div>
              Upcoming
            </div>
            <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
              0
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Clock size={24} />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              No upcoming tests
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-500 mt-2">
              Scheduling coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryPage = ({ onNavigate }) => {
  const { history, setTestResults, theme } = useTest();
  const handleViewResult = (result) => {
    setTestResults(result);
    onNavigate("result");
  };
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="flex items-center gap-4 mb-10">
        <div
          className={`p-3 ${theme.bgLight} ${theme.bgDark} rounded-2xl ${theme.text} ${theme.textDark}`}
        >
          <History size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Test History
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Review your past performance
          </p>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <History size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No tests taken yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your completed tests will appear here.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className={`px-8 py-3 ${theme.primary} ${theme.hover} text-white font-bold rounded-xl transition-colors`}
          >
            Start a Test
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((test, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors shadow-sm group`}
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold border-4 ${
                    test.score.accuracy >= 80
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                      : test.score.accuracy >= 50
                      ? "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                      : "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                  }`}
                >
                  <span className="text-xl">{test.score.accuracy}%</span>
                </div>
                <div>
                  <h3
                    className={`font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:${theme.text} dark:group-hover:${theme.textDark} transition-colors`}
                  >
                    {test.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      <Clock size={14} /> {test.completedAt}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      <Layers size={14} /> {test.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pl-4 md:pl-0 border-l-2 md:border-l-0 border-gray-100 dark:border-zinc-800">
                <div className="text-right hidden md:block">
                  <div className="text-sm text-gray-900 dark:text-white font-bold">
                    {test.score.correct} / {test.totalQuestions}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Correct
                  </div>
                </div>
                <button
                  onClick={() => handleViewResult(test)}
                  className={`flex items-center gap-2 px-6 py-3 ${theme.bgLight} ${theme.bgDark} hover:${theme.primary} ${theme.text} ${theme.textDark} hover:text-white dark:hover:text-white rounded-xl text-sm font-bold transition-all`}
                >
                  <Eye size={18} /> Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ResultPage = ({ onNavigate }) => {
  const { testResults, theme } = useTest();

  if (!testResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <FileText size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No Result Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          It seems like you haven't completed a test recently.
        </p>
        <button
          onClick={() => onNavigate("dashboard")}
          className={`px-6 py-2 rounded-xl ${theme.primary} text-white font-bold`}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const correctPercent = testResults.score.accuracy;
  const wrongPercent = 100 - correctPercent;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 min-h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowRight size={18} className="rotate-180" /> Back to Dashboard
        </button>
        <div className="text-sm text-gray-500">{testResults.completedAt}</div>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-200 dark:border-zinc-800 shadow-lg mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            {testResults.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Performance Summary
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`${theme.bgLight} ${theme.bgDark} p-6 rounded-2xl text-center`}
            >
              <div
                className={`${theme.text} ${theme.textDark} mb-2 flex justify-center`}
              >
                <Award size={32} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {testResults.score.accuracy}%
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                Accuracy
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl text-center">
              <div className="text-emerald-600 dark:text-emerald-400 mb-2 flex justify-center">
                <CheckCircle size={32} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {testResults.score.correct}
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                Correct
              </div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-2xl text-center">
              <div className="text-rose-600 dark:text-rose-400 mb-2 flex justify-center">
                <X size={32} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {testResults.score.wrong}
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                Wrong
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl text-center">
              <div className="text-amber-600 dark:text-amber-400 mb-2 flex justify-center">
                <Timer size={32} />
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">
                {testResults.timeSpent}
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                Time
              </div>
            </div>
          </div>
          <div className="h-full flex flex-col justify-center p-6 bg-gray-50 dark:bg-zinc-950/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart2 size={20} /> Result Visualization
            </h3>
            <div className="flex items-end justify-center gap-8 h-64 w-full max-w-sm mx-auto pb-2">
              <div className="flex flex-col items-center gap-2 w-20 group">
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {testResults.score.correct}
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-900/30 rounded-t-lg relative overflow-hidden h-48">
                  <div
                    className="absolute bottom-0 w-full bg-emerald-500 dark:bg-emerald-500 transition-all duration-1000 ease-out rounded-t-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    style={{ height: `${correctPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase">
                  Correct
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-20 group">
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {testResults.score.wrong}
                </div>
                <div className="w-full bg-rose-200 dark:bg-rose-900/30 rounded-t-lg relative overflow-hidden h-48">
                  <div
                    className="absolute bottom-0 w-full bg-rose-500 dark:bg-rose-500 transition-all duration-1000 ease-out rounded-t-lg shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    style={{ height: `${wrongPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase">
                  Wrong
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-20 group">
                <div
                  className={`text-sm font-bold ${theme.text} ${theme.textDark} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  {testResults.totalQuestions}
                </div>
                <div
                  className={`w-full rounded-t-lg relative overflow-hidden h-48 ${theme.bgLight} ${theme.bgDark}`}
                >
                  <div
                    className={`absolute bottom-0 w-full ${theme.primary} transition-all duration-1000 ease-out rounded-t-lg`}
                    style={{ height: "100%" }}
                  ></div>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white pl-2 border-l-4 border-gray-300 dark:border-gray-600">
          Detailed Breakdown
        </h3>
        {testResults.processedQuestions.map((q, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border-l-4 shadow-sm transition-all hover:shadow-md ${
              q.isCorrect
                ? "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 border-l-emerald-500"
                : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 border-l-rose-500"
            }`}
          >
            <div className="flex gap-5">
              <div
                className={`flex-none w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${
                  q.isCorrect
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                }`}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-snug mb-4">
                  {q.question}
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div
                    className={`p-4 rounded-xl border ${
                      q.isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    <span className="block text-xs font-bold opacity-70 uppercase mb-1 text-gray-900 dark:text-gray-200">
                      Your Answer
                    </span>
                    <span
                      className={`font-bold text-base ${
                        q.isCorrect
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {Array.isArray(q.userAnswer)
                        ? q.userAnswer.length
                          ? q.userAnswer.join(", ")
                          : "Skipped"
                        : q.userAnswer || "Skipped"}
                    </span>
                  </div>
                  {!q.isCorrect && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
                      <span className="block text-xs font-bold opacity-70 uppercase mb-1 text-gray-900 dark:text-gray-200">
                        Correct Answer
                      </span>
                      <span className="font-bold text-base text-emerald-700 dark:text-emerald-400">
                        {Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join(", ")
                          : q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center pb-10">
        <button
          onClick={() => onNavigate("home")}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl"
        >
          Take Another Test
        </button>
      </div>
    </div>
  );
};

const TestPage = ({ onComplete }) => {
  const { activeTest, theme } = useTest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentAns = answers[currentIndex];
    if (typeof currentAns === "string") {
      setTextInput(currentAns);
    } else {
      setTextInput("");
    }
  }, [currentIndex, answers]);

  if (!activeTest)
    return (
      <div className="p-10 text-center text-gray-500">Initializing Test...</div>
    );

  const currentQ = activeTest.questions[currentIndex];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionSelect = (optionId) => {
    if (currentQ.type === "mcq") {
      setAnswers((prev) => {
        const currentSelection = prev[currentIndex] || [];
        if (currentSelection.includes(optionId)) {
          return {
            ...prev,
            [currentIndex]: currentSelection.filter((id) => id !== optionId),
          };
        } else {
          return { ...prev, [currentIndex]: [...currentSelection, optionId] };
        }
      });
    } else {
      setAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextInput(val);
    setAnswers((prev) => ({ ...prev, [currentIndex]: val }));
  };

  const isSelected = (optionId) => {
    const ans = answers[currentIndex];
    if (Array.isArray(ans)) return ans.includes(optionId);
    return ans === optionId;
  };

  const toggleReview = () => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) newSet.delete(currentIndex);
      else newSet.add(currentIndex);
      return newSet;
    });
  };

  const handleSubmitClick = () => {
    setIsSubmitModalOpen(true);
  };

  const confirmSubmit = () => {
    onComplete(answers, formatTime(timeLeft));
  };

  const answeredCount = Object.keys(answers).filter((k) => {
    const ans = answers[k];
    return Array.isArray(ans) ? ans.length > 0 : !!ans;
  }).length;
  const skippedCount = activeTest.questions.length - answeredCount;
  const reviewCount = markedForReview.size;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-zinc-950 p-6 flex flex-col items-center transition-colors duration-300">
      {/* Top Bar - Reduced Width */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {activeTest.title}
            </h2>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 ${theme.text} ${theme.textDark} bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-1.5 rounded-full font-bold shadow-sm text-sm`}
        >
          <Clock size={16} />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Content Grid - Reduced Max Width & Spacing */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Area (Larger share) */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg relative min-h-[400px] flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Question {currentIndex + 1}
                </span>
                <button
                  onClick={toggleReview}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    markedForReview.has(currentIndex)
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Flag
                    size={12}
                    fill={
                      markedForReview.has(currentIndex)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {markedForReview.has(currentIndex) ? "Marked" : "Review"}
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                {currentQ.question}
              </h3>
              {currentQ.type === "mcq" && (
                <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1.5">
                  <CheckSquare size={12} /> Select all that apply
                </p>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {["mcq", "true_false"].includes(currentQ.type) ? (
                <div className="grid gap-2.5">
                  {currentQ.options.map((opt) => {
                    const selected = isSelected(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        className={`relative w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-4 group ${
                          selected
                            ? `${theme.border} bg-indigo-50/50 dark:bg-indigo-500/10 shadow-sm border-2`
                            : "border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/30 border-2 border-transparent"
                        }`}
                      >
                        <div
                          className={`flex-none w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors border ${
                            selected
                              ? `${theme.primary} text-white border-transparent`
                              : "bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-zinc-700"
                          }`}
                        >
                          {["A", "B", "C", "D"].includes(opt.id)
                            ? opt.id
                            : opt.id === "True"
                            ? "T"
                            : "F"}
                        </div>
                        <span
                          className={`text-sm font-medium flex-1 ${
                            selected
                              ? `${theme.text} ${theme.textDark}`
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {opt.text}
                        </span>
                        {selected && (
                          <CheckCircle
                            size={18}
                            className={`${theme.text} ${theme.textDark}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={textInput}
                  onChange={handleTextChange}
                  placeholder="Type your answer here..."
                  className={`w-full h-48 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 text-base text-gray-900 dark:text-white focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all resize-none`}
                />
              )}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              {currentIndex === activeTest.questions.length - 1 ? (
                <button
                  onClick={handleSubmitClick}
                  className={`px-6 py-2 rounded-lg ${theme.primary} ${theme.hover} text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2`}
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(activeTest.questions.length - 1, prev + 1)
                    )
                  }
                  className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                >
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette - Narrower & Smaller Buttons */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-lg sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <Grid size={16} /> Questions
              </h4>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                {answeredCount}/{activeTest.questions.length} Done
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {activeTest.questions.map((q, idx) => {
                const isAnswered =
                  answers[idx] &&
                  (Array.isArray(answers[idx])
                    ? answers[idx].length > 0
                    : true);
                const isReview = markedForReview.has(idx);
                const isCurrent = currentIndex === idx;

                let bgClass =
                  "bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border border-transparent";

                if (isCurrent) {
                  bgClass = `${theme.primary} text-white shadow-md transform scale-105 z-10`;
                } else if (isReview) {
                  bgClass =
                    "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30";
                } else if (isAnswered) {
                  bgClass =
                    "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${theme.primary}`}
                ></div>{" "}
                Current
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-500"></div>{" "}
                Answered
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-500"></div>{" "}
                Review
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600"></div>{" "}
                Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden transform scale-100">
            <div className="p-8 text-center">
              <div
                className={`mx-auto w-14 h-14 rounded-full ${theme.bgLight} ${theme.bgDark} flex items-center justify-center mb-4 ${theme.text} ${theme.textDark}`}
              >
                <AlertCircle size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                Ready to Submit?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                Please review your test summary before finishing.
              </p>
            </div>

            <div className="px-8 pb-2 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-0.5">
                  {answeredCount}
                </div>
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Answered
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mb-0.5">
                  {reviewCount}
                </div>
                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Review
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <div className="text-2xl font-black text-gray-600 dark:text-gray-400 mb-0.5">
                  {skippedCount}
                </div>
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                  Skipped
                </div>
              </div>
            </div>

            <div className="p-8 pt-6 flex gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Back to Test
              </button>
              <button
                onClick={confirmSubmit}
                className={`flex-1 py-3.5 rounded-xl ${theme.primary} ${theme.hover} text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CONTACT PAGE IMPROVED & PRO ---
const ContactPage = () => {
  const { theme } = useTest();

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 min-h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center mb-20">
        <div
          className={`inline-block p-2 px-4 rounded-full ${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark} font-bold text-sm mb-4 border ${theme.border} border-opacity-20`}
        >
          Connect & Collaborate
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
          We'd love to{" "}
          <span
            className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.from} ${theme.to}`}
          >
            hear from you
          </span>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Have a question about QuizGen AI? Want to contribute or just say
          hello? We are always open to discussing new projects and ideas.
        </p>
      </div>

      {/* About Project Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-24">
        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${theme.bgLight} ${theme.bgDark} rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110`}
            ></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
              About The Project
            </h3>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 relative z-10">
              QuizGen AI is an intelligent tool that instantly turns any
              document, topic, or code into ready to use quiz questions. It
              helps students learn better, teachers save time, and professionals
              conduct assessments with ease. By using Powerful AI, the platform
              understands your content and creates meaningful, accurate
              questions within seconds. My goal is to make learning and testing
              simpler, faster, and accessible for everyone.
            </p>
            <div className="flex gap-3 flex-wrap relative z-10">
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                Education
              </span>
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                AI Powered
              </span>
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                Open Source
              </span>
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                Learning
              </span>
              <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                Assessment
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Tech Stack
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Layout size={18} />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-300">
                  React.js
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950">
                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                  <Cpu size={18} />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-300">
                  Tailwind
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles size={18} />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-300">
                  Vite
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-950">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Database size={18} />
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-300">
                  Lucide
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-1 ${theme.bgLight} ${theme.bgDark}`}>
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-8 h-full border border-gray-200 dark:border-zinc-800 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Hello, I'd like to talk about..."
                  className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all resize-none`}
                ></textarea>
              </div>
              <button
                className={`w-full py-4 ${theme.primary} ${theme.hover} text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
              >
                <Send size={20} /> Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Footer */}
      <div className="grid md:grid-cols-3 gap-8 border-t border-gray-200 dark:border-zinc-800 pt-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`p-4 rounded-2xl ${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark}`}
          >
            <Mail size={24} />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">Email Us</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            mallelanarendra88@gmail.com
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`p-4 rounded-2xl ${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark}`}
          >
            <MapPin size={24} />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">Location</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vijayawada, India
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className={`p-4 rounded-2xl ${theme.bgLight} ${theme.bgDark} ${theme.text} ${theme.textDark}`}
          >
            <Globe size={24} />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">Socials</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com/MVnarendra117"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/venkata-narendra-m-40a11b226/?originalSubdomain=in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <p className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-500 font-medium text-sm">
          <Copyright size={14} /> {new Date().getFullYear()} Venkata Narendra
          Mallela. All rights reserved.
        </p>
      </div>
    </div>
  );
};

// --- PROFILE PAGE ---
const ProfilePage = () => {
  const { user, history, theme } = useTest();

  // Calculate aggregates
  const totalTests = history.length;
  const totalQuestions = history.reduce(
    (acc, curr) => acc + curr.totalQuestions,
    0
  );
  const totalCorrect = history.reduce(
    (acc, curr) => acc + curr.score.correct,
    0
  );
  const avgAccuracy =
    totalTests > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + curr.score.accuracy, 0) /
            totalTests
        )
      : 0;
  const totalTimeSeconds = history.reduce((acc, curr) => {
    const [mins, secs] = curr.timeSpent.split(":").map(Number);
    return acc + mins * 60 + secs;
  }, 0);
  const totalHours = Math.floor(totalTimeSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeSeconds % 3600) / 60);

  if (!user)
    return (
      <div className="p-10 text-center">Please log in to view profile.</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 py-12 min-h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl">
        <div
          className={`w-28 h-28 rounded-full ${theme.primary} flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white dark:border-zinc-800`}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} /> {user.email}
          </p>
          <div className="flex gap-3 mt-6 justify-center md:justify-start">
            <button
              className={`px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2`}
            >
              <Edit3 size={16} /> Edit Profile
            </button>
            <button
              className={`px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2`}
            >
              <Shield size={16} /> Privacy
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow text-center">
          <div
            className={`w-12 h-12 mx-auto ${theme.bgLight} ${theme.bgDark} rounded-full flex items-center justify-center mb-3 ${theme.text} ${theme.textDark}`}
          >
            <FileText size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTests}
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Tests Taken
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow text-center">
          <div
            className={`w-12 h-12 mx-auto ${theme.bgLight} ${theme.bgDark} rounded-full flex items-center justify-center mb-3 ${theme.text} ${theme.textDark}`}
          >
            <Award size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {avgAccuracy}%
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Avg. Score
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow text-center">
          <div
            className={`w-12 h-12 mx-auto ${theme.bgLight} ${theme.bgDark} rounded-full flex items-center justify-center mb-3 ${theme.text} ${theme.textDark}`}
          >
            <CheckCircle size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalCorrect}
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Questions Solved
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow text-center">
          <div
            className={`w-12 h-12 mx-auto ${theme.bgLight} ${theme.bgDark} rounded-full flex items-center justify-center mb-3 ${theme.text} ${theme.textDark}`}
          >
            <Clock size={24} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalHours}h {totalMinutes}m
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Time Spent
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Activity className={`${theme.text} ${theme.textDark}`} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.slice(0, 3).map((test, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800"
              >
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {test.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {test.completedAt}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold ${
                      test.score.accuracy >= 70
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {test.score.accuracy}%
                  </span>
                  <p className="text-xs text-gray-400">Score</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            No recent activity to show.
          </p>
        )}
      </div>
    </div>
  );
};

// --- LOGIN & SIGNUP COMPONENT ---
const LoginPage = ({ onLogin }) => {
  const { theme } = useTest();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 relative overflow-hidden">
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 ${theme.bgLight} rounded-full blur-3xl pointer-events-none opacity-50`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${theme.bgLight} rounded-full blur-3xl pointer-events-none opacity-50`}
      ></div>
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center p-3 ${theme.bgLight} ${theme.bgDark} rounded-2xl mb-4 ${theme.text} ${theme.textDark}`}
          >
            {isLogin ? <LogIn size={28} /> : <User size={28} />}
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            {isLogin ? "Welcome Back" : "Join QuizGen AI"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isLogin
              ? "Sign in to continue your learning journey"
              : "Create an account to start generating quizzes"}
          </p>
        </div>
        <div className="space-y-4">
          {!isLogin && (
            <div className="group animate-in slide-in-from-left-4 duration-300">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="group">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
              placeholder="name@example.com"
            />
          </div>
          <div className="group">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
              placeholder="••••••••"
            />
          </div>
          {!isLogin && (
            <div className="group animate-in slide-in-from-left-4 duration-300 delay-75">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none border-transparent focus:border-transparent ring-2 ring-transparent ${theme.ring} transition-all`}
                placeholder="••••••••"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => onLogin({ name: fullName || "Demo User", email })}
          className={`w-full ${theme.primary} ${theme.hover} text-white font-bold py-3.5 rounded-xl mt-6 transition-all shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98]`}
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>
        <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isLogin ? "New to QuizGen AI? " : "Already have an account? "}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`${theme.text} ${theme.textDark} font-bold hover:underline transition-colors ml-1`}
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 5. MAIN APP ---
const AppContent = () => {
  const {
    user,
    setUser,
    startTest,
    completeTest,
    testResults,
    activeTest,
    isDarkMode,
  } = useTest();
  const [currentPage, setCurrentPage] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [source, setSource] = useState(null);

  const navigate = (page) => setCurrentPage(page);
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("dashboard");
  };
  const handleGenerate = (count, difficulty, qType, testName) => {
    if (!source) return;
    startTest(source.type, source.value, count, difficulty, qType, testName);
    setIsModalOpen(false);
    navigate("test");
  };
  const handleTestComplete = (answers, timeSpent) => {
    completeTest(answers, timeSpent);
    navigate("result");
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? "dark bg-black" : "bg-gray-50"
      }`}
    >
      {/* Wrapper for Dark Mode Logic */}
      <div className={isDarkMode ? "dark" : ""}>
        <Navbar currentPage={currentPage} navigate={navigate} />
        <main className="relative">
          {currentPage === "home" && (
            <HomeData
              onOpenModal={() => setIsModalOpen(true)}
              setSource={setSource}
              onNavigate={navigate}
            />
          )}
          {currentPage === "dashboard" && (
            <DashboardPage onNavigate={navigate} />
          )}
          {currentPage === "history" && <HistoryPage onNavigate={navigate} />}
          {currentPage === "contact" && <ContactPage />}
          {currentPage === "profile" && <ProfilePage />}
          {currentPage === "login" && <LoginPage onLogin={handleLogin} />}
          {currentPage === "test" && activeTest && (
            <TestPage onComplete={handleTestComplete} />
          )}
          {currentPage === "result" && <ResultPage onNavigate={navigate} />}
        </main>
        <QuestionCountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGenerate={handleGenerate}
        />
        <SettingsButton />
      </div>
    </div>
  );
};

const App = () => (
  <TestProvider>
    <AppContent />
  </TestProvider>
);

export default App;
