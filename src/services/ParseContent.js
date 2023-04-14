module.exports = (content) => {
    const splitSentences = (text) => {
        return text
            .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
            .split('|')
            .map(sentence => sentence.trim());
    };

    const lines = content.split('\n');
    const sentences = [];
    const options = [];

    let optionsStartIndex = -1;

    lines.forEach((line, index) => {
        const parsedLine = line.trim();
        const optionMatch = parsedLine.match(/^(\d+)\.\s(.+)/);

        if (optionMatch && optionsStartIndex === -1) {
            optionsStartIndex = index;
        }

        if (optionsStartIndex !== -1 && optionMatch) {
            options.push(optionMatch[2]);
        } else if (optionsStartIndex === -1) {
            sentences.push(parsedLine);
        }
    });

    if (options.length == 0) {
        return null;
    }

    const combinedSentences = sentences.join(' ');
    const separatedSentences = splitSentences(combinedSentences);

    return {
        sentences: separatedSentences,
        options,
    };
};