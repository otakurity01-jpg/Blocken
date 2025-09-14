// Blocken Championship Pro - Professional Fighting Game
// Advanced AI, Dynamic Weather, Tournament System, Cinematic Combat

class BlockenChampionshipPro {
    constructor() {
        this.currentGameMode = null;
        this.selectedDifficulty = null;
        this.selectedCharacter = null;
        this.currentWeather = null;
        this.tournamentData = null;
        this.gameStats = {
            totalDamage: 0,
            maxCombo: 0,
            perfectGuards: 0,
            battleTime: 0,
            currentCombo: 0
        };
        this.performanceMonitor = new PerformanceMonitor();
        this.weatherSystem = new DynamicWeatherSystem();
        this.aiSystem = new AdvancedAISystem();
        this.combatSystem = new EnhancedCombatSystem();
        this.tournamentSystem = new TournamentBracketSystem();
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.showLoadingScreen();
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showStartScreen();
        }, 2000);
    }

    setupEventListeners() {
        // Start Screen Navigation - Fixed
        const tournamentBtn = document.getElementById('tournament-mode-btn');
        const quickFightBtn = document.getElementById('quick-fight-btn');
        const trainingBtn = document.getElementById('training-mode-btn');

        if (tournamentBtn) {
            tournamentBtn.addEventListener('click', () => {
                console.log('Tournament mode selected');
                this.currentGameMode = 'tournament';
                this.showDifficultySelect();
            });
        }

        if (quickFightBtn) {
            quickFightBtn.addEventListener('click', () => {
                console.log('Quick fight selected');
                this.currentGameMode = 'quick';
                this.showDifficultySelect();
            });
        }

        if (trainingBtn) {
            trainingBtn.addEventListener('click', () => {
                console.log('Training mode selected');
                this.currentGameMode = 'training';
                this.selectedDifficulty = 'easy';
                this.showCharacterSelect();
            });
        }

        // Difficulty Selection - Fixed
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectDifficulty(card.dataset.difficulty);
            });
        });

        const difficultyBack = document.getElementById('difficulty-back');
        const difficultyConfirm = document.getElementById('difficulty-confirm');

        if (difficultyBack) {
            difficultyBack.addEventListener('click', () => {
                console.log('Going back to start screen');
                this.showStartScreen();
            });
        }

        if (difficultyConfirm) {
            difficultyConfirm.addEventListener('click', () => {
                console.log('Difficulty confirmed, proceeding...');
                if (this.selectedDifficulty) {
                    if (this.currentGameMode === 'tournament') {
                        this.showTournamentBracket();
                    } else {
                        this.showCharacterSelect();
                    }
                }
            });
        }

        // Tournament System - Fixed
        const tournamentBack = document.getElementById('tournament-back');
        const startTournament = document.getElementById('start-tournament');

        if (tournamentBack) {
            tournamentBack.addEventListener('click', () => {
                this.showDifficultySelect();
            });
        }

        if (startTournament) {
            startTournament.addEventListener('click', () => {
                this.initializeTournament();
                this.showCharacterSelect();
            });
        }

        // Character Selection - Fixed
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectCharacter(card.dataset.character);
            });
        });

        const characterBack = document.getElementById('character-back');
        const characterConfirm = document.getElementById('character-confirm');

        if (characterBack) {
            characterBack.addEventListener('click', () => {
                if (this.currentGameMode === 'tournament') {
                    this.showTournamentBracket();
                } else {
                    this.showDifficultySelect();
                }
            });
        }

        if (characterConfirm) {
            characterConfirm.addEventListener('click', () => {
                if (this.selectedCharacter) {
                    this.startBattle();
                }
            });
        }

        // Victory Screen - Fixed
        const victoryContinue = document.getElementById('victory-continue');
        const victoryMenu = document.getElementById('victory-menu');

        if (victoryContinue) {
            victoryContinue.addEventListener('click', () => {
                this.continueGameMode();
            });
        }

        if (victoryMenu) {
            victoryMenu.addEventListener('click', () => {
                this.showStartScreen();
            });
        }

        // Tournament Complete - Fixed
        const newTournament = document.getElementById('new-tournament');
        const championshipMenu = document.getElementById('championship-menu');

        if (newTournament) {
            newTournament.addEventListener('click', () => {
                this.showTournamentBracket();
            });
        }

        if (championshipMenu) {
            championshipMenu.addEventListener('click', () => {
                this.showStartScreen();
            });
        }

        // Mobile Controls Setup
        this.setupMobileControls();
        
        // Keyboard Controls
        this.setupKeyboardControls();
    }

    showLoadingScreen() {
        this.hideAllScreens();
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            this.animateLoading();
        }
    }

    animateLoading() {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        const steps = [
            'Initializing combat engine...',
            'Loading AI personalities...',
            'Generating weather systems...',
            'Setting up tournament brackets...',
            'Optimizing visual effects...',
            'Ready for championship!'
        ];

        let progress = 0;
        let stepIndex = 0;

        const interval = setInterval(() => {
            progress += 16.67;
            if (progressBar) progressBar.style.width = progress + '%';
            
            if (stepIndex < steps.length && loadingText) {
                loadingText.textContent = steps[stepIndex];
                stepIndex++;
            }

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 300);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    showStartScreen() {
        console.log('Showing start screen');
        this.hideAllScreens();
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.classList.remove('hidden');
        }
        this.resetGameState();
    }

    showDifficultySelect() {
        console.log('Showing difficulty select');
        this.hideAllScreens();
        const difficultyScreen = document.getElementById('difficulty-select');
        if (difficultyScreen) {
            difficultyScreen.classList.remove('hidden');
        }
        
        // Reset difficulty selection
        this.selectedDifficulty = null;
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });
        const confirmBtn = document.getElementById('difficulty-confirm');
        if (confirmBtn) confirmBtn.disabled = true;
    }

    showTournamentBracket() {
        console.log('Showing tournament bracket');
        this.hideAllScreens();
        const tournamentScreen = document.getElementById('tournament-bracket');
        if (tournamentScreen) {
            tournamentScreen.classList.remove('hidden');
        }
        this.tournamentSystem.setupBracket();
    }

    showCharacterSelect() {
        console.log('Showing character select');
        this.hideAllScreens();
        const characterScreen = document.getElementById('character-select');
        if (characterScreen) {
            characterScreen.classList.remove('hidden');
        }
        this.weatherSystem.generateRandomWeather();
        this.displayCurrentWeather();
        
        // Reset character selection
        this.selectedCharacter = null;
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        const confirmBtn = document.getElementById('character-confirm');
        if (confirmBtn) confirmBtn.disabled = true;
    }

    showGameArena() {
        console.log('Showing game arena');
        this.hideAllScreens();
        const gameScreen = document.getElementById('game-container');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
        }
        this.setupMobileControls();
        this.initialize3DScene();
    }

    showVictoryScreen(isVictory = true) {
        this.hideAllScreens();
        if (isVictory) {
            const victoryScreen = document.getElementById('victory-screen');
            if (victoryScreen) {
                victoryScreen.classList.remove('hidden');
            }
            this.displayVictoryStats();
        } else {
            // Handle defeat
            this.showStartScreen();
        }
    }

    showTournamentComplete() {
        this.hideAllScreens();
        const tournamentCompleteScreen = document.getElementById('tournament-complete');
        if (tournamentCompleteScreen) {
            tournamentCompleteScreen.classList.remove('hidden');
        }
        this.displayChampionshipCelebration();
    }

    hideAllScreens() {
        const screens = [
            'start-screen', 'difficulty-select', 'tournament-bracket',
            'character-select', 'game-container', 'victory-screen',
            'tournament-complete', 'loading-screen'
        ];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }

    selectDifficulty(difficulty) {
        console.log('Selected difficulty:', difficulty);
        this.selectedDifficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-difficulty="${difficulty}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        const confirmBtn = document.getElementById('difficulty-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
        
        // Initialize AI with selected difficulty
        this.aiSystem.setDifficulty(difficulty);
    }

    selectCharacter(characterId) {
        console.log('Selected character:', characterId);
        this.selectedCharacter = characterId;
        
        // Update UI
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-character="${characterId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        const confirmBtn = document.getElementById('character-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
        
        // Update character info in UI
        const characterData = this.getCharacterData(characterId);
        const playerName = document.getElementById('player-name');
        const playerTitle = document.getElementById('player-title');
        
        if (playerName) playerName.textContent = characterData.name;
        if (playerTitle) playerTitle.textContent = characterData.title;
    }

    getCharacterData(characterId) {
        const characters = {
            yukito: { name: 'Yukito', title: 'The Iron Fist', color: 0x4A90E2 },
            yuka: { name: 'Yuka', title: 'The Rose Warrior', color: 0xE24A90 },
            chao: { name: 'Chao', title: 'The Dragon Master', color: 0x4AE290 },
            chaoli: { name: 'Chaoli', title: 'The Phoenix Dancer', color: 0x9A4AE2 }
        };
        return characters[characterId] || characters.yukito;
    }

    displayCurrentWeather() {
        const weather = this.currentWeather || this.weatherSystem.getCurrentWeather();
        const weatherIcon = document.getElementById('current-weather-icon');
        const weatherName = document.getElementById('current-weather-name');
        
        if (weatherIcon) weatherIcon.textContent = weather.icon;
        if (weatherName) weatherName.textContent = weather.name;
    }

    initializeTournament() {
        this.tournamentData = this.tournamentSystem.initialize(this.selectedDifficulty);
    }

    startBattle() {
        console.log('Starting battle...');
        this.resetGameStats();
        this.showGameArena();
        this.combatSystem.initialize(this.selectedCharacter, this.selectedDifficulty);
        this.weatherSystem.applyWeatherEffects();
        this.startGameLoop();
        
        // Simulate battle completion for demo
        setTimeout(() => {
            this.endBattle(true); // Player wins
        }, 10000);
    }

    endBattle(playerWon) {
        this.gameLoopRunning = false;
        if (playerWon) {
            this.showVictoryScreen(true);
        } else {
            this.showVictoryScreen(false);
        }
    }

    resetGameStats() {
        this.gameStats = {
            totalDamage: Math.floor(Math.random() * 500) + 200,
            maxCombo: Math.floor(Math.random() * 10) + 3,
            perfectGuards: Math.floor(Math.random() * 5),
            battleTime: Math.floor(Math.random() * 60) + 30,
            currentCombo: 0
        };
    }

    resetGameState() {
        this.currentGameMode = null;
        this.selectedDifficulty = null;
        this.selectedCharacter = null;
        this.tournamentData = null;
    }

    setupMobileControls() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
        const mobileControls = document.getElementById('mobile-controls');
        
        if (isMobile && mobileControls) {
            mobileControls.classList.add('active');
            this.setupVirtualJoystick();
            this.setupTouchButtons();
        }
    }

    setupVirtualJoystick() {
        const joystick = document.getElementById('virtual-joystick');
        const knob = document.getElementById('joystick-knob');
        if (!joystick || !knob) return;

        let isDragging = false;

        joystick.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        joystick.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = rect.width / 2 - 20;
            
            if (distance <= maxDistance) {
                knob.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            }
            
            this.handleMovementInput(deltaX / maxDistance, deltaY / maxDistance);
            e.preventDefault();
        });

        joystick.addEventListener('touchend', () => {
            isDragging = false;
            knob.style.transform = 'translate(-50%, -50%)';
            this.handleMovementInput(0, 0);
        });
    }

    setupTouchButtons() {
        const buttons = document.querySelectorAll('.attack-btn, .special-btn, .util-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                button.classList.add('active');
                this.handleAttackInput(button.dataset.key);
                e.preventDefault();
            });

            button.addEventListener('touchend', (e) => {
                button.classList.remove('active');
                e.preventDefault();
            });
        });
    }

    setupKeyboardControls() {
        const keys = {};
        
        document.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
            this.handleKeyboardInput(e.key.toLowerCase(), true);
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
            this.handleKeyboardInput(e.key.toLowerCase(), false);
        });
    }

    handleMovementInput(x, y) {
        if (this.combatSystem) {
            this.combatSystem.handleMovement(x, y);
        }
    }

    handleAttackInput(key) {
        if (this.combatSystem) {
            this.combatSystem.handleAttack(key);
        }
    }

    handleKeyboardInput(key, isPressed) {
        const keyMap = {
            'w': 'up', 's': 'down', 'a': 'left', 'd': 'right',
            'j': 'light', 'k': 'heavy', 'l': 'combo', 'u': 'super',
            'g': 'guard', ' ': 'jump'
        };

        const action = keyMap[key];
        if (action && this.combatSystem) {
            if (['up', 'down', 'left', 'right'].includes(action)) {
                this.combatSystem.handleMovement(action, isPressed);
            } else if (isPressed) {
                this.combatSystem.handleAttack(action);
            }
        }
    }

    initialize3DScene() {
        if (!this.scene) {
            this.setupThreeJS();
        }
        this.combatSystem.setup3DScene(this.scene, this.camera, this.renderer);
        this.weatherSystem.setup3DEffects(this.scene);
    }

    setupThreeJS() {
        const container = document.getElementById('three-container');
        if (!container) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // Camera setup with cinematic positioning
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Arena setup
        this.createArena();
    }

    createArena() {
        // Arena floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Arena boundaries
        const boundaryGeometry = new THREE.BoxGeometry(0.5, 2, 20);
        const boundaryMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        
        const leftBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        leftBoundary.position.set(-10, 1, 0);
        this.scene.add(leftBoundary);
        
        const rightBoundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
        rightBoundary.position.set(10, 1, 0);
        this.scene.add(rightBoundary);
    }

    startGameLoop() {
        this.gameLoopRunning = true;
        this.battleStartTime = Date.now();
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameLoopRunning) return;
        
        // Update game systems
        this.combatSystem.update();
        this.aiSystem.update();
        this.weatherSystem.update();
        this.updateUI();
        this.performanceMonitor.update();
        
        // Render 3D scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updateUI() {
        // Update combo display
        const comboCounter = document.getElementById('combo-counter');
        if (comboCounter) comboCounter.textContent = `${this.gameStats.currentCombo} COMBO`;
        
        // Update damage display
        const damageDisplay = document.getElementById('total-damage-display');
        if (damageDisplay) damageDisplay.textContent = `${this.gameStats.totalDamage} DMG`;
        
        // Update battle timer
        const battleTime = Math.floor((Date.now() - this.battleStartTime) / 1000);
        this.gameStats.battleTime = battleTime;
        const timerDisplay = document.getElementById('round-timer');
        if (timerDisplay) timerDisplay.textContent = battleTime + 's';
        
        // Update performance info
        const fpsCounter = document.getElementById('fps-counter');
        const particleCounter = document.getElementById('particles-counter');
        
        if (fpsCounter) fpsCounter.textContent = `${this.performanceMonitor.getFPS()} FPS`;
        if (particleCounter) particleCounter.textContent = `${this.weatherSystem.getParticleCount()} Particles`;
    }

    continueGameMode() {
        if (this.currentGameMode === 'tournament') {
            if (this.tournamentSystem.advanceRound()) {
                this.showCharacterSelect();
            } else {
                this.showTournamentComplete();
            }
        } else {
            this.showStartScreen();
        }
    }

    displayVictoryStats() {
        const finalDamage = document.getElementById('final-damage');
        const finalCombo = document.getElementById('final-combo');
        const finalGuards = document.getElementById('final-guards');
        const finalTime = document.getElementById('final-time');
        
        if (finalDamage) finalDamage.textContent = this.gameStats.totalDamage;
        if (finalCombo) finalCombo.textContent = this.gameStats.maxCombo;
        if (finalGuards) finalGuards.textContent = this.gameStats.perfectGuards;
        if (finalTime) finalTime.textContent = this.gameStats.battleTime + 's';
        
        const character = this.getCharacterData(this.selectedCharacter);
        const victoryCharDisplay = document.getElementById('victory-character-display');
        if (victoryCharDisplay) victoryCharDisplay.textContent = character.name;
    }

    displayChampionshipCelebration() {
        const character = this.getCharacterData(this.selectedCharacter);
        const championName = document.getElementById('champion-character-name');
        if (championName) championName.textContent = character.name;
    }
}

