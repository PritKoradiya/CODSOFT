// Sample fallback jobs shown on Home page when backend has no jobs
const sampleJobs = [
  {
    _id: "sample-1",
    title: "Frontend React Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA",
    salary: 95000,
    jobType: "full-time",
    description:
      "We are looking for a skilled Frontend React Developer to join our growing team. You will build responsive web applications, collaborate with designers, and write clean, maintainable code. Experience with modern React hooks, state management, and REST APIs is required.",
    skills: ["React", "JavaScript", "CSS", "TypeScript", "Git"],
    postedBy: { name: "TechNova HR" },
  },
  {
    _id: "sample-2",
    title: "Backend Node.js Engineer",
    company: "CloudBridge Inc.",
    location: "Remote",
    salary: 110000,
    jobType: "full-time",
    description:
      "Join our backend team to design and build scalable APIs and microservices. You will work with Node.js, Express, and PostgreSQL. Strong understanding of database design, authentication, and deployment pipelines is a plus.",
    skills: ["Node.js", "Express", "PostgreSQL", "REST API", "Docker"],
    postedBy: { name: "CloudBridge HR" },
  },
  {
    _id: "sample-3",
    title: "UI/UX Design Intern",
    company: "PixelCraft Studio",
    location: "New York, NY",
    salary: 25000,
    jobType: "internship",
    description:
      "A fantastic opportunity for aspiring designers to gain hands-on experience in UI/UX design. You will assist in creating wireframes, prototypes, and visual mockups using Figma. Great mentorship and learning environment.",
    skills: ["Figma", "UI Design", "Wireframing", "Prototyping"],
    postedBy: { name: "PixelCraft HR" },
  },
  {
    _id: "sample-4",
    title: "Part-Time Content Writer",
    company: "GrowthLeaf Media",
    location: "Austin, TX",
    salary: 35000,
    jobType: "part-time",
    description:
      "We need a creative content writer to produce blog posts, social media copy, and product descriptions. Must have strong English writing skills and SEO knowledge. Flexible hours with remote work option.",
    skills: ["Content Writing", "SEO", "Copywriting", "WordPress"],
    postedBy: { name: "GrowthLeaf HR" },
  },
];

export default sampleJobs;
