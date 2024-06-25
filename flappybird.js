let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let bird = {
    x: 50,
    y: 200,
    width: 40,
    height: 44,
    gravity: 0.2,
    lift: -5,
    velocity: 0
};

let pipes = [];
const pipeWidth = 50;
const gap = 180; // Gap between top and bottom pipes
const pipeSpeed = 3;
let pipeInterval = 100; // Interval between pipes in frames
let frameCount = 0;
let score = 0; // Initialize score

let pipeHeights = [100, 230, 150, 50, 200, 250, 400, 270, 350]; // Array of possible pipe heights
let gameOver = false; // Flag to track game over state

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    const birdImg = new Image();
    birdImg.src = './Clipped_image_20240625_202917.png'; // Path to bird image

    const topPipeImg = new Image();
    topPipeImg.src = './toppipe.png'; // Path to top pipe image

    const bottomPipeImg = new Image();
    bottomPipeImg.src = './bottompipe.png'; // Path to bottom pipe image

    birdImg.onload = function() {
        topPipeImg.onload = function() {
            bottomPipeImg.onload = function() {
                drawGame(birdImg, topPipeImg, bottomPipeImg);
            };
        };
    };

    function drawGame(birdImg, topPipeImg, bottomPipeImg) {
        if (gameOver) {
            showResult(); // Show result screen if game over
            return; // Stop game loop if game over
        }

        context.clearRect(0, 0, board.width, board.height);

        // Handle bird movement
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Ensure bird stays within the vertical boundaries of the canvas
        if (bird.y < 0) {
            bird.y = 0;
            bird.velocity = 0;
        }
        if (bird.y + bird.height > boardHeight) {
            bird.y = boardHeight - bird.height;
            bird.velocity = 0;
            gameOver = true;
            showResult();
            return;
        }

        // Handle pipe movement and generation
        frameCount++;
        if (frameCount % pipeInterval === 0) {
            let pipeHeight = pipeHeights[Math.floor(Math.random() * pipeHeights.length)];
            pipes.push({
                x: boardWidth,
                y: pipeHeight,
                passed: false // New property to track if the pipe is passed
            });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }

            // Check for collision
            if (
                bird.x < pipes[i].x + pipeWidth &&
                bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + gap)
            ) {
                gameOver = true; // Set game over flag
                showResult(); // Show result screen
                return; // Exit function to stop game loop
            }

            // Check if the bird passed the pipe
            if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                pipes[i].passed = true;
                score++; // Increment the score
                document.getElementById("score").textContent = score; // Update the score display
            }

            context.drawImage(topPipeImg, pipes[i].x, pipes[i].y - topPipeImg.height, pipeWidth, topPipeImg.height);
            context.drawImage(bottomPipeImg, pipes[i].x, pipes[i].y + gap, pipeWidth, bottomPipeImg.height);
        }

        // Draw bird
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        // Request next frame
        requestAnimationFrame(() => drawGame(birdImg, topPipeImg, bottomPipeImg));
    }

    // Function to show result screen
    function showResult() {
        document.querySelector('#board').style.display = 'none'; // Hide score display
        document.querySelector('.score').style.display = 'none';
        const resultScreen = document.querySelector('.result');
        resultScreen.style.display = 'flex'; // Show result screen
        resultScreen.querySelector('#final').textContent = score; // Display final score
    }

    // Event listener for spacebar press and touch event
    function handleLift() {
        if (!gameOver) {
            bird.velocity = bird.lift; // Apply lift
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            handleLift();
        }
    });

    board.addEventListener('touchstart', function(event) {
        handleLift();
    });

    // Event listener for try again button click
    document.getElementById('try').addEventListener('click', function() {
        resetGame();
    });

    // Function to reset the game
    function resetGame() {
        // Reset all variables
        bird = {
            x: 50,
            y: 200,
            width: 40, // Corrected width
            height: 44, // Corrected height
            gravity: 0.2,
            lift: -5,
            velocity: 0
        };
        pipes = [];
        frameCount = 0;
        score = 0;
        gameOver = false;

        // Reset canvas and score display
        context.clearRect(0, 0, board.width, board.height);
        document.getElementById("score").textContent = score;
        document.querySelector('#board').style.display = 'block';
        document.querySelector('.score').style.display = 'block';
        document.querySelector('.result').style.display = 'none';

        // Restart the game loop
        drawGame(birdImg, topPipeImg, bottomPipeImg);
    }
};