// Enhanced Combat System
class EnhancedCombatSystem {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.particles = [];
        this.cameraEffects = new CinematicCamera();
    }

    initialize(playerCharacter, difficulty) {
        this.createFighters(playerCharacter, difficulty);
        this.setupCombatMechanics();
    }

    createFighters(playerCharacter, difficulty) {
        // Create 3D block characters with enhanced visuals
        const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const playerMaterial = new THREE.MeshLambertMaterial({ color: this.getCharacterColor(playerCharacter) });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(-3, 1, 0);
        this.player.castShadow = true;
        
        const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
        const enemyMaterial = new THREE.MeshLambertMaterial({ color: 0xff4444 });
        this.enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        this.enemy.position.set(3, 1, 0);
        this.enemy.castShadow = true;
    }

    getCharacterColor(character) {
        const colors = {
            yukito: 0x4A90E2,
            yuka: 0xE24A90,
            chao: 0x4AE290,
            chaoli: 0x9A4AE2
        };
        return colors[character] || 0x4A90E2;
    }

    setup3DScene(scene, camera, renderer) {
        if (this.player) scene.add(this.player);
        if (this.enemy) scene.add(this.enemy);
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.cameraEffects.initialize(camera);
    }

    handleMovement(direction, isPressed) {
        if (!this.player) return;
        
        const speed = 0.1;
        switch(direction) {
            case 'left':
                if (isPressed) this.player.position.x -= speed;
                break;
            case 'right':
                if (isPressed) this.player.position.x += speed;
                break;
            case 'up':
                if (isPressed) this.player.position.z -= speed;
                break;
            case 'down':
                if (isPressed) this.player.position.z += speed;
                break;
        }
        
        // Constrain to arena bounds
        this.player.position.x = Math.max(-9, Math.min(9, this.player.position.x));
        this.player.position.z = Math.max(-9, Math.min(9, this.player.position.z));
    }

    handleAttack(type) {
        if (!this.player || !this.enemy) return;
        
        const distance = this.player.position.distanceTo(this.enemy.position);
        if (distance < 3) {
            this.executeAttack(type);
            this.createImpactEffects();
            this.cameraEffects.addScreenShake();
        }
    }

    executeAttack(type) {
        const damage = this.calculateDamage(type);
        game.gameStats.totalDamage += damage;
        game.gameStats.currentCombo++;
        game.gameStats.maxCombo = Math.max(game.gameStats.maxCombo, game.gameStats.currentCombo);
        
        this.showDamageIndicator(damage);
        this.animateAttack(type);
    }

    calculateDamage(type) {
        const baseDamage = {
            light: 10,
            heavy: 20,
            combo: 15,
            super: 35,
            j: 10,
            k: 20,
            l: 15,
            u: 35
        };
        return baseDamage[type] || 10;
    }

    animateAttack(type) {
        if (!this.player) return;
        
        const originalX = this.player.position.x;
        this.player.position.x += 0.5;
        
        setTimeout(() => {
            this.player.position.x = originalX;
        }, 200);
    }

    createImpactEffects() {
        for (let i = 0; i < 10; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            if (this.scene) this.scene.add(particle);
        }
    }

    createParticle() {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.copy(this.enemy.position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        
        return particle;
    }

    showDamageIndicator(damage) {
        const indicator = document.getElementById('super-flash-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            const span = indicator.querySelector('span');
            if (span) span.textContent = `💥 ${damage} DMG!`;
            
            setTimeout(() => {
                indicator.classList.add('hidden');
            }, 1000);
        }
    }

    setupCombatMechanics() {
        // Initialize enhanced combat mechanics
        this.comboSystem = new ComboSystem();
        this.impactFeedback = new ImpactFeedbackSystem();
    }

    update() {
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.position.add(particle.velocity);
            particle.velocity.y -= 0.01; // gravity
            
            if (particle.position.y < 0) {
                if (this.scene) this.scene.remove(particle);
                this.particles.splice(index, 1);
            }
        });
        
        // Update camera effects
        this.cameraEffects.update();
    }
}

