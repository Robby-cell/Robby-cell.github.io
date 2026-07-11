type ProjectLink = {
  label: string;
  url: string;
};

type Project = {
  name: string;
  url?: string;
  description?: string;
  codeSnippet?: string[] | string;
  language?: "cpp" | "java" | "javascript" | "python" | "rust";
  links?: ProjectLink[];
  imageSources?: string[];
  imageAlt?: string;
  imageAlts?: string[];
};
