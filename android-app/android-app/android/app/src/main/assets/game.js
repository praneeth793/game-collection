// =====================================================
// HYPERARCADE HUB - Complete Game Application
// =====================================================

// Global State
const state = {
    currentSection: 'home',
    paused: false,
    gameActive: false,
    currentGame: null,
    scores: {
        racing: 0,
        snake: 0,
        pong: 0,
        tetris: 0,
        neonrunner: 0,
        duckhuntmario: 0,
        spiderman: 0,
        horror: 0,
        duckhunt: 0,
        undertale: 0
    },
    highScores: {
        racing: parseInt(localStorage.getItem('racingHighScore') || '0'),
        snake: parseInt(localStorage.getItem('snakeHighScore') || '0'),
        pong: parseInt(localStorage.getItem('pongHighScore') || '0'),
        tetris: parseInt(localStorage.getItem('tetrisHighScore') || '0'),
        neonrunner: parseInt(localStorage.getItem('neonrunnerHighScore') || '0'),
        duckhuntmario: parseInt(localStorage.getItem('duckhuntmarioHighScore') || '0'),
        spiderman: parseInt(localStorage.getItem('spidermanHighScore') || '0'),
        horror: parseInt(localStorage.getItem('horrorHighScore') || '0'),
        duckhunt: parseInt(localStorage.getItem('duckhuntHighScore') || '0'),
        undertale: parseInt(localStorage.getItem('undertaleHighScore') || '0')
    },
    playCounts: {
        racing: parseInt(localStorage.getItem('racingPlays') || '0'),
        snake: parseInt(localStorage.getItem('snakePlays') || '0'),
        tictactoe: parseInt(localStorage.getItem('tictactoePlays') || '0'),
        pong: parseInt(localStorage.getItem('pongPlays') || '0'),
        tetris: parseInt(localStorage.getItem('tetrisPlays') || '0'),
        neonrunner: parseInt(localStorage.getItem('neonrunnerPlays') || '0'),
        duckhuntmario: parseInt(localStorage.getItem('duckhuntmarioPlays') || '0'),
        spiderman: parseInt(localStorage.getItem('spidermanPlays') || '0'),
        horror: parseInt(localStorage.getItem('horrorPlays') || '0'),
        duckhunt: parseInt(localStorage.getItem('duckhuntPlays') || '0'),
        undertale: parseInt(localStorage.getItem('undertalePlays') || '0')
    },
    tictactoe: {
        wins: parseInt(localStorage.getItem('tttWins') || '0'),
        draws: parseInt(localStorage.getItem('tttDraws') || '0')
    }
};

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const app = document.getElementById('app');
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('pause-modal');
const gameoverModal = document.getElementById('gameover-modal');

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initNavigation();
    initKeyboardShortcuts();
    updateStatsDisplay();
});

function initApp() {
    // Hide loading screen immediately
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (app) app.style.display = 'block';
    createParticles();
    updateStatsDisplay();
}

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: var(--accent-primary);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// =====================================================
// NAVIGATION
// =====================================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            navigateTo(section);
        });
    });
}

function navigateTo(section) {
    if (state.currentSection === section) return;

    // Stop current game if active
    if (state.gameActive) {
        stopCurrentGame();
    }

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');

    state.currentSection = section;

    // Start specific game
    setTimeout(() => {
        switch (section) {
            case 'racing':
                startRacingGame();
                break;
            case 'snake':
                startSnakeGame();
                break;
            case 'tictactoe':
                initTicTacToe();
                break;
            case 'pong':
                startPongGame();
                break;
            case 'tetris':
                startTetrisGame();
                break;
            case 'neonrunner':
                startNeonRunnerGame();
                break;
            case 'gtacity':
                startGTACityGame();
                break;
            case 'duckhuntmario':
                startDuckHuntMarioGame();
                break;
            case 'spiderman':
                startSpiderManGame();
                break;
            case 'horror':
                startHorrorGame();
                break;
            case 'duckhunt':
                startDuckHuntGame();
                break;
            case 'undertale':
                startUndertaleGame();
                break;
            case 'island':
                window.open('floating-island-survival.html', '_blank');
                break;
        }
    }, 100);
}

function scrollToGames() {
    document.querySelector('.games-showcase').scrollIntoView({ behavior: 'smooth' });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.gameActive) {
            if (state.paused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }

        // Quick navigation
        if (!state.gameActive) {
            switch (e.key) {
                case '1': navigateTo('racing'); break;
                case '2': navigateTo('snake'); break;
                case '3': navigateTo('tictactoe'); break;
                case '4': navigateTo('pong'); break;
                case '5': navigateTo('tetris'); break;
                case 'h': navigateTo('home'); break;
            }
        }
    });
}

// =====================================================
// GAME MANAGEMENT
// =====================================================

function pauseGame() {
    state.paused = true;
    modal.classList.remove('hidden');
}

function resumeGame() {
    state.paused = false;
    modal.classList.add('hidden');
    if (state.currentGame && state.currentGame.resume) {
        state.currentGame.resume();
    }
}

function quitGame() {
    modal.classList.add('hidden');
    gameoverModal.classList.add('hidden');
    stopCurrentGame();
    navigateTo('home');
}

function restartGame() {
    gameoverModal.classList.add('hidden');
    state.gameActive = false;
    switch (state.currentSection) {
        case 'racing': startRacingGame(); break;
        case 'snake': startSnakeGame(); break;
        case 'pong': startPongGame(); break;
        case 'tetris': startTetrisGame(); break;
        case 'neonrunner': startNeonRunnerGame(); break;
        case 'gtacity': startGTACityGame(); break;
        case 'duckhuntmario': startDuckHuntMarioGame(); break;
        case 'spiderman': startSpiderManGame(); break;
        case 'horror': startHorrorGame(); break;
        case 'duckhunt': startDuckHuntGame(); break;
        case 'undertale': startUndertaleGame(); break;
        case 'island': window.open('floating-island-survival.html', '_blank'); break;
        case 'arena': window.open('neon-arena.html', '_blank'); break;
    }
}

function stopCurrentGame() {
    if (state.currentGame) {
        if (state.currentGame.stop) {
            state.currentGame.stop();
        }
        state.gameActive = false;
        state.currentGame = null;
    }
}

function showGameOver(score, title = 'GAME OVER') {
    state.gameActive = false;
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('final-score').textContent = `Score: ${score}`;

    // Check for high score
    const gameKey = state.currentSection;
    const isNewHighScore = score > state.highScores[gameKey];

    document.getElementById('new-highscore').classList.toggle('hidden', !isNewHighScore);

    if (isNewHighScore) {
        state.highScores[gameKey] = score;
        localStorage.setItem(`${gameKey}HighScore`, score);
    }

    gameoverModal.classList.remove('hidden');
}

function updateStatsDisplay() {
    // Update high scores display
    document.getElementById('best-racing').textContent = state.highScores.racing;
    document.getElementById('best-snake').textContent = state.highScores.snake;
    document.getElementById('best-pong').textContent = state.highScores.pong;
    document.getElementById('best-tetris').textContent = state.highScores.tetris;
    document.getElementById('best-neonrunner').textContent = state.highScores.neonrunner;
    document.getElementById('best-duckhuntmario').textContent = state.highScores.duckhuntmario;
    document.getElementById('best-spiderman').textContent = state.highScores.spiderman;

    // Update play counts
    document.getElementById('plays-racing').textContent = state.playCounts.racing;
    document.getElementById('plays-snake').textContent = state.playCounts.snake;
    document.getElementById('plays-tictactoe').textContent = state.playCounts.tictactoe;
    document.getElementById('plays-pong').textContent = state.playCounts.pong;
    document.getElementById('plays-tetris').textContent = state.playCounts.tetris;
    document.getElementById('plays-neonrunner').textContent = state.playCounts.neonrunner;
    document.getElementById('plays-duckhuntmario').textContent = state.playCounts.duckhuntmario;
    document.getElementById('plays-spiderman').textContent = state.playCounts.spiderman;

    // Update Tic-Tac-Toe stats
    document.getElementById('ttt-wins').textContent = state.tictactoe.wins;
    document.getElementById('ttt-draws').textContent = state.tictactoe.draws;

    // Update overall high score
    const maxScore = Math.max(
        state.highScores.racing,
        state.highScores.snake,
        state.highScores.pong,
        state.highScores.tetris,
        state.highScores.neonrunner,
        state.highScores.duckhuntmario,
        state.highScores.spiderman
    );
    document.getElementById('high-score').textContent = maxScore;
}

function incrementPlayCount(game) {
    state.playCounts[game]++;
    localStorage.setItem(`${game}Plays`, state.playCounts[game]);
}

// =====================================================
// 3D RACING GAME - Three.js (COMPLETELY REWRITTEN)
// =====================================================

let racingGame = null;

// Keyboard state tracking
const keys = {};

function startRacingGame() {
    incrementPlayCount('racing');
    state.scores.racing = 0;
    state.gameActive = true;
    state.paused = false;

    // Reset keys
    keys['w'] = false;
    keys['a'] = false;
    keys['s'] = false;
    keys['d'] = false;
    keys[' '] = false;

    const container = document.getElementById('racing-game');
    container.innerHTML = '';

    racingGame = new RacingGame(container);
    state.currentGame = racingGame;
}

class RacingGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.startTime = Date.now();
        this.running = true;
        this.paused = false;

        this.init();
        this.setupKeyboardListeners();
        this.animate();
    }

    init() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 450;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0F172A);
        this.scene.fog = new THREE.Fog(0x0F172A, 30, 150);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 4, 8);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        // Create game elements
        this.createGround();
        this.createSimpleCar();
        this.createRoad();
        this.createObstacles();
        this.createCoins();

        // Game state
        this.carX = 0;
        this.carSpeed = 0;
        this.maxSpeed = 0.8;
        this.acceleration = 0.02;
        this.friction = 0.96;
        this.steering = 0;
        this.maxSteering = 0.3;
        this.roadSpeed = 0.5;

        // Road elements for animation
        this.roadMarkings = [];
        this.initRoadMarkings();

        // Window resize
        window.addEventListener('resize', () => this.onResize());
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(200, 200, 20, 20);
        const material = new THREE.MeshBasicMaterial({
            color: 0x1E293B,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.5;
        this.scene.add(this.ground);
    }

    createSimpleCar() {
        this.car = new THREE.Group();

        // Main body
        const bodyGeo = new THREE.BoxGeometry(1.8, 0.6, 3.5);
        const bodyMat = new THREE.MeshPhongMaterial({
            color: 0x3B82F6,
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        this.car.add(body);

        // Top cabin
        const topGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
        const topMat = new THREE.MeshPhongMaterial({
            color: 0x1E3A5F,
            shininess: 150
        });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 1.05;
        top.position.z = -0.3;
        this.car.add(top);

        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
        const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 });

        const wheelPositions = [
            [-0.85, 0.35, 1.1],
            [0.85, 0.35, 1.1],
            [-0.85, 0.35, -1.1],
            [0.85, 0.35, -1.1]
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...pos);
            this.car.add(wheel);
        });

        // Headlights
        const lightGeo = new THREE.BoxGeometry(0.25, 0.15, 0.1);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });

        const leftLight = new THREE.Mesh(lightGeo, lightMat);
        leftLight.position.set(-0.5, 0.5, 1.75);
        this.car.add(leftLight);

        const rightLight = new THREE.Mesh(lightGeo, lightMat);
        rightLight.position.set(0.5, 0.5, 1.75);
        this.car.add(rightLight);

        // Taillights
        const tailMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });

        const leftTail = new THREE.Mesh(lightGeo, tailMat);
        leftTail.position.set(-0.5, 0.5, -1.75);
        this.car.add(leftTail);

        const rightTail = new THREE.Mesh(lightGeo, tailMat);
        rightTail.position.set(0.5, 0.5, -1.75);
        this.car.add(rightTail);

        this.scene.add(this.car);
    }

    createRoad() {
        // Road surface
        const roadGeo = new THREE.PlaneGeometry(16, 200);
        const roadMat = new THREE.MeshBasicMaterial({ color: 0x2a2a3a });
        const road = new THREE.Mesh(roadGeo, roadMat);
        road.rotation.x = -Math.PI / 2;
        road.position.y = -0.4;
        this.scene.add(road);

        // Road edges
        const edgeGeo = new THREE.PlaneGeometry(0.3, 200);
        const edgeMat = new THREE.MeshBasicMaterial({ color: 0x3B82F6 });

        const leftEdge = new THREE.Mesh(edgeGeo, edgeMat);
        leftEdge.rotation.x = -Math.PI / 2;
        leftEdge.position.set(-8, -0.35, 0);
        this.scene.add(leftEdge);

        const rightEdge = new THREE.Mesh(edgeGeo, edgeMat);
        rightEdge.rotation.x = -Math.PI / 2;
        rightEdge.position.set(8, -0.35, 0);
        this.scene.add(rightEdge);
    }

    initRoadMarkings() {
        const dashGeo = new THREE.PlaneGeometry(0.2, 3);
        const dashMat = new THREE.MeshBasicMaterial({ color: 0x666666 });

        for (let i = 0; i < 30; i++) {
            const dash = new THREE.Mesh(dashGeo, dashMat);
            dash.rotation.x = -Math.PI / 2;
            dash.position.y = -0.35;
            dash.position.z = -i * 7;
            this.scene.add(dash);
            this.roadMarkings.push(dash);
        }
    }

    createObstacles() {
        this.obstacles = [];
        const colors = [0xff4444, 0xffaa00, 0x44ff44, 0xff44ff];

        for (let i = 0; i < 12; i++) {
            const size = 1.5 + Math.random();
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshPhongMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                shininess: 50
            });

            const obstacle = new THREE.Mesh(geo, mat);
            obstacle.position.set(
                (Math.random() - 0.5) * 12,
                size / 2 - 0.3,
                -i * 15 - 20
            );

            obstacle.userData = { size: size };
            this.obstacles.push(obstacle);
            this.scene.add(obstacle);
        }
    }

    createCoins() {
        this.coins = [];
        const coinGeo = new THREE.TorusGeometry(0.6, 0.15, 8, 16);
        const coinMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

        for (let i = 0; i < 15; i++) {
            const coin = new THREE.Mesh(coinGeo, coinMat.clone());
            coin.position.set(
                (Math.random() - 0.5) * 12,
                0.8,
                -i * 12 - 10
            );
            coin.rotation.y = Math.random() * Math.PI;
            coin.userData = { active: true };
            this.coins.push(coin);
            this.scene.add(coin);
        }
    }

    setupKeyboardListeners() {
        // These listeners are added ONCE at document level
        document.onkeydown = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'arrowup') keys['w'] = true;
            if (key === 's' || key === 'arrowdown') keys['s'] = true;
            if (key === 'a' || key === 'arrowleft') keys['a'] = true;
            if (key === 'd' || key === 'arrowright') keys['d'] = true;
            if (key === ' ') keys[' '] = true;
            if (key === 'escape') {
                if (this.running) {
                    this.paused = !this.paused;
                    if (this.paused) pauseGame();
                    else resumeGame();
                }
            }
        };

        document.onkeyup = (e) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || key === 'arrowup') keys['w'] = false;
            if (key === 's' || key === 'arrowdown') keys['s'] = false;
            if (key === 'a' || key === 'arrowleft') keys['a'] = false;
            if (key === 'd' || key === 'arrowright') keys['d'] = false;
            if (key === ' ') keys[' '] = false;
        };
    }

    onResize() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 450;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    update() {
        if (this.paused || !this.running) return;

        // Acceleration
        if (keys['w']) {
            this.carSpeed = Math.min(this.carSpeed + this.acceleration, this.maxSpeed);
        } else if (keys['s']) {
            this.carSpeed = Math.max(this.carSpeed - this.acceleration, -this.maxSpeed / 3);
        } else {
            this.carSpeed *= this.friction;
        }

        // Braking
        if (keys[' ']) {
            this.carSpeed *= 0.9;
        }

        // Steering (always works, not dependent on speed)
        if (keys['a']) {
            this.steering = Math.max(this.steering - 0.05, -this.maxSteering);
        } else if (keys['d']) {
            this.steering = Math.min(this.steering + 0.05, this.maxSteering);
        } else {
            this.steering *= 0.85;
        }

        // Apply steering to car position
        this.carX += this.steering * (Math.abs(this.carSpeed) * 10 + 0.5);
        this.carX = Math.max(-7, Math.min(7, this.carX));

        // Update car mesh
        this.car.position.x = this.carX;
        this.car.rotation.z = -this.steering * 2;

        // Move camera with car
        this.camera.position.x = this.carX * 0.3;
        this.camera.lookAt(this.carX * 0.2, 0, -20);

        // Animate road markings
        this.roadSpeed = this.carSpeed + 0.3;
        this.roadMarkings.forEach(dash => {
            dash.position.z += this.roadSpeed;
            if (dash.position.z > 10) {
                dash.position.z -= 210;
            }
        });

        // Update obstacles
        this.obstacles.forEach(obs => {
            obs.position.z += this.roadSpeed;
            if (obs.position.z > 10) {
                obs.position.z -= 180;
                obs.position.x = (Math.random() - 0.5) * 14;
            }

            // Collision
            const dx = Math.abs(obs.position.x - this.carX);
            const dz = Math.abs(obs.position.z);
            if (dx < obs.userData.size / 2 + 1 && dz < obs.userData.size / 2 + 1) {
                this.gameOver();
            }
        });

        // Update coins
        this.coins.forEach(coin => {
            if (!coin.userData.active) return;

            coin.position.z += this.roadSpeed;
            coin.rotation.z += 0.1;

            if (coin.position.z > 10) {
                coin.position.z -= 180;
                coin.position.x = (Math.random() - 0.5) * 14;
                coin.userData.active = true;
                coin.visible = true;
            }

            const dx = Math.abs(coin.position.x - this.carX);
            const dz = Math.abs(coin.position.z);
            if (dx < 1.2 && dz < 1.5) {
                coin.userData.active = false;
                coin.visible = false;
                this.score += 25;
                document.getElementById('racing-score').textContent = this.score;
            }
        });

        // Update score
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.score = Math.max(this.score, elapsed * 3);
        document.getElementById('racing-score').textContent = this.score;

        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        document.getElementById('racing-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    animate() {
        if (!this.running) return;

        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    gameOver() {
        this.running = false;
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.remove();
        }
        showGameOver(this.score, 'CRASHED!');
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    stop() {
        this.running = false;
        keys['w'] = false;
        keys['a'] = false;
        keys['s'] = false;
        keys['d'] = false;
        keys[' '] = false;

        if (this.renderer) {
            this.renderer.domElement.remove();
            this.renderer.dispose();
        }
    }
}

// =====================================================
// SNAKE GAME
// =====================================================

let snakeGame = null;

function startSnakeGame() {
    incrementPlayCount('snake');
    state.scores.snake = 0;
    state.gameActive = true;
    state.paused = false;

    const canvas = document.getElementById('snake-game');
    snakeGame = new SnakeGame(canvas);
    state.currentGame = snakeGame;
}

class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = Math.floor(canvas.width / this.gridSize);

        // Adjust for actual canvas size
        this.tileCountX = Math.floor(canvas.clientWidth / this.gridSize);
        this.tileCountY = Math.floor(canvas.clientHeight / this.gridSize);

        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = { x: 15, y: 15 };
        this.score = 0;
        this.highScore = state.highScores.snake;
        this.speed = 100;
        this.gameLoop = null;
        this.running = true;
        this.paused = false;

        this.init();
    }

    init() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.tileCountX = Math.floor(this.canvas.width / this.gridSize);
        this.tileCountY = Math.floor(this.canvas.height / this.gridSize);

        this.spawnFood();
        this.setupInput();
        this.update();
    }

    setupInput() {
        const keyDown = (e) => {
            if (this.paused) return;

            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup':
                    if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
                    break;
                case 's': case 'arrowdown':
                    if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
                    break;
                case 'a': case 'arrowleft':
                    if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
                    break;
                case 'd': case 'arrowright':
                    if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
                    break;
                case ' ':
                    this.pause();
                    break;
            }
        };

        document.addEventListener('keydown', keyDown);
    }

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCountX),
            y: Math.floor(Math.random() * this.tileCountY)
        };

        // Make sure food doesn't spawn on snake
        for (const segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.spawnFood();
                break;
            }
        }
    }

    update() {
        if (!this.running || this.paused) return;

        this.direction = { ...this.nextDirection };

        // Move snake
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
            this.gameOver();
            return;
        }

        // Check self collision
        for (const segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = this.score;
            document.getElementById('snake-high').textContent = this.highScore;

            // Increase speed
            this.speed = Math.max(50, this.speed - 2);

            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
        this.gameLoop = setTimeout(() => this.update(), this.speed);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        for (let i = 0; i <= this.tileCountX; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.tileCountY; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            const brightness = Math.max(0.5, 1 - index * 0.02);
            const green = Math.floor(200 * brightness);
            this.ctx.fillStyle = `rgb(16, 185, 129, ${brightness})`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#10B981';

            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );

            this.ctx.shadowBlur = 0;
        });

        // Draw food
        this.ctx.fillStyle = '#F43F5E';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#F43F5E';

        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
    }

    pause() {
        this.paused = true;
        pauseGame();
    }

    resume() {
        this.paused = false;
        this.update();
    }

    gameOver() {
        this.running = false;
        clearTimeout(this.gameLoop);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            document.getElementById('snake-high').textContent = this.highScore;
            updateStatsDisplay();
        }

        showGameOver(this.score, 'GAME OVER');
    }

    stop() {
        this.running = false;
        clearTimeout(this.gameLoop);
    }
}

// =====================================================
// TICTACTOE GAME
// =====================================================

let tictactoeGame = null;
let tictactoeBoard = [];
let tictactoeCurrentPlayer = 'X';
let tictactoeImpossible = true;

function initTicTacToe() {
    incrementPlayCount('tictactoe');
    state.gameActive = true;

    tictactoeBoard = Array(9).fill(null);
    tictactoeCurrentPlayer = 'X';

    renderTicTacToe();
}

function renderTicTacToe() {
    const board = document.getElementById('ttt-board');
    board.innerHTML = '';

    tictactoeBoard.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'ttt-cell';
        if (cell) {
            cellDiv.classList.add(cell.toLowerCase());
            cellDiv.textContent = cell;
        }
        cellDiv.addEventListener('click', () => handleTicTacToeMove(index));
        board.appendChild(cellDiv);
    });

    updateTicTacToeInfo();
}

function handleTicTacToeMove(index) {
    if (tictactoeBoard[index] || checkTicTacToeWinner() || state.paused) return;

    tictactoeBoard[index] = tictactoeCurrentPlayer;

    const winner = checkTicTacToeWinner();
    if (winner) {
        renderTicTacToe();
        setTimeout(() => {
            if (winner === 'Draw') {
                state.tictactoe.draws++;
                localStorage.setItem('tttDraws', state.tictactoe.draws);
                updateStatsDisplay();
                alert("It's a Draw!");
            } else {
                state.tictactoe.wins++;
                localStorage.setItem('tttWins', state.tictactoe.wins);
                updateStatsDisplay();
                alert(`You Win!`);
            }
        }, 100);
        return;
    }

    tictactoeCurrentPlayer = tictactoeCurrentPlayer === 'X' ? 'O' : 'X';
    renderTicTacToe();

    // AI move
    if (tictactoeCurrentPlayer === 'O' && tictactoeImpossible) {
        setTimeout(() => {
            const aiMove = getBestMove();
            tictactoeBoard[aiMove] = 'O';

            const aiWinner = checkTicTacToeWinner();
            if (aiWinner) {
                renderTicTacToe();
                setTimeout(() => {
                    if (aiWinner === 'Draw') {
                        state.tictactoe.draws++;
                        localStorage.setItem('tttDraws', state.tictactoe.draws);
                        updateStatsDisplay();
                        alert("It's a Draw!");
                    } else {
                        alert('AI Wins!');
                    }
                }, 100);
                return;
            }

            tictactoeCurrentPlayer = 'X';
            renderTicTacToe();
        }, 300);
    }
}

function checkTicTacToeWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
        if (tictactoeBoard[a] && tictactoeBoard[a] === tictactoeBoard[b] && tictactoeBoard[a] === tictactoeBoard[c]) {
            return tictactoeBoard[a];
        }
    }

    if (!tictactoeBoard.includes(null)) {
        return 'Draw';
    }

    return null;
}

function getBestMove() {
    // Minimax algorithm
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const evaluate = (board, player) => {
        for (const [a, b, c] of lines) {
            if (board[a] === board[b] && board[b] === board[c]) {
                if (board[a] === player) return 10;
                if (board[a] === (player === 'X' ? 'O' : 'X')) return -10;
            }
        }
        if (!board.includes(null)) return 0;
        return null;
    };

    const minimax = (board, depth, isMaximizing, player) => {
        const result = evaluate(board, player);
        if (result !== null) return result - depth;

        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, false, player));
                    board[i] = null;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === null) {
                    board[i] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, true, player));
                    board[i] = null;
                }
            }
            return best;
        }
    };

    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
        if (tictactoeBoard[i] === null) {
            tictactoeBoard[i] = 'O';
            const score = minimax(tictactoeBoard, 0, false, 'O');
            tictactoeBoard[i] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

function updateTicTacToeInfo() {
    const info = document.getElementById('ttt-info');
    if (checkTicTacToeWinner()) {
        info.textContent = 'Game Over';
    } else {
        info.textContent = `${tictactoeCurrentPlayer === 'X' ? 'Your' : "AI's"} Turn (${tictactoeCurrentPlayer})`;
    }
}

function toggleDifficulty() {
    tictactoeImpossible = !tictactoeImpossible;
    document.getElementById('ttt-difficulty').textContent = `Mode: ${tictactoeImpossible ? 'Impossible' : 'Easy'}`;
    resetTicTacToe();
}

function resetTicTacToe() {
    tictactoeBoard = Array(9).fill(null);
    tictactoeCurrentPlayer = 'X';
    renderTicTacToe();
}

// =====================================================
// PONG GAME
// =====================================================

let pongGame = null;

function startPongGame() {
    incrementPlayCount('pong');
    state.scores.pong = 0;
    state.gameActive = true;
    state.paused = false;

    const canvas = document.getElementById('pong-game');
    pongGame = new PongGame(canvas);
    state.currentGame = pongGame;
}

class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Paddles
        this.player = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
        this.cpu = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };

        // Ball
        this.ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 8,
            dx: 5,
            dy: 5,
            speed: 5
        };

        this.running = true;
        this.paused = false;

        this.init();
    }

    init() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // Adjust player positions
        this.player.x = 10;
        this.player.y = this.canvas.height / 2 - this.player.height / 2;
        this.cpu.x = this.canvas.width - 20;
        this.cpu.y = this.canvas.height / 2 - this.cpu.height / 2;

        // Reset ball
        this.resetBall();

        this.setupInput();
        this.update();
    }

    setupInput() {
        // Mouse control
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            this.player.y = mouseY - this.player.height / 2;

            // Clamp to canvas
            this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
        });

        // Keyboard control
        const keyDown = (e) => {
            if (e.key === ' ') this.pause();
            if (e.key.toLowerCase() === 'w') this.player.y -= 10;
            if (e.key.toLowerCase() === 's') this.player.y += 10;
        };

        document.addEventListener('keydown', keyDown);
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
        this.ball.dy = (Math.random() * 2 - 1) * this.ball.speed;
    }

    update() {
        if (!this.running || this.paused) return;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collision (top/bottom)
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Paddle collision
        const checkPaddle = (paddle) => {
            return this.ball.x - this.ball.radius < paddle.x + paddle.width &&
                   this.ball.x + this.ball.radius > paddle.x &&
                   this.ball.y > paddle.y &&
                   this.ball.y < paddle.y + paddle.height;
        };

        if (checkPaddle(this.player)) {
            this.ball.dx = Math.abs(this.ball.dx);
            this.ball.dx += 0.5;
            const hitPos = (this.ball.y - this.player.y) / this.player.height;
            this.ball.dy = (hitPos - 0.5) * 10;
        }

        if (checkPaddle(this.cpu)) {
            this.ball.dx = -Math.abs(this.ball.dx);
            this.ball.dx -= 0.5;
            const hitPos = (this.ball.y - this.cpu.y) / this.cpu.height;
            this.ball.dy = (hitPos - 0.5) * 10;
        }

        // Limit ball speed
        const maxSpeed = 15;
        this.ball.dx = Math.max(-maxSpeed, Math.min(maxSpeed, this.ball.dx));
        this.ball.dy = Math.max(-maxSpeed, Math.min(maxSpeed, this.ball.dy));

        // Score
        if (this.ball.x < 0) {
            this.cpu.score++;
            document.getElementById('pong-cpu').textContent = this.cpu.score;
            this.resetBall();
        }

        if (this.ball.x > this.canvas.width) {
            this.player.score++;
            document.getElementById('pong-player').textContent = this.player.score;
            this.resetBall();
        }

        // CPU AI
        const cpuCenter = this.cpu.y + this.cpu.height / 2;
        if (cpuCenter < this.ball.y - 10) {
            this.cpu.y += 4;
        } else if (cpuCenter > this.ball.y + 10) {
            this.cpu.y -= 4;
        }
        this.cpu.y = Math.max(0, Math.min(this.canvas.height - this.cpu.height, this.cpu.y));

        this.draw();

        this.animationFrame = requestAnimationFrame(() => this.update());
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Center line
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Player paddle
        this.ctx.fillStyle = '#3B82F6';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#3B82F6';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // CPU paddle
        this.ctx.fillStyle = '#F43F5E';
        this.ctx.shadowColor = '#F43F5E';
        this.ctx.fillRect(this.cpu.x, this.cpu.y, this.cpu.width, this.cpu.height);

        // Ball
        this.ctx.fillStyle = '#F8FAFC';
        this.ctx.shadowColor = '#F8FAFC';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;
    }

    pause() {
        this.paused = true;
        pauseGame();
    }

    resume() {
        this.paused = false;
        this.update();
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.animationFrame);
    }
}

