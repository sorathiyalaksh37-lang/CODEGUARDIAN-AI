const allowedExtensions = [

  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".cs",
  ".go",
  ".php",
  ".rb",

];

const fileFilter = (files) => {

  return files.filter((file) => {

    if (!file.path) return false;

    return allowedExtensions.some((ext) =>
      file.path.endsWith(ext)
    );

  });

};

export default fileFilter;