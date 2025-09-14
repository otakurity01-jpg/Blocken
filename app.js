// Blocken: 3D Fighting Tournament - Complete Championship Game Engine
class BlockenTournament {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.enemy = null;
        this.arena = null;
        this.weather = null;
        this.gameState = 'loading';
        this.selectedCharacter = null;
        this.selectedWeather = 'clear';
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.keys = {};
        this.touchControls = null;
        this.particles = [];
        this.destructibles = [];
        this.effects = [];
        this.combo = 0;
        this.maxCombo = 0;
        this.perfectGuards = 0;
        this.totalDamage = 0;
        this.battleStartTime = Date.now();
        this.slowMotion = false;
        this.cameraShake = 0;
        
        // Tournament Configuration
        this.tournamentConfig = {
            fighters: {
                yukito: {
                    name: "YUKITO",
                    title: "Boxing Champion", 
                    color: 0x4A90E2,
                    chargeColor: 0xFFD700,
                    specialty: "punches",
                    superMove: "Championship Knockout Combo",
                    record: "15-2",
                    titles: 3
                },
                yuka: {
                    name: "YUKA",
                    title: "Boxing Contender",
                    color: 0xE24A90, 
                    chargeColor: 0xFF69B4,
                    specialty: "punches",
                    superMove: "Rose Petal Punch Tournament",
                    record: "12-3",
                    titles: 2
                },
                chao: {
                    name: "CHAO",
                    title: "Martial Arts Master",
                    color: 0x4AE290,
                    chargeColor: 0x32CD32,
                    specialty: "kicks", 
                    superMove: "Dragon Hurricane Tournament",
                    record: "18-1",
                    titles: 4
                },
                chaoli: {
                    name: "CHAOLI",
                    title: "Martial Arts Champion",
                    color: 0x9A4AE2,
                    chargeColor: 0xDA70D6,
                    specialty: "kicks",
                    superMove: "Violet Phoenix Tournament Storm",
                    record: "16-2",
                    titles: 3
                }
            },
            weather: {
                clear: { name: "Championship Clear", effects: { visibility: 1.0, movement: 1.0, particles: 0 } },
                rain: { name: "Storm Championship", effects: { visibility: 0.8, movement: 0.9, particles: 8000, slippery: true } },
                storm: { name: "Thunder Tournament", effects: { visibility: 0.7, movement: 0.85, particles: 12000, lightning: true, cameraShake: true } },
                snow: { name: "Winter Championship", effects: { visibility: 0.9, movement: 0.95, particles: 6000, slippery: true } }
            }
        };
        