// Advanced AI System
class AdvancedAISystem {
    constructor() {
        this.difficulty = 'medium';
        this.aiPersonality = 'balanced';
        this.reactionTime = 500;
        this.aggressionLevel = 0.5;
        this.adaptationRate = 0.2;
        this.playerPatterns = [];
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        const settings = {
            easy: { reactionTime: 800, aggressionLevel: 0.3, adaptationRate: 0.0 },
            medium: { reactionTime: 500, aggressionLevel: 0.6, adaptationRate: 0.2 },
            hard: { reactionTime: 300, aggressionLevel: 0.8, adaptationRate: 0.4 },
            expert: { reactionTime: 150, aggressionLevel: 0.9, adaptationRate: 0.6 }
        };
        
        const config = settings[difficulty] || settings.medium;
        this.reactionTime = config.reactionTime;
        this.aggressionLevel = config.aggressionLevel;
        this.adaptationRate = config.adaptationRate;
    }

    update() {
        if (Math.random() < this.aggressionLevel * 0.01) {
            this.executeAIAction();
        }
    }

    executeAIAction() {
        const actions = ['attack', 'defend', 'move', 'combo'];
        const selectedAction = actions[Math.floor(Math.random() * actions.length)];
        
        setTimeout(() => {
            this.performAction(selectedAction);
        }, this.reactionTime * (0.5 + Math.random() * 0.5));
    }

