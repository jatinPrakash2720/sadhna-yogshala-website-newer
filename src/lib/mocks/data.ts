import type { CourseCard, Category, Testimonial, FAQItem, EnrollmentCard, ClassCard, Notification, AdminStat } from "@/types/frontend";

// ──────────────────────────────────────────────
// Mock Courses
// ──────────────────────────────────────────────
export const MOCK_COURSES: CourseCard[] = [
  {
    id: "c1",
    title: "Morning Vinyasa Flow",
    slug: "morning-vinyasa-flow",
    description: "Begin each day with intention. This energising Vinyasa sequence links breath to movement, building strength and flexibility over 30 transformative days.",
    instructor: "Priya Sharma",
    instructorAvatar: "https://i.pravatar.cc/150?img=47",
    thumbnail: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80",
    price: 2999,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 318,
    enrolledCount: 1240,
    duration: 1800,
    level: "beginner",
    category: "Vinyasa",
    isLive: true,
    isFeatured: true,
    tags: ["morning", "flow", "beginner-friendly"],
  },
  {
    id: "c2",
    title: "Yin Yoga & Deep Restoration",
    slug: "yin-yoga-deep-restoration",
    description: "Slow down, breathe, and release tension stored deep in your connective tissue. Perfect for stress recovery and improving flexibility.",
    instructor: "Ananya Kapoor",
    instructorAvatar: "https://i.pravatar.cc/150?img=56",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    price: 1999,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 204,
    enrolledCount: 876,
    duration: 1500,
    level: "beginner",
    category: "Yin",
    isLive: false,
    isFeatured: true,
    tags: ["yin", "restorative", "flexibility"],
  },
  {
    id: "c3",
    title: "Ashtanga Primary Series",
    slug: "ashtanga-primary-series",
    description: "Master the traditional Mysore-style Ashtanga. This rigorous series builds stamina, discipline, and an unshakeable foundation.",
    instructor: "Rajan Nair",
    instructorAvatar: "https://i.pravatar.cc/150?img=12",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    price: 5999,
    originalPrice: 8999,
    rating: 4.7,
    reviewCount: 156,
    enrolledCount: 543,
    duration: 2400,
    level: "advanced",
    category: "Ashtanga",
    isLive: true,
    isFeatured: false,
    tags: ["ashtanga", "traditional", "advanced"],
  },
  {
    id: "c4",
    title: "Pranayama & Breathwork Mastery",
    slug: "pranayama-breathwork-mastery",
    description: "Unlock the power of your breath. Learn 12 classical pranayama techniques that calm the nervous system, boost energy, and deepen meditation.",
    instructor: "Sunita Devi",
    instructorAvatar: "https://i.pravatar.cc/150?img=32",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    price: 3499,
    originalPrice: 5999,
    rating: 4.9,
    reviewCount: 287,
    enrolledCount: 1102,
    duration: 900,
    level: "intermediate",
    category: "Pranayama",
    isLive: false,
    isFeatured: true,
    tags: ["breathwork", "pranayama", "meditation"],
  },
  {
    id: "c5",
    title: "Kids Yoga: Playful Movement",
    slug: "kids-yoga-playful-movement",
    description: "Specially designed for children ages 5-12. Fun, imaginative sequences that build body awareness, confidence, and focus through play.",
    instructor: "Meera Joshi",
    instructorAvatar: "https://i.pravatar.cc/150?img=41",
    thumbnail: "https://images.unsplash.com/photo-1573858853475-3d9e24073f22?w=600&q=80",
    price: 1499,
    originalPrice: 2499,
    rating: 5.0,
    reviewCount: 93,
    enrolledCount: 420,
    duration: 600,
    level: "beginner",
    category: "Kids",
    isLive: true,
    isFeatured: false,
    tags: ["kids", "fun", "playful"],
  },
  {
    id: "c6",
    title: "Yoga Nidra & Sleep Science",
    slug: "yoga-nidra-sleep-science",
    description: "A deep dive into the science of sleep through Yoga Nidra. Rewire your nervous system and achieve the deepest rest you have ever experienced.",
    instructor: "Vikram Rao",
    instructorAvatar: "https://i.pravatar.cc/150?img=67",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviewCount: 178,
    enrolledCount: 734,
    duration: 720,
    level: "beginner",
    category: "Yoga Nidra",
    isLive: false,
    isFeatured: true,
    tags: ["nidra", "sleep", "relaxation"],
  },
];