        this.init();
    }

    async init() {
        this.updatePlatformIndicator();
        this.setupEventListeners();
        await this.loadTournament();
    }

    updatePlatformIndicator() {
        const platformStatus = document.getElementById('platform-status');
        const performanceIndicator = document.getElementById('performance-indicator');
        
        if (this.isMobile) {
            platformStatus.textContent = '📱 Mobile Championship';
            performanceIndicator.textContent = 'Tournament Optimized';
        } else {
            platformStatus.textContent = '🎮 Desktop Championship';
            performanceIndicator.textContent = 'Championship Quality';
        }
    }

    async loadTournament() {
        const loadingScreen = document.getElementById('championship-loading-screen');
        const progressBar = document.getElementById('championship-loading-progress');
        const loadingText = document.getElementById('championship-loading-text');
        
        const loadingSteps = [
            { text: "Initializing championship tournament systems...", progress: 20 },
            { text: "Loading 3D championship fighters...", progress: 40 },
            { text: "Setting up tournament arena physics...", progress: 60 },
            { text: "Preparing championship weather system...", progress: 80 },
            { text: "Finalizing tournament experience...", progress: 100 }
        ];

        for (let i = 0; i < loadingSteps.length; i++) {
            const step = loadingSteps[i];
            loadingText.textContent = step.text;
            progressBar.style.width = `${step.progress}%`;
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            this.gameState = 'character-select';
        }, 500);
    }

    setupEventListeners() {
        // Character Selection
        document.querySelectorAll('.fighter-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.fighter-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedCharacter = card.dataset.character;
            });
        });

        // Weather Selection
        document.querySelectorAll('.weather-championship-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.weather-championship-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedWeather = card.dataset.weather;
            });
        });

        // Tournament Start
        document.getElementById('start-tournament').addEventListener('click', () => {
            if (this.selectedCharacter) {
                this.startChampionshipTournament();
            }
        });

        // Victory/Game Over Buttons
        document.getElementById('championship-victory-restart').addEventListener('click', () => this.restartTournament());
        document.getElementById('championship-victory-menu').addEventListener('click', () => this.returnToCharacterSelect());
        document.getElementById('championship-game-over-restart').addEventListener('click', () => this.restartTournament());
        document.getElementById('championship-game-over-menu').addEventListener('click', () => this.returnToCharacterSelect());

        // Keyboard Controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleChampionshipInput(e.key.toLowerCase(), true);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.handleChampionshipInput(e.key.toLowerCase(), false);
        });

        // Mobile Controls Setup
        if (this.isMobile) {
            this.setupMobileChampionshipControls();
        }
    }

    setupMobileChampionshipControls() {
        const mobileControls = document.getElementById('championship-mobile-controls');
        const joystick = document.getElementById('championship-virtual-joystick');
        const joystickKnob = document.getElementById('championship-joystick-knob');
        
        this.touchControls = {
            joystick: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 },
            buttons: {}
        };

        // Virtual Joystick
        joystick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = joystick.getBoundingClientRect();
            this.touchControls.joystick.active = true;
            this.touchControls.joystick.startX = touch.clientX - rect.left - rect.width / 2;
            this.touchControls.joystick.startY = touch.clientY - rect.top - rect.height / 2;
        });

        joystick.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!this.touchControls.joystick.active) return;
            
            const touch = e.touches[0];
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maxDistance = centerX * 0.8;
            
            let deltaX = touch.clientX - rect.left - centerX;
            let deltaY = touch.clientY - rect.top - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > maxDistance) {
                deltaX = (deltaX / distance) * maxDistance;
                deltaY = (deltaY / distance) * maxDistance;
            }
            
            joystickKnob.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            
            this.touchControls.joystick.currentX = deltaX / maxDistance;
            this.touchControls.joystick.currentY = deltaY / maxDistance;
        });

        joystick.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchControls.joystick.active = false;
            this.touchControls.joystick.currentX = 0;
            this.touchControls.joystick.currentY = 0;
            joystickKnob.style.transform = 'translate(-50%, -50%)';
        });

        // Action Buttons
        const buttons = ['championship-light-btn', 'championship-heavy-btn', 'championship-combo-btn', 
                        'championship-super-btn', 'championship-guard-btn', 'championship-jump-btn'];
        
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            const key = button.dataset.key;
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.classList.add('active');
                this.touchControls.buttons[key] = true;
                this.handleChampionshipInput(key, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.classList.remove('active');
                this.touchControls.buttons[key] = false;
                this.handleChampionshipInput(key, false);
            });
        });
    }

    handleChampionshipInput(key, pressed) {
        if (this.gameState !== 'tournament-battle' || !this.player) return;

        if (pressed) {
            switch(key) {
                case 'j':
                    this.player.lightAttack();
                    break;
                case 'k':
                    this.player.heavyAttack();
                    break;
                case 'l':
                    this.player.comboAttack();
                    break;
                case 'u':
                    this.player.superMove();
                    break;
                case 'g':
                    this.player.guard();
                    break;
                case ' ':
                    this.player.jump();
                    break;
            }
        }
    }

    startChampionshipTournament() {
        document.getElementById('character-select').classList.add('hidden');
        document.getElementById('tournament-arena').classList.remove('hidden');
        
        this.gameState = 'tournament-battle';
        this.initializeChampionship3D();
        this.createChampionshipFighters();
        this.setupChampionshipWeather();
        this.startChampionshipBattle();
        
        if (this.isMobile) {
            document.getElementById('championship-mobile-controls').classList.add('active');
        }
    }

    initializeChampionship3D() {
        const container = document.getElementById('championship-three-container');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 100);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.camera.position.set(0, 8, 12);
        this.camera.lookAt(0, 2, 0);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: !this.isMobile });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x1a1a2e);
        container.appendChild(this.renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = this.isMobile ? 1024 : 2048;
        directionalLight.shadow.mapSize.height = this.isMobile ? 1024 : 2048;
        this.scene.add(directionalLight);
        
        // Championship Arena
        this.createChampionshipArena();
        
        // Start render loop
        this.animate();
    }

    createChampionshipArena() {
        // Championship Platform
        const platformGeometry = new THREE.BoxGeometry(20, 0.5, 20);
        const platformMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2a2a4a,
            transparent: true,
            opacity: 0.9
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.25;
        platform.receiveShadow = true;
        this.scene.add(platform);
        
        // Championship Ring Boundary
        const ringGeometry = new THREE.RingGeometry(9.5, 10, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFD700,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.01;
        this.scene.add(ring);
        
        // Destructible Elements
        this.createDestructibleElements();
    }

    createDestructibleElements() {
        const positions = [
            { x: 8, z: 8 }, { x: -8, z: 8 }, { x: 8, z: -8 }, { x: -8, z: -8 }
        ];
        
        positions.forEach(pos => {
            const pillarGeometry = new THREE.BoxGeometry(1, 4, 1);
            const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(pos.x, 2, pos.z);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);
            
            this.destructibles.push({
                mesh: pillar,
                health: 100,
                maxHealth: 100
            });
        });
    }

    createChampionshipFighters() {
        const playerConfig = this.tournamentConfig.fighters[this.selectedCharacter];
        const enemyCharacters = Object.keys(this.tournamentConfig.fighters).filter(c => c !== this.selectedCharacter);
        const enemyConfig = this.tournamentConfig.fighters[enemyCharacters[Math.floor(Math.random() * enemyCharacters.length)]];
        
        this.player = new ChampionshipFighter(playerConfig, { x: -3, y: 1, z: 0 }, 'player', this);
        this.enemy = new ChampionshipFighter(enemyConfig, { x: 3, y: 1, z: 0 }, 'enemy', this);
        
        this.scene.add(this.player.mesh);
        this.scene.add(this.enemy.mesh);
        
        // Update UI
        document.getElementById('championship-player-name').textContent = playerConfig.name;
        document.getElementById('championship-enemy-name').textContent = `${enemyConfig.name} (CPU)`;
    }

    setupChampionshipWeather() {
        const weatherConfig = this.tournamentConfig.weather[this.selectedWeather];
        
        // Update UI
        const weatherIcon = document.getElementById('tournament-weather-icon');
        const weatherName = document.getElementById('tournament-weather-name');
        
        const icons = { clear: '🌤️', rain: '🌧️', storm: '⛈️', snow: '❄️' };
        weatherIcon.textContent = icons[this.selectedWeather];
        weatherName.textContent = weatherConfig.name;
        
        // Create weather particles
        if (weatherConfig.effects.particles > 0) {
            this.createWeatherParticles(weatherConfig.effects);
        }
        
        // Apply weather effects
        if (weatherConfig.effects.visibility < 1) {
            this.scene.fog.far = 50 * weatherConfig.effects.visibility;
        }
    }

    createWeatherParticles(effects) {
        const particleCount = this.isMobile ? effects.particles / 2 : effects.particles;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = Math.random() * 20 + 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 1] = -Math.random() * 0.2 - 0.1;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.selectedWeather === 'snow' ? 0xffffff : 0x4A90E2,
            size: this.selectedWeather === 'snow' ? 0.1 : 0.05,
            transparent: true,
            opacity: 0.6
        });
        
        this.weather = new THREE.Points(geometry, material);
        this.weather.userData = { velocities };
        this.scene.add(this.weather);
    }

    startChampionshipBattle() {
        this.battleStartTime = Date.now();
        this.combo = 0;
        this.maxCombo = 0;
        this.perfectGuards = 0;
        this.totalDamage = 0;
        
        // Simple AI for enemy
        this.setupEnemyAI();
    }

    setupEnemyAI() {
        setInterval(() => {
            if (this.gameState !== 'tournament-battle' || !this.enemy || this.enemy.isStunned) return;
            
            const distance = this.player.mesh.position.distanceTo(this.enemy.mesh.position);
            const action = Math.random();
            
            if (distance < 3) {
                if (action < 0.3) {
                    this.enemy.lightAttack();
                } else if (action < 0.5) {
                    this.enemy.heavyAttack();
                } else if (action < 0.6) {
                    this.enemy.guard();
                } else {
                    this.enemy.moveAway();
                }
            } else if (distance < 6) {
                if (action < 0.4) {
                    this.enemy.moveToward(this.player.mesh.position);
                } else if (action < 0.6) {
                    this.enemy.comboAttack();
                } else if (action < 0.8 && this.enemy.superMeter >= 100) {
                    this.enemy.superMove();
                }
            }
        }, 1000);
    }

    updateChampionshipUI() {
        if (!this.player || !this.enemy) return;
        
        // Health bars
        const playerHealthFill = document.getElementById('championship-player-health');
        const enemyHealthFill = document.getElementById('championship-enemy-health');
        const playerHealthText = playerHealthFill.parentElement.querySelector('.championship-health-text');
        const enemyHealthText = enemyHealthFill.parentElement.querySelector('.championship-health-text');
        
        const playerHealthPercent = (this.player.health / this.player.maxHealth) * 100;
        const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
        
        playerHealthFill.style.width = `${playerHealthPercent}%`;
        enemyHealthFill.style.width = `${enemyHealthPercent}%`;
        playerHealthText.textContent = `${Math.ceil(playerHealthPercent)}%`;
        enemyHealthText.textContent = `${Math.ceil(enemyHealthPercent)}%`;
        
        if (playerHealthPercent < 25) playerHealthFill.classList.add('low');
        if (enemyHealthPercent < 25) enemyHealthFill.classList.add('low');
        
        // Super meters
        const playerSuperFill = document.getElementById('championship-player-super');
        const enemySuperFill = document.getElementById('championship-enemy-super');
        playerSuperFill.style.width = `${(this.player.superMeter / 100) * 100}%`;
        enemySuperFill.style.width = `${(this.enemy.superMeter / 100) * 100}%`;
        
        // Charge meters
        const playerChargeFill = document.getElementById('championship-player-charge');
        const enemyChargeFill = document.getElementById('championship-enemy-charge');
        playerChargeFill.style.width = `${(this.player.charge / 180) * 100}%`;
        enemyChargeFill.style.width = `${(this.enemy.charge / 180) * 100}%`;
        
        // Combo counter
        document.getElementById('championship-combo-counter').textContent = `${this.combo} COMBO`;
        
        // Style rating
        const stars = Math.min(5, Math.floor(this.combo / 3) + 1);
        document.getElementById('championship-style-rating').textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    updateMovement() {
        if (!this.player || this.gameState !== 'tournament-battle') return;
        
        const moveSpeed = 0.1 * (this.tournamentConfig.weather[this.selectedWeather].effects.movement || 1);
        const moved = { x: 0, z: 0 };
        
        // Desktop controls
        if (this.keys['w'] || this.keys['arrowup']) moved.z -= moveSpeed;
        if (this.keys['s'] || this.keys['arrowdown']) moved.z += moveSpeed;
        if (this.keys['a'] || this.keys['arrowleft']) moved.x -= moveSpeed;
        if (this.keys['d'] || this.keys['arrowright']) moved.x += moveSpeed;
        
        // Mobile joystick
        if (this.isMobile && this.touchControls?.joystick.active) {
            moved.x += this.touchControls.joystick.currentX * moveSpeed;
            moved.z += this.touchControls.joystick.currentY * moveSpeed;
        }
        
        // Apply movement with bounds checking
        const newX = this.player.mesh.position.x + moved.x;
        const newZ = this.player.mesh.position.z + moved.z;
        
        if (Math.abs(newX) < 9) this.player.mesh.position.x = newX;
        if (Math.abs(newZ) < 9) this.player.mesh.position.z = newZ;
        
        // Face opponent
        if (moved.x !== 0 || moved.z !== 0) {
            this.player.mesh.lookAt(this.enemy.mesh.position);
        }
    }

    updateWeatherEffects() {
        if (!this.weather) return;
        
        const positions = this.weather.geometry.attributes.position.array;
        const velocities = this.weather.userData.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            if (positions[i + 1] < 0) {
                positions[i + 1] = 20;
                positions[i] = (Math.random() - 0.5) * 40;
                positions[i + 2] = (Math.random() - 0.5) * 40;
            }
        }
        
        this.weather.geometry.attributes.position.needsUpdate = true;
    }

    updateCameraEffects() {
        // Camera shake from storm or impacts
        if (this.cameraShake > 0) {
            this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
            this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
            this.cameraShake *= 0.9;
        }
        
        // Dynamic camera following
        const playerPos = this.player?.mesh.position;
        const enemyPos = this.enemy?.mesh.position;
        
        if (playerPos && enemyPos) {
            const centerX = (playerPos.x + enemyPos.x) / 2;
            const centerZ = (playerPos.z + enemyPos.z) / 2;
            const distance = playerPos.distanceTo(enemyPos);
            
            this.camera.position.x = centerX + Math.sin(Date.now() * 0.001) * 2;
            this.camera.position.z = centerZ + 12 + distance * 0.5;
            this.camera.lookAt(centerX, 2, centerZ);
        }
    }

    checkVictoryConditions() {
        if (!this.player || !this.enemy) return;
        
        if (this.player.health <= 0) {
            this.endChampionshipBattle('defeat');
        } else if (this.enemy.health <= 0) {
            this.endChampionshipBattle('victory');
        }
    }

    endChampionshipBattle(result) {
        this.gameState = 'battle-end';
        
        const battleTime = Math.floor((Date.now() - this.battleStartTime) / 1000);
        
        if (result === 'victory') {
            this.showChampionshipVictory(battleTime);
        } else {
            this.showChampionshipDefeat(battleTime);
        }
    }

    showChampionshipVictory(battleTime) {
        const victoryScreen = document.getElementById('championship-victory-screen');
        const characterDisplay = document.getElementById('championship-victory-character-display');
        const victoryMessage = document.getElementById('championship-victory-message');
        
        // Update victory stats
        document.getElementById('championship-total-damage').textContent = Math.floor(this.totalDamage);
        document.getElementById('championship-max-combo').textContent = this.maxCombo;
        document.getElementById('championship-perfect-guards').textContent = this.perfectGuards;
        document.getElementById('championship-battle-time').textContent = `${battleTime}s`;
        
        const fighter = this.tournamentConfig.fighters[this.selectedCharacter];
        characterDisplay.textContent = `${fighter.name} - ${fighter.title}`;
        
        const messages = [
            "🏆 NEW TOURNAMENT CHAMPION! 🏆",
            "🥇 CHAMPIONSHIP VICTORY! 🥇", 
            "👑 ULTIMATE BLOCK FIGHTER! 👑",
            "⚡ TOURNAMENT LEGEND! ⚡"
        ];
        victoryMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        victoryScreen.classList.remove('hidden');
    }

    showChampionshipDefeat(battleTime) {
        const gameOverScreen = document.getElementById('championship-game-over-screen');
        const gameOverMessage = document.getElementById('championship-game-over-message');
        const finalStats = document.getElementById('championship-final-stats');
        
        gameOverMessage.textContent = "The championship continues... Train harder and return stronger!";
        
        finalStats.innerHTML = `
            <div class="championship-stat-row">
                <span class="championship-stat-label">Damage Dealt:</span>
                <span class="championship-stat-value">${Math.floor(this.totalDamage)}</span>
            </div>
            <div class="championship-stat-row">
                <span class="championship-stat-label">Max Combo:</span>
                <span class="championship-stat-value">${this.maxCombo}</span>
            </div>
            <div class="championship-stat-row">
                <span class="championship-stat-label">Battle Duration:</span>
                <span class="championship-stat-value">${battleTime}s</span>
            </div>
        `;
        
        gameOverScreen.classList.remove('hidden');
    }

    restartTournament() {
        document.getElementById('championship-victory-screen').classList.add('hidden');
        document.getElementById('championship-game-over-screen').classList.add('hidden');
        this.startChampionshipTournament();
    }

    returnToCharacterSelect() {
        document.getElementById('championship-victory-screen').classList.add('hidden');
        document.getElementById('championship-game-over-screen').classList.add('hidden');
        document.getElementById('tournament-arena').classList.add('hidden');
        document.getElementById('character-select').classList.remove('hidden');
        document.getElementById('championship-mobile-controls').classList.remove('active');
        
        this.gameState = 'character-select';
        
        // Clean up 3D scene
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById('championship-three-container');
            container.innerHTML = '';
        }
    }

    updatePerformanceInfo() {
        if (!this.renderer) return;
        
        const info = this.renderer.info;
        const fps = Math.floor(1000 / (performance.now() - this.lastTime || 16));
        
        document.getElementById('championship-fps-counter').textContent = `${fps} FPS`;
        document.getElementById('championship-particles-counter').textContent = `${this.particles.length} Particles`;
        document.getElementById('championship-device-info').textContent = this.isMobile ? 'Mobile Tournament' : 'Desktop Championship';
        
        this.lastTime = performance.now();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.gameState === 'tournament-battle') {
            this.updateMovement();
            this.updateChampionshipUI();
            this.updateWeatherEffects();
            this.updateCameraEffects();
            this.checkVictoryConditions();
            
            if (this.player) this.player.update();
            if (this.enemy) this.enemy.update();
        }
        
        this.updatePerformanceInfo();
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