    performAction(action) {
        switch(action) {
            case 'attack':
                this.aiAttack();
                break;
            case 'defend':
                this.aiDefend();
                break;
            case 'move':
                this.aiMove();
                break;
            case 'combo':
                this.aiCombo();
                break;
        }
    }

    aiAttack() {
        // Simulate AI attack
        if (Math.random() < 0.3) {
            game.gameStats.currentCombo = 0; // Reset player combo
        }
    }

    aiDefend() {
        if (Math.random() < 0.7) {
            this.showPerfectGuard();
        }
    }

    aiMove() {
        // Simulate AI movement
    }

    aiCombo() {
        // Simulate AI combo
        const comboLength = Math.min(3 + Math.floor(this.aggressionLevel * 3), 6);
        for (let i = 0; i < comboLength; i++) {
            setTimeout(() => {
                this.aiAttack();
            }, i * 300);
        }
    }

    showPerfectGuard() {
        const indicator = document.getElementById('perfect-guard-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            
            setTimeout(() => {
                indicator.classList.add('hidden');
            }, 800);
            
            game.gameStats.perfectGuards++;
        }
    }
}

// Dynamic Weather System
class DynamicWeatherSystem {
    constructor() {
        this.weatherTypes = [
            { id: 'clear', name: 'Clear Championship', icon: '🌤️', effects: { visibility: 1.0, particles: 0 } },
            { id: 'rain', name: 'Storm Arena', icon: '🌧️', effects: { visibility: 0.8, particles: 8000 } },
            { id: 'storm', name: 'Thunder Dome', icon: '⛈️', effects: { visibility: 0.7, particles: 12000 } },
            { id: 'snow', name: 'Winter Tournament', icon: '❄️', effects: { visibility: 0.9, particles: 6000 } },
            { id: 'fog', name: 'Mystic Arena', icon: '🌫️', effects: { visibility: 0.6, particles: 4000 } }
        ];
        this.currentWeather = null;
        this.particleSystem = null;
        this.particleCount = 0;
    }

