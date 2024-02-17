import React, { useState, useEffect } from 'react';
import './Style.css';

export default function Home() {
  const totalGridSize = 20;

  let snakeInitialPosition = [
    {
      x: totalGridSize / 2,
      y: totalGridSize / 2,
    },
    {
      x: totalGridSize / 2,
      y: totalGridSize / 2 + 1,
    },
  ];

  const [score, setScore] = useState(0);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [snake, setSnake] = useState(snakeInitialPosition);
  const [direction, setDirection] = useState("LEFT");
  const [speed, setSpeed] = useState(180);

  function renderBoard() {
    let cellArray = [];

    for (let row = 0; row < totalGridSize; row++) {
      for (let col = 0; col < totalGridSize; col++) {
        let classes = "cell";

        let isFood = food.x === row && food.y === col;

        let isSnakeHead = snake[0].x === row && snake[0].y === col;

        let isSnake = snake.some((value) => value.x === row && value.y === col);

        if (isFood) {
          classes = `${classes} food`;
        }

        if (isSnake) {
          classes = `${classes} snake`;
        }

        if (isSnakeHead) {
          classes = `${classes} snake-head`;
        }

        let cell = <div key={`${row}-${col}`} className={classes}></div>;

        cellArray.push(cell);
      }
    }

    return cellArray;
  }

  function renderFood() {
    let randomX = Math.floor(Math.random() * totalGridSize);
    let randomY = Math.floor(Math.random() * totalGridSize);

    setFood({
      x: randomX,
      y: randomY,
    });
  }

  function gameOver() {
    setSnake(snakeInitialPosition);
    setScore(0);
  }

  function updateGame() {
    if (snake[0].x < 0 || snake[0].x >= totalGridSize || snake[0].y < 0 || snake[0].y >= totalGridSize) {
      gameOver();
      return;
    }

    const isBit = snake
      .slice(1)
      .some((value) => value.x === snake[0].x && value.y === snake[0].y);
    if (isBit) {
      gameOver();
      return;
    }

    let newSnake = [...snake];
    if (direction === "UP") {
      newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
    }
    if (direction === "DOWN") {
      newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
    }
    if (direction === "RIGHT") {
      newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
    }
    if (direction === "LEFT") {
      newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
    }

    if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
      setScore((sco) => sco + 1);
      renderFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  function updateDirection(e) {
    let key = e.code;

    switch (key) {
      case "ArrowUp":
        setDirection("UP");
        break;
      case "ArrowDown":
        setDirection("DOWN");
        break;
      case "ArrowLeft":
        setDirection("LEFT");
        break;
      case "ArrowRight":
        setDirection("RIGHT");
        break;
    }
  }

  useEffect(() => {
    let moveSnake = setInterval(updateGame, speed);
    return () => clearInterval(moveSnake);
  }, [snake, direction, food]);

  useEffect(() => {
    document.addEventListener("keydown", updateDirection);

    return () => document.removeEventListener("keydown", updateDirection);
  }, []);

  return (
    <div className="snakeGame">
      <div className='column1'>
        <div className='board'>{renderBoard()}</div>
      </div>
      <div className="column2">
        <div className='score'>
          Score: {score}
        </div>
        <div className="setting">
          <div class="dropdown-center">
            <button className="btn btn-secondary btn-outline-warning btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Difficulty 
            </button>
            <ul className="dropdown-menu dropdown-menu-right dropdown-width">
              <li><a className="dropdown-item" onClick={() => setSpeed(180)}>Easy</a></li>
              <li><a className="dropdown-item" onClick={() => setSpeed(120)}>Medium</a></li>
              <li><a className="dropdown-item" onClick={() => setSpeed(70)}>Hard</a></li>
            </ul>
            
          </div>
        </div>
      </div>
    </div>

  );
}

