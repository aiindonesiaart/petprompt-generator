// Sample prompt database
const prompts = [
    {
        id: 1,
        text: "Write a story about a cat who becomes a detective",
        type: "cat",
        category: "writing"
    },
    {
        id: 2,
        text: "Draw your pet as a superhero with special powers",
        type: "all",
        category: "drawing"
    },
    {
        id: 3,
        text: "Create an obstacle course for your dog using household items",
        type: "dog",
        category: "activity"
    },
    {
        id: 4,
        text: "Describe a day in the life of your pet from their perspective",
        type: "all",
        category: "writing"
    },
    {
        id: 5,
        text: "Sketch your bird in a fantasy landscape",
        type: "bird",
        category: "drawing"
    },
    {
        id: 6,
        text: "Invent a new game to play with your fish",
        type: "fish",
        category: "activity"
    },
    {
        id: 7,
        text: "Write a poem about your reptile's morning routine",
        type: "reptile",
        category: "writing"
    },
    {
        id: 8,
        text: "Draw a comic strip about your pet's secret life",
        type: "all",
        category: "drawing"
    },
    {
        id: 9,
        text: "Design a treasure hunt for your cat with treats as rewards",
        type: "cat",
        category: "activity"
    },
    {
        id: 10,
        text: "Imagine and describe what your pet dreams about",
        type: "all",
        category: "writing"
    }
];

// DOM elements
const generateBtn = document.getElementById('generate-btn');
const petTypeSelect = document.getElementById('pet-type');
const categoryBtns = document.querySelectorAll('.category-btn');
const promptDisplay = document.querySelector('.prompt-display .prompt-card');
const promptText = document.querySelector('.prompt-text');
const promptMeta = document.querySelector('.prompt-meta');
const saveBtn = document.querySelector('.save-btn');
const toggleSavedBtn = document.querySelector('.toggle-saved');
const savedList = document.querySelector('.saved-list');
const savedCount = document.querySelector('.saved-count');

// State variables
let currentPrompt = null;
let savedPrompts = JSON.parse(localStorage.getItem('savedPetPrompts')) || [];

// Initialize the app
function init() {
    updateSavedCount();
    displaySavedPrompts();
    generateBtn.addEventListener('click', generatePrompt);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    saveBtn.addEventListener('click', toggleSavePrompt);
    toggleSavedBtn.addEventListener('click', toggleSavedList);
}

// Generate random prompt
function generatePrompt() {
    const selectedPetType = petTypeSelect.value;
    const selectedCategory = document.querySelector('.category-btn.active').dataset.category;
    
    // Filter prompts based on selection
    let filteredPrompts = prompts.filter(p => {
        const typeMatch = selectedPetType === 'all' || p.type === selectedPetType || p.type === 'all';
        const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
        return typeMatch && categoryMatch;
    });
    
    // Select random prompt
    if (filteredPrompts.length > 0) {
        currentPrompt = filteredPrompts[Math.floor(Math.random() * filteredPrompts.length)];
        displayPrompt(currentPrompt);
    } else {
        currentPrompt = {
            id: 0,
            text: "No prompts match your criteria. Try different filters!",
            type: "all",
            category: "all"
        };
        displayPrompt(currentPrompt);
    }
}

// Display prompt function
function displayPrompt(prompt) {
    promptText.textContent = prompt.text;
    
    // Clear previous meta tags
    promptMeta.innerHTML = '';
    
    // Create and append pet type tag
    const petTypeTag = document.createElement('span');
    petTypeTag.className = `pet-type-tag ${prompt.type}`;
    petTypeTag.textContent = prompt.type;
    promptMeta.appendChild(petTypeTag);
    
    // Create and append category tag
    const categoryTag = document.createElement('span');
    categoryTag.className = `category-tag ${prompt.category}`;
    categoryTag.textContent = prompt.category;
    promptMeta.appendChild(categoryTag);
    
    // Update save button state
    const isSaved = savedPrompts.some(p => p.id === prompt.id);
    saveBtn.classList.toggle('saved', isSaved);
    saveBtn.textContent = isSaved ? 'Saved' : 'Save';
}

// Toggle save prompt
function toggleSavePrompt() {
    if (!currentPrompt || currentPrompt.id === 0) return;
    
    const promptIndex = savedPrompts.findIndex(p => p.id === currentPrompt.id);
    
    if (promptIndex === -1) {
        // Add to saved
        savedPrompts.push(currentPrompt);
        saveBtn.classList.add('saved');
        saveBtn.textContent = 'Saved';
    } else {
        // Remove from saved
        savedPrompts.splice(promptIndex, 1);
        saveBtn.classList.remove('saved');
        saveBtn.textContent = 'Save';
    }
    
    // Update localStorage and UI
    localStorage.setItem('savedPetPrompts', JSON.stringify(savedPrompts));
    updateSavedCount();
    displaySavedPrompts();
}

// Update saved prompts count
function updateSavedCount() {
    savedCount.textContent = savedPrompts.length;
}

// Display saved prompts
function displaySavedPrompts() {
    savedList.innerHTML = '';
    
    if (savedPrompts.length === 0) {
        savedList.innerHTML = '<p>No saved prompts yet.</p>';
        return;
    }
    
    savedPrompts.forEach(prompt => {
        const savedItem = document.createElement('div');
        savedItem.className = 'saved-item';
        
        const promptText = document.createElement('p');
        promptText.className = 'prompt-text';
        promptText.textContent = prompt.text;
        
        const promptMeta = document.createElement('div');
        promptMeta.className = 'prompt-meta';
        
        const petTypeTag = document.createElement('span');
        petTypeTag.className = `pet-type-tag ${prompt.type}`;
        petTypeTag.textContent = prompt.type;
        
        const categoryTag = document.createElement('span');
        categoryTag.className = `category-tag ${prompt.category}`;
        categoryTag.textContent = prompt.category;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', () => removeSavedPrompt(prompt.id));
        
        promptMeta.appendChild(petTypeTag);
        promptMeta.appendChild(categoryTag);
        
        savedItem.appendChild(promptText);
        savedItem.appendChild(promptMeta);
        savedItem.appendChild(removeBtn);
        
        savedList.appendChild(savedItem);
    });
}

// Remove saved prompt
function removeSavedPrompt(id) {
    savedPrompts = savedPrompts.filter(p => p.id !== id);
    localStorage.setItem('savedPetPrompts', JSON.stringify(savedPrompts));
    updateSavedCount();
    displaySavedPrompts();
    
    // Update current prompt save button if needed
    if (currentPrompt && currentPrompt.id === id) {
        saveBtn.classList.remove('saved');
        saveBtn.textContent = 'Save';
    }
}

// Toggle saved prompts list visibility
function toggleSavedList() {
    savedList.classList.toggle('hidden');
    toggleSavedBtn.classList.toggle('expanded');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