    generateRandomWeather() {
        const randomIndex = Math.floor(Math.random() * this.weatherTypes.length);
        this.currentWeather = this.weatherTypes[randomIndex];
        game.currentWeather = this.currentWeather;
        
        this.animateWeatherTransition();
    }

    animateWeatherTransition() {
        const weatherIndicator = document.querySelector('.weather-indicator');
        if (weatherIndicator) {
            weatherIndicator.style.transform = 'scale(0.8)';
            weatherIndicator.style.opacity = '0.5';
            
            setTimeout(() => {
                weatherIndicator.style.transform = 'scale(1)';
                weatherIndicator.style.opacity = '1';
            }, 300);
        }
    }

    getCurrentWeather() {
        return this.currentWeather || this.weatherTypes[0];
    }

    setup3DEffects(scene) {
        this.scene = scene;
        this.createWeatherEffects();
    }

    createWeatherEffects() {
        if (!this.currentWeather || this.currentWeather.effects.particles === 0) return;
        
        const particleCount = Math.min(this.currentWeather.effects.particles, 5000);
        this.particleCount = particleCount;
        
        // Simple particle system
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 40;     // x
            positions[i + 1] = Math.random() * 20 + 10;    // y
            positions[i + 2] = (Math.random() - 0.5) * 40; // z
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.getWeatherColor(),
            size: this.getParticleSize(),
            transparent: true,
            opacity: 0.6
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        if (this.scene) this.scene.add(this.particleSystem);
    }

