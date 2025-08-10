// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

// Check for saved theme preference or use preferred color scheme
const currentTheme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
    themeLabel.textContent = 'Light Mode';
}

themeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeLabel.textContent = 'Light Mode';
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeLabel.textContent = 'Dark Mode';
    }
});

// Username generation functionality
const generationHistory = [];
const historyTextarea = document.getElementById("history");

function updateHistory(mask, username) {
    const entry = `[${new Date().toLocaleTimeString()}] ${mask} → ${username}`;
    generationHistory.push(entry);
    historyTextarea.value = generationHistory.join("\n");
    historyTextarea.scrollTop = historyTextarea.scrollHeight;
}

function generateUsernameFromInput() {
    const maskInput = document.getElementById("mask");
    const mask = maskInput.value.trim();
    const resultDiv = document.getElementById("result");

    maskInput.classList.remove("error");
    resultDiv.classList.remove("error");

    if (!mask) {
        resultDiv.textContent = "Please enter a mask pattern";
        resultDiv.classList.add("error");
        return;
    }

    try {
        const username = generateUsername(mask);
        resultDiv.textContent = `Generated username: ${username}`;
        updateHistory(mask, username);
    } catch (e) {
        resultDiv.textContent = `Error: ${e.message}`;
        resultDiv.classList.add("error");
        maskInput.classList.add("error");
    }
}

document.getElementById("generate").addEventListener("click", generateUsernameFromInput);
document.getElementById("mask").addEventListener("keypress", function(e) {
    if (e.key === "Enter") generateUsernameFromInput();
});

function generateUsername(mask) {
    const vowels = "aeiou";
    const consonants = "bcdfghjklmnpqrstvwxyz";
    const validPatternChars = new Set(["C", "c", "V", "v", "#", "%"]);

    let result = [];
    let i = 0;

    while (i < mask.length) {
        const char = mask[i];
        const multiplierMatch = mask.slice(i).match(/^(\d+)([CcVv#%])/);
        
        if (multiplierMatch) {
            const multiplier = parseInt(multiplierMatch[1]);
            const patternChar = multiplierMatch[2];
            i += multiplierMatch[0].length;

            if (patternChar === "%") {
                if (i < mask.length) {
                    result.push(mask[i].repeat(multiplier));
                    i++;
                }
                continue;
            }

            let generatedChar;
            switch (patternChar) {
                case "C": generatedChar = consonants[Math.floor(Math.random() * consonants.length)].toUpperCase(); break;
                case "c": generatedChar = consonants[Math.floor(Math.random() * consonants.length)]; break;
                case "V": generatedChar = vowels[Math.floor(Math.random() * vowels.length)].toUpperCase(); break;
                case "v": generatedChar = vowels[Math.floor(Math.random() * vowels.length)]; break;
                case "#": generatedChar = Math.floor(Math.random() * 10).toString(); break;
                default: throw new Error(`Invalid pattern character after multiplier: '${patternChar}'`);
            }

            result.push(generatedChar.repeat(multiplier));
            continue;
        }

        if (char === "%") {
            if (i + 1 < mask.length) {
                result.push(mask[i + 1]);
                i += 2;
            }
            continue;
        }

        switch (char) {
            case "C": result.push(consonants[Math.floor(Math.random() * consonants.length)].toUpperCase()); break;
            case "c": result.push(consonants[Math.floor(Math.random() * consonants.length)]); break;
            case "V": result.push(vowels[Math.floor(Math.random() * vowels.length)].toUpperCase()); break;
            case "v": result.push(vowels[Math.floor(Math.random() * vowels.length)]); break;
            case "#": result.push(Math.floor(Math.random() * 10).toString()); break;
            default:
                if (!validPatternChars.has(char)) {
                    throw new Error(`Invalid character in mask: '${char}'. Use only C, c, V, v, #, %, or digits followed by these characters.`);
                }
                result.push(char);
        }

        i++;
    }

    return result.join("");
}