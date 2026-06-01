const optimizeCode = (content) => {

    if (!content) return "";

    // LARGE FILE OPTIMIZATION
    if (content.length > 5000) {

        console.log(
            "Large file optimized"
        );

        return content
            .split("\n")
            .slice(0, 100)
            .join("\n");

    }

    return content;
};

export default optimizeCode;