class ChampionshipFighter {
    constructor(config, position, type, game) {
        this.name = config.name;
        this.color = config.color;
        this.chargeColor = config.chargeColor;
        this.specialty = config.specialty;
        this.superMove = config.superMove;
        this.type = type;
        this.game = game;
        
        this.health = 100;
        this.maxHealth = 100;
        this.superMeter = 0;
        this.charge = 0;
        this.maxCharge = 180; // 5 levels * 36 frames each
        
        this.isAttacking = false;
        this.isGuarding = false;
        this.isStunned = false;
        this.isAirborne = false;
        this.airActions = 0;
        this.maxAirActions = 3;
        
        this.velocity = { x: 0, y: 0, z: 0 };
        this.chargeStartTime = 0;
        this.lastAttackTime = 0;
        
        this.createMesh();
        this.mesh.position.set(position.x, position.y, position.z);
    }

    createMesh() {
        // Championship Fighter Model (Roblox-style blocks)
        const group = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const headMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.25;
        head.castShadow = true;
        group.add(head);
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        body.castShadow = true;
        group.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.4, 0.75, 0);
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.4, 0.75, 0);
        rightArm.castShadow = true;
        group.add(rightArm);
        
        // Championship Gloves/Boots
        if (this.specialty === 'punches') {
            const gloveGeometry = new THREE.SphereGeometry(0.6, 8, 6);
            const gloveMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
            
            const leftGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
            leftGlove.position.set(-1.4, -0.5, 0);
            group.add(leftGlove);
            
            const rightGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
            rightGlove.position.set(1.4, -0.5, 0);
            group.add(rightGlove);
        }
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: this.color });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.6, -1.5, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.6, -1.5, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);
        
        if (this.specialty === 'kicks') {
            const bootGeometry = new THREE.BoxGeometry(0.9, 0.6, 1.2);
            const bootMaterial = new THREE.MeshPhongMaterial({ color: 0x8A2BE2 });
            
            const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
            leftBoot.position.set(-0.6, -2.5, 0);
            group.add(leftBoot);
            
            const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
            rightBoot.position.set(0.6, -2.5, 0);
            group.add(rightBoot);
        }
        
        this.mesh = group;
        this.parts = { head, body, leftArm: leftArm, rightArm: rightArm, leftLeg, rightLeg };
    }

    lightAttack() {
        if (this.isAttacking || this.isStunned) return;
        
        this.isAttacking = true;
        this.animateAttack('light');
        
        setTimeout(() => {
            this.isAttacking = false;
            this.checkHit('light', 15);
        }, 200);
    }

    heavyAttack() {
        if (this.isAttacking || this.isStunned) return;
        
        this.isAttacking = true;
        this.animateAttack('heavy');
        
        setTimeout(() => {
            this.isAttacking = false;
            this.checkHit('heavy', 25);
        }, 400);
    }

    comboAttack() {
        if (this.isAttacking || this.isStunned) return;
        
        this.isAttacking = true;
        this.animateAttack('combo');
        
        // Multi-hit combo
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.checkHit('combo', 12);
                if (i === 2) this.isAttacking = false;
            }, 150 * (i + 1));
        }
    }

    superMove() {
        if (this.superMeter < 100 || this.isAttacking || this.isStunned) return;
        
        this.superMeter = 0;
        this.isAttacking = true;
        
        // Activate slow motion
        this.game.slowMotion = true;
        document.getElementById('tournament-slow-motion-indicator').classList.remove('hidden');
        
        this.animateSuper();
        
        setTimeout(() => {
            this.isAttacking = false;
            this.game.slowMotion = false;
            document.getElementById('tournament-slow-motion-indicator').classList.add('hidden');
            this.checkHit('super', 50);
        }, 1200);
    }

    guard() {
        this.isGuarding = true;
        this.parts.leftArm.position.x = -0.8;
        this.parts.rightArm.position.x = 0.8;
        
        setTimeout(() => {
            this.isGuarding = false;
            this.parts.leftArm.position.x = -1.4;
            this.parts.rightArm.position.x = 1.4;
        }, 300);
    }

    jump() {
        if (this.isAirborne && this.airActions >= this.maxAirActions) return;
        
        if (this.isAirborne) {
            this.airActions++;
        } else {
            this.isAirborne = true;
            this.airActions = 0;
        }
        
        this.velocity.y = 0.3;
    }

    checkHit(attackType, baseDamage) {
        const opponent = this.type === 'player' ? this.game.enemy : this.game.player;
        if (!opponent) return;
        
        const distance = this.mesh.position.distanceTo(opponent.mesh.position);
        if (distance > 3) return;
        
        let damage = baseDamage;
        
        // Apply charge multiplier
        const chargeLevel = Math.floor(this.charge / 36);
        damage *= (1 + chargeLevel * 0.4);
        
        // Check if opponent is guarding
        if (opponent.isGuarding) {
            const perfectGuardWindow = 8; // frames
            const guardTiming = Date.now() - opponent.guardStartTime;
            
            if (guardTiming <= perfectGuardWindow * 16.67) { // Perfect guard
                this.game.perfectGuards++;
                opponent.health += 5; // Health recovery
                opponent.superMeter += 15; // Meter gain
                damage = 0;
                
                // Show perfect guard indicator
                document.getElementById('tournament-perfect-guard-indicator').classList.add('active');
                setTimeout(() => {
                    document.getElementById('tournament-perfect-guard-indicator').classList.remove('active');
                }, 1000);
            } else {
                damage *= 0.3; // Normal guard damage reduction
            }
        }
        
        // Apply damage
        opponent.takeDamage(damage);
        
        // Add to combo
        if (this.type === 'player' && damage > 0) {
            this.game.combo++;
            this.game.maxCombo = Math.max(this.game.maxCombo, this.game.combo);
            this.game.totalDamage += damage;
        }
        
        // Camera shake on heavy hits
        if (damage > 20) {
            this.game.cameraShake = 0.2;
        }
        
        // Reset charge after attack
        this.charge = 0;
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        if (amount > 0) {
            this.isStunned = true;
            this.mesh.scale.set(1.1, 0.9, 1.1); // Hit reaction
            
            setTimeout(() => {
                this.isStunned = false;
                this.mesh.scale.set(1, 1, 1);
            }, 200);
        }
    }

    animateAttack(type) {
        const duration = type === 'super' ? 1200 : (type === 'heavy' ? 400 : 200);
        
        if (this.specialty === 'punches') {
            this.parts.rightArm.rotation.z = -Math.PI / 3;
            setTimeout(() => {
                this.parts.rightArm.rotation.z = 0;
            }, duration);
        } else {
            this.parts.rightLeg.rotation.x = Math.PI / 4;
            setTimeout(() => {
                this.parts.rightLeg.rotation.x = 0;
            }, duration);
        }
    }

    animateSuper() {
        // Epic super move animation with multiple phases
        const phases = [
            { time: 0, action: () => this.mesh.scale.set(1.2, 1.2, 1.2) },
            { time: 300, action: () => this.mesh.rotation.y = Math.PI * 2 },
            { time: 600, action: () => this.mesh.scale.set(1.5, 1.5, 1.5) },
            { time: 900, action: () => this.mesh.position.y += 2 },
            { time: 1200, action: () => {
                this.mesh.scale.set(1, 1, 1);
                this.mesh.rotation.y = 0;
                this.mesh.position.y -= 2;
            }}
        ];
        
        phases.forEach(phase => {
            setTimeout(phase.action, phase.time);
        });
    }

    moveToward(targetPosition) {
        const direction = new THREE.Vector3().subVectors(targetPosition, this.mesh.position).normalize();
        this.mesh.position.add(direction.multiplyScalar(0.05));
    }

    moveAway() {
        const direction = new THREE.Vector3().subVectors(this.mesh.position, this.game.player.mesh.position).normalize();
        this.mesh.position.add(direction.multiplyScalar(0.08));
    }

    update() {
        // Handle charging
        if (this.game.keys['j'] || this.game.keys['k'] || this.game.keys['l']) {
            this.charge = Math.min(this.maxCharge, this.charge + 1);
            
            // Visual charge effect
            const chargeLevel = Math.floor(this.charge / 36);
            if (chargeLevel > 0) {
                this.mesh.children.forEach(part => {
                    part.material.emissive.setHex(this.chargeColor);
                    part.material.emissiveIntensity = chargeLevel * 0.2;
                });
            }
        } else {
            // Reset charge glow
            this.mesh.children.forEach(part => {
                part.material.emissive.setHex(0x000000);
                part.material.emissiveIntensity = 0;
            });
        }
        
        // Handle gravity and landing
        if (this.isAirborne) {
            this.velocity.y -= 0.02; // Gravity
            this.mesh.position.y += this.velocity.y;
            
            if (this.mesh.position.y <= 1) {
                this.mesh.position.y = 1;
                this.isAirborne = false;
                this.velocity.y = 0;
                this.airActions = 0;
            }
        }
        
        // Build super meter gradually
        if (this.superMeter < 100) {
            this.superMeter += 0.1;
        }
        
        // Keep within arena bounds
        this.mesh.position.x = Math.max(-9, Math.min(9, this.mesh.position.x));
        this.mesh.position.z = Math.max(-9, Math.min(9, this.mesh.position.z));
    }
}

// Initialize the championship tournament when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlockenTournament();
});