// ──────────────────────────────────────────────
// Mock Categories
// ──────────────────────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: "cat1", name: "Vinyasa Flow", icon: "🌊", courseCount: 12, description: "Dynamic, breath-linked movement" },
  { id: "cat2", name: "Yin Yoga", icon: "🌙", courseCount: 8, description: "Deep stretching & restoration" },
  { id: "cat3", name: "Ashtanga", icon: "🔥", courseCount: 6, description: "Traditional vigorous practice" },
  { id: "cat4", name: "Pranayama", icon: "💨", courseCount: 9, description: "Breath control mastery" },
  { id: "cat5", name: "Meditation", icon: "🧘", courseCount: 15, description: "Mindfulness & inner stillness" },
  { id: "cat6", name: "Yoga Nidra", icon: "✨", courseCount: 5, description: "Yogic sleep & deep rest" },
  { id: "cat7", name: "Kids Yoga", icon: "🌈", courseCount: 7, description: "Fun movement for children" },
  { id: "cat8", name: "Hatha", icon: "☀️", courseCount: 10, description: "Classical posture-based practice" },
];

// ──────────────────────────────────────────────
// Mock Testimonials
// ──────────────────────────────────────────────
export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Kavya Reddy",
    avatar: "https://i.pravatar.cc/150?img=23",
    role: "Software Engineer, Bangalore",
    rating: 5,
    text: "I have tried many online yoga platforms, but Sadhna Yogshala is in a different league. The live sessions with Priya feel deeply personal. My back pain of 3 years is completely gone.",
    course: "Morning Vinyasa Flow",
  },
  {
    id: "t2",
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?img=8",
    role: "Entrepreneur, Mumbai",
    rating: 5,
    text: "The Pranayama course transformed how I handle stress. Within two weeks, my sleep improved dramatically and I have more mental clarity throughout the day. Absolutely worth every rupee.",
    course: "Pranayama & Breathwork",
  },
  {
    id: "t3",
    name: "Shalini Verma",
    avatar: "https://i.pravatar.cc/150?img=45",
    role: "Teacher, Delhi",
    rating: 5,
    text: "My 8-year-old daughter loves the Kids Yoga classes. She used to struggle with focus in school; now her teachers are asking what we changed. This is a true gift.",
    course: "Kids Yoga: Playful Movement",
  },
  {
    id: "t4",
    name: "Rahul Gupta",
    avatar: "https://i.pravatar.cc/150?img=15",
    role: "Doctor, Pune",
    rating: 5,
    text: "As a physician, I recommend yoga but rarely had time to practice. The flexible scheduling and recorded sessions mean I never miss a class. The Yin course is phenomenal for recovery.",
    course: "Yin Yoga & Deep Restoration",
  },
];