    getWeatherColor() {
        const colors = {
            rain: 0x87CEEB,
            storm: 0x4682B4,
            snow: 0xFFFFFF,
            fog: 0xC0C0C0
        };
        return colors[this.currentWeather.id] || 0xFFFFFF;
    }

    getParticleSize() {
        const sizes = {
            rain: 0.1,
            storm: 0.15,
            snow: 0.2,
            fog: 0.3
        };
        return sizes[this.currentWeather.id] || 0.1;
    }

    applyWeatherEffects() {
        if (!this.currentWeather) return;
        
        const gameWeatherIcon = document.getElementById('game-weather-icon');
        const gameWeatherName = document.getElementById('game-weather-name');
        
        if (gameWeatherIcon) gameWeatherIcon.textContent = this.currentWeather.icon;
        if (gameWeatherName) gameWeatherName.textContent = this.currentWeather.name;
        
        if (this.scene) {
            this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100 / this.currentWeather.effects.visibility);
        }
    }

    update() {
        if (!this.particleSystem) return;
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.1; // Make particles fall
            
            if (positions[i] < 0) {
                positions[i] = 20; // Reset to top
            }
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    getParticleCount() {
        return this.particleCount;
    }
}

// Tournament Bracket System
class TournamentBracketSystem {
    constructor() {
        this.currentRound = 1;
        this.totalRounds = 3;
        this.opponents = ['Yukito', 'Yuka', 'Chao', 'Chaoli'];
        this.currentOpponentIndex = 0;
    }