// =====================================================
// TETRIS GAME
// =====================================================

let tetrisGame = null;

function startTetrisGame() {
    incrementPlayCount('tetris');
    state.scores.tetris = 0;
    state.gameActive = true;
    state.paused = false;

    const canvas = document.getElementById('tetris-game');
    tetrisGame = new TetrisGame(canvas);
    state.currentGame = tetrisGame;
}

class TetrisGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.blockSize = Math.floor(canvas.clientWidth / 10);
        this.cols = 10;
        this.rows = 20;

        this.canvas.width = this.cols * this.blockSize;
        this.canvas.height = this.rows * this.blockSize;

        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));

        this.score = 0;
        this.level = 1;
        this.lines = 0;

        this.pieces = [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[0, 1, 0], [1, 1, 1]], // T
            [[1, 0, 0], [1, 1, 1]], // L
            [[0, 0, 1], [1, 1, 1]], // J
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 1, 0], [0, 1, 1]]  // Z
        ];

        this.colors = [
            null,
            '#3B82F6', // I - Blue
            '#F59E0B', // O - Yellow
            '#8B5CF6', // T - Purple
            '#F97316', // L - Orange
            '#3B82F6', // J - Blue
            '#10B981', // S - Green
            '#EF4444'  // Z - Red
        ];

        this.currentPiece = null;
        this.currentPiecePos = { x: 0, y: 0 };

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        this.running = true;
        this.paused = false;

        this.init();
    }

    init() {
        this.spawnPiece();
        this.setupInput();
        this.update();
    }

    spawnPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = this.pieces[pieceIndex];
        this.currentPiecePos = {
            x: Math.floor(this.cols / 2) - Math.floor(this.currentPiece[0].length / 2),
            y: 0
        };

        // Check for game over
        if (this.checkCollision(0, 0)) {
            this.gameOver();
        }
    }

    checkCollision(offsetX, offsetY, piece = this.currentPiece) {
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    const newX = this.currentPiecePos.x + x + offsetX;
                    const newY = this.currentPiecePos.y + y + offsetY;

                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }

                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    mergePiece() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const boardY = this.currentPiecePos.y + y;
                    const boardX = this.currentPiecePos.x + x;

                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.pieces.indexOf(this.currentPiece);
                    }
                }
            }
        }

        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;

        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800];
            this.score += points[linesCleared] * this.level;
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

            document.getElementById('tetris-score').textContent = this.score;
            document.getElementById('tetris-level').textContent = this.level;
        }
    }

    rotatePiece() {
        const rotated = this.currentPiece[0].map((_, i) =>
            this.currentPiece.map(row => row[i]).reverse()
        );

        if (!this.checkCollision(0, 0, rotated)) {
            this.currentPiece = rotated;
        } else if (!this.checkCollision(-1, 0, rotated)) {
            this.currentPiece = rotated;
            this.currentPiecePos.x -= 1;
        } else if (!this.checkCollision(1, 0, rotated)) {
            this.currentPiece = rotated;
            this.currentPiecePos.x += 1;
        }
    }

    setupInput() {
        const keyDown = (e) => {
            if (this.paused) return;

            switch (e.key) {
                case 'ArrowLeft':
                    if (!this.checkCollision(-1, 0)) this.currentPiecePos.x--;
                    break;
                case 'ArrowRight':
                    if (!this.checkCollision(1, 0)) this.currentPiecePos.x++;
                    break;
                case 'ArrowDown':
                    if (!this.checkCollision(0, 1)) {
                        this.currentPiecePos.y++;
                        this.score += 1;
                        document.getElementById('tetris-score').textContent = this.score;
                    }
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    // Hard drop
                    while (!this.checkCollision(0, 1)) {
                        this.currentPiecePos.y++;
                        this.score += 2;
                    }
                    this.mergePiece();
                    document.getElementById('tetris-score').textContent = this.score;
                    break;
            }
        };

        document.addEventListener('keydown', keyDown);
    }

    update(time = 0) {
        if (!this.running || this.paused) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.dropPiece();
        }

        this.draw();
        this.animationFrame = requestAnimationFrame((t) => this.update(t));
    }

    dropPiece() {
        if (!this.checkCollision(0, 1)) {
            this.currentPiecePos.y++;
        } else {
            this.mergePiece();
        }
        this.dropCounter = 0;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0F172A';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.colors[this.board[y][x]]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.length; y++) {
                for (let x = 0; x < this.currentPiece[y].length; x++) {
                    if (this.currentPiece[y][x]) {
                        this.drawBlock(
                            this.currentPiecePos.x + x,
                            this.currentPiecePos.y + y,
                            this.colors[this.pieces.indexOf(this.currentPiece)]
                        );
                    }
                }
            }
        }

        // Grid lines
        this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawBlock(x, y, color) {
        const size = this.blockSize - 1;

        // Block body
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, size, size);

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, size, 3);
        this.ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, 3, size);

        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + size - 3, size, 3);
        this.ctx.fillRect(x * this.blockSize + size - 3, y * this.blockSize + 1, 3, size);
    }

    pause() {
        this.paused = true;
        pauseGame();
    }

    resume() {
        this.paused = false;
        this.lastTime = performance.now();
        this.update();
    }

    gameOver() {
        this.running = false;
        cancelAnimationFrame(this.animationFrame);

        if (this.score > state.highScores.tetris) {
            state.highScores.tetris = this.score;
            localStorage.setItem('tetrisHighScore', this.score);
            updateStatsDisplay();
        }

        showGameOver(this.score, 'GAME OVER');
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.animationFrame);
    }
}


// =====================================================
// NEON RUNNER GAME - Space Shooter
// =====================================================

let neonRunnerGame = null;

function startNeonRunnerGame() {
    incrementPlayCount('neonrunner');
    state.scores.neonrunner = 0;
    state.gameActive = true;
    state.paused = false;

    const canvas = document.getElementById('neonrunner-canvas');
    if (canvas) {
        neonRunnerGame = new NeonRunnerGame(canvas);
        state.currentGame = neonRunnerGame;
    }
}

class NeonRunnerGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = true;
        this.score = 0;
        this.health = 100;
        this.weapon = 'laser';
        this.ammo = 100;
        this.wave = 1;
        
        this.init();
        this.setupControls();
        this.update();
    }

    init() {
        // Set canvas size
        this.canvas.width = this.canvas.clientWidth || 800;
        this.canvas.height = this.canvas.clientHeight || 600;
        
        // Player ship
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 80,
            width: 40,
            height: 50,
            speed: 8,
            color: '#00ffff'
        };
        
        // Bullets
        this.bullets = [];
        this.lastShot = 0;
        this.shootCooldown = 150;
        
        // Enemies
        this.enemies = [];
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = 60;
        
        // Stars background
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 3 + 1
            });
        }
        
        // Powerups
        this.powerups = [];
        
        // Explosions
        this.explosions = [];
        
        // Update UI
        this.updateHUD();
    }

    setupControls() {
        document.onkeydown = (e) => {
            keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' || e.key === 'e') this.shoot();
            if (e.key === 'p' || e.key === 'Escape') this.togglePause();
        };
        document.onkeyup = (e) => keys[e.key.toLowerCase()] = false;
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shootCooldown) return;
        this.lastShot = now;
        
        if (this.weapon === 'laser') {
            this.bullets.push({
                x: this.player.x,
                y: this.player.y - 25,
                width: 4,
                height: 20,
                speed: 12,
                damage: 10,
                color: '#00ffff'
            });
        } else if (this.weapon === 'spread') {
            for (let i = -1; i <= 1; i++) {
                this.bullets.push({
                    x: this.player.x,
                    y: this.player.y - 25,
                    width: 6,
                    height: 15,
                    speed: 10,
                    damage: 8,
                    angle: i * 0.2,
                    color: '#ff00ff'
                });
            }
        }
        
        this.ammo = Math.max(0, this.ammo - 1);
        this.updateHUD();
    }

    spawnEnemy() {
        const types = [
            { width: 40, height: 40, speed: 2, health: 20, color: '#ff4444', points: 10 },
            { width: 50, height: 50, speed: 1.5, health: 40, color: '#ff8800', points: 25 },
            { width: 30, height: 30, speed: 4, health: 10, color: '#ffff00', points: 15 }
        ];
        
        const type = types[Math.floor(Math.random() * types.length)];
        this.enemies.push({
            x: Math.random() * (this.canvas.width - type.width),
            y: -type.height,
            ...type,
            maxHealth: type.health,
            angle: 0
        });
    }

    update() {
        if (!this.running || state.paused) {
            requestAnimationFrame(() => this.update());
            return;
        }

        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateStars();
        this.updateExplosions();
        this.updatePowerups();
        this.checkCollisions();
        
        this.draw();
        this.updateHUD();
        
        requestAnimationFrame(() => this.update());
    }

    updatePlayer() {
        if (keys['a'] || keys['arrowleft']) {
            this.player.x = Math.max(this.player.width / 2, this.player.x - this.player.speed);
        }
        if (keys['d'] || keys['arrowright']) {
            this.player.x = Math.min(this.canvas.width - this.player.width / 2, this.player.x + this.player.speed);
        }
        if (keys['w'] || keys['arrowup']) {
            this.player.y = Math.max(this.player.height / 2, this.player.y - this.player.speed);
        }
        if (keys['s'] || keys['arrowdown']) {
            this.player.y = Math.min(this.canvas.height - this.player.height / 2, this.player.y + this.player.speed);
        }
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.angle) {
                bullet.x += Math.sin(bullet.angle) * bullet.speed;
                bullet.y -= Math.cos(bullet.angle) * bullet.speed;
            } else {
                bullet.y -= bullet.speed;
            }
            return bullet.y > -bullet.height && bullet.x > 0 && bullet.x < this.canvas.width;
        });
    }

    updateEnemies() {
        // Spawn enemies
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= this.enemySpawnRate) {
            this.enemySpawnTimer = 0;
            this.spawnEnemy();
        }
        
        // Move enemies
        this.enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            enemy.x += Math.sin(enemy.y * 0.02) * 1;
        });
        
        // Remove off-screen enemies
        this.enemies = this.enemies.filter(enemy => enemy.y < this.canvas.height + enemy.height);
    }

    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }

    updateExplosions() {
        this.explosions = this.explosions.filter(exp => {
            exp.radius += 3;
            exp.alpha -= 0.05;
            return exp.alpha > 0;
        });
    }

    updatePowerups() {
        this.powerups.forEach(powerup => {
            powerup.y += powerup.speed;
            powerup.angle += 0.1;
        });
        this.powerups = this.powerups.filter(p => p.y < this.canvas.height + 20);
    }

    checkCollisions() {
        // Bullets vs Enemies
        this.bullets.forEach((bullet, bi) => {
            this.enemies.forEach((enemy, ei) => {
                if (this.isColliding(bullet, enemy)) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(bi, 1);
                    
                    if (enemy.health <= 0) {
                        this.createExplosion(enemy.x, enemy.y, enemy.color);
                        this.score += enemy.points;
                        this.enemies.splice(ei, 1);
                        
                        // Chance to spawn powerup
                        if (Math.random() < 0.1) {
                            this.spawnPowerup(enemy.x, enemy.y);
                        }
                    }
                }
            });
        });
        
        // Player vs Enemies
        this.enemies.forEach((enemy, ei) => {
            if (this.isColliding(this.player, enemy)) {
                this.health -= 20;
                this.createExplosion(enemy.x, enemy.y, enemy.color);
                this.enemies.splice(ei, 1);
                
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // Player vs Powerups
        this.powerups.forEach((powerup, pi) => {
            if (this.isColliding(this.player, powerup)) {
                if (powerup.type === 'health') {
                    this.health = Math.min(100, this.health + 25);
                } else if (powerup.type === 'ammo') {
                    this.ammo += 50;
                } else if (powerup.type === 'weapon') {
                    this.weapon = this.weapon === 'laser' ? 'spread' : 'laser';
                }
                this.powerups.splice(pi, 1);
            }
        });
    }

    isColliding(a, b) {
        const aBox = {
            x: a.x - (a.width || a.radius || 20) / 2,
            y: a.y - (a.height || a.radius || 20) / 2,
            width: a.width || a.radius * 2 || 40,
            height: a.height || a.radius * 2 || 40
        };
        const bBox = {
            x: b.x - (b.width || b.radius || 20) / 2,
            y: b.y - (b.height || b.radius || 20) / 2,
            width: b.width || b.radius * 2 || 40,
            height: b.height || b.radius * 2 || 40
        };
        return aBox.x < bBox.x + bBox.width &&
               aBox.x + aBox.width > bBox.x &&
               aBox.y < bBox.y + bBox.height &&
               aBox.y + aBox.height > bBox.y;
    }

    createExplosion(x, y, color) {
        this.explosions.push({
            x, y,
            radius: 5,
            color,
            alpha: 1
        });
    }

    spawnPowerup(x, y) {
        const types = ['health', 'ammo', 'weapon'];
        this.powerups.push({
            x, y,
            type: types[Math.floor(Math.random() * types.length)],
            width: 25,
            height: 25,
            speed: 2,
            angle: 0
        });
    }

    draw() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars (warp effect)
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + star.size / 4})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw powerups
        this.powerups.forEach(powerup => {
            ctx.save();
            ctx.translate(powerup.x, powerup.y);
            ctx.rotate(powerup.angle);
            
            if (powerup.type === 'health') {
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(-10, -10, 20, 20);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('+', 0, 5);
            } else if (powerup.type === 'ammo') {
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('A', 0, 4);
            } else if (powerup.type === 'weapon') {
                ctx.fillStyle = '#9b59b6';
                ctx.fillRect(-12, -12, 24, 24);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('W', 0, 4);
            }
            ctx.restore();
        });
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
            
            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = bullet.color;
            ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);
            ctx.shadowBlur = 0;
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            ctx.fillStyle = enemy.color;
            
            // Enemy ship shape
            ctx.beginPath();
            ctx.moveTo(enemy.x, enemy.y + enemy.height / 2);
            ctx.lineTo(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
            ctx.lineTo(enemy.x + enemy.width / 2, enemy.y - enemy.height / 2);
            ctx.closePath();
            ctx.fill();
            
            // Health bar
            const healthPercent = enemy.health / enemy.maxHealth;
            ctx.fillStyle = '#333';
            ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2 - 10, enemy.width, 5);
            ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
            ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2 - 10, enemy.width * healthPercent, 5);
        });
        
        // Draw player ship
        ctx.save();
        ctx.translate(this.player.x, this.player.y);
        
        // Ship body
        ctx.fillStyle = this.player.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.player.height / 2);
        ctx.lineTo(-this.player.width / 2, this.player.height / 2);
        ctx.lineTo(0, this.player.height / 3);
        ctx.lineTo(this.player.width / 2, this.player.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Engine glow
        ctx.fillStyle = '#ff6600';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(-8, this.player.height / 2);
        ctx.lineTo(0, this.player.height / 2 + 15 + Math.random() * 10);
        ctx.lineTo(8, this.player.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
        
        // Draw explosions
        this.explosions.forEach(exp => {
            ctx.globalAlpha = exp.alpha;
            ctx.fillStyle = exp.color;
            ctx.beginPath();
            ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }

    updateHUD() {
        document.getElementById('neonrunner-score').textContent = Math.floor(this.score);
        document.getElementById('neonrunner-hp').textContent = Math.max(0, this.health);
        
        const weaponEl = document.getElementById('neonrunner-weapon');
        if (weaponEl) {
            weaponEl.textContent = this.weapon.charAt(0).toUpperCase() + this.weapon.slice(1);
        }
        
        const ammoEl = document.getElementById('neonrunner-ammo');
        if (ammoEl) {
            ammoEl.textContent = this.ammo;
        }
    }

    togglePause() {
        state.paused = !state.paused;
        if (state.paused) {
            showPauseModal();
        } else {
            hidePauseModal();
        }
    }

    gameOver() {
        this.running = false;
        
        if (this.score > state.highScores.neonrunner) {
            state.highScores.neonrunner = this.score;
            localStorage.setItem('neonrunnerHighScore', this.score);
            updateStatsDisplay();
        }
        
        showGameOver(Math.floor(this.score), 'GAME OVER');
    }

    stop() {
        this.running = false;
        keys['w'] = false;
        keys['a'] = false;
        keys['s'] = false;
        keys['d'] = false;
        keys[' '] = false;
    }
}
// =====================================================
// END OF GAME.JS
// =====================================================

// =====================================================
// GTA CITY 3D GAME - Three.js Open World
// =====================================================

let gtacityGame = null;

function startGTACityGame() {
    incrementPlayCount('gtacity');
    state.scores.gtacity = 0;
    state.gameActive = true;
    state.paused = false;
    
    const container = document.getElementById('three-canvas-container');
    const loading = document.getElementById('gtacity-loading');
    const hud = document.getElementById('gtacity-hud');
    
    if (container && loading && hud) {
        loading.style.display = 'block';
        hud.style.display = 'none';
        
        // Add Three.js script dynamically
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                gtacityGame = new GTACityGame(container, loading, hud);
                state.currentGame = gtacityGame;
            };
            script.onerror = () => {
                loading.innerHTML = 'Error: Three.js failed to load. Please refresh the page.';
            };
            document.head.appendChild(script);
        } else {
            gtacityGame = new GTACityGame(container, loading, hud);
            state.currentGame = gtacityGame;
        }
    }
}

class GTACityGame {
    constructor(container, loading, hud) {
        this.container = container;
        this.loading = loading;
        this.hud = hud;
        this.score = 0;
        this.money = 0;
        this.health = 100;
        this.wantedLevel = 0;
        this.inVehicle = false;
        this.currentVehicle = null;
        this.weapon = 'pistol';
        this.bullets = [];
        this.running = true;
        
        this.init();
    }
    
    init() {
        // Scene setup - Morning atmosphere with realistic fog
        this.scene = new THREE.Scene();
        // Warm morning sky - sunrise colors
        this.scene.background = new THREE.Color(0xffc7a0);
        this.scene.fog = new THREE.FogExp2(0xffd4aa, 0.0008);
        
        // Camera with wider FOV for better perspective
        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.1, 4000);
        this.camera.position.set(0, 50, 100);
        