// ──────────────────────────────────────────────
// Mock FAQs
// ──────────────────────────────────────────────
export const MOCK_FAQS: FAQItem[] = [
  {
    id: "faq1",
    question: "Do I need prior yoga experience to join?",
    answer: "Not at all! We have courses for absolute beginners with no prior experience required. Our instructors provide modifications for every pose so you can practice safely at your own pace.",
  },
  {
    id: "faq2",
    question: "Are classes live or recorded?",
    answer: "We offer both! Live sessions are held via video call with real-time instructor feedback. All live sessions are also recorded and available in your dashboard for 30 days so you never miss a class.",
  },
  {
    id: "faq3",
    question: "What equipment do I need?",
    answer: "Just a yoga mat and comfortable clothing! For some advanced courses, props like blocks and straps are helpful but never mandatory. We will always suggest modifications.",
  },
  {
    id: "faq4",
    question: "Can I get a refund if I am not satisfied?",
    answer: "Yes! We offer a 7-day money-back guarantee on all courses. If you are not completely satisfied, contact us within 7 days of purchase for a full refund — no questions asked.",
  },
  {
    id: "faq5",
    question: "How do I access my courses after purchase?",
    answer: "After payment, you will receive a confirmation email and gain instant access through your student dashboard. All your courses, schedules, and class recordings will be in one place.",
  },
  {
    id: "faq6",
    question: "Are there group discounts?",
    answer: "Yes! For families and corporate groups of 5 or more, we offer special pricing. Reach out to us at namaste@sadhna-yogshala.com and we will create a custom plan for you.",
  },
];

// ──────────────────────────────────────────────
// Mock Enrollments (Student Dashboard)
// ──────────────────────────────────────────────
export const MOCK_ENROLLMENTS: EnrollmentCard[] = [
  {
    id: "e1",
    course: MOCK_COURSES[0],
    enrolledAt: "2025-01-15T10:00:00Z",
    progress: 65,
    completedSessions: 13,
    totalSessions: 20,
  },
  {
    id: "e2",
    course: MOCK_COURSES[3],
    enrolledAt: "2025-02-01T10:00:00Z",
    progress: 30,
    completedSessions: 6,
    totalSessions: 20,
  },
  {
    id: "e3",
    course: MOCK_COURSES[1],
    enrolledAt: "2025-02-20T10:00:00Z",
    progress: 10,
    completedSessions: 2,
    totalSessions: 18,
  },
];

// ──────────────────────────────────────────────
// Mock Upcoming Classes
// ──────────────────────────────────────────────
export const MOCK_CLASSES: ClassCard[] = [
  {
    id: "cl1",
    title: "Morning Vinyasa — Session 14",
    courseTitle: "Morning Vinyasa Flow",
    instructor: "Priya Sharma",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(), // 1.5 hrs from now
    duration: 60,
    meetLink: "https://meet.google.com/abc-def-ghi",
    status: "upcoming",
  },
  {
    id: "cl2",
    title: "Pranayama — Session 7",
    courseTitle: "Pranayama & Breathwork Mastery",
    instructor: "Sunita Devi",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
    duration: 45,
    meetLink: "https://meet.google.com/xyz-uvw-rst",
    status: "upcoming",
  },
  {
    id: "cl3",
    title: "Yin Yoga — Session 3",
    courseTitle: "Yin Yoga & Deep Restoration",
    instructor: "Ananya Kapoor",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 2 days
    duration: 75,
    meetLink: "https://meet.google.com/lmn-opq-rst",
    status: "upcoming",
  },
];

// ──────────────────────────────────────────────
// Mock Notifications
// ──────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Class Starting Soon!",
    message: "Your Morning Vinyasa session starts in 30 minutes. Get your mat ready!",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "n2",
    title: "New Course Available",
    message: "Advanced Meditation & Mindfulness is now live. Enroll with 20% early-bird discount.",
    type: "success",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n3",
    title: "Payment Confirmed",
    message: "Your enrollment in Pranayama Mastery has been confirmed. Check your email.",
    type: "success",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// ──────────────────────────────────────────────
// Mock Admin Stats
// ──────────────────────────────────────────────
export const MOCK_ADMIN_STATS: AdminStat[] = [
  { label: "Total Students", value: "2,847", change: 12.5, icon: "Users", trend: "up" },
  { label: "Revenue (MTD)", value: "₹4,82,350", change: 8.3, icon: "TrendingUp", trend: "up" },
  { label: "Active Courses", value: 24, change: 2, icon: "BookOpen", trend: "up" },
  { label: "Classes Today", value: 8, change: -1, icon: "Calendar", trend: "down" },
];