    initialize(difficulty) {
        this.currentRound = 1;
        this.currentOpponentIndex = 0;
        this.updateBracketDisplay();
        return {
            round: this.currentRound,
            opponent: this.opponents[this.currentOpponentIndex],
            difficulty: difficulty
        };
    }

    setupBracket() {
        this.updateBracketDisplay();
        this.updateProgressBar();
    }

    updateBracketDisplay() {
        const currentRoundDisplay = document.querySelector('.current-round');
        if (currentRoundDisplay) {
            currentRoundDisplay.textContent = `Round ${this.currentRound} of ${this.totalRounds}`;
        }
        
        if (this.currentOpponentIndex < this.opponents.length) {
            const opponentName = this.opponents[this.currentOpponentIndex];
            const opponentNameDisplay = document.getElementById('opponent-1-name');
            if (opponentNameDisplay) {
                opponentNameDisplay.textContent = opponentName;
            }
        }
    }

    updateProgressBar() {
        const progress = ((this.currentRound - 1) / this.totalRounds) * 100;
        const progressBar = document.getElementById('tournament-progress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    advanceRound() {
        this.currentOpponentIndex++;
        
        if (this.currentOpponentIndex >= this.opponents.length) {
            return false; // Tournament complete
        }
        
        if (this.currentOpponentIndex % 2 === 0) {
            this.currentRound++;
        }
        
        this.updateBracketDisplay();
        this.updateProgressBar();
        return true;
    }

    getCurrentOpponent() {
        return this.opponents[this.currentOpponentIndex] || 'Champion AI';
    }
}

// Cinematic Camera System
class CinematicCamera {
    constructor() {
        this.camera = null;
        this.originalPosition = new THREE.Vector3();
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.isShaking = false;
    }

    initialize(camera) {
        this.camera = camera;
        this.originalPosition.copy(camera.position);
    }

    addScreenShake(intensity = 0.1, duration = 300) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.isShaking = true;
        
        setTimeout(() => {
            this.isShaking = false;
            this.resetCameraPosition();
        }, duration);
    }

    update() {
        if (this.isShaking && this.camera) {
            const shake = new THREE.Vector3(
                (Math.random() - 0.5) * this.shakeIntensity,
                (Math.random() - 0.5) * this.shakeIntensity,
                (Math.random() - 0.5) * this.shakeIntensity
            );
            
            this.camera.position.copy(this.originalPosition).add(shake);
        }
    }

    resetCameraPosition() {
        if (this.camera) {
            this.camera.position.copy(this.originalPosition);
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = performance.now();
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    getFPS() {
        return this.fps;
    }
}

// Additional Combat Systems
class ComboSystem {
    constructor() {
        this.combos = [];
        this.comboWindow = 1000;
    }
}

class ImpactFeedbackSystem {
    constructor() {
        this.feedbackQueue = [];
    }
}

// Initialize the game
let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    game = new BlockenChampionshipPro();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.renderer && game.camera) {
        const container = document.getElementById('three-container');
        if (container) {
            game.camera.aspect = container.clientWidth / container.clientHeight;
            game.camera.updateProjectionMatrix();
            game.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
});