        // Renderer with enhanced quality settings
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth || 800, this.container.clientHeight || 450);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);
        
        // Morning lighting - warm sun with soft shadows
        const ambientLight = new THREE.AmbientLight(0xffebe0, 0.7);
        this.scene.add(ambientLight);
        
        // Sun light - warm golden hour light
        const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.5);
        sunLight.position.set(400, 300, 150);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 1500;
        sunLight.shadow.camera.left = -500;
        sunLight.shadow.camera.right = 500;
        sunLight.shadow.camera.top = 500;
        sunLight.shadow.camera.bottom = -500;
        sunLight.shadow.bias = -0.0005;
        sunLight.shadow.radius = 4;
        this.scene.add(sunLight);
        
        // Hemisphere light for natural sky/ground color gradient
        const hemiLight = new THREE.HemisphereLight(0xffeedd, 0x665544, 0.6);
        this.scene.add(hemiLight);
        
        // Add subtle fill light from opposite direction
        const fillLight = new THREE.DirectionalLight(0xccddff, 0.3);
        fillLight.position.set(-200, 100, -100);
        this.scene.add(fillLight);
        
        // Create city
        this.createCity();
        this.createPlayer();
        this.createVehicles();
        this.createPedestrians();
        
        // Hide loading, show HUD
        this.loading.style.display = 'none';
        this.hud.style.display = 'block';
        
        // Setup controls
        this.setupControls();
        
        // Start game loop
        this.animate();
    }
    
    createCity() {
        // Realistic asphalt ground with subtle texture variation
        const groundGeometry = new THREE.PlaneGeometry(4000, 4000, 100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a2a,
            roughness: 0.95,
            metalness: 0.05,
            bumpScale: 0.02
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Realistic buildings with varied textures and materials
        const buildingColors = [
            0x808080, 0x909090, 0xa0a0a0, 0x707070, 0x606060,
            0x8b7355, 0xa0522d, 0x8b4513, 0xcd853f, 0xd2691e,
            0x4a6670, 0x5a7a80, 0x3d5a60, 0x2c3e50, 0x34495e
        ];
        
        for (let x = -1400; x <= 1400; x += 80) {
            for (let z = -1400; z <= 1400; z += 80) {
                if (Math.random() > 0.3) {
                    const width = 20 + Math.random() * 60;
                    const depth = 20 + Math.random() * 60;
                    const height = 30 + Math.random() * 250;
                    
                    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
                    const buildingMaterial = new THREE.MeshStandardMaterial({
                        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
                        roughness: 0.7 + Math.random() * 0.25,
                        metalness: 0.1 + Math.random() * 0.3
                    });
                    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
                    building.position.set(x + (Math.random() - 0.5) * 40, height / 2, z + (Math.random() - 0.5) * 40);
                    building.castShadow = true;
                    building.receiveShadow = true;
                    this.scene.add(building);
                    
                    // Realistic windows with varied brightness
                    const windowRows = Math.floor(height / 10);
                    const windowCols = Math.floor(width / 7);
                    
                    for (let row = 0; row < windowRows; row++) {
                        for (let col = 0; col < windowCols; col++) {
                            if (Math.random() > 0.4) {
                                const windowBrightness = 0.5 + Math.random() * 0.5;
                                const windowGeometry = new THREE.BoxGeometry(2.5, 3.5, 0.3);
                                const windowMaterial = new THREE.MeshStandardMaterial({
                                    color: 0xffffee,
                                    emissive: 0xffdd88,
                                    emissiveIntensity: 0.2 + Math.random() * 0.4 * windowBrightness
                                });
                                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                                window.position.set(
                                    building.position.x - width/2 + 4 + col * 7,
                                    8 + row * 10,
                                    building.position.z + depth/2 + 0.3
                                );
                                this.scene.add(window);
                            }
                        }
                    }
                }
            }
        }
        
        // Realistic roads with lane markings
        const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
        const roadLinesMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const dashedLinesMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // Main highways with proper lanes
        for (let i = -8; i <= 8; i++) {
            const roadH = new THREE.Mesh(new THREE.BoxGeometry(4000, 0.15, 40), roadMaterial);
            roadH.position.set(0, 0.05, i * 80);
            roadH.receiveShadow = true;
            this.scene.add(roadH);
            
            const roadV = new THREE.Mesh(new THREE.BoxGeometry(40, 0.15, 4000), roadMaterial);
            roadV.position.set(i * 80, 0.05, 0);
            roadV.receiveShadow = true;
            this.scene.add(roadV);
            
            // Road markings - solid lines on edges
            for (let j = -2000; j < 2000; j += 2) {
                // Edge lines
                const edgeLineH1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.18, 1), roadLinesMaterial);
                edgeLineH1.position.set(0, 0.1, i * 80 + 18);
                this.scene.add(edgeLineH1);
                
                const edgeLineH2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.18, 1), roadLinesMaterial);
                edgeLineH2.position.set(0, 0.1, i * 80 - 18);
                this.scene.add(edgeLineH2);
                
                // Dashed center lines
                if (j % 8 < 4) {
                    const dashedLineV = new THREE.Mesh(new THREE.BoxGeometry(1, 0.18, 4), dashedLinesMaterial);
                    dashedLineV.position.set(i * 80, 0.1, j);
                    this.scene.add(dashedLineV);
                }
            }
        }
        
        // Sidewalks with realistic concrete texture
        const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.85, metalness: 0.05 });
        for (let i = -8; i <= 8; i++) {
            for (let j = -1800; j < 1800; j += 150) {
                const swH1 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 120), sidewalkMaterial);
                swH1.position.set(i * 80 + 35, 0.1, j);
                swH1.receiveShadow = true;
                this.scene.add(swH1);
                
                const swH2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 120), sidewalkMaterial);
                swH2.position.set(i * 80 - 35, 0.1, j);
                swH2.receiveShadow = true;
                this.scene.add(swH2);
                
                const swV1 = new THREE.Mesh(new THREE.BoxGeometry(120, 0.25, 20), sidewalkMaterial);
                swV1.position.set(j, 0.1, i * 80 + 35);
                swV1.receiveShadow = true;
                this.scene.add(swV1);
                
                const swV2 = new THREE.Mesh(new THREE.BoxGeometry(120, 0.25, 20), sidewalkMaterial);
                swV2.position.set(j, 0.1, i * 80 - 35);
                swV2.receiveShadow = true;
                this.scene.add(swV2);
            }
        }
        
        // Street trees with more realistic geometry
        const treeColors = [0x228b22, 0x2e8b57, 0x32cd32, 0x006400];
        for (let i = -8; i <= 8; i++) {
            for (let j = -1800; j < 1800; j += 100) {
                if (Math.random() > 0.5) {
                    // Tree trunk with bark texture
                    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.7, 10, 12);
                    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 });
                    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                    const posX = i * 80 + 50 + (Math.random() - 0.5) * 25;
                    const posZ = j + (Math.random() - 0.5) * 25;
                    trunk.position.set(posX, 5, posZ);
                    trunk.castShadow = true;
                    this.scene.add(trunk);
                    
                    // Tree foliage - multiple layers for realism
                    const leavesColor = treeColors[Math.floor(Math.random() * treeColors.length)];
                    const leavesMaterial = new THREE.MeshStandardMaterial({ color: leavesColor, roughness: 0.8 });
                    
                    const leaves1 = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16), leavesMaterial);
                    leaves1.position.set(posX, 14, posZ);
                    leaves1.castShadow = true;
                    this.scene.add(leaves1);
                    
                    const leaves2 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 12), leavesMaterial);
                    leaves2.position.set(posX + 2, 12, posZ - 1);
                    leaves2.castShadow = true;
                    this.scene.add(leaves2);
                    
                    const leaves3 = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 12), leavesMaterial);
                    leaves3.position.set(posX - 1, 11, posZ + 2);
                    leaves3.castShadow = true;
                    this.scene.add(leaves3);
                }
            }
        }
    }
    
    createPlayer() {
        // Realistic player character with better proportions
        const playerGroup = new THREE.Group();
        
        // Body - realistic proportions
        const bodyGeometry = new THREE.CylinderGeometry(0.45, 0.55, 2.8, 12);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7, metalness: 0.1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 3.8;
        body.castShadow = true;
        playerGroup.add(body);
        
        // Head with more detail
        const headGeometry = new THREE.SphereGeometry(0.55, 20, 20);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.6 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 5.7;
        head.castShadow = true;
        playerGroup.add(head);
        
        // Hair with better shape
        const hairGeometry = new THREE.SphereGeometry(0.6, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 6.0;
        hair.castShadow = true;
        playerGroup.add(hair);
        
        // Arms with better detail
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.15, 2.2, 12);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.6 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.65, 4.3, 0);
        leftArm.rotation.z = 0.25;
        leftArm.castShadow = true;
        playerGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.65, 4.3, 0);
        rightArm.rotation.z = -0.25;
        rightArm.castShadow = true;
        playerGroup.add(rightArm);
        
        // Legs with better detail
        const legGeometry = new THREE.CylinderGeometry(0.18, 0.22, 2.8, 12);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.25, 1.4, 0);
        leftLeg.castShadow = true;
        playerGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.25, 1.4, 0);
        rightLeg.castShadow = true;
        playerGroup.add(rightLeg);
        
        // Shoes
        const shoeGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.7);
        const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
        
        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(-0.25, 0.15, 0.1);
        leftShoe.castShadow = true;
        playerGroup.add(leftShoe);
        
        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0.25, 0.15, 0.1);
        rightShoe.castShadow = true;
        playerGroup.add(rightShoe);
        
        playerGroup.position.set(50, 0, 50);
        this.scene.add(playerGroup);
        this.player = playerGroup;
        
        // Player properties with improved movement
        this.playerSpeed = 0.8;
        this.playerVelocity = new THREE.Vector3();
        this.cameraOffset = new THREE.Vector3(0, 15, -25);
        this.mouseX = 0;
        this.mouseY = 0;
    }
    
    createVehicles() {
        this.vehicles = [];
        // Realistic car colors with more variety
        const vehicleColors = [
            0xc0392b, 0x2980b9, 0x27ae60, 0xf39c12, 0x8e44ad,
            0x1abc9c, 0xecf0f1, 0x2c3e50, 0xe74c3c, 0x3498db,
            0x16a085, 0xd35400, 0x7f8c8d, 0xc0392b, 0x9b59b6
        ];
        
        for (let i = 0; i < 80; i++) {
            const vehicleGroup = new THREE.Group();
            const carColor = vehicleColors[Math.floor(Math.random() * vehicleColors.length)];
            
            // Car body - realistic proportions with better shape
            const bodyGeometry = new THREE.BoxGeometry(5, 2, 10);
            const bodyMaterial = new THREE.MeshStandardMaterial({ 
                color: carColor,
                metalness: 0.7,
                roughness: 0.3
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 1.5;
            body.castShadow = true;
            vehicleGroup.add(body);
            
            // Car cabin - more aerodynamic shape
            const cabinGeometry = new THREE.BoxGeometry(4, 1.4, 4.5);
            const cabinMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x111111,
                metalness: 0.95,
                roughness: 0.05,
                transparent: true,
                opacity: 0.8
            });
            const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
            cabin.position.set(0, 2.7, -0.5);
            cabin.castShadow = true;
            vehicleGroup.add(cabin);
            
            // Hood detail
            const hoodGeometry = new THREE.BoxGeometry(4, 0.3, 2.5);
            const hoodMaterial = new THREE.MeshStandardMaterial({ color: carColor, metalness: 0.7, roughness: 0.3 });
            const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
            hood.position.set(0, 2.6, 2.5);
            hood.castShadow = true;
            vehicleGroup.add(hood);
            
            // Wheels - realistic with hubcaps
            const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 24);
            const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.3 });
            const hubcapMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
            
            const wheelPositions = [
                [-2.5, 0.8, 3.2], [2.5, 0.8, 3.2],
                [-2.5, 0.8, -3.2], [2.5, 0.8, -3.2]
            ];
            
            wheelPositions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(...pos);
                wheel.castShadow = true;
                vehicleGroup.add(wheel);
                
                // Hubcap
                const hubcap = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.52, 16), hubcapMaterial);
                hubcap.rotation.z = Math.PI / 2;
                hubcap.position.set(...pos);
                vehicleGroup.add(hubcap);
            });
            
            // Headlights with glow effect
            const lightGeometry = new THREE.BoxGeometry(1, 0.4, 0.1);
            const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
            
            const lightL = new THREE.Mesh(lightGeometry, lightMaterial);
            lightL.position.set(-1.8, 1.5, 5.05);
            vehicleGroup.add(lightL);
            
            const lightR = new THREE.Mesh(lightGeometry, lightMaterial);
            lightR.position.set(1.8, 1.5, 5.05);
            vehicleGroup.add(lightR);
            
            // Headlight beams (subtle)
            const beamGeometry = new THREE.ConeGeometry(0.5, 3, 8, 1, true);
            const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.1 });
            const beamL = new THREE.Mesh(beamGeometry, beamMaterial);
            beamL.position.set(-1.8, 1.5, 7);
            beamL.rotation.x = Math.PI / 2;
            vehicleGroup.add(beamL);
            
            const beamR = new THREE.Mesh(beamGeometry, beamMaterial);
            beamR.position.set(1.8, 1.5, 7);
            beamR.rotation.x = Math.PI / 2;
            vehicleGroup.add(beamR);
            
            // Taillights with realistic appearance
            const tailGeometry = new THREE.BoxGeometry(1, 0.3, 0.1);
            const tailMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });
            
            const tailL = new THREE.Mesh(tailGeometry, tailMaterial);
            tailL.position.set(-1.8, 1.5, -5.05);
            vehicleGroup.add(tailL);
            
            const tailR = new THREE.Mesh(tailGeometry, tailMaterial);
            tailR.position.set(1.8, 1.5, -5.05);
            vehicleGroup.add(tailR);
            
            // Reverse lights
            const reverseGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.1);
            const reverseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            
            const reverseL = new THREE.Mesh(reverseGeometry, reverseMaterial);
            reverseL.position.set(-1, 1.3, -5.05);
            vehicleGroup.add(reverseL);
            
            const reverseR = new THREE.Mesh(reverseGeometry, reverseMaterial);
            reverseR.position.set(1, 1.3, -5.05);
            vehicleGroup.add(reverseR);
            
            // Position vehicle on road
            const roadIndex = Math.floor(Math.random() * 16) - 8;
            const pos = Math.floor(Math.random() * 3800) - 1900;
            vehicleGroup.position.set(roadIndex * 80 + (Math.random() - 0.5) * 30, 0, pos);
            vehicleGroup.rotation.y = Math.random() > 0.5 ? 0 : Math.PI;
            
            this.scene.add(vehicleGroup);
            
            this.vehicles.push({
                mesh: vehicleGroup,
                speed: 0,
                maxSpeed: 4 + Math.random() * 3,
                acceleration: 0.1,
                turnSpeed: 0.05,
                occupied: false
            });
        }
    }
    
    createPedestrians() {
        this.pedestrians = [];
        // Realistic skin tones
        const skinTones = [0xffdbac, 0xf1c27d, 0xe0ac69, 0x8d5524, 0xc68642, 0xd4a574];
        // Realistic clothing colors with more variety
        const clothingColors = [0x3498db, 0xe74c3c, 0x2ecc71, 0xf39c12, 0x9b59b6, 0x1abc9c, 0x34495e, 0x7f8c8d, 0x1a1a2e, 0x16213e, 0xe94560, 0x0f3460];
        
        for (let i = 0; i < 300; i++) {
            const pedGroup = new THREE.Group();
            const clothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)];
            
            // Body with more realistic proportions
            const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.45, 2.3, 10);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: clothingColor, roughness: 0.8 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 3.0;
            body.castShadow = true;
            pedGroup.add(body);
            
            // Head with more detail
            const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ color: skinTones[Math.floor(Math.random() * skinTones.length)], roughness: 0.5 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 4.45;
            head.castShadow = true;
            pedGroup.add(head);
            
            // Hair
            const hairGeometry = new THREE.SphereGeometry(0.42, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
            const hairMaterial = new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0x2c1810 : 0x1a1a1a, roughness: 0.9 });
            const hair = new THREE.Mesh(hairGeometry, hairMaterial);
            hair.position.y = 4.65;
            pedGroup.add(hair);
            
            // Arms
            const armGeometry = new THREE.CylinderGeometry(0.1, 0.12, 1.8, 10);
            const armMaterial = new THREE.MeshStandardMaterial({ color: skinTones[Math.floor(Math.random() * skinTones.length)], roughness: 0.5 });
            
            const leftArm = new THREE.Mesh(armGeometry, armMaterial);
            leftArm.position.set(-0.45, 3.2, 0);
            leftArm.rotation.z = 0.1;
            leftArm.castShadow = true;
            pedGroup.add(leftArm);
            
            const rightArm = new THREE.Mesh(armGeometry, armMaterial);
            rightArm.position.set(0.45, 3.2, 0);
            rightArm.rotation.z = -0.1;
            rightArm.castShadow = true;
            pedGroup.add(rightArm);
            
            // Legs
            const legGeometry = new THREE.CylinderGeometry(0.12, 0.15, 2, 10);
            const legMaterial = new THREE.MeshStandardMaterial({ color: clothingColor, roughness: 0.8 });
            
            const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
            leftLeg.position.set(-0.15, 1.0, 0);
            leftLeg.castShadow = true;
            pedGroup.add(leftLeg);
            
            const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
            rightLeg.position.set(0.15, 1.0, 0);
            rightLeg.castShadow = true;
            pedGroup.add(rightLeg);
            
            // Shoes
            const shoeGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.5);
            const shoeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 });
            
            const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
            leftShoe.position.set(-0.15, 0.1, 0.1);
            pedGroup.add(leftShoe);
            
            const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
            rightShoe.position.set(0.15, 0.1, 0.1);
            pedGroup.add(rightShoe);
            
            // Position pedestrian on sidewalk
            const roadIndex = Math.floor(Math.random() * 16) - 8;
            const pos = Math.floor(Math.random() * 3600) - 1800;
            const side = Math.random() > 0.5 ? 1 : -1;
            pedGroup.position.set(
                roadIndex * 80 + side * (35 + Math.random() * 15),
                0,
                pos
            );
            
            this.scene.add(pedGroup);
            
            this.pedestrians.push({
                mesh: pedGroup,
                direction: Math.random() * Math.PI * 2,
                speed: 0.03 + Math.random() * 0.05,
                alive: true
            });
        }
    }
    
    updateCamera() {
        if (this.inVehicle && this.currentVehicle) {
            // Follow vehicle with smooth camera
            const vehicle = this.currentVehicle.mesh;
            const offset = new THREE.Vector3(0, 10, 22);
            offset.applyQuaternion(vehicle.quaternion);
            
            this.camera.position.lerp(vehicle.position.clone().add(offset), 0.05);
            this.camera.lookAt(vehicle.position.x, vehicle.position.y + 2, vehicle.position.z);
        } else {
            // Follow player with third-person camera
            const playerPos = this.player.position.clone();
            playerPos.y += 10;
            
            // Smooth camera movement
            const cameraOffset = new THREE.Vector3(
                Math.sin(this.mouseX) * 25 * Math.cos(this.mouseY),
                16 + Math.sin(this.mouseY) * 12,
                Math.cos(this.mouseX) * 25 * Math.cos(this.mouseY)
            );
            
            this.camera.position.lerp(playerPos.clone().add(cameraOffset), 0.08);
            this.camera.lookAt(playerPos);
        }
    }
    
    updateHUD() {
        document.getElementById('gtacity-score').textContent = Math.floor(this.score);
        document.getElementById('gtacity-money').textContent = '$' + Math.floor(this.money);
        document.getElementById('gtacity-hp').textContent = Math.floor(this.health);
        
        const weaponEl = document.getElementById('gtacity-weapon');
        if (weaponEl) {
            weaponEl.textContent = this.weapon.charAt(0).toUpperCase() + this.weapon.slice(1);
        }
        
        const wantedEl = document.getElementById('gtacity-wanted');
        if (wantedEl) {
            wantedEl.textContent = '★'.repeat(Math.floor(this.wantedLevel)) + '☆'.repeat(5 - Math.floor(this.wantedLevel));
        }
    }
    
    animate() {
        if (!this.running) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.updatePlayer();
        this.updateVehicles();
        this.updatePedestrians();
        this.updateBullets();
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
        this.updateHUD();
    }
    
    stop() {
        this.running = false;
        if (this.renderer) {
            this.renderer.dispose();
        }
        keys['w'] = false;
        keys['a'] = false;
        keys['s'] = false;
        keys['d'] = false;
    }
    
    setupControls() {
        document.onkeydown = (e) => {
            keys[e.key.toLowerCase()] = true;
            
            if (e.key === 'f' || e.key === 'F') {
                if (this.inVehicle) {
                    this.exitVehicle();
                } else {
                    this.tryEnterVehicle();
                }
            }
            
            if (e.key === 'e' || e.key === 'E') {
                this.shoot();
            }
            
            if (e.key === 'q' || e.key === 'Q') {
                const weapons = ['pistol', 'rifle', 'shotgun'];
                const currentIndex = weapons.indexOf(this.weapon);
                this.weapon = weapons[(currentIndex + 1) % weapons.length];
                this.updateHUD();
            }
        };
        
        document.onkeyup = (e) => keys[e.key.toLowerCase()] = false;
        
        document.onmousemove = (e) => {
            if (this.container === document.pointerLockElement) {
                this.mouseX += e.movementX * 0.002;
                this.mouseY += e.movementY * 0.002;
                this.mouseY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mouseY));
            }
        };
        
        this.container.addEventListener('click', () => {
            this.container.requestPointerLock();
        });
        
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    tryEnterVehicle() {
        const playerPos = this.player.position;
        
        for (const vehicle of this.vehicles) {
            const dist = playerPos.distanceTo(vehicle.mesh.position);
            if (dist < 15) {
                this.inVehicle = true;
                this.currentVehicle = vehicle;
                vehicle.occupied = true;
                this.player.visible = false;
                this.updateHUD();
                return;
            }
        }
    }
    
    exitVehicle() {
        if (this.currentVehicle) {
            this.player.position.copy(this.currentVehicle.mesh.position);
            this.player.position.x += 10;
            this.player.visible = true;
            this.currentVehicle.occupied = false;
            this.currentVehicle = null;
            this.inVehicle = false;
            this.updateHUD();
        }
    }
    
    shoot() {
        if (this.inVehicle && this.currentVehicle) {
            // Shooting from vehicle
            this.wantedLevel = Math.min(5, this.wantedLevel + 0.2);
        } else {
            // Create bullet
            const bulletGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
            
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(this.player.quaternion);
            
            bullet.position.copy(this.player.position);
            bullet.position.y += 7;
            bullet.position.add(direction.clone().multiplyScalar(3));
            
            this.scene.add(bullet);
            
            this.bullets.push({
                mesh: bullet,
                direction: direction,
                speed: 3,
                life: 100
            });
            
            this.wantedLevel = Math.min(5, this.wantedLevel + 0.1);
        }
        this.updateHUD();
    }
    
    updatePlayer() {
        const moveX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
        const moveZ = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
        
        if (moveX !== 0 || moveZ !== 0) {
            const angle = this.mouseX + Math.PI;
            this.player.rotation.y = angle;
            
            this.player.position.x += Math.sin(angle) * moveZ * this.playerSpeed + Math.cos(angle) * moveX * this.playerSpeed;
            this.player.position.z += Math.cos(angle) * moveZ * this.playerSpeed - Math.sin(angle) * moveX * this.playerSpeed;
        }
        
        // Keep player in bounds with larger world
        this.player.position.x = Math.max(-1800, Math.min(1800, this.player.position.x));
        this.player.position.z = Math.max(-1800, Math.min(1800, this.player.position.z));
    }
    
    updateVehicles() {
        for (const vehicle of this.vehicles) {
            if (vehicle.occupied) {
                // Driving with improved controls
                const moveX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
                const moveZ = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
                
                if (moveZ > 0) {
                    vehicle.speed = Math.min(vehicle.maxSpeed, vehicle.speed + vehicle.acceleration);
                } else if (moveZ < 0) {
                    vehicle.speed = Math.max(-vehicle.maxSpeed * 0.4, vehicle.speed - vehicle.acceleration);
                } else {
                    vehicle.speed *= 0.97;
                }
                
                // More responsive steering
                if (Math.abs(vehicle.speed) > 0.05 && moveX !== 0) {
                    vehicle.mesh.rotation.y += moveX * vehicle.turnSpeed * Math.sign(vehicle.speed) * (1 + Math.abs(vehicle.speed) * 0.5);
                }
                
                // Move in the direction the car is facing
                vehicle.mesh.position.x -= Math.sin(vehicle.mesh.rotation.y) * vehicle.speed;
                vehicle.mesh.position.z -= Math.cos(vehicle.mesh.rotation.y) * vehicle.speed;
                
                // Collect money while driving
                if (vehicle.speed > 1) {
                    this.money += 0.15;
                    this.score += 0.15;
                }
            } else {
                // AI driving with more realistic behavior
                vehicle.speed = Math.min(vehicle.maxSpeed * 0.6, vehicle.speed + 0.015);
                vehicle.mesh.position.x -= Math.sin(vehicle.mesh.rotation.y) * vehicle.speed;
                vehicle.mesh.position.z -= Math.cos(vehicle.mesh.rotation.y) * vehicle.speed;
            }
            
            // Wrap around with larger bounds
            if (vehicle.mesh.position.x > 2000) vehicle.mesh.position.x = -2000;
            if (vehicle.mesh.position.x < -2000) vehicle.mesh.position.x = 2000;
            if (vehicle.mesh.position.z > 2000) vehicle.mesh.position.z = -2000;
            if (vehicle.mesh.position.z < -2000) vehicle.mesh.position.z = 2000;
        }
    }
    
    updatePedestrians() {
        for (const ped of this.pedestrians) {
            if (!ped.alive) continue;
            
            ped.mesh.position.x += Math.sin(ped.direction) * ped.speed;
            ped.mesh.position.z += Math.cos(ped.direction) * ped.speed;
            
            // Change direction occasionally
            if (Math.random() < 0.01) {
                ped.direction += (Math.random() - 0.5) * Math.PI;
            }
            
            // Keep in bounds
            if (Math.abs(ped.mesh.position.x) > 900 || Math.abs(ped.mesh.position.z) > 900) {
                ped.direction += Math.PI;
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.mesh.position.add(bullet.direction.clone().multiplyScalar(bullet.speed));
            bullet.life--;
            
            // Check collision with pedestrians
            for (const ped of this.pedestrians) {
                if (ped.alive && bullet.mesh.position.distanceTo(ped.mesh.position) < 3) {
                    ped.alive = false;
                    this.scene.remove(ped.mesh);
                    this.score += 50;
                    this.wantedLevel = Math.min(5, this.wantedLevel + 0.5);
                    bullet.life = 0;
                    break;
                }
            }
            
            if (bullet.life <= 0) {
                this.scene.remove(bullet.mesh);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateCamera() {
        if (this.inVehicle && this.currentVehicle) {
            // Follow vehicle
            const vehicle = this.currentVehicle.mesh;
            const offset = new THREE.Vector3(0, 10, 20);
            offset.applyQuaternion(vehicle.quaternion);
            
            this.camera.position.lerp(vehicle.position.clone().add(offset), 0.1);
            this.camera.lookAt(vehicle.position);
        } else {
            // Follow player
            const playerPos = this.player.position.clone();
            playerPos.y += 10;
            
            const cameraOffset = new THREE.Vector3(
                Math.sin(this.mouseX) * 25 * Math.cos(this.mouseY),
                15 + Math.sin(this.mouseY) * 10,
                Math.cos(this.mouseX) * 25 * Math.cos(this.mouseY)
            );
            
            this.camera.position.lerp(playerPos.clone().add(cameraOffset), 0.1);
            this.camera.lookAt(playerPos);
        }
    }
    
    updateHUD() {
        document.getElementById('gtacity-score').textContent = Math.floor(this.score);
        document.getElementById('gtacity-money').textContent = '$' + Math.floor(this.money);
        document.getElementById('gtacity-hp').textContent = Math.floor(this.health);
        
        const weaponEl = document.getElementById('gtacity-weapon');
        if (weaponEl) {
            weaponEl.textContent = this.weapon.charAt(0).toUpperCase() + this.weapon.slice(1);
        }
        
        const wantedEl = document.getElementById('gtacity-wanted');
        if (wantedEl) {
            wantedEl.textContent = '★'.repeat(Math.floor(this.wantedLevel)) + '☆'.repeat(5 - Math.floor(this.wantedLevel));
        }
    }
    
    animate() {
        if (!this.running) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.updatePlayer();
        this.updateVehicles();
        this.updatePedestrians();
        this.updateBullets();
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
        this.updateHUD();
    }
    
    stop() {
        this.running = false;
        if (this.renderer) {
            this.renderer.dispose();
        }
        keys['w'] = false;
        keys['a'] = false;
        keys['s'] = false;
        keys['d'] = false;
    }
    
    setupControls() {
        document.onkeydown = (e) => {
            keys[e.key.toLowerCase()] = true;
            
            if (e.key === 'f' || e.key === 'F') {
                if (this.inVehicle) {
                    this.exitVehicle();
                } else {
                    this.tryEnterVehicle();
                }
            }
            
            if (e.key === 'e' || e.key === 'E') {
                this.shoot();
            }
            
            if (e.key === 'q' || e.key === 'Q') {
                const weapons = ['pistol', 'rifle', 'shotgun'];
                const currentIndex = weapons.indexOf(this.weapon);
                this.weapon = weapons[(currentIndex + 1) % weapons.length];
                this.updateHUD();
            }
        };
        
        document.onkeyup = (e) => keys[e.key.toLowerCase()] = false;
        
        document.onmousemove = (e) => {
            if (this.container === document.pointerLockElement) {
                this.mouseX += e.movementX * 0.002;
                this.mouseY += e.movementY * 0.002;
                this.mouseY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.mouseY));
            }
        };
        
        this.container.addEventListener('click', () => {
            this.container.requestPointerLock();
        });
        
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    tryEnterVehicle() {
        const playerPos = this.player.position;
        
        for (const vehicle of this.vehicles) {
            const dist = playerPos.distanceTo(vehicle.mesh.position);
            if (dist < 20) {
                this.inVehicle = true;
                this.currentVehicle = vehicle;
                vehicle.occupied = true;
                this.player.visible = false;
                this.updateHUD();
                return;
            }
        }
    }
    
    exitVehicle() {
        if (this.currentVehicle) {
            this.player.position.copy(this.currentVehicle.mesh.position);
            this.player.position.x += 12;
            this.player.visible = true;
            this.currentVehicle.occupied = false;
            this.currentVehicle = null;
            this.inVehicle = false;
            this.updateHUD();
        }
    }
    
    shoot() {
        if (this.inVehicle && this.currentVehicle) {
            this.wantedLevel = Math.min(5, this.wantedLevel + 0.2);
        } else {
            // Create bullet
            const bulletGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
            
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(this.player.quaternion);
            
            bullet.position.copy(this.player.position);
            bullet.position.y += 7;
            bullet.position.add(direction.clone().multiplyScalar(4));
            
            this.scene.add(bullet);
            
            this.bullets.push({
                mesh: bullet,
                direction: direction,
                speed: 4,
                life: 120
            });
            
            this.wantedLevel = Math.min(5, this.wantedLevel + 0.1);
        }
        this.updateHUD();
    }
    
    updatePlayer() {
        const moveX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
        const moveZ = (keys['s'] || keys['arrowdown'] ? 1 : 0) - (keys['w'] || keys['arrowup'] ? 1 : 0);
        
        if (moveX !== 0 || moveZ !== 0) {
            const angle = this.mouseX + Math.PI;
            this.player.rotation.y = angle;
            
            this.player.position.x += Math.sin(angle) * moveZ * this.playerSpeed + Math.cos(angle) * moveX * this.playerSpeed;
            this.player.position.z += Math.cos(angle) * moveZ * this.playerSpeed - Math.sin(angle) * moveX * this.playerSpeed;
        }
        
        this.player.position.x = Math.max(-1400, Math.min(1400, this.player.position.x));
        this.player.position.z = Math.max(-1400, Math.min(1400, this.player.position.z));
    }
    
    updateVehicles() {
        for (const vehicle of this.vehicles) {
            if (vehicle.occupied) {
                const moveX = (keys['d'] || keys['arrowright'] ? 1 : 0) - (keys['a'] || keys['arrowleft'] ? 1 : 0);
                const moveZ = (keys['w'] || keys['arrowup'] ? 1 : 0) - (keys['s'] || keys['arrowdown'] ? 1 : 0);
                
                if (moveZ > 0) {
                    vehicle.speed = Math.min(vehicle.maxSpeed, vehicle.speed + vehicle.acceleration);
                } else if (moveZ < 0) {
                    vehicle.speed = Math.max(-vehicle.maxSpeed * 0.3, vehicle.speed - vehicle.acceleration);
                } else {
                    vehicle.speed *= 0.98;
                }
                
                if (Math.abs(vehicle.speed) > 0.1 && moveX !== 0) {
                    vehicle.mesh.rotation.y += moveX * vehicle.turnSpeed * Math.sign(vehicle.speed);
                }
                
                vehicle.mesh.position.x -= Math.sin(vehicle.mesh.rotation.y) * vehicle.speed;
                vehicle.mesh.position.z -= Math.cos(vehicle.mesh.rotation.y) * vehicle.speed;
                
                if (vehicle.speed > 1) {
                    this.money += 0.15;
                    this.score += 0.15;
                }
            } else {
                vehicle.speed = Math.min(vehicle.maxSpeed * 0.5, vehicle.speed + 0.02);
                vehicle.mesh.position.x -= Math.sin(vehicle.mesh.rotation.y) * vehicle.speed;
                vehicle.mesh.position.z -= Math.cos(vehicle.mesh.rotation.y) * vehicle.speed;
            }
            
            if (vehicle.mesh.position.x > 1500) vehicle.mesh.position.x = -1500;
            if (vehicle.mesh.position.x < -1500) vehicle.mesh.position.x = 1500;
            if (vehicle.mesh.position.z > 1500) vehicle.mesh.position.z = -1500;
            if (vehicle.mesh.position.z < -1500) vehicle.mesh.position.z = 1500;
        }
    }
    
    updatePedestrians() {
        for (const ped of this.pedestrians) {
            if (!ped.alive) continue;
            
            ped.mesh.position.x += Math.sin(ped.direction) * ped.speed;
            ped.mesh.position.z += Math.cos(ped.direction) * ped.speed;
            
            if (Math.random() < 0.01) {
                ped.direction += (Math.random() - 0.5) * Math.PI;
            }
            
            if (Math.abs(ped.mesh.position.x) > 1400 || Math.abs(ped.mesh.position.z) > 1400) {
                ped.direction += Math.PI;
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.mesh.position.add(bullet.direction.clone().multiplyScalar(bullet.speed));
            bullet.life--;
            
            for (const ped of this.pedestrians) {
                if (ped.alive && bullet.mesh.position.distanceTo(ped.mesh.position) < 4) {
                    ped.alive = false;
                    this.scene.remove(ped.mesh);
                    this.score += 50;
                    this.wantedLevel = Math.min(5, this.wantedLevel + 0.5);
                    bullet.life = 0;
                    break;
                }
            }
            
            if (bullet.life <= 0) {
                this.scene.remove(bullet.mesh);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateCamera() {
        if (this.inVehicle && this.currentVehicle) {
            const vehicle = this.currentVehicle.mesh;
            const offset = new THREE.Vector3(0, 12, 25);
            offset.applyQuaternion(vehicle.quaternion);
            
            this.camera.position.lerp(vehicle.position.clone().add(offset), 0.08);
            this.camera.lookAt(vehicle.position);
        } else {
            const playerPos = this.player.position.clone();
            playerPos.y += 12;
            
            const cameraOffset = new THREE.Vector3(
                Math.sin(this.mouseX) * 30 * Math.cos(this.mouseY),
                18 + Math.sin(this.mouseY) * 15,
                Math.cos(this.mouseX) * 30 * Math.cos(this.mouseY)
            );
            
            this.camera.position.lerp(playerPos.clone().add(cameraOffset), 0.1);
            this.camera.lookAt(playerPos);
        }
    }
    
    updateHUD() {
        document.getElementById('gtacity-score').textContent = Math.floor(this.score);
        document.getElementById('gtacity-money').textContent = '$' + Math.floor(this.money);
        document.getElementById('gtacity-hp').textContent = Math.floor(this.health);
        
        const weaponEl = document.getElementById('gtacity-weapon');
        if (weaponEl) {
            weaponEl.textContent = this.weapon.charAt(0).toUpperCase() + this.weapon.slice(1);
        }
        
        const wantedEl = document.getElementById('gtacity-wanted');
        if (wantedEl) {
            wantedEl.textContent = '★'.repeat(Math.floor(this.wantedLevel)) + '☆'.repeat(5 - Math.floor(this.wantedLevel));
        }
    }
    
    animate() {
        if (!this.running) return;
        
        requestAnimationFrame(() => this.animate());
        
        this.updatePlayer();
        this.updateVehicles();
        this.updatePedestrians();
        this.updateBullets();
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
        this.updateHUD();
    }
}

// =====================================================
// DUCK HUNT x MARIO - Pixel Art Platformer Shooter
// =====================================================

let duckhuntmarioGame = null;

function startDuckHuntMarioGame() {
    incrementPlayCount('duckhuntmario');
    state.scores.duckhuntmario = 0;
    state.gameActive = true;
    state.paused = false;
    
    const canvas = document.getElementById('duckhuntmario-game');
    
    // Ensure canvas is visible
    if (canvas) {
        canvas.style.display = 'block';
        canvas.style.visibility = 'visible';
    }
    
    // Wait a brief moment for DOM to be ready
    setTimeout(() => {
        if (canvas && canvas.getContext) {
            duckhuntmarioGame = new DuckHuntMarioGame(canvas);
            state.currentGame = duckhuntmarioGame;
        } else {
            console.error('Canvas not found or context not available');
        }
    }, 50);
}

class DuckHuntMarioGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Get actual canvas dimensions
        const rect = canvas.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width : 800;
        const height = rect.height > 0 ? rect.height : 500;
        
        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Verify context is valid
        if (!this.ctx) {
            console.error('Failed to get canvas context');
            return;
        }
        
        // Game state
        this.score = 0;
        this.lives = 3;
        this.round = 1;
        this.ducksRemaining = 10;
        this.ducksShot = 0;
        this.running = true;
        this.paused = false;
        
        // Player (Mario-style)
        this.player = {
            x: 100,
            y: height - 120,
            width: 32,
            height: 48,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 12,
            grounded: false,
            facing: 1 // 1 = right, -1 = left
        };
        
        // Physics
        this.gravity = 0.5;
        this.friction = 0.8;
        
        // Platforms
        this.platforms = [];
        this.createPlatforms();
        
        // Ducks
        this.ducks = [];
        this.spawnDuck();
        
        // Floating elements
        this.pipes = [];
        this.coinBlocks = [];
        this.clouds = [];
        this.createEnvironment();
        
        // Bullets
        this.bullets = [];
        this.bulletSpeed = 15;
        
        // Coins
        this.coins = [];
        
        // Particles
        this.particles = [];
        
        // Input
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Animation
        this.frameCount = 0;
        this.animationFrame = 0;
        
        // Setup
        this.setupInput();
        this.update();
    }
    
    createPlatforms() {
        // Ground
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 40,
            width: this.canvas.width,
            height: 40,
            type: 'ground'
        });
        
        // Floating platforms
        const platformData = [
            { x: 200, y: 420, width: 120, height: 24 },
            { x: 400, y: 350, width: 120, height: 24 },
            { x: 600, y: 280, width: 120, height: 24 },
            { x: 150, y: 250, width: 100, height: 24 },
            { x: 500, y: 180, width: 150, height: 24 },
            { x: 750, y: 380, width: 100, height: 24 },
            { x: 50, y: 380, width: 80, height: 24 }
        ];
        
        platformData.forEach(p => {
            this.platforms.push({
                ...p,
                type: 'brick'
            });
        });
    }
    
    createEnvironment() {
        // Green pipes
        this.pipes = [
            { x: 680, y: this.canvas.height - 140, width: 50, height: 100 },
            { x: 320, y: this.canvas.height - 100, width: 45, height: 60 },
            { x: 100, y: this.canvas.height - 120, width: 45, height: 80 }
        ];
        
        // Coin blocks
        this.coinBlocks = [
            { x: 280, y: 370, width: 32, height: 32, coins: 5, hit: false },
            { x: 520, y: 230, width: 32, height: 32, coins: 5, hit: false },
            { x: 600, y: 230, width: 32, height: 32, coins: 3, hit: false }
        ];
        
        // Clouds
        for (let i = 0; i < 8; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 30 + Math.random() * 80,
                width: 60 + Math.random() * 40,
                speed: 0.2 + Math.random() * 0.3
            });
        }
    }
    
    spawnDuck() {
        if (this.ducks.length < 3 && this.ducksRemaining > 0) {
            this.ducks.push({
                x: Math.random() > 0.5 ? -50 : this.canvas.width + 50,
                y: 100 + Math.random() * 150,
                width: 48,
                height: 40,
                velocityX: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2),
                velocityY: (Math.random() - 0.5) * 3,
                speed: 3 + Math.random() * 2,
                direction: 1,
                wingFrame: 0,
                alive: true,
                escapeTimer: 0,
                zigzagTimer: 0
            });
        }
    }
    
    setupInput() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ') e.preventDefault();
            if (e.key === 'escape' && this.running) {
                this.paused = !this.paused;
                if (this.paused) pauseGame();
                else resumeGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse aiming
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        // Mouse shooting
        this.canvas.addEventListener('click', (e) => {
            if (this.running && !this.paused) {
                this.shoot();
            }
        });
    }
    
    shoot() {
        // Create bullet from player center to mouse position
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        
        const angle = Math.atan2(this.mouseY - playerCenterY, this.mouseX - playerCenterX);
        
        this.bullets.push({
            x: playerCenterX,
            y: playerCenterY,
            velocityX: Math.cos(angle) * this.bulletSpeed,
            velocityY: Math.sin(angle) * this.bulletSpeed,
            radius: 4
        });
        
        // Muzzle flash particles
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: playerCenterX,
                y: playerCenterY,
                velocityX: Math.cos(angle) * (5 + Math.random() * 5),
                velocityY: Math.sin(angle) * (5 + Math.random() * 5),
                life: 10,
                maxLife: 10,
                color: '#ffcc00',
                size: 3 + Math.random() * 3
            });
        }
    }
    
    update() {
        if (!this.running || this.paused) return;
        
        this.frameCount++;
        this.animationFrame = Math.floor(this.frameCount / 8) % 4;
        
        this.updatePlayer();
        this.updateDucks();
        this.updateBullets();
        this.updateCoins();
        this.updateParticles();
        this.updateEnvironment();
        this.checkCollisions();
        this.updateHUD();
        
        // Spawn more ducks
        if (Math.random() < 0.01 && this.ducks.length < 2) {
            this.spawnDuck();
        }
        
        // Check round end
        if (this.ducksRemaining <= 0 && this.ducks.length === 0) {
            this.nextRound();
        }
        
        this.draw();
        
        requestAnimationFrame(() => this.update());
    }
    
    updatePlayer() {
        // Horizontal movement
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.velocityX = -this.player.speed;
            this.player.facing = -1;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.player.velocityX = this.player.speed;
            this.player.facing = 1;
        } else {
            this.player.velocityX *= this.friction;
        }
        
        // Jumping
        if ((this.keys['w'] || this.keys['arrowup'] || this.keys[' ']) && this.player.grounded) {
            this.player.velocityY = -this.player.jumpPower;
            this.player.grounded = false;
        }
        
        // Apply gravity
        this.player.velocityY += this.gravity;
        
        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Keep in bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        
        // Platform collision
        this.player.grounded = false;
        for (const platform of this.platforms) {
            if (this.checkPlatformCollision(platform)) {
                if (this.player.velocityY > 0) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.grounded = true;
                }
            }
        }
        
        // Pipe collision
        for (const pipe of this.pipes) {
            if (this.checkRectCollision(this.player, pipe)) {
                this.handlePipeCollision(pipe);
            }
        }
        
        // Fall off screen
        if (this.player.y > this.canvas.height) {
            this.player.y = this.canvas.height - 100;
            this.player.x = 100;
            this.player.velocityY = 0;
        }
    }
    
    checkPlatformCollision(platform) {
        return this.player.x < platform.x + platform.width &&
               this.player.x + this.player.width > platform.x &&
               this.player.y + this.player.height > platform.y &&
               this.player.y + this.player.height < platform.y + platform.height + 20 &&
               this.player.velocityY >= 0;
    }
    
    checkRectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    handlePipeCollision(pipe) {
        const overlapLeft = (this.player.x + this.player.width) - pipe.x;
        const overlapRight = (pipe.x + pipe.width) - this.player.x;
        const overlapTop = (this.player.y + this.player.height) - pipe.y;
        
        if (overlapLeft < overlapRight && overlapLeft < overlapTop) {
            this.player.x = pipe.x - this.player.width;
        } else if (overlapRight < overlapTop) {
            this.player.x = pipe.x + pipe.width;
        } else if (overlapTop < 20) {
            this.player.y = pipe.y - this.player.height;
            this.player.velocityY = 0;
            this.player.grounded = true;
        }
    }
    
    updateDucks() {
        for (let i = this.ducks.length - 1; i >= 0; i--) {
            const duck = this.ducks[i];
            
            if (!duck.alive) {
                this.ducks.splice(i, 1);
                continue;
            }
            
            // Zigzag movement
            duck.zigzagTimer++;
            if (duck.zigzagTimer > 30) {
                duck.velocityY = (Math.random() - 0.5) * 6;
                duck.zigzagTimer = 0;
            }
            
            // Update position
            duck.x += duck.velocityX;
            duck.y += duck.velocityY;
            
            // Bounce off walls
            if (duck.x < 0 || duck.x > this.canvas.width - duck.width) {
                duck.velocityX *= -1;
            }
            
            // Bounce off top/bottom
            if (duck.y < 50) {
                duck.velocityY = Math.abs(duck.velocityY);
            }
            if (duck.y > this.canvas.height - 100) {
                duck.velocityY = -Math.abs(duck.velocityY);
            }
            
            // Wing animation
            duck.wingFrame = Math.floor(this.frameCount / 5) % 2;
            
            // Escape timer
            duck.escapeTimer++;
            if (duck.escapeTimer > 300) {
                // Duck escapes
                this.ducks.splice(i, 1);
                this.ducksRemaining--;
                this.createDuckEscapeEffect(duck.x, duck.y);
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;
            
            // Check if off screen
            if (bullet.x < 0 || bullet.x > this.canvas.width ||
                bullet.y < 0 || bullet.y > this.canvas.height) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check duck collision
            for (const duck of this.ducks) {
                if (duck.alive &&
                    bullet.x > duck.x && bullet.x < duck.x + duck.width &&
                    bullet.y > duck.y && bullet.y < duck.y + duck.height) {
                    
                    duck.alive = false;
                    this.bullets.splice(i, 1);
                    this.score += 100 * this.round;
                    this.ducksShot++;
                    this.ducksRemaining--;
                    this.createDuckHitEffect(duck.x, duck.y);
                    this.spawnCoins(duck.x, duck.y);
                    break;
                }
            }
            
            // Check coin block collision
            for (const block of this.coinBlocks) {
                if (!block.hit &&
                    bullet.x > block.x && bullet.x < block.x + block.width &&
                    bullet.y > block.y && bullet.y < block.y + block.height) {
                    
                    this.hitCoinBlock(block);
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    updateCoins() {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            
            coin.y += coin.velocityY;
            coin.velocityY += 0.2;
            coin.rotation += 0.1;
            coin.life--;
            
            // Check player collision
            if (this.checkRectCollision(this.player, coin)) {
                this.score += 50;
                this.coins.splice(i, 1);
                continue;
            }
            
            if (coin.life <= 0 || coin.y > this.canvas.height) {
                this.coins.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.life--;
            p.velocityX *= 0.95;
            p.velocityY *= 0.95;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateEnvironment() {
        // Move clouds
        for (const cloud of this.clouds) {
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + cloud.width) {
                cloud.x = -cloud.width;
            }
        }
    }
    
    checkCollisions() {
        // Coin block collision with player (from below)
        for (const block of this.coinBlocks) {
            if (!block.hit &&
                this.player.x + this.player.width > block.x &&
                this.player.x < block.x + block.width &&
                this.player.y - this.player.velocityY >= block.y + block.height &&
                this.player.y < block.y + block.height + 10 &&
                this.player.velocityY < 0) {
                
                this.hitCoinBlock(block);
            }
        }
    }
    
    hitCoinBlock(block) {
        block.hit = true;
        this.score += 200;
        
        // Spawn coins
        for (let i = 0; i < Math.min(block.coins, 5); i++) {
            setTimeout(() => {
                this.coins.push({
                    x: block.x + block.width / 2 - 8,
                    y: block.y - 10,
                    width: 16,
                    height: 16,
                    velocityY: -8 - i * 2,
                    rotation: 0,
                    life: 120
                });
            }, i * 100);
        }
    }
    
    spawnCoins(x, y) {
        for (let i = 0; i < 3; i++) {
            this.coins.push({
                x: x + Math.random() * 30,
                y: y + Math.random() * 20,
                width: 16,
                height: 16,
                velocityY: -5 - Math.random() * 5,
                velocityX: (Math.random() - 0.5) * 4,
                rotation: 0,
                life: 150
            });
        }
    }
    
    createDuckHitEffect(x, y) {
        // Feathers explosion
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x + 24,
                y: y + 20,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10 - 3,
                life: 30,
                maxLife: 30,
                color: Math.random() > 0.5 ? '#8B4513' : '#006400',
                size: 4 + Math.random() * 4
            });
        }
    }
    
    createDuckEscapeEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x + 24,
                y: y + 20,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: -2 - Math.random() * 3,
                life: 20,
                maxLife: 20,
                color: '#ffa500',
                size: 3 + Math.random() * 3
            });
        }
    }
    
    nextRound() {
        this.round++;
        this.ducksRemaining = 10 + this.round * 5;
        this.lives = Math.max(1, 3 - Math.floor((this.round - 1) / 3));
        this.createRoundEffect();
    }
    
    createRoundEffect() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: (Math.random() - 0.5) * 2,
                life: 60,
                maxLife: 60,
                color: '#ffcc00',
                size: 6 + Math.random() * 6
            });
        }
    }
    
    updateHUD() {
        document.getElementById('duckhuntmario-score').textContent = this.score;
        document.getElementById('duckhuntmario-round').textContent = this.round;
        document.getElementById('duckhuntmario-ducks').textContent = `${this.ducksShot}/${10 + (this.round - 1) * 5}`;
        document.getElementById('duckhuntmario-lives').textContent = '🍄'.repeat(this.lives);
    }
    
    draw() {
        const ctx = this.ctx;
        
        // Sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        skyGradient.addColorStop(0, '#5c94fc');
        skyGradient.addColorStop(1, '#87ceeb');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw background hills
        this.drawHills();
        
        // Draw platforms
        this.drawPlatforms();
        
        // Draw pipes
        this.drawPipes();
        
        // Draw coin blocks
        this.drawCoinBlocks();
        
        // Draw coins
        this.drawCoins();
        
        // Draw ducks
        this.drawDucks();
        
        // Draw player (Mario-style)
        this.drawPlayer();
        
        // Draw bullets
        this.drawBullets();
        
        // Draw particles
        this.drawParticles();
        
        // Draw crosshair
        this.drawCrosshair();
    }
    
    drawClouds() {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        
        for (const cloud of this.clouds) {
            // Cloud shape
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.width * 0.3, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width * 0.25, cloud.y - 10, cloud.width * 0.25, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawHills() {
        const ctx = this.ctx;
        
        // Background hills
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height - 40);
        
        for (let x = 0; x <= this.canvas.width; x += 50) {
            const height = 60 + Math.sin(x * 0.02 + this.frameCount * 0.005) * 30;
            ctx.lineTo(x, this.canvas.height - 40 - height);
        }
        
        ctx.lineTo(this.canvas.width, this.canvas.height - 40);
        ctx.fill();
        
        // Foreground hills
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height - 40);
        
        for (let x = 0; x <= this.canvas.width; x += 80) {
            const height = 40 + Math.sin(x * 0.03 - this.frameCount * 0.003) * 20;
            ctx.lineTo(x, this.canvas.height - 40 - height);
        }
        
        ctx.lineTo(this.canvas.width, this.canvas.height - 40);
        ctx.fill();
    }
    
    drawPlatforms() {
        const ctx = this.ctx;
        
        for (const platform of this.platforms) {
            if (platform.type === 'ground') {
                // Ground with grass
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                
                // Grass top
                ctx.fillStyle = '#228B22';
                ctx.fillRect(platform.x, platform.y, platform.width, 8);
                
                // Grass detail
                ctx.fillStyle = '#32CD32';
                for (let x = platform.x; x < platform.x + platform.width; x += 16) {
                    ctx.fillRect(x, platform.y, 8, 4);
                }
            } else {
                // Brick platform
                ctx.fillStyle = '#CD853F';
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                
                // Brick pattern
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                
                const brickWidth = platform.width / 4;
                const brickHeight = platform.height / 2;
                
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 4; col++) {
                        const offsetX = row % 2 === 0 ? 0 : brickWidth / 2;
                        ctx.strokeRect(
                            platform.x + col * brickWidth + offsetX,
                            platform.y + row * brickHeight,
                            brickWidth,
                            brickHeight
                        );
                    }
                }
            }
        }
    }
    
    drawPipes() {
        const ctx = this.ctx;
        
        for (const pipe of this.pipes) {
            // Pipe body
            ctx.fillStyle = '#228B22';
            ctx.fillRect(pipe.x, pipe.y + 20, pipe.width, pipe.height - 20);
            
            // Pipe top
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(pipe.x - 5, pipe.y, pipe.width + 10, 25);
            
            // Pipe highlight
            ctx.fillStyle = '#90EE90';
            ctx.fillRect(pipe.x + 5, pipe.y + 3, 8, 18);
            ctx.fillRect(pipe.x + 8, pipe.y + 25, 5, pipe.height - 30);
            
            // Pipe outline
            ctx.strokeStyle = '#006400';
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x - 5, pipe.y, pipe.width + 10, 25);
            ctx.strokeRect(pipe.x, pipe.y + 20, pipe.width, pipe.height - 20);
        }
    }
    
    drawCoinBlocks() {
        const ctx = this.ctx;
        
        for (const block of this.coinBlocks) {
            // Block body
            ctx.fillStyle = block.hit ? '#8B4513' : '#FFD700';
            ctx.fillRect(block.x, block.y, block.width, block.height);
            
            // Block border
            ctx.strokeStyle = block.hit ? '#654321' : '#B8860B';
            ctx.lineWidth = 3;
            ctx.strokeRect(block.x + 1, block.y + 1, block.width - 2, block.height - 2);
            
            // Question mark or coin slot
            if (!block.hit) {
                ctx.fillStyle = '#B8860B';
                ctx.font = 'bold 20px pixel, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('?', block.x + block.width / 2, block.y + 24);
            } else {
                ctx.fillStyle = '#654321';
                ctx.font = 'bold 16px pixel, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('$', block.x + block.width / 2, block.y + 22);
            }
        }
    }
    
    drawCoins() {
        const ctx = this.ctx;
        
        for (const coin of this.coins) {
            ctx.save();
            ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
            ctx.rotate(coin.rotation);
            
            // Coin
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.ellipse(0, 0, coin.width / 2, coin.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Coin shine
            ctx.fillStyle = '#FFEC8B';
            ctx.beginPath();
            ctx.ellipse(-2, -2, coin.width / 4, coin.height / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    drawDucks() {
        const ctx = this.ctx;
        
        for (const duck of this.ducks) {
            if (!duck.alive) continue;
            
            const direction = duck.velocityX > 0 ? 1 : -1;
            
            ctx.save();
            ctx.translate(duck.x + duck.width / 2, duck.y + duck.height / 2);
            ctx.scale(direction, 1);
            
            // Duck body
            ctx.fillStyle = '#228B22';
            ctx.beginPath();
            ctx.ellipse(0, 5, 20, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Duck head
            ctx.fillStyle = '#32CD32';
            ctx.beginPath();
            ctx.arc(15, -5, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Duck beak
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(22, -5);
            ctx.lineTo(32, -3);
            ctx.lineTo(22, 0);
            ctx.fill();
            
            // Duck eye
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(18, -8, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(19, -9, 1, 0, Math.PI * 2);
            ctx.fill();
            
            // Duck wings
            ctx.fillStyle = '#006400';
            const wingY = duck.wingFrame === 0 ? -5 : -15;
            ctx.beginPath();
            ctx.ellipse(-5, wingY, 12, 8, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    drawPlayer() {
        const ctx = this.ctx;
        const p = this.player;
        const dir = p.facing;
        
        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.scale(dir, 1);
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, p.height / 2 - 2, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body (red shirt)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-10, -4, 20, 16);
        
        // Overalls (blue)
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(-10, 8, 20, 12);
        
        // Overalls straps
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(-10, -2, 4, 10);
        ctx.fillRect(6, -2, 4, 10);
        
        // Buttons
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(-8, 2, 2, 0, Math.PI * 2);
        ctx.arc(8, 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Head (skin)
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(0, -14, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, -18, 10, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Hat
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-14, -26, 28, 6);
        ctx.fillRect(-10, -32, 20, 8);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(4, -16, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#FFA07A';
        ctx.beginPath();
        ctx.arc(6, -12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Arms
        ctx.fillStyle = '#FFDBAC';
        const armOffset = Math.sin(this.frameCount * 0.2) * 3;
        ctx.fillRect(-14, 0, 6, 12 + armOffset);
        ctx.fillRect(8, 0, 6, 12 - armOffset);
        
        // Hands
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(-11, 12 + armOffset, 4, 0, Math.PI * 2);
        ctx.arc(11, 12 - armOffset, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.fillStyle = '#0000FF';
        const legOffset = !p.grounded ? 0 : Math.sin(this.frameCount * 0.3) * 3;
        ctx.fillRect(-8, 18, 6, 10 + legOffset);
        ctx.fillRect(2, 18, 6, 10 - legOffset);
        
        // Shoes
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-10, 26 + legOffset, 10, 6);
        ctx.fillRect(0, 26 - legOffset, 10, 6);
        
        ctx.restore();
    }
    
    drawBullets() {
        const ctx = this.ctx;
        
        ctx.fillStyle = '#FFFF00';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        
        for (const bullet of this.bullets) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    
    drawParticles() {
        const ctx = this.ctx;
        
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawCrosshair() {
        const ctx = this.ctx;
        
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        
        // Crosshair
        const size = 15;
        const gap = 5;
        
        ctx.beginPath();
        // Horizontal lines
        ctx.moveTo(this.mouseX - size, this.mouseY);
        ctx.lineTo(this.mouseX - gap, this.mouseY);
        ctx.moveTo(this.mouseX + gap, this.mouseY);
        ctx.lineTo(this.mouseX + size, this.mouseY);
        // Vertical lines
        ctx.moveTo(this.mouseX, this.mouseY - size);
        ctx.lineTo(this.mouseX, this.mouseY - gap);
        ctx.moveTo(this.mouseX, this.mouseY + gap);
        ctx.lineTo(this.mouseX, this.mouseY + size);
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.mouseX, this.mouseY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(this.mouseX, this.mouseY, size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.stroke();
    }
    
    pause() {
        this.paused = true;
    }
    
    resume() {
        this.paused = false;
        this.update();
    }
    
    gameOver() {
        this.running = false;
        
        if (this.score > state.highScores.duckhuntmario) {
            state.highScores.duckhuntmario = this.score;
            localStorage.setItem('duckhuntmarioHighScore', this.score);
            updateStatsDisplay();
        }
        
        showGameOver(this.score, 'GAME OVER');
    }
    
    stop() {
        this.running = false;
    }
}

// =====================================================
// SPIDER-MAN 2D GAME - Story Narrated Platformer
// =====================================================

let spiderManGame = null;

function startSpiderManGame() {
    incrementPlayCount('spiderman');
    state.scores.spiderman = 0;
    state.gameActive = true;
    state.paused = false;

    const container = document.getElementById('spiderman-game');
    container.innerHTML = '';

    spiderManGame = new SpiderManGame(container);
    state.currentGame = spiderManGame;
}

class SpiderManGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 900;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.chapter = 1;
        this.frameCount = 0;
        this.running = true;
        this.paused = false;
        this.gameOver = false;
        this.victory = false;

        // Story elements
        this.storyIndex = 0;
        this.storyText = '';
        this.showingStory = true;
        this.storyTimer = 0;
        this.storyComplete = false;

        // Story chapters
        this.chapters = [
            {
                title: "Chapter 1: The Origin",
                text: "It started with a bite. Peter Parker was just a high school student when a radioactive spider changed everything. Uncle Ben taught him that with great power comes great responsibility. Now, Spider-Man protects New York City from those who would do it harm.",
                duration: 5000
            },
            {
                title: "Chapter 2: Green Goblin's Threat",
                text: "Norman Osborn, his father's old business partner, has gone mad with power. As the Green Goblin, he threatens to destroy everything Peter holds dear. The city needs its web-slinging hero now more than ever.",
                duration: 5000
            },
            {
                title: "Chapter 3: Final Battle",
                text: "This is it. The showdown between Spider-Man and the Green Goblin. Across the rooftops of Manhattan, the final battle begins. Swing fast, web-slinger. The city is counting on you.",
                duration: 5000
            }
        ];

        // Player
        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 50,
            vx: 0,
            vy: 0,
            speed: 6,
            jumpPower: 14,
            grounded: false,
            swinging: false,
            webPoint: null,
            webLength: 0,
            facing: 1,
            animFrame: 0,
            health: 100,
            jumpHeld: false,
            wallClinging: false
        };

        // Camera
        this.camera = { x: 0, y: 0 };

        // Input
        this.keys = {};
        this.mousePos = { x: 0, y: 0 };
        this.mouseClicked = false;

        // World
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.webProjectiles = [];
        this.particles = [];
        this.buildings = [];
        this.clouds = [];

        // Level data
        this.levelLength = 4000;
        this.levelProgress = 0;
        this.bossSpawned = false;
        this.boss = null;

        // UI
        this.setupEventListeners();
        this.initLevel();
        this.startStory();

        // Start game loop
        this.lastTime = Date.now();
        this.update();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();
            
            // Dismiss story with SPACE or Enter
            if (this.showingStory && (e.key === ' ' || e.key === 'Enter')) {
                this.skipStory();
                return;
            }
            
            if (e.key === 'Escape' && !this.showingStory && !this.storyComplete) {
                this.paused = !this.paused;
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
            // Dismiss story on click
            if (this.showingStory) {
                this.skipStory();
                return;
            }
            
            if (!this.paused && !this.gameOver && !this.victory) {
                this.shootWeb();
            }
        });
    }

    skipStory() {
        // Immediately advance to next chapter or start game
        this.storyTimer = this.chapters[this.storyIndex].duration;
    }

    startStory() {
        this.showingStory = true;
        this.storyTimer = 0;
        this.storyIndex = 0;
        this.storyText = this.chapters[0].text;
    }

    initLevel() {
        // Generate platforms
        this.platforms = [];
        this.buildings = [];
        this.clouds = [];

        // Ground platforms at different heights
        for (let x = 0; x < this.levelLength; x += 200) {
            const height = 50 + Math.random() * 100;
            const width = 150 + Math.random() * 100;

            this.platforms.push({
                x: x,
                y: 400 - height,
                width: width,
                height: 20,
                type: 'building'
            });

            // Building details
            this.buildings.push({
                x: x,
                y: 400 - height,
                width: width,
                height: height + 100,
                windows: Math.floor(width / 30)
            });
        }

        // Floating platforms for web-swinging
        for (let x = 300; x < this.levelLength - 500; x += 400) {
            this.platforms.push({
                x: x,
                y: 100 + Math.random() * 150,
                width: 80 + Math.random() * 60,
                height: 20,
                type: 'floating'
            });
        }

        // Enemies
        this.enemies = [];
        for (let x = 500; x < this.levelLength - 800; x += 350) {
            if (Math.random() > 0.3) {
                this.enemies.push({
                    x: x,
                    y: 350,
                    width: 45,
                    height: 50,
                    vx: -1.5,
                    type: 'thug',
                    health: 2,
                    frame: 0
                });
            }
        }

        // Collectibles - Spider Tokens
        this.collectibles = [];
        for (let x = 200; x < this.levelLength; x += 250) {
            const py = 150 + Math.random() * 200;
            this.collectibles.push({
                x: x,
                y: py,
                width: 25,
                height: 25,
                collected: false,
                frame: 0
            });
        }

        // Clouds
        for (let x = 0; x < this.levelLength; x += 300) {
            this.clouds.push({
                x: x,
                y: 30 + Math.random() * 80,
                width: 80 + Math.random() * 60,
                speed: 0.2 + Math.random() * 0.3
            });
        }

        // Final boss platform
        this.platforms.push({
            x: this.levelLength - 300,
            y: 350,
            width: 200,
            height: 30,
            type: 'boss'
        });
    }

    shootWeb() {
        const dx = this.mousePos.x + this.camera.x - (this.player.x + this.player.width / 2);
        const dy = this.mousePos.y + this.camera.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.webProjectiles.push({
            x: this.player.x + this.player.width / 2,
            y: this.player.y + 15,
            vx: (dx / dist) * 15,
            vy: (dy / dist) * 15,
            active: true
        });

        // Web impact effect
        this.particles.push({
            x: this.mousePos.x + this.camera.x,
            y: this.mousePos.y + this.camera.y,
            vx: 0,
            vy: 0,
            life: 20,
            maxLife: 20,
            color: '#FFFFFF',
            size: 3
        });
    }

    attachWeb() {
        // Find closest attach point above
        let closestPoint = null;
        let closestDist = 300;

        for (const platform of this.platforms) {
            if (platform.y < this.player.y) {
                const dx = platform.x + platform.width / 2 - (this.player.x + this.player.width / 2);
                const dy = platform.y - this.player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < closestDist && Math.abs(dx) < 200) {
                    closestDist = dist;
                    closestPoint = { x: platform.x + platform.width / 2, y: platform.y };
                }
            }
        }

        if (closestPoint && !this.player.grounded) {
            this.player.swinging = true;
            this.player.webPoint = closestPoint;
            this.player.webLength = closestDist;
        }
    }

    update() {
        if (!this.running) return;

        const now = Date.now();
        const dt = Math.min((now - this.lastTime) / 16.67, 2);
        this.lastTime = now;

        if (this.paused || this.gameOver || this.victory) {
            requestAnimationFrame(() => this.update());
            return;
        }

        this.frameCount++;

        if (this.showingStory) {
            this.updateStory(dt);
        } else {
            this.updateGame(dt);
        }

        this.render();

        requestAnimationFrame(() => this.update());
    }

    updateStory(dt) {
        this.storyTimer += dt;

        if (this.storyTimer > this.chapters[this.storyIndex].duration) {
            this.storyTimer = 0;
            this.storyIndex++;

            if (this.storyIndex >= this.chapters.length) {
                this.showingStory = false;
                this.storyComplete = true;
            } else {
                this.storyText = this.chapters[this.storyIndex].text;
            }
        }
    }

    updateGame(dt) {
        // Player movement - IMPROVED CONTROLS
        const moveSpeed = this.player.speed;
        const airControl = 0.6; // Less control in air

        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.vx = this.player.grounded ? -moveSpeed : this.player.vx - 0.5 * dt;
            this.player.vx = Math.max(this.player.vx, -moveSpeed * (this.player.grounded ? 1 : airControl));
            this.player.facing = -1;
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.player.vx = this.player.grounded ? moveSpeed : this.player.vx + 0.5 * dt;
            this.player.vx = Math.min(this.player.vx, moveSpeed * (this.player.grounded ? 1 : airControl));
            this.player.facing = 1;
        } else {
            // Friction
            if (this.player.grounded) {
                this.player.vx *= 0.85;
            } else {
                this.player.vx *= 0.95; // Less friction in air
            }
        }

        // Improved Jump - variable height based on hold time
        const jumpPressed = this.keys[' '] || this.keys['w'] || this.keys['arrowup'];
        const canJump = this.player.grounded || this.player.wallClinging;

        if (jumpPressed && canJump && !this.player.jumpHeld) {
            this.player.vy = -this.player.jumpPower;
            this.player.grounded = false;
            this.player.swinging = false;
            this.player.wallClinging = false;
            this.player.jumpHeld = true;

            // Jump particles
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: this.player.x + this.player.width / 2,
                    y: this.player.y + this.player.height,
                    vx: (Math.random() - 0.5) * 3,
                    vy: Math.random() * 2,
                    life: 15,
                    maxLife: 15,
                    color: '#FFFFFF',
                    size: 3
                });
            }
        }

        if (!jumpPressed) {
            this.player.jumpHeld = false;
            // Variable jump height - release early for shorter jump
            if (this.player.vy < -3) {
                this.player.vy = -3;
            }
        }

        // Swing web - IMPROVED
        if (this.keys['mousedown'] || this.keys['e']) {
            if (!this.player.swinging && !this.player.grounded) {
                this.attachWeb();
            }
            // Hold to maintain swing
            if (this.player.swinging && this.player.webPoint) {
                // Add swing momentum when pressing direction keys
                if (this.keys['a'] || this.keys['arrowleft']) {
                    this.player.vx -= 0.8 * dt;
                }
                if (this.keys['d'] || this.keys['arrowright']) {
                    this.player.vx += 0.8 * dt;
                }
            }
        }

        // Physics
        this.player.vy += 0.55 * dt; // Slightly reduced gravity for floatier feel

        // IMPROVED: Wall cling mechanic
        if (this.player.vy > 0 && !this.player.grounded) {
            // Check for wall proximity
            for (const platform of this.platforms) {
                if (platform.type === 'building' && Math.abs(this.player.x - platform.x) < 30) {
                    // Wall slide
                    if (jumpPressed && !this.player.jumpHeld) {
                        this.player.wallClinging = true;
                        this.player.vy = 0;
                        this.player.vx = 0;
                    }
                    if (this.player.wallClinging) {
                        this.player.vy *= 0.5; // Slow wall slide
                    }
                }
            }
        } else {
            this.player.wallClinging = false;
        }

        // Web swinging physics - ENHANCED
        if (this.player.swinging && this.player.webPoint) {
            const dx = this.player.webPoint.x - (this.player.x + this.player.width / 2);
            const dy = this.player.webPoint.y - this.player.y;
            const currentLen = Math.sqrt(dx * dx + dy * dy);

            // Add swing velocity based on player movement
            if (currentLen > this.player.webLength) {
                // Pendulum physics
                const angle = Math.atan2(dy, dx);
                const tangentX = -Math.sin(angle);
                const tangentY = Math.cos(angle);

                // Constrain to web length
                const targetX = this.player.webPoint.x - Math.cos(angle) * this.player.webLength;
                const targetY = this.player.webPoint.y - Math.sin(angle) * this.player.webLength;

                this.player.x = targetX - this.player.width / 2;
                this.player.y = targetY;

                // Conserve momentum along the swing arc
                const dotProduct = (this.player.vx * tangentX + this.player.vy * tangentY);
                this.player.vx = tangentX * dotProduct;
                this.player.vy = tangentY * dotProduct;

                // Add gravity component to swing
                this.player.vx += tangentX * 0.3 * dt;
            }

            // Release web
            if (!this.keys['mousedown'] && !this.keys['e']) {
                this.player.swinging = false;
            }
        }

        // Apply velocity
        this.player.x += this.player.vx * dt;
        this.player.y += this.player.vy * dt;

        // Keep player in bounds
        this.player.x = Math.max(0, this.player.x);

        // Platform collision
        this.player.grounded = false;
        for (const platform of this.platforms) {
            if (this.player.x + this.player.width > platform.x &&
                this.player.x < platform.x + platform.width &&
                this.player.y + this.player.height > platform.y &&
                this.player.y + this.player.height < platform.y + platform.height + 20 &&
                this.player.vy > 0) {

                this.player.y = platform.y - this.player.height;
                this.player.vy = 0;
                this.player.grounded = true;
                this.player.swinging = false;
            }
        }

        // Fall death
        if (this.player.y > 550) {
            this.loseLife();
        }

        // Update camera
        this.camera.x = this.player.x - 200;
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.levelLength - 900));

        // Update web projectiles
        for (const web of this.webProjectiles) {
            if (!web.active) continue;

            web.x += web.vx * dt;
            web.y += web.vy * dt;

            // Check enemy hits
            for (const enemy of this.enemies) {
                if (web.x > enemy.x && web.x < enemy.x + enemy.width &&
                    web.y > enemy.y && web.y < enemy.y + enemy.height) {
                    enemy.health--;
                    web.active = false;

                    if (enemy.health <= 0) {
                        enemy.dead = true;
                        this.score += 100;

                        // Death particles
                        for (let i = 0; i < 10; i++) {
                            this.particles.push({
                                x: enemy.x + enemy.width / 2,
                                y: enemy.y + enemy.height / 2,
                                vx: (Math.random() - 0.5) * 8,
                                vy: (Math.random() - 0.5) * 8,
                                life: 30,
                                maxLife: 30,
                                color: '#FF4444',
                                size: 5
                            });
                        }
                    }
                    break;
                }
            }

            // Remove if off screen
            if (web.x > this.camera.x + 950 || web.x < this.camera.x - 50 ||
                web.y > 550 || web.y < -50) {
                web.active = false;
            }
        }

        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.dead) continue;

            enemy.frame += 0.1;

            if (enemy.type === 'thug') {
                enemy.x += enemy.vx * dt;

                // Patrol bounds
                const startX = enemy.x;
                const patrolRange = 80;

                if (enemy.x < startX - patrolRange || enemy.x > startX + patrolRange) {
                    enemy.vx *= -1;
                }

                // Check player collision
                if (this.checkCollision(this.player, enemy)) {
                    this.loseLife();
                }
            }
        }

        // Check boss spawn
        if (this.levelProgress >= this.levelLength - 500 && !this.bossSpawned) {
            this.spawnBoss();
        }

        // Update boss
        if (this.boss) {
            this.updateBoss(dt);
        }

        // Update collectibles
        for (const coin of this.collectibles) {
            if (coin.collected) continue;

            coin.frame += 0.1;

            if (this.checkCollision(this.player, coin)) {
                coin.collected = true;
                this.score += 50;

                // Collection particles
                for (let i = 0; i < 5; i++) {
                    this.particles.push({
                        x: coin.x + coin.width / 2,
                        y: coin.y + coin.height / 2,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 20,
                        maxLife: 20,
                        color: '#FFD700',
                        size: 4
                    });
                }
            }
        }

        // Update particles
        for (const p of this.particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life--;
        }
        this.particles = this.particles.filter(p => p.life > 0);

        // Update level progress
        this.levelProgress = Math.max(this.levelProgress, this.player.x);

        // Clean up
        this.webProjectiles = this.webProjectiles.filter(w => w.active);
        this.enemies = this.enemies.filter(e => !e.dead);
        this.collectibles = this.collectibles.filter(c => !c.collected);
    }

    spawnBoss() {
        this.bossSpawned = true;
        this.boss = {
            x: this.levelLength - 200,
            y: 250,
            width: 70,
            height: 80,
            vx: 3,
            vy: 0,
            health: 10,
            maxHealth: 10,
            type: 'goblin',
            frame: 0,
            attackTimer: 0,
            pumpkins: []
        };
    }

    updateBoss(dt) {
        if (!this.boss || this.boss.health <= 0) return;

        this.boss.frame += 0.1;
        this.boss.attackTimer += dt;

        // Movement
        this.boss.x += this.boss.vx * dt;

        if (this.boss.x < this.levelLength - 350 || this.boss.x > this.levelLength - 100) {
            this.boss.vx *= -1;
        }

        // Pumpkin bomb attacks
        if (this.boss.attackTimer > 120) {
            this.boss.attackTimer = 0;

            this.boss.pumpkins.push({
                x: this.boss.x + this.boss.width / 2,
                y: this.boss.y + this.boss.height / 2,
                vx: (this.player.x - this.boss.x) * 0.02,
                vy: -5,
                active: true
            });
        }

        // Update pumpkins
        for (const pumpkin of this.boss.pumpkins) {
            if (!pumpkin.active) continue;

            pumpkin.x += pumpkin.vx * dt;
            pumpkin.y += pumpkin.vy * dt;
            pumpkin.vy += 0.2 * dt;

            if (this.checkCollision(pumpkin, this.player)) {
                this.loseLife();
                pumpkin.active = false;
            }

            if (pumpkin.y > 500) {
                pumpkin.active = false;
            }
        }
        this.boss.pumpkins = this.boss.pumpkins.filter(p => p.active);

        // Check web hit on boss
        for (const web of this.webProjectiles) {
            if (!web.active) continue;

            if (this.checkCollisionPoint(web.x, web.y, this.boss)) {
                this.boss.health--;
                web.active = false;

                // Hit particles
                for (let i = 0; i < 5; i++) {
                    this.particles.push({
                        x: web.x,
                        y: web.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 15,
                        maxLife: 15,
                        color: '#00FF00',
                        size: 4
                    });
                }

                if (this.boss.health <= 0) {
                    this.victory = true;
                    this.score += 1000;

                    // Victory particles
                    for (let i = 0; i < 30; i++) {
                        this.particles.push({
                            x: this.boss.x + this.boss.width / 2,
                            y: this.boss.y + this.boss.height / 2,
                            vx: (Math.random() - 0.5) * 12,
                            vy: (Math.random() - 0.5) * 12,
                            life: 60,
                            maxLife: 60,
                            color: ['#FFD700', '#FF4444', '#44FF44'][Math.floor(Math.random() * 3)],
                            size: 8
                        });
                    }

                    setTimeout(() => this.showVictory(), 2000);
                }
            }
        }

        // Boss collision with player
        if (this.checkCollision(this.player, this.boss)) {
            this.loseLife();
        }
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    checkCollisionPoint(px, py, b) {
        return px > b.x && px < b.x + b.width &&
               py > b.y && py < b.y + b.height;
    }

    loseLife() {
        this.lives--;
        this.player.x = 100;
        this.player.y = 300;
        this.player.vx = 0;
        this.player.vy = 0;
        this.camera.x = 0;

        // Damage particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 40,
                maxLife: 40,
                color: '#FF0000',
                size: 6
            });
        }

        if (this.lives <= 0) {
            this.gameOver = true;
            this.endGame();
        }
    }

    showVictory() {
        this.victory = true;
        state.scores.spiderman = this.score;

        if (this.score > state.highScores.spiderman) {
            state.highScores.spiderman = this.score;
            localStorage.setItem('spidermanHighScore', this.score);
        }

        document.getElementById('gameover-title').textContent = 'VICTORY!';
        document.getElementById('final-score').textContent = `Score: ${this.score}`;
        document.getElementById('new-highscore').classList.remove('hidden');
        document.getElementById('new-highscore').textContent = '🏆 MISSION COMPLETE! 🏆';
        document.getElementById('gameover-modal').classList.remove('hidden');
    }

    endGame() {
        state.scores.spiderman = this.score;

        if (this.score > state.highScores.spiderman) {
            state.highScores.spiderman = this.score;
            localStorage.setItem('spidermanHighScore', this.score);
        }

        updateStatsDisplay();
        showGameOver(this.score, 'GAME OVER');
    }

    render() {
        const ctx = this.ctx;

        // Clear and draw sky gradient - ENHANCED
        const gradient = ctx.createLinearGradient(0, 0, 0, 500);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.3, '#1a1a3a');
        gradient.addColorStop(0.6, '#2d1b4e');
        gradient.addColorStop(0.8, '#4a2c6a');
        gradient.addColorStop(1, '#1a1a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 900, 500);

        // Draw stars - NEW
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
            const starX = (i * 137 + this.camera.x * 0.1) % 900;
            const starY = (i * 89) % 300;
            const twinkle = Math.sin(this.frameCount * 0.05 + i) * 0.5 + 0.5;
            ctx.globalAlpha = twinkle * 0.8;
            ctx.fillRect(starX, starY, 2, 2);
        }
        ctx.globalAlpha = 1;

        // Draw moon - NEW
        ctx.fillStyle = '#FFE4B5';
        ctx.beginPath();
        ctx.arc(800, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon glow
        const moonGlow = ctx.createRadialGradient(800, 80, 30, 800, 80, 80);
        moonGlow.addColorStop(0, 'rgba(255, 228, 181, 0.3)');
        moonGlow.addColorStop(1, 'rgba(255, 228, 181, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(800, 80, 80, 0, Math.PI * 2);
        ctx.fill();

        // Draw clouds - IMPROVED
        for (const cloud of this.clouds) {
            ctx.fillStyle = 'rgba(100, 100, 150, 0.15)';
            this.drawCloud(cloud.x - this.camera.x * 0.3, cloud.y, cloud.width);
        }

        // Draw buildings (background) - ENHANCED
        for (const building of this.buildings) {
            const bx = building.x - this.camera.x;
            if (bx > -building.width && bx < 950) {
                // Building with depth
                ctx.fillStyle = '#1a1a2a';
                ctx.fillRect(bx, building.y, building.width, building.height);
                
                // Building edge highlight
                ctx.fillStyle = '#2a2a4a';
                ctx.fillRect(bx, building.y, 3, building.height);
                ctx.fillRect(bx + building.width - 3, building.y, 3, building.height);

                // Windows - more varied
                ctx.fillStyle = '#ffffaa';
                for (let wx = 0; wx < building.windows; wx++) {
                    for (let wy = 0; wy < 6; wy++) {
                        const flicker = Math.sin(this.frameCount * 0.02 + wx + wy);
                        if (flicker > -0.5 && Math.random() > 0.2) {
                            // Lit window with glow
                            ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
                            ctx.fillRect(bx + 8 + wx * 28, building.y + 15 + wy * 35, 20, 30);
                            ctx.fillStyle = '#ffffaa';
                            ctx.fillRect(bx + 10 + wx * 28, building.y + 17 + wy * 35, 16, 26);
                        }
                    }
                }
                
                // Antenna / detail
                if (building.width > 150) {
                    ctx.fillStyle = '#333';
                    ctx.fillRect(bx + building.width / 2 - 2, building.y - 20, 4, 20);
                    ctx.fillStyle = '#FF0000';
                    ctx.globalAlpha = 0.8 + Math.sin(this.frameCount * 0.1) * 0.2;
                    ctx.fillRect(bx + building.width / 2 - 1, building.y - 22, 2, 4);
                    ctx.globalAlpha = 1;
                }
            }
        }

        // Draw platforms - ENHANCED with depth
        for (const platform of this.platforms) {
            const px = platform.x - this.camera.x;
            if (px > -platform.width && px < 950) {
                if (platform.type === 'boss') {
                    // Boss platform with dramatic effect
                    ctx.fillStyle = '#4a0000';
                    ctx.fillRect(px, platform.y, platform.width, platform.height);
                    ctx.fillStyle = '#8B0000';
                    ctx.fillRect(px + 5, platform.y + 5, platform.width - 10, platform.height - 10);
                    
                    // Lava cracks
                    ctx.fillStyle = '#FF4400';
                    for (let i = 0; i < 5; i++) {
                        const crackX = px + 20 + i * 35;
                        ctx.fillRect(crackX, platform.y + 5, 3, platform.height - 10);
                    }
                    
                    // Flag
                    ctx.fillStyle = '#333';
                    ctx.fillRect(px + platform.width / 2 - 3, platform.y - 60, 6, 60);
                    ctx.fillStyle = '#00AA00';
                    ctx.beginPath();
                    ctx.moveTo(px + platform.width / 2 + 3, platform.y - 60);
                    ctx.lineTo(px + platform.width / 2 + 50, platform.y - 45);
                    ctx.lineTo(px + platform.width / 2 + 3, platform.y - 30);
                    ctx.fill();
                } else {
                    // Regular platform with depth
                    ctx.fillStyle = '#2a2a3a';
                    ctx.fillRect(px, platform.y, platform.width, platform.height);
                    
                    // Top surface
                    const platGradient = ctx.createLinearGradient(px, platform.y, px, platform.y + 20);
                    platGradient.addColorStop(0, '#5a5a7a');
                    platGradient.addColorStop(1, '#4a4a6a');
                    ctx.fillStyle = platGradient;
                    ctx.fillRect(px, platform.y, platform.width, 8);
                    
                    // Edge highlight
                    ctx.fillStyle = '#6a6a8a';
                    ctx.fillRect(px, platform.y, platform.width, 2);
                    
                    // Support beams
                    if (platform.type === 'building') {
                        ctx.fillStyle = '#1a1a2a';
                        ctx.fillRect(px + 10, platform.y + 20, 5, 100);
                        ctx.fillRect(px + platform.width - 15, platform.y + 20, 5, 100);
                    }
                }
            }
        }

        // Draw collectibles - ENHANCED
        for (const coin of this.collectibles) {
            if (coin.collected) continue;

            const cx = coin.x - this.camera.x;
            if (cx > -30 && cx < 930) {
                // Spider token with glow
                const pulse = Math.sin(this.frameCount * 0.15) * 0.3 + 0.7;
                
                // Outer glow
                ctx.fillStyle = `rgba(255, 68, 68, ${0.3 * pulse})`;
                ctx.beginPath();
                ctx.arc(cx + coin.width / 2, coin.y + coin.height / 2, 18, 0, Math.PI * 2);
                ctx.fill();

                ctx.save();
                ctx.translate(cx + coin.width / 2, coin.y + coin.height / 2);
                ctx.rotate(Math.sin(this.frameCount * 0.1) * 0.2);

                // Token body
                ctx.fillStyle = '#FF4444';
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.fill();

                // Token highlight
                ctx.fillStyle = '#FF6666';
                ctx.beginPath();
                ctx.arc(-3, -3, 5, 0, Math.PI * 2);
                ctx.fill();

                // Spider emblem
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FF4444';
                ctx.beginPath();
                ctx.arc(0, 0, 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Draw enemies - ENHANCED
        for (const enemy of this.enemies) {
            if (enemy.dead) continue;

            const ex = enemy.x - this.camera.x;
            if (ex > -50 && ex < 950) {
                if (enemy.type === 'thug') {
                    // Thug enemy with detail
                    ctx.fillStyle = '#1a1a1a'; // Dark suit
                    ctx.fillRect(ex, enemy.y, enemy.width, enemy.height);
                    
                    // Suit shading
                    ctx.fillStyle = '#2a2a2a';
                    ctx.fillRect(ex, enemy.y, enemy.width, 5);
                    ctx.fillRect(ex + 5, enemy.y, 3, enemy.height);
                    ctx.fillRect(ex + enemy.width - 8, enemy.y, 3, enemy.height);

                    // Face
                    ctx.fillStyle = '#8B7355';
                    ctx.fillRect(ex + 10, enemy.y + 5, 25, 15);
                    
                    // Eyes
                    ctx.fillStyle = '#FF0000';
                    const eyeGlow = 0.6 + Math.sin(this.frameCount * 0.2) * 0.4;
                    ctx.globalAlpha = eyeGlow;
                    ctx.fillRect(ex + 13, enemy.y + 8, 6, 4);
                    ctx.fillRect(ex + 26, enemy.y + 8, 6, 4);
                    ctx.globalAlpha = 1;

                    // Angry eyebrows
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fillRect(ex + 12, enemy.y + 5, 8, 3);
                    ctx.fillRect(ex + 25, enemy.y + 5, 8, 3);
                }
            }
        }

        // Draw boss - ENHANCED Green Goblin
        if (this.boss && this.boss.health > 0) {
            const bx = this.boss.x - this.camera.x;
            
            // Boss shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(bx + this.boss.width / 2, this.boss.y + this.boss.height + 5, 40, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.translate(bx + this.boss.width / 2, this.boss.y + this.boss.height / 2);
            ctx.scale(this.boss.vx > 0 ? -1 : 1, 1);

            // Goblin body
            ctx.fillStyle = '#2E7D32'; // Dark green
            ctx.fillRect(-40, -45, 80, 90);
            
            // Muscle definition
            ctx.fillStyle = '#1B5E20';
            ctx.fillRect(-35, -35, 25, 30);
            ctx.fillRect(10, -35, 25, 30);

            // Chest emblem
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1B5E20';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();

            // Head
            ctx.fillStyle = '#4CAF50'; // Lighter green
            ctx.fillRect(-35, -65, 70, 30);

            // Mask
            ctx.fillStyle = '#2E7D32';
            ctx.fillRect(-32, -62, 64, 24);

            // Eyes - glowing white
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(-25, -55, 18, 12);
            ctx.fillRect(7, -55, 18, 12);
            
            // Pupils
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-20, -52, 8, 8);
            ctx.fillRect(12, -52, 8, 8);

            // Eye glow
            ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
            ctx.fillRect(-25, -55, 18, 12);
            ctx.fillRect(7, -55, 18, 12);

            // Goblin ears
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.moveTo(-40, -50);
            ctx.lineTo(-60, -65);
            ctx.lineTo(-45, -40);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(40, -50);
            ctx.lineTo(60, -65);
            ctx.lineTo(45, -40);
            ctx.fill();

            // Ear shading
            ctx.fillStyle = '#2E7D32';
            ctx.beginPath();
            ctx.moveTo(-40, -50);
            ctx.lineTo(-55, -60);
            ctx.lineTo(-42, -45);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(40, -50);
            ctx.lineTo(55, -60);
            ctx.lineTo(42, -45);
            ctx.fill();

            // Grin
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-20, -38, 40, 8);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(-18, -37, 8, 5);
            ctx.fillRect(10, -37, 8, 5);

            // Hair
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(-30, -65, 60, 5);

            ctx.restore();

            // Boss health bar - enhanced
            const healthPercent = this.boss.health / this.boss.maxHealth;
            
            // Health bar background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(bx - 10, this.boss.y - 50, 90, 12);
            
            // Health bar fill
            const healthGradient = ctx.createLinearGradient(bx - 10, 0, bx + 80, 0);
            healthGradient.addColorStop(0, '#FF0000');
            healthGradient.addColorStop(0.5, '#FF6600');
            healthGradient.addColorStop(1, '#FF0000');
            ctx.fillStyle = healthGradient;
            ctx.fillRect(bx - 10, this.boss.y - 50, 85 * healthPercent, 10);
            
            // Health bar border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx - 10, this.boss.y - 50, 90, 12);
            
            // Boss name
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GREEN GOBLIN', bx + this.boss.width / 2 - 5, this.boss.y - 55);
        }

        // Draw pumpkins - ENHANCED
        for (const pumpkin of this.boss ? this.boss.pumpkins : []) {
            const px = pumpkin.x - this.camera.x;
            const py = pumpkin.y;

            // Pumpkin glow
            const pumpkinGlow = ctx.createRadialGradient(px, py, 10, px, py, 25);
            pumpkinGlow.addColorStop(0, 'rgba(255, 102, 0, 0.4)');
            pumpkinGlow.addColorStop(1, 'rgba(255, 102, 0, 0)');
            ctx.fillStyle = pumpkinGlow;
            ctx.beginPath();
            ctx.arc(px, py, 25, 0, Math.PI * 2);
            ctx.fill();

            // Pumpkin body
            ctx.fillStyle = '#FF6600';
            ctx.beginPath();
            ctx.arc(px, py, 16, 0, Math.PI * 2);
            ctx.fill();

            // Pumpkin segments
            ctx.strokeStyle = '#CC5500';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px, py, 16, -0.5, 0.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(px, py, 16, 2.5, 3.5);
            ctx.stroke();

            // Stem
            ctx.fillStyle = '#2E7D32';
            ctx.beginPath();
            ctx.moveTo(px - 4, py - 12);
            ctx.lineTo(px, py - 25);
            ctx.lineTo(px + 4, py - 12);
            ctx.fill();

            // Stem leaf
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.ellipse(px + 6, py - 18, 4, 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();

            // Evil grin
            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.arc(px, py + 2, 8, 0.2, Math.PI - 0.2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.moveTo(px - 8, py - 5);
            ctx.lineTo(px - 3, py - 10);
            ctx.lineTo(px + 2, py - 5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(px + 3, py - 5);
            ctx.lineTo(px + 8, py - 10);
            ctx.lineTo(px + 13, py - 5);
            ctx.fill();
        }

        // Draw web projectiles - ENHANCED
        for (const web of this.webProjectiles) {
            if (!web.active) continue;

            const wx = web.x - this.camera.x;
            const wy = web.y;

            // Web impact glow
            const webGlow = ctx.createRadialGradient(wx, wy, 2, wx, wy, 15);
            webGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            webGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            webGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = webGlow;
            ctx.beginPath();
            ctx.arc(wx, wy, 15, 0, Math.PI * 2);
            ctx.fill();

            // Web core with sparkle
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(wx, wy, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Sparkle effect
            ctx.fillStyle = '#FFDDFF';
            ctx.beginPath();
            ctx.arc(wx - 2, wy - 2, 2, 0, Math.PI * 2);
            ctx.fill();

            // Web trail - multiple strands
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.lineTo(wx - web.vx * 4, wy - web.vy * 4);
            ctx.stroke();

            // Secondary trail
            ctx.strokeStyle = 'rgba(200, 200, 255, 0.4)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.lineTo(wx - web.vx * 5, wy - web.vy * 5);
            ctx.stroke();
        }

        // Draw player
        this.drawSpiderMan();

        // Draw web line when swinging - IMPROVED
        if (this.player.swinging && this.player.webPoint) {
            const playerScreenX = this.player.x + this.player.width / 2;
            const playerScreenY = this.player.y + 15;
            const webScreenX = this.player.webPoint.x - this.camera.x;
            const webScreenY = this.player.webPoint.y;

            // Outer glow
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.moveTo(playerScreenX, playerScreenY);
            ctx.lineTo(webScreenX, webScreenY);
            ctx.stroke();

            // Middle layer
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(playerScreenX, playerScreenY);
            ctx.lineTo(webScreenX, webScreenY);
            ctx.stroke();

            // Main web line
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(playerScreenX, playerScreenY);
            ctx.lineTo(webScreenX, webScreenY);
            ctx.stroke();

            // Web anchor point
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(webScreenX, webScreenY, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw particles
        for (const p of this.particles) {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - this.camera.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;

        // Draw story overlay
        if (this.showingStory) {
            this.renderStory();
        }

        // Draw HUD
        this.renderHUD();

        // Draw crosshair - ENHANCED
        if (!this.showingStory) {
            const mx = this.mousePos.x;
            const my = this.mousePos.y;

            // Crosshair glow
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(mx, my, 25, 0, Math.PI * 2);
            ctx.fill();

            // Main crosshair
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(mx, my, 12, 0, Math.PI * 2);
            ctx.stroke();

            // Cross lines
            ctx.beginPath();
            ctx.moveTo(mx - 18, my);
            ctx.lineTo(mx - 6, my);
            ctx.moveTo(mx + 6, my);
            ctx.lineTo(mx + 18, my);
            ctx.moveTo(mx, my - 18);
            ctx.lineTo(mx, my - 6);
            ctx.moveTo(mx, my + 6);
            ctx.lineTo(mx, my + 18);
            ctx.stroke();

            // Center dot
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(mx, my, 3, 0, Math.PI * 2);
            ctx.fill();

            // Center dot glow
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(mx, my, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawSpiderMan() {
        const ctx = this.ctx;
        const px = this.player.x - this.camera.x;
        const py = this.player.y;
        const f = this.player.facing;

        ctx.save();
        ctx.translate(px + this.player.width / 2, py + this.player.height / 2);
        ctx.scale(f, 1);
        ctx.translate(-this.player.width / 2, -this.player.height / 2);

        // Shadow effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(20, 55, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cape effect when falling/swinging - draw behind body
        if (this.player.vy > 2 || this.player.swinging) {
            const capeWave = Math.sin(this.frameCount * 0.5) * 5;
            ctx.fillStyle = '#8B0000';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(5, 15);
            ctx.quadraticCurveTo(-15, 30 + capeWave, -5, 50);
            ctx.lineTo(5, 45);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(35, 15);
            ctx.quadraticCurveTo(55, 25 - capeWave, 45, 45);
            ctx.lineTo(35, 45);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Body - ENHANCED with muscle definition
        ctx.fillStyle = '#B71C1C'; // Darker red for shading
        ctx.fillRect(5, 10, 30, 25);
        ctx.fillStyle = '#E53935'; // Main red
        ctx.fillRect(7, 12, 26, 21);

        // Muscle shading
        ctx.fillStyle = '#C62828';
        ctx.fillRect(10, 15, 8, 15);
        ctx.fillRect(22, 15, 8, 15);

        // Spider emblem - more detailed
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(20, 22, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#B71C1C';
        ctx.beginPath();
        ctx.arc(20, 22, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Spider legs on emblem
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, 22); ctx.lineTo(8, 18);
        ctx.moveTo(12, 22); ctx.lineTo(8, 26);
        ctx.moveTo(28, 22); ctx.lineTo(32, 18);
        ctx.moveTo(28, 22); ctx.lineTo(32, 26);
        ctx.moveTo(20, 14); ctx.lineTo(20, 10);
        ctx.moveTo(20, 30); ctx.lineTo(20, 34);
        ctx.stroke();

        // Head - detailed
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(10, 0, 20, 15);
        ctx.fillStyle = '#E53935';
        ctx.fillRect(11, 1, 18, 13);

        // Mask details
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(10, 3, 20, 2); // Mask band top
        ctx.fillRect(10, 12, 20, 2); // Mask band bottom

        // Eyes - detailed white eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 5, 8, 7);
        ctx.fillRect(20, 5, 8, 7);
        
        // Eye outline
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 5, 8, 7);
        ctx.strokeRect(20, 5, 8, 7);

        // Pupils that look in direction
        ctx.fillStyle = '#1a1a1a';
        const pupilOffset = Math.max(-2, Math.min(2, this.player.vx * 0.5));
        ctx.fillRect(14 + pupilOffset, 7, 4, 4);
        ctx.fillRect(22 + pupilOffset, 7, 4, 4);

        // Glint in eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(15 + pupilOffset, 7, 2, 2);
        ctx.fillRect(23 + pupilOffset, 7, 2, 2);

        // Arms - ENHANCED with muscles
        const armSwing = this.player.swinging 
            ? Math.sin(this.frameCount * 0.2) * 10
            : Math.sin(this.frameCount * 0.3) * 6;

        // Left arm
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(-8, 10 + armSwing, 15, 10);
        ctx.fillStyle = '#E53935';
        ctx.fillRect(-6, 12 + armSwing, 11, 6);

        // Right arm
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(33, 10 - armSwing, 15, 10);
        ctx.fillStyle = '#E53935';
        ctx.fillRect(35, 12 - armSwing, 11, 6);

        // Gloves
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(-9, 18 + armSwing, 17, 8);
        ctx.fillRect(32, 18 - armSwing, 17, 8);

        // Legs - detailed with muscles
        const isMoving = Math.abs(this.player.vx) > 0.5;
        const legSwing = isMoving || this.player.swinging 
            ? Math.sin(this.frameCount * (this.player.swinging ? 0.35 : 0.45)) * 7 
            : 0;

        // Left leg
        ctx.fillStyle = '#0D47A1'; // Dark blue
        ctx.fillRect(8, 35, 11, 17 + legSwing);
        ctx.fillStyle = '#1565C0'; // Main blue
        ctx.fillRect(9, 37, 9, 14 + legSwing);

        // Right leg
        ctx.fillStyle = '#0D47A1';
        ctx.fillRect(21, 35, 11, 17 - legSwing);
        ctx.fillStyle = '#1565C0';
        ctx.fillRect(22, 37, 9, 14 - legSwing);

        // Boots - detailed
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(6, 50 + legSwing, 15, 7);
        ctx.fillRect(19, 50 - legSwing, 15, 7);
        
        // Boot highlight
        ctx.fillStyle = '#E53935';
        ctx.fillRect(7, 51 + legSwing, 12, 4);
        ctx.fillRect(20, 51 - legSwing, 12, 4);

        ctx.restore();
    }

    drawCloud(x, y, width) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, width * 0.3, 0, Math.PI * 2);
        ctx.arc(x + width * 0.25, y - 10, width * 0.25, 0, Math.PI * 2);
        ctx.arc(x + width * 0.5, y, width * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    renderStory() {
        const ctx = this.ctx;

        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 900, 500);

        // Story box
        ctx.fillStyle = 'rgba(30, 30, 60, 0.95)';
        ctx.strokeStyle = '#E53935';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(100, 150, 700, 200, 15);
        ctx.fill();
        ctx.stroke();

        // Chapter title
        ctx.fillStyle = '#E53935';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.chapters[this.storyIndex].title, 450, 195);

        // Story text - FIXED: Reset alignment and adjust positioning
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        
        const words = this.storyText.split(' ');
        let line = '';
        let y = 235;
        const maxWidth = 580; // Adjusted for story box width (700px box - 60px padding each side)
        const x = 130; // Start position inside the story box

        // Word wrap logic
        const lines = [];
        for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth) {
                if (line.trim()) {
                    lines.push(line.trim());
                }
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        if (line.trim()) {
            lines.push(line.trim());
        }

        // Draw each line
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y);
            y += 28;
        }

        // Continue prompt - show immediately so player knows controls
        const blink = Math.sin(this.frameCount * 0.1) > 0;
        ctx.fillStyle = blink ? '#E53935' : 'rgba(229, 57, 51, 0.7)';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or CLICK to continue...', 450, 325);
    }

    renderHUD() {
        const ctx = this.ctx;

        // Enhanced HUD panel style
        const panelGradient = ctx.createLinearGradient(0, 0, 0, 45);
        panelGradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        panelGradient.addColorStop(1, 'rgba(20, 20, 40, 0.6)');

        // Score panel
        ctx.fillStyle = panelGradient;
        ctx.fillRect(8, 8, 180, 42);
        
        // Panel border
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, 180, 42);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE`, 18, 26);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`${this.score}`, 18, 46);

        // Lives panel
        ctx.fillStyle = panelGradient;
        ctx.fillRect(195, 8, 150, 42);
        ctx.strokeStyle = 'rgba(255, 68, 68, 0.3)';
        ctx.strokeRect(195, 8, 150, 42);
        
        ctx.fillStyle = '#FF4444';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`LIVES`, 205, 26);
        
        ctx.font = '24px Arial';
        const livesStr = this.lives > 0 ? '🕷️'.repeat(this.lives) : '💀';
        ctx.fillText(livesStr, 205, 48);

        // Progress panel
        ctx.fillStyle = panelGradient;
        ctx.fillRect(352, 8, 260, 42);
        ctx.strokeStyle = 'rgba(68, 255, 68, 0.3)';
        ctx.strokeRect(352, 8, 260, 42);
        
        ctx.fillStyle = '#44FF44';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`PROGRESS`, 362, 24);
        
        const progress = Math.min(100, (this.levelProgress / (this.levelLength - 300)) * 100);
        
        // Progress bar background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(362, 30, 240, 10);
        
        // Progress bar fill with gradient
        const progGradient = ctx.createLinearGradient(362, 0, 602, 0);
        progGradient.addColorStop(0, '#44FF44');
        progGradient.addColorStop(1, '#00FF88');
        ctx.fillStyle = progGradient;
        ctx.fillRect(362, 30, 238 * (progress / 100), 10);
        
        // Progress text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${progress.toFixed(0)}%`, 595, 25);

        // Boss health panel
        if (this.boss && this.boss.health > 0) {
            ctx.fillStyle = panelGradient;
            ctx.fillRect(618, 8, 275, 42);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.strokeRect(618, 8, 275, 42);
            
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`BOSS`, 628, 24);
            
            // Boss health bar
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(628, 30, 255, 10);
            
            const bossHealth = this.boss.health / this.boss.maxHealth;
            const bossGradient = ctx.createLinearGradient(628, 0, 883, 0);
            bossGradient.addColorStop(0, '#FF0000');
            bossGradient.addColorStop(0.5, '#FF6600');
            bossGradient.addColorStop(1, '#FF0000');
            ctx.fillStyle = bossGradient;
            ctx.fillRect(628, 30, 253 * bossHealth, 10);
            
            // Flashing effect when boss is low
            if (bossHealth < 0.3 && Math.sin(this.frameCount * 0.2) > 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
                ctx.fillRect(628, 30, 253, 10);
            }
        }

        // Web fluid indicator
        ctx.fillStyle = panelGradient;
        ctx.fillRect(8, 55, 140, 32);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeRect(8, 55, 140, 32);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`🕸️ Web: Ready`, 18, 77);
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.lastTime = Date.now();
        this.update();
    }

    stop() {
        this.running = false;
    }
}

// =====================================================
// MIDNIGHT CORRIDOR - Enhanced Horror Game (Raycasting)
// =====================================================

class HorrorGame {
    constructor() {
        this.container = document.getElementById('horror-game');
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'horror-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        
        this.running = false;
        this.paused = false;
        
        // Game state
        this.skullsCollected = 0;
        this.totalSkulls = 5;
        this.battery = 100;
        this.flashlightOn = true;
        this.gameOver = false;
        this.victory = false;
        
        // Player
        this.player = {
            x: 2.5,
            y: 0.5,
            z: 2.5,
            angle: 0,
            pitch: 0,
            health: 100,
            speed: 3,
            turnSpeed: 2.5
        };
        
        // Input
        this.keys = {};
        this.mouseLocked = false;
        this.mouseSensitivity = 0.002;
        
        // Map (1 = wall, 0 = floor, 2 = skull, 3 = exit, 4 = pillar)
        this.mapWidth = 16;
        this.mapHeight = 16;
        this.map = this.generateMap();
        
        // Raycasting
        this.screenWidth = 0;
        this.screenHeight = 0;
        this.fov = Math.PI / 3;
        this.depthBuffer = [];
        
        // Horror elements
        this.entity = null;
        this.entityVisible = false;
        this.entityTimer = 0;
        this.entityAngle = 0;
        this.jumpscareTriggered = false;
        this.heartbeatTime = 0;
        this.ambientTime = 0;
        this.fogDensity = 1;
        
        // Textures (procedurally generated)
        this.wallTexture = this.generateWallTexture();
        this.floorTexture = this.generateFloorTexture();
        this.ceilingTexture = this.generateCeilingTexture();
        this.doorTexture = this.generateDoorTexture();
        
        // Sprites
        this.sprites = this.generateSprites();
        
        // Timing
        this.lastTime = 0;
        this.frameCount = 0;
        this.lastStepTime = 0;
        
        // Audio
        this.audioContext = null;
        
        this.init();
    }
    
    generateMap() {
        const map = [];
        for (let y = 0; y < this.mapHeight; y++) {
            map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Border walls
                if (x === 0 || x === this.mapWidth - 1 || y === 0 || y === this.mapHeight - 1) {
                    map[y][x] = 1;
                } else if (x % 3 === 0 && y % 3 === 0 && Math.random() > 0.3) {
                    // Random wall blocks
                    map[y][x] = 1;
                } else if (x === 8 && y === 8) {
                    // Starting position (clear area)
                    map[y][x] = 0;
                } else {
                    map[y][x] = 0;
                }
            }
        }
        
        // Place skulls at strategic locations
        const skullPositions = [
            { x: 13, y: 2 }, { x: 2, y: 13 }, { x: 13, y: 13 },
            { x: 7, y: 5 }, { x: 10, y: 10 }
        ];
        skullPositions.forEach(pos => {
            if (map[pos.y][pos.x] === 0) {
                map[pos.y][pos.x] = 2;
            }
        });
        
        // Exit door
        map[1][8] = 3;
        
        return map;
    }
    
    generateWallTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base color (dark brick with subtle variation)
        ctx.fillStyle = '#1a1515';
        ctx.fillRect(0, 0, 64, 64);
        
        // Brick pattern with realistic mortar
        ctx.fillStyle = '#0a0a0a';
        for (let y = 0; y < 64; y += 16) {
            const offset = (y / 16) % 2 === 0 ? 0 : 32;
            // Main brick
            ctx.fillRect(0, y, 31, 16);
            ctx.fillRect(33, y, 31, 8);
            // Mortar lines
            ctx.fillRect(0, y + 15, 64, 1);
            ctx.fillRect(32, y + 7, 32, 1);
        }
        
        // Add grime, cracks, and texture
        for (let i = 0; i < 40; i++) {
            ctx.fillStyle = `rgba(20, 10, 5, ${Math.random() * 0.4})`;
            ctx.fillRect(Math.random() * 64, Math.random() * 64, Math.random() * 6 + 2, Math.random() * 6 + 2);
        }
        
        // Realistic cracks
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(20, 25);
        ctx.lineTo(15, 40);
        ctx.lineTo(25, 50);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(45, 15);
        ctx.lineTo(55, 35);
        ctx.lineTo(48, 55);
        ctx.stroke();
        
        // Add subtle noise texture
        const imageData = ctx.getImageData(0, 0, 64, 64);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 10;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
        
        return canvas;
    }
    
    generateFloorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Dirty concrete floor
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 64, 64);
        
        // Floor tiles with subtle variation
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        
        // Stains and grime
        for (let i = 0; i < 25; i++) {
            ctx.fillStyle = `rgba(30, 10, 10, ${Math.random() * 0.25})`;
            ctx.beginPath();
            ctx.arc(Math.random() * 64, Math.random() * 64, Math.random() * 8 + 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Scratches
        ctx.strokeStyle = 'rgba(40, 40, 40, 0.3)';
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 64, Math.random() * 64);
            ctx.lineTo(Math.random() * 64, Math.random() * 64);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    generateCeilingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 64, 64);
        
        // Cobwebs in corners
        ctx.strokeStyle = 'rgba(60, 60, 60, 0.25)';
        ctx.lineWidth = 0.5;
        
        // Corner cobwebs
        for (let corner = 0; corner < 4; corner++) {
            const startX = corner % 2 === 0 ? 0 : 64;
            const startY = corner < 2 ? 0 : 64;
            const dirX = corner % 2 === 0 ? 1 : -1;
            const dirY = corner < 2 ? 1 : -1;
            
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + dirX * (i * 8), startY + dirY * (i * 4));
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(startX + dirX * (i * 8), startY);
                ctx.lineTo(startX + dirX * (i * 8), startY + dirY * (i * 8));
                ctx.stroke();
            }
        }
        
        // Water stains
        ctx.fillStyle = 'rgba(30, 30, 30, 0.3)';
        ctx.beginPath();
        ctx.ellipse(20, 25, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(50, 45, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }
    
    generateDoorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Door base
        ctx.fillStyle = '#1a0a0a';
        ctx.fillRect(0, 0, 64, 64);
        
        // Door frame
        ctx.fillStyle = '#0a0505';
        ctx.fillRect(0, 0, 64, 4);
        ctx.fillRect(0, 60, 64, 4);
        ctx.fillRect(0, 0, 4, 64);
        ctx.fillRect(60, 0, 4, 64);
        
        // Door panels
        ctx.fillStyle = '#150808';
        ctx.fillRect(8, 8, 48, 22);
        ctx.fillRect(8, 34, 48, 22);
        
        // Door handle
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(52, 32, 4, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas;
    }
    
    generateSprites() {
        // Generate detailed skull sprite
        const skullCanvas = document.createElement('canvas');
        skullCanvas.width = 32;
        skullCanvas.height = 32;
        const ctx = skullCanvas.getContext('2d');
        
        // Skull base with gradient
        const skullGrad = ctx.createRadialGradient(16, 14, 2, 16, 14, 12);
        skullGrad.addColorStop(0, '#e0e0d8');
        skullGrad.addColorStop(0.7, '#c8c8c0');
        skullGrad.addColorStop(1, '#a0a0a0');
        ctx.fillStyle = skullGrad;
        ctx.beginPath();
        ctx.arc(16, 13, 11, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye sockets (deep)
        const eyeGrad = ctx.createRadialGradient(12, 12, 1, 12, 12, 5);
        eyeGrad.addColorStop(0, '#000000');
        eyeGrad.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.arc(11, 11, 4, 0, Math.PI * 2);
        ctx.arc(21, 11, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Red eye glow (subtle supernatural effect)
        ctx.fillStyle = 'rgba(150, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(11, 11, 3, 0, Math.PI * 2);
        ctx.arc(21, 11, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose cavity
        ctx.fillStyle = '#202020';
        ctx.beginPath();
        ctx.moveTo(16, 15);
        ctx.lineTo(13, 21);
        ctx.lineTo(19, 21);
        ctx.fill();
        
        // Jaw
        const jawGrad = ctx.createRadialGradient(16, 24, 2, 16, 24, 8);
        jawGrad.addColorStop(0, '#d0d0c8');
        jawGrad.addColorStop(1, '#909090');
        ctx.fillStyle = jawGrad;
        ctx.fillRect(10, 21, 12, 8);
        
        // Teeth
        ctx.fillStyle = '#f0f0e8';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(11 + i * 3, 22, 2, 4);
        }
        
        // Generate entity sprite (shadow figure with menacing presence)
        const entityCanvas = document.createElement('canvas');
        entityCanvas.width = 64;
        entityCanvas.height = 64;
        const ectx = entityCanvas.getContext('2d');
        
        // Shadow body (tall, menacing figure)
        ectx.fillStyle = '#000000';
        ectx.beginPath();
        ectx.moveTo(32, 60);
        ectx.lineTo(8, 25);
        ectx.quadraticCurveTo(12, 15, 20, 10);
        ectx.lineTo(44, 10);
        ectx.quadraticCurveTo(52, 15, 56, 25);
        ectx.lineTo(32, 60);
        ectx.fill();
        
        // Hood/head area
        ectx.beginPath();
        ectx.arc(32, 18, 14, Math.PI, 0);
        ectx.lineTo(46, 25);
        ectx.lineTo(18, 25);
        ectx.fill();
        
        // Glowing eyes (menacing red)
        const eyeGlow = ectx.createRadialGradient(25, 16, 1, 25, 16, 6);
        eyeGlow.addColorStop(0, '#ff3333');
        eyeGlow.addColorStop(0.5, '#cc0000');
        eyeGlow.addColorStop(1, '#660000');
        ectx.fillStyle = eyeGlow;
        ectx.shadowColor = '#ff0000';
        ectx.shadowBlur = 15;
        ectx.beginPath();
        ectx.arc(25, 16, 4, 0, Math.PI * 2);
        ectx.arc(39, 16, 4, 0, Math.PI * 2);
        ectx.fill();
        ectx.shadowBlur = 0;
        
        return { skull: skullCanvas, entity: entityCanvas };
    }
    
    init() {
        // Prevent multiple initializations
        if (this.initialized) return;
        this.initialized = true;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupEventListeners();
        
        this.running = true;
        this.lastTime = performance.now();
        this.animationFrame = requestAnimationFrame((t) => this.update(t));
    }
    
    resize() {
        this.canvas.width = this.container.clientWidth || 800;
        this.canvas.height = this.container.clientHeight || 450;
        this.screenWidth = this.canvas.width;
        this.screenHeight = this.canvas.height;
        this.depthBuffer = new Array(this.screenWidth).fill(0);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', () => this.onClick());
        
        this.canvas.addEventListener('pointerlockchange', () => {
            this.mouseLocked = document.pointerLockElement === this.canvas;
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    onKeyDown(e) {
        if (!this.running || this.gameOver || this.paused) return;
        this.keys[e.code] = true;
        
        if (e.code === 'KeyF') {
            this.flashlightOn = !this.flashlightOn;
            this.playSound('click');
        }
        
        // Escape to pause
        if (e.code === 'Escape' && this.running) {
            this.paused = true;
            pauseGame();
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        }
    }
    
    onKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    onMouseMove(e) {
        if (this.mouseLocked) {
            this.player.angle += e.movementX * this.mouseSensitivity;
            this.player.pitch = Math.max(-0.3, Math.min(0.3, this.player.pitch - e.movementY * this.mouseSensitivity));
        }
    }
    
    onClick() {
        if (!this.running || this.gameOver || this.paused) return;
        
        if (!this.mouseLocked) {
            this.canvas.requestPointerLock();
            this.initAudio();
        } else {
            this.tryCollectSkull();
        }
    }
    
    initAudio() {
        if (this.audioContext) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.startAmbientSound();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    startAmbientSound() {
        if (!this.audioContext) return;
        
        // Low frequency ambient drone (more atmospheric)
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 40;
        gain.gain.value = 0.08;
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start();
        
        // Add LFO modulation for unsettling effect
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
    }
    
    playSound(type) {
        if (!this.audioContext) return;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        
        switch(type) {
            case 'click':
                // More substantial click sound
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            case 'collect':
                // Ethereal chime for skull collection
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
            case 'heartbeat':
                // Thumping heartbeat
                osc.type = 'sine';
                osc.frequency.setValueAtTime(60, now);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
            case 'jumpscare':
                // Intense jumpscare sound
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.4);
                gain.gain.setValueAtTime(0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case 'victory':
                // Triumphant sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.15);
                osc.frequency.setValueAtTime(784, now + 0.3);
                osc.frequency.setValueAtTime(1047, now + 0.45);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
                osc.start(now);
                osc.stop(now + 1.5);
                break;
            case 'footstep':
                // Quiet footstep
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(80, now);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
        }
    }
    
    tryCollectSkull() {
        // Check if player is near a skull
        const mapX = Math.floor(this.player.x);
        const mapY = Math.floor(this.player.z);
        
        if (this.map[mapY] && this.map[mapY][mapX] === 2) {
            this.map[mapY][mapX] = 0;
            this.skullsCollected++;
            this.playSound('collect');
            
            if (this.skullsCollected >= this.totalSkulls) {
                // Unlock exit
                this.map[1][8] = 4;
            }
            
            this.updateHUD();
        }
    }
    
    checkExit() {
        const mapX = Math.floor(this.player.x);
        const mapY = Math.floor(this.player.z);
        
        // Check if at exit (position 8,1)
        if (mapX === 8 && mapY === 1 && this.skullsCollected >= this.totalSkulls) {
            this.victory = true;
            this.gameOver = true;
            this.playSound('victory');
            setTimeout(() => {
                state.scores.horror = 1000 + (this.skullsCollected * 200) + Math.round(this.battery);
                state.playCounts.horror++;
                localStorage.setItem('horrorPlays', state.playCounts.horror);
                if (state.scores.horror > state.highScores.horror) {
                    state.highScores.horror = state.scores.horror;
                    localStorage.setItem('horrorHighScore', state.scores.horror);
                    showGameOver(state.scores.horror, 'SURVIVED!');
                } else {
                    showGameOver(state.scores.horror, 'SURVIVED!');
                }
            }, 1000);
        }
    }
    
    checkEntityCollision() {
        if (!this.entityVisible || this.jumpscareTriggered) return;
        
        const dx = this.player.x - this.entity.x;
        const dz = this.player.z - this.entity.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 0.7) {
            this.jumpscare();
        }
    }
    
    jumpscare() {
        this.jumpscareTriggered = true;
        this.playSound('jumpscare');
        
        // Flash screen red
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
        
        // Show scary face briefly
        setTimeout(() => {
            this.gameOver = true;
            state.playCounts.horror++;
            localStorage.setItem('horrorPlays', state.playCounts.horror);
            showGameOver(this.skullsCollected * 100, 'TAKEN BY THE SHADOW');
        }, 600);
    }
    
    updatePlayer(delta) {
        if (!this.running || this.gameOver || this.paused) return;
        
        const moveSpeed = this.player.speed * delta;
        let moveX = 0;
        let moveZ = 0;
        
        // Movement with WASD
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            moveX += Math.sin(this.player.angle) * moveSpeed;
            moveZ += Math.cos(this.player.angle) * moveSpeed;
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            moveX -= Math.sin(this.player.angle) * moveSpeed;
            moveZ -= Math.cos(this.player.angle) * moveSpeed;
        }
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            moveX += Math.sin(this.player.angle - Math.PI/2) * moveSpeed;
            moveZ += Math.cos(this.player.angle - Math.PI/2) * moveSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            moveX += Math.sin(this.player.angle + Math.PI/2) * moveSpeed;
            moveZ += Math.cos(this.player.angle + Math.PI/2) * moveSpeed;
        }
        
        // Collision detection with better wall sliding
        const newX = this.player.x + moveX;
        const newZ = this.player.z + moveZ;
        
        let canMoveX = !this.checkCollision(newX, this.player.z);
        let canMoveZ = !this.checkCollision(this.player.x, newZ);
        
        if (canMoveX) {
            this.player.x = newX;
        }
        if (canMoveZ) {
            this.player.z = newZ;
        }
        
        // Footstep sounds
        if ((canMoveX || canMoveZ) && (moveX !== 0 || moveZ !== 0)) {
            const now = performance.now();
            if (now - this.lastStepTime > 400) {
                this.lastStepTime = now;
                if (Math.random() < 0.15) {
                    this.playSound('footstep');
                }
            }
        }
    }
    
    checkCollision(x, z) {
        const margin = 0.15;
        const corners = [
            { x: x - margin, z: z - margin },
            { x: x + margin, z: z - margin },
            { x: x - margin, z: z + margin },
            { x: x + margin, z: z + margin }
        ];
        
        for (const corner of corners) {
            const mapX = Math.floor(corner.x);
            const mapY = Math.floor(corner.z);
            
            if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) {
                return true;
            }
            
            if (this.map[mapY][mapX] === 1) {
                return true;
            }
        }
        
        return false;
    }
    
    updateEntity(delta) {
        this.entityTimer += delta;
        
        // Entity appears randomly
        const distFromOrigin = Math.sqrt(
            Math.pow(this.player.x - 8, 2) + Math.pow(this.player.z - 8, 2)
        );
        
        if (distFromOrigin > 6 && Math.random() < 0.0015 && !this.entityVisible && !this.jumpscareTriggered) {
            this.entityVisible = true;
            // Position behind player
            this.entityAngle = this.player.angle + Math.PI + (Math.random() - 0.5) * 0.5;
            this.entity = {
                x: this.player.x + Math.sin(this.entityAngle) * 7,
                z: this.player.z + Math.cos(this.entityAngle) * 7
            };
        }
        
        if (this.entityVisible && this.entity) {
            // Move toward player with slight hesitation
            const dx = this.player.x - this.entity.x;
            const dz = this.player.z - this.entity.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            
            if (dist > 0.8) {
                // Slower, more ominous movement
                this.entity.x += (dx / dist) * 1.2 * delta;
                this.entity.z += (dz / dist) * 1.2 * delta;
            }
            
            // Check if player is looking at entity
            const angleToEntity = Math.atan2(dx, dz);
            let angleDiff = angleToEntity - this.player.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // Entity disappears if player looks directly at it or gets too close
            if ((angleDiff > -0.25 && angleDiff < 0.25) || dist < 3.5) {
                this.entityVisible = false;
            }
        }
    }
    
    updateBattery(delta) {
        // Ensure delta is valid
        if (isNaN(delta) || delta <= 0) delta = 0.016;
        
        if (this.flashlightOn && !this.gameOver) {
            this.battery -= delta * 2;
            if (this.battery <= 0) {
                this.battery = 0;
                this.flashlightOn = false;
            }
            this.updateHUD();
        }
    }
    
    updateHeartbeat() {
        if (!this.audioContext) return;
        
        this.heartbeatTime += 0.016;
        const distFromOrigin = Math.sqrt(this.player.x * this.player.x + this.player.z * this.player.z);
        
        let heartbeatRate = 1;
        if (this.entityVisible) {
            heartbeatRate = 0.35;
        } else if (distFromOrigin < 12) {
            heartbeatRate = 0.6;
        } else if (distFromOrigin < 18) {
            heartbeatRate = 0.8;
        }
        
        if (this.heartbeatTime > heartbeatRate) {
            this.heartbeatTime = 0;
            this.playSound('heartbeat');
        }
    }
    
    updateHUD() {
        const skullsEl = document.getElementById('horror-skulls');
        const batteryEl = document.getElementById('horror-battery');
        
        if (skullsEl) {
            skullsEl.textContent = `${this.skullsCollected}/${this.totalSkulls}`;
        }
        
        if (batteryEl) {
            // Ensure battery is a valid number
            const displayBattery = isNaN(this.battery) ? 100 : Math.max(0, Math.min(100, Math.round(this.battery)));
            batteryEl.textContent = `${displayBattery}%`;
            
            if (this.battery < 20) {
                batteryEl.style.color = '#ff3333';
            } else if (this.battery < 50) {
                batteryEl.style.color = '#ffaa00';
            } else {
                batteryEl.style.color = '';
            }
        }
    }
    
    update(timestamp) {
        if (!this.running) return;
        
        this.frameCount++;
        
        // Calculate delta time in milliseconds
        const now = timestamp || performance.now();
        let deltaMs = now - this.lastTime;
        
        // Skip first frame or if delta is too large (prevent freezing)
        if (this.frameCount === 1 || deltaMs > 1000) {
            this.lastTime = now;
            this.animationFrame = requestAnimationFrame((t) => this.update(t));
            return;
        }
        
        this.lastTime = now;
        
        // Convert to seconds, clamp to prevent large jumps
        const delta = Math.min(deltaMs / 1000, 0.1);
        
        if (!this.paused && !this.gameOver) {
            this.updatePlayer(delta);
            this.updateEntity(delta);
            this.updateBattery(delta);
            this.updateHeartbeat();
            this.checkExit();
            this.checkEntityCollision();
        }
        
        this.render();
        this.animationFrame = requestAnimationFrame((t) => this.update(t));
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.screenWidth;
        const height = this.screenHeight;
        
        // Clear with dark background
        ctx.fillStyle = '#020202';
        ctx.fillRect(0, 0, width, height);
        
        // Raycasting
        this.raycast();
        
        // Draw entity if visible
        if (this.entityVisible && this.entity) {
            this.drawEntity();
        }
        
        // Draw HUD
        this.drawHUD();
    }
    
    raycast() {
        const ctx = this.ctx;
        const width = this.screenWidth;
        const height = this.screenHeight;
        
        // Draw ceiling with gradient (more atmospheric)
        const gradientCeiling = ctx.createLinearGradient(0, 0, 0, height / 2);
        gradientCeiling.addColorStop(0, '#080808');
        gradientCeiling.addColorStop(1, '#151515');
        ctx.fillStyle = gradientCeiling;
        ctx.fillRect(0, 0, width, height / 2);
        
        // Draw floor with gradient
        const gradientFloor = ctx.createLinearGradient(0, height / 2, 0, height);
        gradientFloor.addColorStop(0, '#121212');
        gradientFloor.addColorStop(1, '#050505');
        ctx.fillStyle = gradientFloor;
        ctx.fillRect(0, height / 2, width, height / 2);
        
        // Cast rays
        for (let x = 0; x < width; x++) {
            const rayAngle = this.player.angle - this.fov / 2 + (x / width) * this.fov;
            
            const result = this.castRay(
                this.player.x,
                this.player.z,
                Math.sin(rayAngle),
                Math.cos(rayAngle)
            );
            
            this.depthBuffer[x] = result.distance;
            
            if (result.distance > 0 && result.distance < 20) {
                // Calculate wall height
                const wallHeight = height / result.distance;
                const wallTop = (height - wallHeight) / 2 + this.player.pitch * height;
                
                // Apply improved fog effect
                let fogFactor = 1;
                if (this.flashlightOn && result.distance > 2) {
                    fogFactor = Math.max(0, 1 - Math.pow((result.distance - 2) / 10, 1.5));
                } else if (!this.flashlightOn) {
                    fogFactor = Math.max(0.15, 1 - result.distance / 12);
                }
                
                // Get texture coordinates
                const texX = Math.floor(result.textureX * 64) % 64;
                
                if (result.type === 3) {
                    // Exit door - enhanced appearance
                    ctx.drawImage(
                        this.doorTexture,
                        texX, 0, 1, 64,
                        x, wallTop, 1, wallHeight
                    );
                    
                    // Door glow when unlocked
                    if (this.skullsCollected >= this.totalSkulls) {
                        ctx.fillStyle = `rgba(80, 200, 80, ${fogFactor * 0.25})`;
                        ctx.fillRect(x, wallTop, 1, wallHeight);
                    }
                } else if (result.type === 4) {
                    // Unlocked door
                    ctx.fillStyle = `rgba(60, 150, 60, ${fogFactor})`;
                    ctx.fillRect(x, wallTop, 1, wallHeight);
                } else {
                    // Regular wall - sample texture
                    ctx.drawImage(
                        this.wallTexture,
                        texX, 0, 1, 64,
                        x, wallTop, 1, wallHeight
                    );
                    
                    // Apply fog color overlay
                    ctx.fillStyle = `rgba(8, 8, 8, ${1 - fogFactor})`;
                    ctx.fillRect(x, wallTop, 1, wallHeight);
                }
                
                // Distance-based shading (darker further away)
                const shade = Math.min(0.75, result.distance / 18);
                ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
                ctx.fillRect(x, wallTop, 1, wallHeight);
            }
        }
        
        // Draw sprites (skulls)
        this.drawSprites();
        
        // Enhanced flashlight cone effect
        if (this.flashlightOn && this.battery > 0) {
            ctx.globalCompositeOperation = 'overlay';
            const gradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, width / 2
            );
            gradient.addColorStop(0, 'rgba(255, 255, 220, 0.12)');
            gradient.addColorStop(0.3, 'rgba(255, 255, 200, 0.08)');
            gradient.addColorStop(0.6, 'rgba(255, 250, 180, 0.04)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
        }
    }
    
    castRay(startX, startZ, dirX, dirZ) {
        let x = startX;
        let z = startZ;
        let distance = 0;
        let textureX = 0;
        let hitType = 0;
        
        const maxDistance = 20;
        const stepSize = 0.02;
        
        while (distance < maxDistance) {
            x += dirX * stepSize;
            z += dirZ * stepSize;
            distance += stepSize;
            
            const mapX = Math.floor(x);
            const mapY = Math.floor(z);
            
            if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) {
                return { distance, textureX: 0, type: 1 };
            }
            
            const cell = this.map[mapY][mapX];
            
            if (cell === 1) {
                // Wall hit - determine side for texture mapping
                const prevX = x - dirX * stepSize;
                const prevZ = z - dirZ * stepSize;
                const cellX = Math.floor(prevX);
                const cellY = Math.floor(prevZ);
                
                if (cellX !== mapX) {
                    textureX = prevZ % 1;
                } else {
                    textureX = prevX % 1;
                }
                
                return { distance, textureX, type: 1 };
            } else if (cell === 2) {
                // Skull - don't stop ray, just return distance for depth buffer
            } else if (cell === 3 || cell === 4) {
                // Exit door
                const prevX = x - dirX * stepSize;
                const prevZ = z - dirZ * stepSize;
                textureX = prevX % 1;
                return { distance, textureX, type: cell };
            }
        }
        
        return { distance: maxDistance, textureX: 0, type: 0 };
    }
    
    drawSprites() {
        const ctx = this.ctx;
        const width = this.screenWidth;
        const height = this.screenHeight;
        
        // Find all skulls
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map[y][x] !== 2) continue;
                
                const spriteX = x + 0.5;
                const spriteY = y + 0.5;
                
                // Calculate distance and angle
                const dx = spriteX - this.player.x;
                const dy = spriteY - this.player.z;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 0.1) continue;
                
                // Transform sprite
                const spriteAngle = Math.atan2(dy, dx) - this.player.angle;
                while (spriteAngle > Math.PI) spriteAngle -= Math.PI * 2;
                while (spriteAngle < -Math.PI) spriteAngle += Math.PI * 2;
                
                if (Math.abs(spriteAngle) > this.fov / 2 + 0.2) continue;
                
                // Project to screen
                const spriteScreenX = width / 2 + (spriteAngle / this.fov) * width;
                const spriteHeight = height / distance;
                const spriteWidth = spriteHeight * 0.8;
                const spriteTop = (height - spriteHeight) / 2;
                
                // Check depth buffer
                const screenX = Math.floor(spriteScreenX);
                if (screenX >= 0 && screenX < width && distance < this.depthBuffer[screenX]) {
                    // Calculate fog
                    let fogFactor = 1;
                    if (this.flashlightOn && distance > 3) {
                        fogFactor = Math.max(0, 1 - (distance - 3) / 10);
                    } else if (!this.flashlightOn) {
                        fogFactor = Math.max(0.2, 1 - distance / 14);
                    }
                    
                    // Draw skull sprite
                    const skullCanvas = this.sprites.skull;
                    
                    ctx.globalAlpha = fogFactor;
                    ctx.drawImage(
                        skullCanvas,
                        spriteScreenX - spriteWidth / 2,
                        spriteTop,
                        spriteWidth,
                        spriteHeight
                    );
                    ctx.globalAlpha = 1;
                    
                    // Glow effect (supernatural)
                    if (fogFactor > 0.25) {
                        ctx.shadowColor = '#ffffaa';
                        ctx.shadowBlur = 12 * fogFactor;
                        ctx.drawImage(
                            skullCanvas,
                            spriteScreenX - spriteWidth / 2,
                            spriteTop,
                            spriteWidth,
                            spriteHeight
                        );
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }
    }
    
    drawEntity() {
        const ctx = this.ctx;
        const width = this.screenWidth;
        const height = this.screenHeight;
        
        const dx = this.entity.x - this.player.x;
        const dz = this.entity.z - this.player.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 0.1) return;
        
        const entityAngle = Math.atan2(dz, dx) - this.player.angle;
        let angleDiff = entityAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        if (Math.abs(angleDiff) > this.fov / 2 + 0.3) return;
        
        const entityScreenX = width / 2 + (angleDiff / this.fov) * width;
        const entityHeight = height / distance;
        const entityWidth = entityHeight * 0.7;
        const entityTop = (height - entityHeight) / 2;
        
        // Check depth buffer
        const screenX = Math.floor(entityScreenX);
        if (screenX >= 0 && screenX < width && distance < this.depthBuffer[screenX]) {
            // Draw shadow entity
            const entityCanvas = this.sprites.entity;
            
            // Slight transparency for eerie effect
            ctx.globalAlpha = 0.95;
            ctx.drawImage(
                entityCanvas,
                entityScreenX - entityWidth / 2,
                entityTop - entityHeight * 0.1,
                entityWidth,
                entityHeight * 1.2
            );
            ctx.globalAlpha = 1;
            
            // Additional shadow effect
            ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
            ctx.fillRect(
                entityScreenX - entityWidth / 2,
                entityTop + entityHeight * 0.8,
                entityWidth,
                entityHeight * 0.2
            );
        }
    }
    
    drawHUD() {
        const ctx = this.ctx;
        const width = this.screenWidth;
        const height = this.screenHeight;
        
        // Enhanced vignette effect
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, height / 4,
            width / 2, height / 2, height * 0.85
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Enhanced crosshair (more visible and game-like)
        const centerX = width / 2;
        const centerY = height / 2;
        const crosshairColor = this.flashlightOn ? 'rgba(255, 255, 200, 0.7)' : 'rgba(255, 255, 255, 0.5)';
        
        ctx.strokeStyle = crosshairColor;
        ctx.lineWidth = 2;
        
        // Crosshair circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(centerX - 18, centerY);
        ctx.lineTo(centerX - 6, centerY);
        ctx.moveTo(centerX + 6, centerY);
        ctx.lineTo(centerX + 18, centerY);
        ctx.moveTo(centerX, centerY - 18);
        ctx.lineTo(centerX, centerY - 6);
        ctx.moveTo(centerX, centerY + 6);
        ctx.lineTo(centerX, centerY + 18);
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = this.flashlightOn ? '#ffffcc' : '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Instructions overlay
        if (!this.mouseLocked && !this.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(width / 2 - 170, height / 2 + 60, 340, 110);
            ctx.strokeStyle = 'rgba(180, 50, 50, 0.7)';
            ctx.lineWidth = 2;
            ctx.strokeRect(width / 2 - 170, height / 2 + 60, 340, 110);
            
            ctx.fillStyle = '#cc4444';
            ctx.font = 'bold 18px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('CLICK TO START', width / 2, height / 2 + 85);
            ctx.font = '14px Courier New';
            ctx.fillStyle = '#aa6666';
            ctx.fillText('Collect all 5 skulls to unlock the exit door', width / 2, height / 2 + 115);
            ctx.fillText('WASD to move | Mouse to look | F for flashlight', width / 2, height / 2 + 135);
            ctx.textAlign = 'left';
        }
        
        // Low battery warning (more prominent)
        if (this.battery < 20 && this.flashlightOn) {
            const pulse = Math.abs(Math.sin(this.frameCount * 0.08));
            ctx.fillStyle = `rgba(255, 0, 0, ${0.4 + pulse * 0.4})`;
            ctx.font = 'bold 22px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ LOW BATTERY ⚠', width / 2, height / 2 - 80);
            ctx.textAlign = 'left';
        }
        
        // Exit unlocked notification
        if (this.skullsCollected >= this.totalSkulls) {
            ctx.fillStyle = 'rgba(60, 200, 60, 0.9)';
            ctx.font = 'bold 18px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('EXIT DOOR UNLOCKED!', width / 2, height / 2 - 110);
            ctx.textAlign = 'left';
        }
    }
    
    stop() {
        this.running = false;
        this.initialized = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
    
    pause() {
        this.paused = true;
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
    
    resume() {
        this.paused = false;
        this.lastTime = performance.now();
        this.animationFrame = requestAnimationFrame((t) => this.update(t));
    }
}

// =====================================================
// DUCK HUNT GAME
// =====================================================

class DuckHuntGame {
    constructor() {
        this.canvas = document.getElementById('duckhunt-game');
        this.ctx = this.canvas.getContext('2d');
        
        this.running = false;
        this.paused = false;
        
        // Game state
        this.round = 1;
        this.score = 0;
        this.shotsLeft = 3;
        this.ducksHit = 0;
        this.ducksSpawned = 0;
        this.totalDucks = 10;
        this.minToPass = 6;
        
        // Game phases
        this.phase = 'intro'; // intro, playing, duckShot, duckFalling, duckEscaped, roundEnd, gameOver
        
        // Timing
        this.phaseTimer = 0;
        this.duckTimer = 0;
        this.animationFrame = null;
        this.frameCount = 0;
        
        // Ducks
        this.ducks = [];
        this.currentDuck = null;
        
        // Dog
        this.dog = {
            x: 400,
            y: 320,
            state: 'hidden', // hidden, sniffing, jumping, holding, laughing
            frame: 0,
            animTimer: 0
        };
        
        // Mouse
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseClicked = false;
        this.shotFlash = 0;
        
        // Audio
        this.audioContext = null;
        
        // Assets
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Custom cursor
        this.canvas.style.cursor = 'crosshair';
        
        this.startIntro();
    }
    
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }
    
    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    onClick(e) {
        if (!this.running || this.paused || this.phase === 'intro') return;
        
        if (this.shotsLeft > 0 && this.phase === 'playing' && !this.currentDuck.shot) {
            this.shotsLeft--;
            this.shotFlash = 3;
            this.playSound('shot');
            this.updateHUD();
            
            // Check hit
            const hit = this.checkHit(this.mouseX, this.mouseY);
            
            if (hit) {
                this.phase = 'duckShot';
                this.currentDuck.shot = true;
                this.currentDuck.frame = 0;
                this.phaseTimer = 30;
                this.score += 100 * this.round;
                this.ducksHit++;
                this.playSound('hit');
                this.updateHUD();
            } else if (this.shotsLeft === 0) {
                this.phase = 'duckEscaped';
                this.phaseTimer = 60;
            }
        }
    }
    
    checkHit(x, y) {
        if (!this.currentDuck) return false;
        
        const duck = this.currentDuck;
        // Duck sprite is approximately 50x40 visual size, make hit area generous
        const duckWidth = 55;
        const duckHeight = 45;
        const duckLeft = duck.x - duckWidth / 2;
        const duckRight = duck.x + duckWidth / 2;
        const duckTop = duck.y - duckHeight / 2;
        const duckBottom = duck.y + duckHeight / 2;
        
        return x >= duckLeft && x <= duckRight && y >= duckTop && y <= duckBottom;
    }
    
    startIntro() {
        this.phase = 'intro';
        this.phaseTimer = 120;
        this.dog.state = 'sniffing';
        this.dog.x = this.canvas.width / 2;
        this.dog.y = 320;
        this.dog.frame = 0;
        this.dog.animTimer = 0;
        this.running = true;
        
        this.update();
    }
    
    startRound() {
        this.phase = 'playing';
        this.ducksSpawned = 0;
        this.ducksHit = 0;
        this.shotsLeft = 3;
        this.ducks = [];
        this.spawnDuck();
        this.updateHUD();
    }
    
    spawnDuck() {
        if (this.ducksSpawned >= this.totalDucks) {
            this.endRound();
            return;
        }
        
        this.ducksSpawned++;
        
        // Spawn from grass area
        const startX = Math.random() * (this.canvas.width - 200) + 100;
        
        // Random direction
        const direction = Math.random() > 0.5 ? 1 : -1;
        const speed = (2 + this.round * 0.5) * (0.8 + Math.random() * 0.4);
        
        this.currentDuck = {
            x: startX,
            y: 340,
            vx: direction * speed,
            vy: -1 - Math.random() * 2,
            frame: 0,
            animTimer: 0,
            shot: false,
            falling: false,
            escaped: false
        };
        
        this.phase = 'playing';
        this.duckTimer = 300 + this.round * 30; // Less time in later rounds
    }
    
    update() {
        if (!this.running) return;
        
        this.frameCount++;
        
        // Handle shot flash
        if (this.shotFlash > 0) {
            this.shotFlash--;
        }
        
        switch (this.phase) {
            case 'intro':
                this.updateIntro();
                break;
            case 'playing':
                this.updatePlaying();
                break;
            case 'duckShot':
                this.updateDuckShot();
                break;
            case 'duckFalling':
                this.updateDuckFalling();
                break;
            case 'duckEscaped':
                this.updateDuckEscaped();
                break;
            case 'roundEnd':
                this.updateRoundEnd();
                break;
            case 'gameOver':
                this.updateGameOver();
                break;
        }
        
        this.render();
        this.animationFrame = requestAnimationFrame(() => this.update());
    }
    
    updateIntro() {
        // Dog sniffing animation
        this.dog.animTimer++;
        if (this.dog.animTimer > 8) {
            this.dog.animTimer = 0;
            this.dog.frame = (this.dog.frame + 1) % 4;
        }
        
        this.phaseTimer--;
        if (this.phaseTimer <= 0) {
            this.startRound();
        }
    }
    
    updatePlaying() {
        // Update duck
        if (this.currentDuck) {
            const duck = this.currentDuck;
            
            duck.animTimer++;
            if (duck.animTimer > 6) {
                duck.animTimer = 0;
                duck.frame = (duck.frame + 1) % 2;
            }
            
            if (!duck.shot && !duck.falling && !duck.escaped) {
                duck.x += duck.vx;
                duck.y += duck.vy;
                
                // Bounce off walls
                if (duck.x < 50 || duck.x > this.canvas.width - 50) {
                    duck.vx *= -1;
                    duck.x = Math.max(50, Math.min(this.canvas.width - 50, duck.x));
                }
                
                // Bounce off top
                if (duck.y < 50) {
                    duck.vy = Math.abs(duck.vy);
                }
                
                // Duck flies away if time runs out
                this.duckTimer--;
                if (this.duckTimer <= 0) {
                    duck.escaped = true;
                    duck.vy = -3;
                    this.phase = 'duckEscaped';
                    this.phaseTimer = 45;
                }
            }
        }
    }
    
    updateDuckShot() {
        const duck = this.currentDuck;
        
        duck.animTimer++;
        if (duck.animTimer > 8) {
            duck.animTimer = 0;
            duck.frame++;
            if (duck.frame > 3) {
                duck.frame = 3;
                this.phase = 'duckFalling';
                this.phaseTimer = 60;
                duck.falling = true;
            }
        }
    }
    
    updateDuckFalling() {
        const duck = this.currentDuck;
        
        duck.y += 4;
        duck.animTimer++;
        if (duck.animTimer > 10) {
            duck.animTimer = 0;
            duck.frame = (duck.frame + 1) % 2;
        }
        
        // Dog fetches duck
        if (duck.y > 320) {
            duck.y = 320;
            this.phase = 'duckFalling';
            this.phaseTimer = 90;
            this.dog.state = 'holding';
            this.dog.x = duck.x;
            this.playSound('fetch');
        }
        
        this.phaseTimer--;
        if (this.phaseTimer <= 0) {
            this.nextDuck();
        }
    }
    
    updateDuckEscaped() {
        const duck = this.currentDuck;
        
        if (duck) {
            duck.y -= 3;
            duck.animTimer++;
            if (duck.animTimer > 10) {
                duck.animTimer = 0;
                duck.frame = (duck.frame + 1) % 2;
            }
        }
        
        // Dog laughs
        this.dog.state = 'laughing';
        this.dog.animTimer++;
        if (this.dog.animTimer > 8) {
            this.dog.animTimer = 0;
            this.dog.frame = (this.dog.frame + 1) % 4;
        }
        
        this.phaseTimer--;
        if (this.phaseTimer <= 0) {
            this.nextDuck();
        }
    }
    
    nextDuck() {
        this.ducksSpawned++;
        
        if (this.ducksSpawned >= this.totalDucks) {
            this.endRound();
        } else {
            this.shotsLeft = 3;
            this.spawnDuck();
            this.updateHUD();
        }
    }
    
    endRound() {
        this.phase = 'roundEnd';
        this.phaseTimer = 120;
        
        if (this.ducksHit >= this.minToPass) {
            this.round++;
        } else {
            this.phase = 'gameOver';
        }
        
        this.updateHUD();
    }
    
    updateRoundEnd() {
        this.phaseTimer--;
        
        if (this.phaseTimer <= 0) {
            if (this.ducksHit >= this.minToPass) {
                this.startRound();
            } else {
                this.phase = 'gameOver';
            }
        }
    }
    
    updateGameOver() {
        // Game over state - waiting for restart
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear
        ctx.fillStyle = '#3ebfbf';
        ctx.fillRect(0, 0, width, height);
        
        // Draw sun
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(width - 80, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw clouds
        this.drawClouds();
        
        // Draw background elements
        this.drawBackgroundElements();
        
        // Draw ducks
        if (this.currentDuck) {
            this.drawDuck(this.currentDuck);
        }
        
        // Draw grass (foreground)
        this.drawGrass();
        
        // Draw dog
        this.drawDog();
        
        // Draw shot flash
        if (this.shotFlash > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.shotFlash / 3})`;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Draw crosshair
        this.drawCrosshair();
        
        // Draw phase-specific overlays
        this.drawOverlays();
    }
    
    drawClouds() {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        
        const clouds = [
            { x: 100, y: 60, size: 40 },
            { x: 300, y: 100, size: 50 },
            { x: 550, y: 50, size: 35 },
            { x: 700, y: 120, size: 45 }
        ];
        
        clouds.forEach(cloud => {
            // Draw each circle separately to avoid rendering artifacts
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(cloud.x + cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(cloud.x - cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawBackgroundElements() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Draw tree trunk - solid fill
        ctx.fillStyle = '#5c4033';
        ctx.fillRect(60, 250, 30, 100);
        
        // Draw tree foliage - solid fill with no gaps
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.arc(75, 220, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(48, 255, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(102, 255, 42, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bush on right - solid fill
        ctx.fillStyle = '#2e8b2e';
        ctx.beginPath();
        ctx.arc(width - 80, 300, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width - 50, 268, 37, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width - 112, 285, 32, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDuck(duck) {
        const ctx = this.ctx;
        const x = duck.x;
        const y = duck.y;
        const frame = duck.frame;
        
        ctx.save();
        ctx.translate(x, y);
        
        if (duck.vx < 0) {
            ctx.scale(-1, 1);
        }
        
        // Duck body
        if (duck.shot) {
            // Shot duck - upside down
            ctx.rotate(Math.PI);
        }
        
        // Body
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-20, -15, 40, 25);
        
        // Wing
        ctx.fillStyle = '#a0522d';
        if (frame === 0) {
            ctx.fillRect(-5, -10, 15, 12);
        } else {
            ctx.fillRect(-5, -20, 15, 15);
        }
        
        // Head
        ctx.fillStyle = '#006400';
        ctx.fillRect(15, -20, 15, 15);
        
        // Beak
        ctx.fillStyle = '#ffa500';
        ctx.fillRect(30, -15, 8, 6);
        
        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(22, -18, 3, 3);
        
        // Tail
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.moveTo(-20, -10);
        ctx.lineTo(-30, -20);
        ctx.lineTo(-25, -10);
        ctx.fill();
        
        ctx.restore();
    }
    
    drawGrass() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Grass area
        ctx.fillStyle = '#83d313';
        ctx.fillRect(0, height - 120, width, 120);
        
        // Grass blades
        ctx.fillStyle = '#4e9216';
        for (let x = 0; x < width; x += 8) {
            const bladeHeight = 15 + Math.sin(x * 0.1 + this.frameCount * 0.05) * 5;
            ctx.fillRect(x, height - 120 - bladeHeight, 4, bladeHeight);
        }
        
        // Grass top edge
        ctx.fillStyle = '#9bed3b';
        ctx.fillRect(0, height - 120, width, 10);
    }
    
    drawDog() {
        const ctx = this.ctx;
        const dog = this.dog;
        
        if (dog.state === 'hidden') return;
        
        const x = dog.x;
        const y = dog.y;
        const frame = dog.frame;
        
        ctx.save();
        
        // Dog body
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x - 25, y - 30, 50, 40);
        
        // Dog belly
        ctx.fillStyle = '#deb887';
        ctx.fillRect(x - 20, y - 15, 40, 25);
        
        // Dog head
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x - 15, y - 55, 30, 30);
        
        // Snout
        ctx.fillStyle = '#deb887';
        ctx.fillRect(x - 10, y - 40, 20, 15);
        
        // Nose
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 5, y - 38, 6, 5);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 10, y - 50, 5, 5);
        ctx.fillRect(x + 5, y - 50, 5, 5);
        
        // Ears
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(x - 15, y - 55);
        ctx.lineTo(x - 25, y - 70);
        ctx.lineTo(x - 10, y - 55);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + 15, y - 55);
        ctx.lineTo(x + 25, y - 70);
        ctx.lineTo(x + 10, y - 55);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 25, y - 25, 15, 8);
        
        // Legs
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 20, y + 10, 8, 20);
        ctx.fillRect(x + 12, y + 10, 8, 20);
        
        // Handle duck when holding
        if (dog.state === 'holding') {
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x + 25, y - 20, 20, 8);
            
            // Duck being held
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(x + 40, -15, 30, 20);
            ctx.fillStyle = '#006400';
            ctx.fillRect(x + 55, -20, 12, 12);
            ctx.fillStyle = '#ffa500';
            ctx.fillRect(x + 67, -15, 6, 5);
        }
        
        // Laughing expression
        if (dog.state === 'laughing') {
            ctx.fillStyle = '#000000';
            // Open mouth
            ctx.fillRect(x - 5, -35, 20, 10);
        }
        
        ctx.restore();
    }
    
    drawCrosshair() {
        const ctx = this.ctx;
        const x = this.mouseX;
        const y = this.mouseY;
        const size = 18;
        
        // Outer circle with black outline for visibility against clouds
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Crosshair lines with black outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x - size - 8, y);
        ctx.lineTo(x - size + 2, y);
        ctx.moveTo(x + size - 2, y);
        ctx.lineTo(x + size + 8, y);
        ctx.moveTo(x, y - size - 8);
        ctx.lineTo(x, y - size + 2);
        ctx.moveTo(x, y + size - 2);
        ctx.lineTo(x, y + size + 8);
        ctx.stroke();
        
        // White crosshair lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - size - 5, y);
        ctx.lineTo(x - 5, y);
        ctx.moveTo(x + 5, y);
        ctx.lineTo(x + size + 5, y);
        ctx.moveTo(x, y - size - 5);
        ctx.lineTo(x, y - 5);
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x, y + size + 5);
        ctx.stroke();
        
        // Bright center dot
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    drawOverlays() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Round text at start
        if (this.phase === 'intro' && this.phaseTimer < 60) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(width / 2 - 100, height / 2 - 40, 200, 80);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeRect(width / 2 - 100, height / 2 - 40, 200, 80);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`ROUND ${this.round}`, width / 2, height / 2 + 10);
            ctx.textAlign = 'left';
        }
        
        // Fly away text
        if (this.phase === 'duckEscaped' || (this.currentDuck && this.currentDuck.escaped)) {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('FLY AWAY!', width / 2, 80);
            ctx.textAlign = 'left';
        }
        
        // Round complete
        if (this.phase === 'roundEnd' && this.ducksHit >= this.minToPass) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(width / 2 - 150, height / 2 - 60, 300, 120);
            ctx.strokeStyle = '#83d313';
            ctx.lineWidth = 4;
            ctx.strokeRect(width / 2 - 150, height / 2 - 60, 300, 120);
            
            ctx.fillStyle = '#83d313';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ROUND COMPLETE!', width / 2, height / 2 - 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = '18px Arial';
            ctx.fillText(`Ducks: ${this.ducksHit}/10`, width / 2, height / 2 + 20);
            ctx.fillText(`Next: Round ${this.round + 1}`, width / 2, height / 2 + 45);
            ctx.textAlign = 'left';
        }
        
        // Game over
        if (this.phase === 'gameOver') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', width / 2, height / 2 - 40);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.fillText(`Final Score: ${this.score}`, width / 2, height / 2 + 10);
            ctx.fillText(`Ducks Hit: ${this.ducksHit}/10`, width / 2, height / 2 + 45);
            
            if (this.score >= state.highScores.duckhunt) {
                ctx.fillStyle = '#ffff00';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('NEW HIGH SCORE!', width / 2, height / 2 + 80);
            }
            
            ctx.textAlign = 'left';
        }
    }
    
    updateHUD() {
        document.getElementById('duckhunt-score').textContent = this.score.toString().padStart(6, '0');
        document.getElementById('duckhunt-round').textContent = this.round;
        
        let shotsStr = '';
        for (let i = 0; i < 3; i++) {
            shotsStr += i < this.shotsLeft ? '●' : '○';
        }
        document.getElementById('duckhunt-shots').textContent = shotsStr;
    }
    
    initAudio() {
        if (this.audioContext) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    playSound(type) {
        if (!this.audioContext) return;
        
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        switch(type) {
            case 'shot':
                // Gunshot sound
                const shotOsc = ctx.createOscillator();
                const shotGain = ctx.createGain();
                shotOsc.type = 'square';
                shotOsc.frequency.setValueAtTime(150, now);
                shotOsc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
                shotGain.gain.setValueAtTime(0.3, now);
                shotGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                shotOsc.connect(shotGain);
                shotGain.connect(ctx.destination);
                shotOsc.start(now);
                shotOsc.stop(now + 0.15);
                break;
                
            case 'hit':
                // Duck quack/hit sound
                const hitOsc = ctx.createOscillator();
                const hitGain = ctx.createGain();
                hitOsc.type = 'sawtooth';
                hitOsc.frequency.setValueAtTime(300, now);
                hitOsc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                hitGain.gain.setValueAtTime(0.2, now);
                hitGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                hitOsc.connect(hitGain);
                hitGain.connect(ctx.destination);
                hitOsc.start(now);
                hitOsc.stop(now + 0.2);
                break;
                
            case 'fetch':
                // Success sound
                const fetchOsc = ctx.createOscillator();
                const fetchGain = ctx.createGain();
                fetchOsc.type = 'sine';
                fetchOsc.frequency.setValueAtTime(523, now);
                fetchOsc.frequency.setValueAtTime(659, now + 0.1);
                fetchOsc.frequency.setValueAtTime(784, now + 0.2);
                fetchGain.gain.setValueAtTime(0.2, now);
                fetchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                fetchOsc.connect(fetchGain);
                fetchGain.connect(ctx.destination);
                fetchOsc.start(now);
                fetchOsc.stop(now + 0.3);
                break;
        }
    }
    
    stop() {
        this.running = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

function startDuckHuntGame() {
    state.currentGame = new DuckHuntGame();
    state.gameActive = true;
    state.scores.duckhunt = 0;
    state.playCounts.duckhunt++;
    localStorage.setItem('duckhuntPlays', state.playCounts.duckhunt);
    
    // Update HUD
    document.getElementById('duckhunt-score').textContent = '000000';
    document.getElementById('duckhunt-round').textContent = '1';
    document.getElementById('duckhunt-shots').textContent = '●●●';
}

function startHorrorGame() {
    incrementPlayCount('horror');
    state.scores.horror = 0;
    state.gameActive = true;
    state.paused = false;
    
    const container = document.getElementById('horror-game');
    container.innerHTML = '';
    
    const game = new HorrorGame();
    state.currentGame = game;
    
    // Update HUD
    document.getElementById('horror-skulls').textContent = '0/5';
    document.getElementById('horror-battery').textContent = '100%';
}

// =====================================================
// UNDERTALE GAME - Bullet Hell RPG
// =====================================================

class UndertaleGame {
    constructor() {
        console.log('UndertaleGame: Constructor starting...');
        
        // Get the existing canvas
        this.canvas = document.getElementById('undertale-canvas');
        
        if (!this.canvas) {
            console.error('UndertaleGame: Canvas not found!');
            // Try to create it as fallback
            this.container = document.getElementById('undertale-game');
            if (this.container) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'undertale-canvas';
                this.canvas.width = 800;
                this.canvas.height = 600;
                this.canvas.style.display = 'block';
                this.canvas.style.margin = '0 auto';
                this.canvas.style.background = '#000000';
                this.container.appendChild(this.canvas);
            }
        }
        
        if (!this.canvas) {
            console.error('UndertaleGame: Failed to create canvas');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        if (!this.ctx) {
            console.error('UndertaleGame: Failed to get 2D context');
            return;
        }
        
        console.log('UndertaleGame: Canvas initialized successfully');
        
        // Game states
        this.STATE_EXPLORE = 'explore';
        this.STATE_COMBAT_INTRO = 'combat_intro';
        this.STATE_PLAYER_TURN = 'player_turn';
        this.STATE_ENEMY_TURN = 'enemy_turn';
        this.STATE_VICTORY = 'victory';
        this.STATE_GAMEOVER = 'gameover';
        
        this.state = this.STATE_EXPLORE;
        
        // Player stats
        this.maxHP = 92;
        this.hp = 92;
        this.attack = 10;
        this.defense = 0;
        this.lv = 1;
        this.name = 'Frisk';
        
        // Exploration
        this.playerX = 400;
        this.playerY = 450;
        this.steps = 0;
        this.encounterThreshold = 50;
        
        // Combat
        this.enemy = null;
        this.enemyName = '';
        this.enemyHP = 0;
        this.maxEnemyHP = 0;
        this.spareProgress = 0;
        this.dialogueText = '';
        this.dialogueIndex = 0;
        this.dialogueTimer = 0;
        this.playerTurnMenuIndex = 0;
        this.actionMenuIndex = 0;
        this.subMenuIndex = 0;
        this.subMenu = null;
        this.selectedOption = null;
        
        // Player heart (combat)
        this.heartX = 400;
        this.heartY = 400;
        this.heartRadius = 8;
        this.heartSpeed = 5;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.blinkTimer = 0;
        
        // Bullet hell projectiles
        this.projectiles = [];
        this.attackTimer = 0;
        this.attackDuration = 300;
        this.attackPattern = 0;
        
        // Animation
        this.animationFrame = 0;
        this.lastTime = 0;
        this.transitionAlpha = 0;
        this.fadeDirection = 0;
        
        // Input
        this.keys = {};
        this.inputCooldown = 0;
        
        // Sounds (visual feedback)
        this.screenShake = 0;
        this.hitFlash = 0;
        
        console.log('UndertaleGame: Initializing game state...');
        
        this.setupInput();
        this.spawnEnemy();
        
        console.log('UndertaleGame: Starting game loop...');
        this.gameLoop();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    spawnEnemy() {
        const enemies = [
            { name: 'Flowey', hp: 50, attacks: 0, color: '#FFD700' },
            { name: 'Toriel', hp: 80, attacks: 1, color: '#FF69B4' },
            { name: 'Papyrus', hp: 120, attacks: 2, color: '#FF8C00' },
            { name: 'Undyne', hp: 150, attacks: 3, color: '#00CED1' },
            { name: 'Mettaton', hp: 180, attacks: 4, color: '#FF1493' }
        ];
        
        const base = enemies[Math.min(Math.floor(this.steps / 100), enemies.length - 1)];
        this.enemy = { ...base };
        this.enemyName = base.name;
        this.maxEnemyHP = base.hp;
        this.enemyHP = base.hp;
        this.attackPattern = base.attacks;
        this.spareProgress = 0;
        
        console.log('UndertaleGame: Spawned enemy:', this.enemyName, 'HP:', this.enemyHP, 'Pattern:', this.attackPattern);
    }
    
    startCombat() {
        this.state = this.STATE_COMBAT_INTRO;
        this.dialogueText = `* ${this.enemyName} blocks the way!`;
        this.dialogueIndex = 0;
        this.heartX = 400;
        this.heartY = 400;
        this.projectiles = [];
        this.fadeDirection = 1;
        this.transitionAlpha = 1;
        
        console.log('UndertaleGame: Started combat with', this.enemyName);
    }
    
    update(deltaTime) {
        this.animationFrame++;
        
        // Update timers
        if (this.inputCooldown > 0) this.inputCooldown -= deltaTime;
        if (this.invincibleTimer > 0) {
            this.invincibleTimer -= deltaTime;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        if (this.blinkTimer > 0) this.blinkTimer -= deltaTime;
        if (this.screenShake > 0) this.screenShake *= 0.9;
        if (this.hitFlash > 0) this.hitFlash -= 0.05;
        
        // Transition effects
        if (this.fadeDirection !== 0) {
            this.transitionAlpha += this.fadeDirection * 0.02;
            if (this.transitionAlpha <= 0) {
                this.transitionAlpha = 0;
                this.fadeDirection = 0;
                if (this.state === this.STATE_COMBAT_INTRO && this.fadeDirection === 0) {
                    this.state = this.STATE_PLAYER_TURN;
                    this.dialogueText = 'What will ' + this.name + ' do?';
                    this.dialogueIndex = 0;
                }
            }
            if (this.transitionAlpha >= 1) {
                this.transitionAlpha = 1;
                if (this.state === this.STATE_ENEMY_TURN) {
                    this.attackTimer = 0;
                }
            }
        }
        
        // Dialogue typewriter effect
        if (this.dialogueText && this.dialogueIndex < this.dialogueText.length) {
            this.dialogueTimer += deltaTime;
            if (this.dialogueTimer > 30) {
                this.dialogueTimer = 0;
                this.dialogueIndex++;
            }
        }
        
        switch (this.state) {
            case this.STATE_EXPLORE:
                this.updateExplore();
                break;
            case this.STATE_COMBAT_INTRO:
                this.updateCombatIntro();
                break;
            case this.STATE_PLAYER_TURN:
                this.updatePlayerTurn();
                break;
            case this.STATE_ENEMY_TURN:
                this.updateEnemyTurn();
                break;
            case this.STATE_VICTORY:
                this.updateVictory();
                break;
            case this.STATE_GAMEOVER:
                this.updateGameOver();
                break;
        }
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.timer++;
            return p.x > -50 && p.x < 850 && p.y > -50 && p.y < 650;
        });
    }
    
    updateExplore() {
        let moved = false;
        
        if (this.keys['ArrowLeft'] && this.playerX > 100) {
            this.playerX -= 3;
            moved = true;
        }
        if (this.keys['ArrowRight'] && this.playerX < 700) {
            this.playerX += 3;
            moved = true;
        }
        if (this.keys['ArrowUp'] && this.playerY > 300) {
            this.playerY -= 3;
            moved = true;
        }
        if (this.keys['ArrowDown'] && this.playerY < 550) {
            this.playerY += 3;
            moved = true;
        }
        
        if (moved) {
            this.steps++;
            if (this.steps >= this.encounterThreshold) {
                this.steps = 0;
                this.encounterThreshold = 40 + Math.random() * 40;
                this.startCombat();
            }
        }
    }
    
    updateCombatIntro() {
        if (this.keys['KeyZ'] && this.inputCooldown <= 0) {
            this.inputCooldown = 150;
            if (this.dialogueIndex < this.dialogueText.length) {
                this.dialogueIndex = this.dialogueText.length;
            } else if (this.fadeDirection === 0) {
                this.fadeDirection = 1;
            }
        }
    }
    
    updatePlayerTurn() {
        if (this.keys['KeyZ'] && this.inputCooldown <= 0) {
            this.inputCooldown = 200;
            
            if (this.subMenu) {
                this.executeAction();
            } else {
                const options = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
                const selected = options[this.playerTurnMenuIndex];
                
                if (selected === 'FIGHT') {
                    this.attackEnemy();
                } else if (selected === 'ACT') {
                    this.subMenu = 'ACT';
                    this.subMenuIndex = 0;
                    this.dialogueText = this.getActOptions();
                    this.dialogueIndex = 0;
                } else if (selected === 'ITEM') {
                    this.subMenu = 'ITEM';
                    this.subMenuIndex = 0;
                    this.dialogueText = 'Use what?* (Only 1 item)';
                    this.dialogueIndex = 0;
                } else if (selected === 'MERCY') {
                    if (this.spareProgress >= 100) {
                        this.victory();
                    } else {
                        this.dialogueText = `* Can't spare ${this.enemyName} yet...`;
                        this.dialogueIndex = 0;
                        this.state = this.STATE_ENEMY_TURN;
                        this.fadeDirection = 1;
                    }
                }
            }
        }
        
        if (this.keys['ArrowLeft'] && this.inputCooldown <= 0) {
            this.inputCooldown = 150;
            if (this.subMenu) {
                this.subMenuIndex = Math.max(0, this.subMenuIndex - 1);
            } else {
                this.playerTurnMenuIndex = (this.playerTurnMenuIndex + 3) % 4;
            }
        }
        if (this.keys['ArrowRight'] && this.inputCooldown <= 0) {
            this.inputCooldown = 150;
            if (this.subMenu) {
                const max = this.subMenu === 'ACT' ? 3 : 1;
                this.subMenuIndex = Math.min(max, this.subMenuIndex + 1);
            } else {
                this.playerTurnMenuIndex = (this.playerTurnMenuIndex + 1) % 4;
            }
        }
        if (this.keys['ArrowUp'] && this.inputCooldown <= 0 && this.subMenu) {
            this.inputCooldown = 150;
            const max = this.subMenu === 'ACT' ? 3 : 1;
            this.subMenuIndex = Math.max(0, this.subMenuIndex - 1);
        }
        if (this.keys['ArrowDown'] && this.inputCooldown <= 0 && this.subMenu) {
            this.inputCooldown = 150;
            const max = this.subMenu === 'ACT' ? 3 : 1;
            this.subMenuIndex = Math.min(max, this.subMenuIndex + 1);
        }
        if (this.keys['KeyX'] && this.inputCooldown <= 0 && this.subMenu) {
            this.inputCooldown = 150;
            this.subMenu = null;
            this.dialogueText = 'What will ' + this.name + ' do?';
            this.dialogueIndex = 0;
        }
    }
    
    getActOptions() {
        const acts = ['Check', 'Talk', 'Pet', 'Compliment'];
        return `* ${acts[this.subMenuIndex]}...`;
    }
    
    executeAction() {
        const options = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
        const mainChoice = options[this.playerTurnMenuIndex];
        
        if (mainChoice === 'ACT') {
            const acts = ['Check', 'Talk', 'Pet', 'Compliment'];
            const act = acts[this.subMenuIndex];
            
            if (act === 'Check') {
                const damage = 5 + Math.floor(Math.random() * 5);
                this.dialogueText = `* ${this.enemyName} - ATK: ${damage} DEF: ${damage}`;
            } else if (act === 'Talk') {
                this.dialogueText = `* You tried talking to ${this.enemyName}...* But nothing happened.`;
                this.spareProgress += 10;
            } else if (act === 'Pet') {
                this.dialogueText = `* ${this.enemyName} seems confused by your gesture.`;
                this.spareProgress += 15;
            } else if (act === 'Compliment') {
                this.dialogueText = `* ${this.enemyName} smiles at your words!`;
                this.spareProgress += 20;
            }
            this.dialogueIndex = 0;
        } else if (mainChoice === 'ITEM') {
            this.hp = Math.min(this.maxHP, this.hp + 30);
            this.dialogueText = '* You ate a <item>. HP restored!';
            this.dialogueIndex = 0;
        }
        
        this.subMenu = null;
        this.state = this.STATE_ENEMY_TURN;
        this.fadeDirection = 1;
    }
    
    attackEnemy() {
        // Simple attack animation
        const damage = this.attack + Math.floor(Math.random() * 10);
        this.enemyHP = Math.max(0, this.enemyHP - damage);
        this.dialogueText = `* You attacked! ${this.enemyName} took ${damage} damage!`;
        this.dialogueIndex = 0;
        
        if (this.enemyHP <= 0) {
            this.victory();
        } else {
            this.state = this.STATE_ENEMY_TURN;
            this.fadeDirection = 1;
        }
    }
    
    updateEnemyTurn() {
        if (this.transitionAlpha > 0.5) return;
        
        this.attackTimer++;
        
        // Move heart
        if (this.keys['ArrowLeft']) this.heartX -= this.heartSpeed;
        if (this.keys['ArrowRight']) this.heartX += this.heartSpeed;
        if (this.keys['ArrowUp']) this.heartY -= this.heartSpeed;
        if (this.keys['ArrowDown']) this.heartY += this.heartSpeed;
        
        // Boundary check
        const box = this.getBulletBoardBounds();
        this.heartX = Math.max(box.x + 20, Math.min(box.x + box.width - 20, this.heartX));
        this.heartY = Math.max(box.y + 20, Math.min(box.y + box.height - 20, this.heartY));
        
        // Spawn projectiles
        this.spawnProjectiles();
        
        // Check collision
        this.checkCollision();
        
        // End attack
        if (this.attackTimer >= this.attackDuration) {
            this.state = this.STATE_PLAYER_TURN;
            this.dialogueText = `${this.enemyName}'s attack ended!`;
            this.dialogueIndex = 0;
            this.playerTurnMenuIndex = 0;
            this.fadeDirection = -1;
        }
    }
    
    getBulletBoardBounds() {
        return { x: 100, y: 150, width: 600, height: 280 };
    }
    
    spawnProjectiles() {
        const patterns = 5;
        const t = this.attackTimer;
        const box = this.getBulletBoardBounds();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        
        // Pattern 0: Falling projectiles
        if (this.attackPattern === 0) {
            if (t % 15 === 0 && t < 200) {
                for (let i = 0; i < 3; i++) {
                    this.projectiles.push({
                        x: box.x + 50 + Math.random() * (box.width - 100),
                        y: box.y,
                        vx: 0,
                        vy: 3 + Math.random() * 2,
                        radius: 10,
                        type: 'circle'
                    });
                }
            }
        }
        // Pattern 1: Spiral
        else if (this.attackPattern === 1) {
            if (t % 8 === 0 && t < 250) {
                const angle = (t * 0.1) % (Math.PI * 2);
                for (let i = 0; i < 4; i++) {
                    const a = angle + (i * Math.PI / 2);
                    this.projectiles.push({
                        x: cx,
                        y: cy,
                        vx: Math.cos(a) * 4,
                        vy: Math.sin(a) * 4,
                        radius: 8,
                        type: 'circle'
                    });
                }
            }
        }
        // Pattern 2: Targeted spread
        else if (this.attackPattern === 2) {
            if (t === 30 || t === 80 || t === 130 || t === 180) {
                const angle = Math.atan2(this.heartY - cy, this.heartX - cx);
                for (let i = -2; i <= 2; i++) {
                    const a = angle + i * 0.2;
                    this.projectiles.push({
                        x: cx,
                        y: cy,
                        vx: Math.cos(a) * 5,
                        vy: Math.sin(a) * 5,
                        radius: 7,
                        type: 'circle'
                    });
                }
            }
        }
        // Pattern 3: Grid
        else if (this.attackPattern === 3) {
            if (t === 30) {
                for (let row = 0; row < 6; row++) {
                    for (let col = 0; col < 10; col++) {
                        this.projectiles.push({
                            x: box.x + 60 + col * 55,
                            y: box.y + row * 40,
                            vx: 0,
                            vy: 0,
                            radius: 12,
                            type: 'rect',
                            delay: (row * 10 + col * 5)
                        });
                    }
                }
            }
            this.projectiles.forEach(p => {
                if (p.delay && p.timer > p.delay && p.vy === 0) {
                    p.vy = 4;
                }
            });
        }
        // Pattern 4: Wavy lines
        else if (this.attackPattern === 4) {
            if (t % 20 === 0 && t < 280) {
                for (let i = 0; i < 5; i++) {
                    const startX = box.x + 50 + i * 120;
                    this.projectiles.push({
                        x: startX,
                        y: box.y,
                        vx: 0,
                        vy: 3,
                        radius: 8,
                        type: 'wave',
                        phase: i * 0.5,
                        baseX: startX
                    });
                }
            }
            this.projectiles.forEach(p => {
                if (p.type === 'wave') {
                    p.x = p.baseX + Math.sin(p.timer * 0.1 + p.phase) * 30;
                }
            });
        }
    }
    
    checkCollision() {
        if (this.invincible) return;
        
        for (const p of this.projectiles) {
            const dx = this.heartX - p.x;
            const dy = this.heartY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < p.radius + this.heartRadius - 2) {
                this.takeDamage(15);
                break;
            }
        }
    }
    
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.hp -= actualDamage;
        this.invincible = true;
        this.invincibleTimer = 1500;
        this.blinkTimer = 1500;
        this.screenShake = 10;
        this.hitFlash = 0.5;
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = this.STATE_GAMEOVER;
        }
    }
    
    updateVictory() {
        if (this.keys['KeyZ'] && this.inputCooldown <= 0) {
            this.inputCooldown = 200;
            this.steps = 0;
            this.state = this.STATE_EXPLORE;
            this.spawnEnemy();
        }
    }
    
    updateGameOver() {
        if (this.keys['KeyZ'] && this.inputCooldown <= 0) {
            this.inputCooldown = 200;
            this.hp = this.maxHP;
            this.steps = 0;
            this.state = this.STATE_EXPLORE;
            this.spawnEnemy();
        }
    }
    
    victory() {
        this.state = this.STATE_VICTORY;
        this.dialogueText = `* ${this.enemyName} was defeated!* But who are you to judge?`;
        this.dialogueIndex = 0;
    }
    
    draw() {
        if (!this.ctx) {
            console.error('UndertaleGame: No context available for drawing');
            return;
        }
        
        const ctx = this.ctx;
        ctx.save();
        
        // Clear the canvas completely
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        
        // Debug: show current state
        // console.log('UndertaleGame: Drawing state:', this.state);
        
        // Screen shake
        if (this.screenShake > 0.5) {
            ctx.translate(
                (Math.random() - 0.5) * this.screenShake,
                (Math.random() - 0.5) * this.screenShake
            );
        }
        
        // Hit flash
        if (this.hitFlash > 0) {
            ctx.fillStyle = `rgba(255, 0, 0, ${this.hitFlash})`;
            ctx.fillRect(0, 0, 800, 600);
        }
        
        // Background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        
        switch (this.state) {
            case this.STATE_EXPLORE:
                this.drawExplore();
                break;
            case this.STATE_COMBAT_INTRO:
            case this.STATE_PLAYER_TURN:
            case this.STATE_ENEMY_TURN:
                this.drawCombat();
                break;
            case this.STATE_VICTORY:
                this.drawCombat();
                this.drawVictory();
                break;
            case this.STATE_GAMEOVER:
                this.drawCombat();
                this.drawGameOver();
                break;
        }
        
        // Transition overlay
        if (this.transitionAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
            ctx.fillRect(0, 0, 800, 600);
        }
        
        ctx.restore();
    }
    
    drawExplore() {
        const ctx = this.ctx;
        
        // Clear and draw background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw exploration area background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 280, 800, 240);
        
        // Floor line - bright white
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 500);
        ctx.lineTo(800, 500);
        ctx.stroke();
        
        // Steps indicator - bright and visible
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`Steps: ${this.steps}`, 30, 40);
        
        // Draw "Use arrow keys to move" hint
        ctx.font = '14px monospace';
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('Use ARROW KEYS to move around', 30, 65);
        
        // Player character - clearly visible
        this.drawPlayerCharacter(this.playerX, this.playerY);
        
        // Draw some background elements for visual interest
        ctx.fillStyle = '#222222';
        ctx.fillRect(50, 510, 100, 20);
        ctx.fillRect(600, 510, 150, 20);
    }
    
    drawPlayerCharacter(x, y) {
        const ctx = this.ctx;
        
        // Body
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(x - 12, y - 30, 24, 30);
        
        // Head
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.arc(x, y - 40, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 5, y - 43, 3, 3);
        ctx.fillRect(x + 2, y - 43, 3, 3);
    }
    
    drawCombat() {
        const ctx = this.ctx;
        
        // Ensure canvas is cleared
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        
        // Enemy area (top) - lighter background for visibility
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, 800, 120);
        
        // Enemy sprite placeholder
        this.drawEnemy(400, 60);
        
        // Enemy name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.enemyName, 400, 100);
        
        // Enemy HP bar
        const hpPercent = this.enemyHP / this.maxEnemyHP;
        ctx.fillStyle = '#333333';
        ctx.fillRect(300, 110, 200, 8);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(302, 112, 196 * hpPercent, 4);
        
        // Bullet board - bright white for visibility
        const box = this.getBulletBoardBounds();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
        // Fill bullet board with semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(box.x, box.y, box.width, box.height);
        
        // Projectiles
        ctx.fillStyle = '#FFFFFF';
        this.projectiles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Player heart - always draw in combat
        if (!this.invincible || this.blinkTimer % 100 < 50) {
            this.drawHeart(this.heartX, this.heartY);
        }
        
        // UI Panel (bottom) - white border for visibility
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 450, 800, 150);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 450, 800, 150);
        
        // Stats
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(this.name, 30, 480);
        ctx.fillText('LV ' + this.lv, 130, 480);
        
        // HP Bar
        ctx.fillText('HP', 30, 510);
        const playerHpPercent = this.hp / this.maxHP;
        ctx.fillStyle = '#000000';
        ctx.fillRect(60, 495, 150, 16);
        ctx.fillStyle = playerHpPercent > 0.5 ? '#FFFF00' : playerHpPercent > 0.25 ? '#FFA500' : '#FF0000';
        ctx.fillRect(62, 497, 146 * playerHpPercent, 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';
        ctx.fillText(`${this.hp}/${this.maxHP}`, 220, 508);
        
        // Action buttons
        if (this.state === this.STATE_PLAYER_TURN) {
            const options = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
            options.forEach((opt, i) => {
                ctx.font = 'bold 18px monospace';
                ctx.textAlign = 'center';
                const x = 400 + (i - 1.5) * 120;
                const y = 550;
                
                if (i === this.playerTurnMenuIndex) {
                    ctx.fillStyle = '#FF7F27';
                    ctx.fillText('▶ ' + opt + ' ◀', x, y);
                } else {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(opt, x, y);
                }
            });
        }
        
        // Dialogue box
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(30, 440, 740, 40);
        ctx.fillStyle = '#000000';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        const displayText = this.dialogueText.substring(0, this.dialogueIndex);
        this.wrapText(ctx, displayText, 45, 462, 710, 20);
    }
    
    drawEnemy(x, y) {
        const ctx = this.ctx;
        const t = this.animationFrame * 0.05;
        
        // Safety check - if no enemy, draw a placeholder
        if (!this.enemy || !this.enemyName) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.fill();
            return;
        }
        
        ctx.fillStyle = this.enemy.color || '#FFFFFF';
        
        // Simple animated enemy shape
        ctx.save();
        ctx.translate(x, y + Math.sin(t) * 5);
        
        if (this.enemyName === 'Flowey') {
            // Flower shape
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.rotate(i * Math.PI / 3 + t * 0.5);
                ctx.beginPath();
                ctx.ellipse(25, 0, 20, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
            // Face
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-5, -3, 3, 0, Math.PI * 2);
            ctx.arc(5, -3, 3, 0, Math.PI * 2);
            ctx.arc(0, 5, 5, 0, Math.PI);
            ctx.fill();
        } else if (this.enemyName === 'Toriel') {
            // Goat-like shape
            ctx.beginPath();
            ctx.ellipse(0, 0, 40, 50, 0, 0, Math.PI * 2);
            ctx.fill();
            // Ears
            ctx.beginPath();
            ctx.ellipse(-35, -30, 15, 25, -0.3, 0, Math.PI * 2);
            ctx.ellipse(35, -30, 15, 25, 0.3, 0, Math.PI * 2);
            ctx.fill();
            // Face
            ctx.fillStyle = '#FFE4C4';
            ctx.beginPath();
            ctx.arc(0, -10, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-8, -15, 3, 0, Math.PI * 2);
            ctx.arc(8, -15, 3, 0, Math.PI * 2);
            ctx.arc(0, -5, 8, 0, Math.PI);
            ctx.fill();
        } else if (this.enemyName === 'Papyrus') {
            // Skeleton
            ctx.fillStyle = '#FFFFFF';
            // Skull
            ctx.beginPath();
            ctx.arc(0, -30, 25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-8, -33, 4, 0, Math.PI * 2);
            ctx.arc(8, -33, 4, 0, Math.PI * 2);
            ctx.fill();
            // Body
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(-12, -5, 24, 50);
        } else {
            // Generic enemy (Undyne, Mettaton, etc.)
            ctx.fillStyle = this.enemy ? this.enemy.color : '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(0, -50);
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + t;
                const r = i % 2 === 0 ? 50 : 40;
                ctx.lineTo(
                    Math.cos(angle) * r,
                    Math.sin(angle) * r
                );
            }
            ctx.closePath();
            ctx.fill();
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(-15, -5, 6, 0, Math.PI * 2);
            ctx.arc(15, -5, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    drawHeart(x, y) {
        const ctx = this.ctx;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        const topCurveHeight = 8;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(
            x, y,
            x - 12, y - 12,
            x - 12, y + 4
        );
        ctx.bezierCurveTo(
            x - 12, y + 12,
            x, y + 20,
            x, y + 20
        );
        ctx.bezierCurveTo(
            x, y + 20,
            x + 12, y + 12,
            x + 12, y + 4
        );
        ctx.bezierCurveTo(
            x + 12, y - 12,
            x, y,
            x, y + topCurveHeight
        );
        ctx.fill();
        
        // Shine
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x - 4, y + 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawVictory() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VICTORY!', 400, 250);
        ctx.font = '16px monospace';
        ctx.fillText('* But nobody came...', 400, 300);
        ctx.fillText('Press Z to continue', 400, 400);
    }
    
    drawGameOver() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 800, 600);
        
        // Glitch effect
        if (this.animationFrame % 10 < 5) {
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 48px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', 400, 250);
        }
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 400, 250);
        
        ctx.font = '16px monospace';
        ctx.fillText('* You died.', 400, 300);
        ctx.fillText('* Determination depleted...', 400, 340);
        ctx.fillText('Press Z to try again', 400, 400);
    }
    
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
    
    gameLoop() {
        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;
        
        this.update(deltaTime);
        this.draw();
        
        this.animationFrame++;
        
        // Debug: Check if canvas is drawing
        if (this.animationFrame === 1) {
            console.log('UndertaleGame: First frame drawn');
            // Force a visible test
            if (this.ctx) {
                this.ctx.fillStyle = '#333333';
                this.ctx.fillRect(0, 0, 800, 600);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '20px monospace';
                this.ctx.fillText('Undertale Game Loaded!', 300, 300);
                this.ctx.fillText('Arrow keys to move', 310, 340);
            }
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
    
    cleanup() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}

function startUndertaleGame() {
    incrementPlayCount('undertale');
    state.scores.undertale = 0;
    state.gameActive = true;
    state.paused = false;
    
    const container = document.getElementById('undertale-game');
    container.innerHTML = '';
    
    const game = new UndertaleGame();
    state.currentGame = game;
    
    // Update HUD
    document.getElementById('undertale-hp').textContent = '92/92';
    document.getElementById('undertale-lv').textContent = 'LV 1';
}
